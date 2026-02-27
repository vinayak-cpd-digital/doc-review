import io
import os
import json
import shutil
import asyncio
import time
import uuid
import threading
from datetime import datetime
from typing import Any, Dict, List, Optional, Union

import pandas as pd
import requests
from fastapi import FastAPI, File, Form, UploadFile, HTTPException, Path as FastAPIPath, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse, FileResponse
# -------------------------------
# Landing.ai ADE (OCR) helpers
# -------------------------------
from pathlib import Path
import tempfile
from starlette.concurrency import run_in_threadpool

try:
    from landingai_ade import LandingAIADE
except Exception:
    LandingAIADE = None  # so app can still start if package not installed

# LANDING_API_KEY = "bGQxYWN2dzZmbm1nenZnMjR1NHU4OkZBU3BNTllXMUdLaUhsT1NoT3ZqTTIyR2ZZRDhPRjNq"  # put key in env
LANDING_API_KEY = "bXg1Z3gyemxqY3V6dWd2M3YyMjVpOmlwRG5PRmFrTXp2U25PbDRBWEdaa3cyTDhqbFFXb2pC"  # put key in env
LANDING_PARSE_MODEL = os.getenv("LANDING_PARSE_MODEL", "dpt-2-latest")

KRK_SPECIAL_FILENAME = "KRK - W6 CA with Hilton Garden Inn Kraków - Signed by TAC and Hotel.pdf"

def _landing_client() -> "LandingAIADE":
    if LandingAIADE is None:
        raise RuntimeError("landingai_ade is not installed. pip install landingai-ade")
    if not LANDING_API_KEY:
        raise RuntimeError("LANDING_API_KEY env var not set")
    return LandingAIADE(apikey=LANDING_API_KEY)

def landing_ocr_to_markdown(file_bytes: bytes, filename: str) -> str:
    """
    Upload bytes to Landing.ai ADE, return markdown text.
    """
    suffix = Path(filename).suffix.lower() or ".pdf"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(file_bytes)
        tmp_path = Path(tmp.name)

    try:
        client = _landing_client()
        parse_resp = client.parse(document=tmp_path, model=LANDING_PARSE_MODEL)
        md = getattr(parse_resp, "markdown", None)
        if not md:
            raise RuntimeError("Landing.ai parse returned empty markdown")
        return md
    finally:
        try:
            tmp_path.unlink(missing_ok=True)
        except Exception:
            pass

def call_vectorshift_with_text(text: str, filename: str = "ocr.txt"):
    """
    Send OCR text to VectorShift as a .txt file (still uses input_0 multipart).
    """
    headers = {"Authorization": f"Bearer {API_KEY}"}

    mime = "text/plain"
    file_bytes = text.encode("utf-8", errors="ignore")

    inputs_payload = {
        "input_0": {"metadata": {"name": filename, "mime_type": mime}}
    }
    data = {"inputs": json.dumps(inputs_payload)}

    files_a = {"input_0": (filename, file_bytes, mime)}
    resp = requests.post(API_URL, headers=headers, data=data, files=files_a, timeout=120)

    try:
        payload = resp.json()
    except Exception:
        payload = {"status": "error", "detail": resp.text}

    return resp.status_code, payload


# -------------------------------
# CONFIG
# -------------------------------
# API_KEY = os.getenv("VECTORSHIFT_API_KEY", "sk_m1TPd61zEtpGYQE7GF1c861LoYuspJ6KQBC3DKTanMhYe8B2")
# API_KEY = os.getenv("VECTORSHIFT_API_KEY", "sk_pLQWcuyXJPKYQXyzQ4F4ikRFserkjZ9KuOVVbgsqaCKzV8Vv")
# API_KEY = os.getenv("VECTORSHIFT_API_KEY","sk_5muVwqRQ6XsrxAW0AsH1ehiHTOEOsjPzLoXKq6VvN0FlYCmM")
API_KEY = os.getenv("VECTORSHIFT_API_KEY","sk_ofmb0zjM9EgJnA1TrpJGoosKTZ08PieUQmRlStzu2YFlDBl0")
# PIPELINE_ID = os.getenv("VECTORSHIFT_PIPELINE_ID", "6819865fd8e427428c7afec9")
# PIPELINE_ID = os.getenv("VECTORSHIFT_PIPELINE_ID", "67aad437284a32202156ca43")
# PIPELINE_ID = os.getenv("VECTORSHIFT_PIPELINE_ID","6973839698163cbba191cd49")
PIPELINE_ID = os.getenv("VECTORSHIFT_PIPELINE_ID", "684682b5a6b9d506da7b18de")
API_URL = f"https://api.vectorshift.ai/v1/pipeline/{PIPELINE_ID}/run"

app = FastAPI(title="Contract Review Backend")

REVIEWER_KEY = os.getenv("REVIEWER_KEY", "reviewer")
APPROVER_KEY = os.getenv("APPROVER_KEY", "approver")
SUBMISSIONS_DIR = os.getenv("SUBMISSIONS_DIR", os.path.join(os.getcwd(), "review_submissions"))
REVIEW_AUDIT_LOG_XLSX = os.getenv("REVIEW_AUDIT_LOG_XLSX", os.path.join(os.getcwd(), "review_audit_log.xlsx"))
REVIEWED_FILES_DIR = os.getenv("REVIEWED_FILES_DIR", os.path.join(os.getcwd(), "reviewed_files"))
_review_audit_lock = threading.Lock()


def _require_reviewer(x_api_key: Optional[str]) -> None:
    if not x_api_key or x_api_key != REVIEWER_KEY:
        raise HTTPException(status_code=403, detail="Reviewer access required")


def _require_approver(x_api_key: Optional[str]) -> None:
    if not x_api_key or x_api_key != APPROVER_KEY:
        raise HTTPException(status_code=403, detail="Approver access required")


def _require_reviewer_or_approver(x_api_key: Optional[str]) -> str:
    if x_api_key == REVIEWER_KEY:
        return "reviewer"
    if x_api_key == APPROVER_KEY:
        return "approver"
    raise HTTPException(status_code=403, detail="Reviewer or approver access required")


def _ensure_submissions_dir() -> None:
    os.makedirs(SUBMISSIONS_DIR, exist_ok=True)


def _ensure_reviewed_files_dir() -> None:
    os.makedirs(REVIEWED_FILES_DIR, exist_ok=True)


def _safe_filename(name: str) -> str:
    # Keep this conservative for Windows.
    bad = '<>:"/\\|?*\n\r\t'
    out = "".join(("_" if c in bad else c) for c in (name or ""))
    out = out.strip().strip(".")
    return out or "file"


def _reviewed_excel_path(submission_id: str, file_name: str) -> str:
    _ensure_reviewed_files_dir()
    base = _safe_filename(os.path.basename(file_name))
    # Prevent extremely long file names.
    if len(base) > 140:
        base = base[:140]
    return os.path.join(REVIEWED_FILES_DIR, f"{submission_id}__{base}.xlsx")


def _reviewed_json_path(session_or_submission_id: str, file_name: str) -> str:
    return os.path.splitext(_reviewed_excel_path(session_or_submission_id, file_name))[0] + ".json"


def _clean_tables_from_rows(rows: List[Dict[str, Any]]) -> Dict[str, Any]:
    # Minimal metadata once (not repeated per row)
    base = rows[0] if rows else {}
    meta = {
        "hotel_name": base.get("hotel_name"),
        "station_or_airport_code": base.get("station_or_airport_code"),
        "airline_name": base.get("airline_name"),
        "document_title": base.get("document_title"),
    }

    compliance_cols = ["field", "actual_content", "compliant", "comment"]
    compliance_rows = []
    for r in rows:
        if not r.get("field"):
            continue
        # Skip the synthetic entries (rate periods/yearly terms) from compliance table
        if (
            r.get("segment_year")
            or r.get("rate_period_start_date")
            or r.get("rate_period_room_rate")
        ):
            continue
        compliance_rows.append([
            r.get("field") or "",
            r.get("actual_content") or "",
            (r.get("compliant") or "").strip(),
            r.get("comment") or "",
        ])

    yt_cols = ["segment_year", "segment_start_date", "segment_end_date", "segment_room_rate", "segment_currency"]
    yt_rows = []
    for r in rows:
        if not (
            r.get("segment_year")
            or r.get("segment_start_date")
            or r.get("segment_end_date")
            or r.get("segment_room_rate")
        ):
            continue
        yt_rows.append([
            r.get("segment_year") or "",
            r.get("segment_start_date") or "",
            r.get("segment_end_date") or "",
            r.get("segment_room_rate") or "",
            r.get("segment_currency") or "",
        ])

    # sort yearly terms by year
    def _y_key(row: List[Any]):
        try:
            return int(str(row[0]).strip())
        except Exception:
            return 10**9

    yt_rows.sort(key=_y_key)

    return {
        "meta": meta,
        "tables": {
            "compliance": {"columns": compliance_cols, "rows": compliance_rows},
            "yearly_terms": {"columns": yt_cols, "rows": yt_rows},
        },
    }


def _load_saved_clean_table(session_or_submission_id: str, file_name: str) -> Optional[Dict[str, Any]]:
    path = _reviewed_json_path(session_or_submission_id, file_name)
    if not os.path.exists(path):
        return None
    try:
        with open(path, "r", encoding="utf-8") as f:
            obj = json.load(f)
        if isinstance(obj, dict) and obj.get("tables"):
            return obj
    except Exception:
        return None
    return None


def _save_clean_table(session_or_submission_id: str, file_name: str, obj: Dict[str, Any]) -> str:
    path = _reviewed_json_path(session_or_submission_id, file_name)
    _ensure_reviewed_files_dir()
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)
    return path


def _submission_path(submission_id: str) -> str:
    return os.path.join(SUBMISSIONS_DIR, f"{submission_id}.json")


def _write_submission(submission_id: str, payload: Dict[str, Any]) -> None:
    _ensure_submissions_dir()
    with open(_submission_path(submission_id), "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)


def _read_submission(submission_id: str) -> Dict[str, Any]:
    path = _submission_path(submission_id)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Submission not found")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _list_submissions() -> List[Dict[str, Any]]:
    _ensure_submissions_dir()
    out: List[Dict[str, Any]] = []
    for name in os.listdir(SUBMISSIONS_DIR):
        if not name.lower().endswith(".json"):
            continue
        sid = os.path.splitext(name)[0]
        try:
            obj = _read_submission(sid)
        except Exception:
            continue
        out.append({
            "submission_id": sid,
            "created_at": obj.get("created_at"),
            "status": obj.get("status"),
            "reviewer": obj.get("reviewer"),
        })
    out.sort(key=lambda x: str(x.get("created_at") or ""), reverse=True)
    return out


def _extract_file_names_from_submission_payload(payload: Any) -> List[str]:
    # Stored payload can be either:
    # - {"ocr_session_id": ..., "results": [ {file_name, ...}, ... ]}
    # - {"status": "success", "results": [...]}
    # - [ {file_name, ...}, ... ]
    # - a single result dict
    if payload is None:
        return []

    # New clean reviewed table payload shape
    if isinstance(payload, dict) and isinstance(payload.get("reviewed_tables"), dict):
        rt = payload.get("reviewed_tables") or {}
        fn = rt.get("file_name")
        if isinstance(fn, str) and fn.strip():
            return [fn.strip()]
        return []

    # In case we store the reviewed_tables directly as the payload
    if isinstance(payload, dict) and isinstance(payload.get("tables"), dict):
        fn = payload.get("file_name")
        if isinstance(fn, str) and fn.strip():
            return [fn.strip()]

    raw = payload
    if isinstance(raw, dict) and "results" in raw and isinstance(raw.get("results"), list):
        raw = raw.get("results")

    items: List[Dict[str, Any]] = []
    if isinstance(raw, list):
        items = [x for x in raw if isinstance(x, dict)]
    elif isinstance(raw, dict):
        items = [raw]
    else:
        return []

    names: List[str] = []
    for it in items:
        fn = it.get("file_name") or (it.get("meta") or {}).get("file_name")
        if isinstance(fn, str) and fn.strip():
            names.append(fn.strip())

    # de-dupe but stable
    seen = set()
    out: List[str] = []
    for n in names:
        key = n.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append(n)
    return out


def _append_audit_log(row: Dict[str, Any]) -> None:
    with _review_audit_lock:
        if os.path.exists(REVIEW_AUDIT_LOG_XLSX):
            try:
                df_old = pd.read_excel(REVIEW_AUDIT_LOG_XLSX)
            except Exception:
                df_old = pd.DataFrame()
        else:
            df_old = pd.DataFrame()

        df_new = pd.DataFrame([row])
        df_out = pd.concat([df_old, df_new], ignore_index=True)
        with pd.ExcelWriter(REVIEW_AUDIT_LOG_XLSX, engine="openpyxl") as writer:
            df_out.to_excel(writer, sheet_name="Audit", index=False)

OCR_SESSION_TTL_SECONDS = int(os.getenv("OCR_SESSION_TTL_SECONDS", "3600"))
_ocr_sessions_lock = threading.Lock()
_ocr_sessions: Dict[str, Dict[str, Any]] = {}

REVIEW_SESSION_TTL_SECONDS = int(os.getenv("REVIEW_SESSION_TTL_SECONDS", "21600"))
_review_sessions_lock = threading.Lock()
_review_sessions: Dict[str, Dict[str, Any]] = {}


def _ocr_sessions_purge_expired(now_ts: Optional[float] = None) -> None:
    now_ts = now_ts if now_ts is not None else time.time()
    expired = []
    for sid, payload in _ocr_sessions.items():
        created = payload.get("created_at", 0)
        if now_ts - float(created or 0) > OCR_SESSION_TTL_SECONDS:
            expired.append(sid)
    for sid in expired:
        _ocr_sessions.pop(sid, None)


def _review_sessions_purge_expired(now_ts: Optional[float] = None) -> None:
    now_ts = now_ts if now_ts is not None else time.time()
    expired = []
    for sid, payload in _review_sessions.items():
        created = payload.get("created_at", 0)
        if now_ts - float(created or 0) > REVIEW_SESSION_TTL_SECONDS:
            expired.append(sid)
    for sid in expired:
        _review_sessions.pop(sid, None)


def review_session_put(session_id: str, results_payload: Dict[str, Any]) -> None:
    now_ts = time.time()
    with _review_sessions_lock:
        _review_sessions_purge_expired(now_ts)
        _review_sessions[session_id] = {
            "created_at": now_ts,
            "payload": results_payload,
        }


def review_session_get(session_id: str) -> Optional[Dict[str, Any]]:
    with _review_sessions_lock:
        _review_sessions_purge_expired()
        sess = _review_sessions.get(session_id)
        if not sess:
            return None
        return {"created_at": sess.get("created_at"), "payload": sess.get("payload")}


def review_session_clear(session_id: Optional[str]) -> None:
    if not session_id:
        return
    with _review_sessions_lock:
        _review_sessions_purge_expired()
        _review_sessions.pop(session_id, None)


def ocr_session_clear(session_id: Optional[str]) -> None:
    if not session_id:
        return
    with _ocr_sessions_lock:
        _ocr_sessions_purge_expired()
        _ocr_sessions.pop(session_id, None)


def ocr_session_put_markdown(session_id: str, file_name: str, markdown: str) -> None:
    now_ts = time.time()
    with _ocr_sessions_lock:
        _ocr_sessions_purge_expired(now_ts)
        sess = _ocr_sessions.get(session_id)
        if not sess:
            sess = {"created_at": now_ts, "files": {}}
            _ocr_sessions[session_id] = sess
        sess["files"][file_name or "uploaded_file"] = markdown


def ocr_session_get(session_id: str) -> Optional[Dict[str, Any]]:
    with _ocr_sessions_lock:
        _ocr_sessions_purge_expired()
        sess = _ocr_sessions.get(session_id)
        if not sess:
            return None
        return {"created_at": sess.get("created_at"), "files": dict(sess.get("files") or {})}


@app.get("/ocr/{session_id}")
async def get_ocr_session(session_id: str = FastAPIPath(..., description="OCR session id returned by /analyze or /analyze-batch")):
    sess = ocr_session_get(session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="OCR session not found or expired")
    return JSONResponse(content={"status": "success", "ocr_session_id": session_id, **sess})


@app.get("/ocr/{session_id}/{file_name}")
async def get_ocr_for_file(
    session_id: str = FastAPIPath(..., description="OCR session id returned by /analyze or /analyze-batch"),
    file_name: str = FastAPIPath(..., description="Exact file_name returned by analyze endpoints"),
):
    sess = ocr_session_get(session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="OCR session not found or expired")
    files = sess.get("files") or {}
    if file_name not in files:
        raise HTTPException(status_code=404, detail="OCR for file not found in this session")
    return JSONResponse(content={"status": "success", "ocr_session_id": session_id, "file_name": file_name, "ocr_markdown": files[file_name]})


@app.delete("/ocr/{session_id}")
async def delete_ocr_session(session_id: str = FastAPIPath(..., description="OCR session id to delete")):
    ocr_session_clear(session_id)
    return JSONResponse(content={"status": "success", "ocr_session_id": session_id})


@app.get("/review-sessions/{review_session_id}")
async def get_review_session(review_session_id: str, x_api_key: Optional[str] = Header(None)):
    _require_reviewer_or_approver(x_api_key)
    sess = review_session_get(review_session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="Review session not found or expired")
    return JSONResponse(content={"status": "success", "review_session_id": review_session_id, **sess})


@app.delete("/review-sessions/{review_session_id}")
async def delete_review_session(review_session_id: str, x_api_key: Optional[str] = Header(None)):
    _require_reviewer_or_approver(x_api_key)
    review_session_clear(review_session_id)
    return JSONResponse(content={"status": "success", "review_session_id": review_session_id})

# CORS for your React app (adjust origins to your domain/port)

CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in CORS_ORIGINS if o.strip()],  # replace with ["http://localhost:5173", "https://your-frontend.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Helpers
# -------------------------------
def guess_mime(filename: str) -> str:
    ext = os.path.splitext(filename)[1].lower()
    return {
        ".txt": "text/plain",
        ".pdf": "application/pdf",
        ".doc": "application/msword",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }.get(ext, "application/octet-stream")

def _safe_to_row_items(obj: Any) -> List[Dict[str, Any]]:
    """
    Normalize vs_output into list[dict] suitable for DataFrame.
    - dict -> [dict]
    - list of dicts -> list[dict]
    - list of scalars -> [ {"value": "<json-string>"} ]
    - scalar -> [ {"value": "<string>"} ]
    """
    if isinstance(obj, dict):
        return [obj]
    if isinstance(obj, list):
        if all(isinstance(x, dict) for x in obj) and len(obj) > 0:
            return obj
        return [{"value": json.dumps(obj, ensure_ascii=False)}]
    return [{"value": str(obj)}]

def flatten_to_records(vs_output: Any, meta: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Flatten nested JSON to dot-notated columns and prepend meta."""
    rows = _safe_to_row_items(vs_output)
    df = pd.json_normalize(rows, sep=".")
    for k in ["timestamp", "file_name", "run_id"]:
        df.insert(0, k, meta.get(k, ""))
    return df.to_dict(orient="records")

def build_excel_bytes(flat_rows: List[Dict[str, Any]]) -> bytes:
    df = pd.DataFrame(flat_rows)
    buf = io.BytesIO()
    with pd.ExcelWriter(buf, engine="xlsxwriter") as writer:
        df.to_excel(writer, sheet_name="Review", index=False)
    buf.seek(0)
    return buf.read()


def _excel_bytes_from_clean_tables(clean_obj: Dict[str, Any]) -> bytes:
    tables = (clean_obj or {}).get("tables") or {}
    comp = tables.get("compliance") or {}
    yt = tables.get("yearly_terms") or {}

    comp_cols = comp.get("columns") or ["field", "actual_content", "compliant", "comment"]
    comp_rows = comp.get("rows") or []
    yt_cols = yt.get("columns") or ["segment_year", "segment_start_date", "segment_end_date", "segment_room_rate", "segment_currency"]
    yt_rows = yt.get("rows") or []

    buf = io.BytesIO()
    with pd.ExcelWriter(buf, engine="xlsxwriter") as writer:
        df_comp = pd.DataFrame(comp_rows, columns=comp_cols)
        df_comp.to_excel(writer, sheet_name="Compliance", index=False)

        df_yt = pd.DataFrame(yt_rows, columns=yt_cols)
        df_yt.to_excel(writer, sheet_name="Yearly Terms", index=False)

    buf.seek(0)
    return buf.read()


def _rows_from_review_session_payload(review_payload: Dict[str, Any]) -> List[Dict[str, Any]]:
    # review_payload shape: {"ocr_session_id": ..., "results": [...]}
    return _rows_from_payload(review_payload)

def call_vectorshift(file_bytes: bytes, filename: str, mime: str):
    """
    Try multipart with port name 'input_0', then fallback to 'file'.
    """
    headers = {"Authorization": f"Bearer {API_KEY}"}
    inputs_payload = {
        "input_0": {"metadata": {"name": filename, "mime_type": mime or "application/octet-stream"}}
    }
    data = {"inputs": json.dumps(inputs_payload)}

    # Attempt A
    files_a = {"input_0": (filename, file_bytes, mime or "application/octet-stream")}
    resp_a = requests.post(API_URL, headers=headers, data=data, files=files_a, timeout=120)
    try:
        payload_a = resp_a.json()
    except Exception:
        payload_a = {"status": "error", "detail": resp_a.text}

    if resp_a.status_code == 200 and payload_a.get("status") == "success":
        return resp_a.status_code, payload_a

    # Attempt B
    err_text = (payload_a.get("error") or payload_a.get("detail") or "").lower()
    if ("file parser" in err_text) or ("no file" in err_text) or ("parser" in err_text) or (resp_a.status_code >= 400):
        files_b = {"file": (filename, file_bytes, mime or "application/octet-stream")}
        resp_b = requests.post(API_URL, headers=headers, data=data, files=files_b, timeout=120)
        try:
            payload_b = resp_b.json()
        except Exception:
            payload_b = {"status": "error", "detail": resp_b.text}
        return resp_b.status_code, payload_b

    return resp_a.status_code, payload_a

# -------------------------------
# Routes
# -------------------------------
@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    try_parse_json: bool = Form(True),  # optional flag from frontend
    include_ocr: bool = Form(False),
    prev_ocr_session_id: Optional[str] = Form(None),
):
    """
    Upload one file (multipart/form-data) -> OCR via Landing.ai -> calls VectorShift -> returns:
    - run_id
    - output_raw
    - output_parsed (if JSON)
    - flat_rows (preview table data with metadata)
    """
    filename = file.filename
    content = await file.read()
    mime = guess_mime(filename)

    ocr_session_clear(prev_ocr_session_id)
    ocr_session_id = str(uuid.uuid4())

    # --- ALL FILES: First OCR via Landing.ai, then send to VectorShift ---
    try:
        # Step 1: OCR the document using Landing.ai
        ocr_md = landing_ocr_to_markdown(content, filename)
        ocr_session_put_markdown(ocr_session_id, filename, ocr_md)

        # Step 2: Prepare OCR text with filename context for VectorShift
        ocr_payload_text = f"FILE_NAME: {filename}\n\n{ocr_md}"

        # Step 3: Send OCR'd text to VectorShift for analysis
        status_code, payload = call_vectorshift_with_text(
            ocr_payload_text,
            filename=f"{Path(filename).stem}_landing_ocr.txt"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail={"error": f"Landing.ai OCR failed for {filename}: {str(e)}"})

    if status_code != 200 or payload.get("status") != "success":
        # Pass through error to client
        raise HTTPException(status_code=400, detail=payload)

    run_id = payload.get("run_id")
    outputs = payload.get("outputs", {})
    raw_output = outputs.get("output_0", "")

    parsed: Optional[Any] = None
    if try_parse_json:
        try:
            parsed = json.loads(raw_output)
        except Exception:
            parsed = None

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    meta = {"timestamp": now, "file_name": filename, "run_id": run_id}

    vs_out = parsed if parsed is not None else raw_output
    # If not dict/list, keep raw in {"value": "..."} so table still shows something.
    if not isinstance(vs_out, (dict, list)):
        try:
            vs_out = json.loads(str(vs_out))
        except Exception:
            vs_out = {"value": str(vs_out)}

    flat_rows = flatten_to_records(vs_out, meta)

    return JSONResponse(
        content={
            "status": "success",
            "run_id": run_id,
            "file_name": filename,
            "ocr_session_id": ocr_session_id,
            "ocr_markdown": ocr_md if include_ocr else None,
            "output_raw": raw_output,
            "output_parsed": parsed,  # may be null
            "flat_rows": flat_rows,   # list of dicts for table preview
            "meta": meta,
        }
    )

from typing import Any, Dict, List, Union
from datetime import datetime
import json
import pandas as pd
import io
from fastapi import HTTPException
from fastapi.responses import StreamingResponse
import re
from collections import defaultdict

# ===============================================================================
# ENHANCED CONTRACT COMPLIANCE EXPORT SYSTEM
# ===============================================================================
# 
# OVERVIEW:
# This enhanced export system processes contract review data from VectorShift AI
# and generates professional compliance reports with the following features:
#
# 1. DATA VALIDATION:
#    - Validates required fields are present
#    - Identifies unmapped AI pipeline fields  
#    - Calculates compliance statistics
#    - Generates data quality warnings
#
# 2. EXCEL OUTPUT FEATURES:
#    - Summary sheet with overall statistics and file-level validation results
#    - Individual contract sheets with 2-row format (values + compliance flags)
#    - Conditional formatting: Green=Compliant, Red=Non-compliant, Yellow=N/A
#    - Data quality comments on sheets with issues
#    - Professional styling with borders and proper column widths
#
# 3. FIELD MAPPING:
#    - Robust mapping from AI field names to standardized column names
#    - Easy to extend with new field types as AI pipeline evolves
#    - Handles multiple field names that map to same output column
#
# 4. USAGE NOTES:
#    - Input: JSON from /analyze or /analyze-batch endpoints
#    - Output: Excel file with .xlsx extension
#    - Supports batch processing of multiple contract files
#    - Automatically handles missing or incomplete data
#
# 5. MAINTENANCE:
#    - Add new field mappings to FIELD_TO_COLUMN dictionary
#    - Update REQUIRED_FIELDS for critical validation
#    - Modify HIGH_RISK_FIELDS for compliance reporting focus
#
# ===============================================================================

# NOTE: Define the exact column order and names for the compliance Excel export
# This matches the expected format for contract compliance reporting
DESIRED_COLUMNS = [
    "Airline",           # Airline name from contract
    "Name Full",         # Hotel full name
    "HC Key",            # Station/Airport code (Hotel Code Key)
    "Start Dt Tm",       # Contract start date
    "End Dt Tm",         # Contract end date  
    "End Dt Tm Other",   # Alternative end date (usually same as End Dt Tm)
    "Room Rate",         # Primary room rate (LRA/Non-LRA)
    "Ad Hoc Room Rate",  # Special/emergency rates
    "Currency Cd",       # Currency code (USD, EUR, etc.)
    "Tax Rate",          # Tax percentage and exemptions
    "Tax Reclaim Len",   # Tax reclaim period length (usually N/A)
    "Tax Rate Reclaim",  # Reclaimable tax rate (usually N/A)
    "Flat Tax",          # Fixed tax amount (e.g., $5.00)
    "Comm Rate",         # Commission rate percentage
    "Layover Rule Text", # Layover policies and rules
    "CancelTxt",         # Cancellation policy text
]

# NOTE: Map VectorShift AI pipeline field names to our standardized Excel column names
# This ensures consistent output regardless of how the AI names the extracted fields
# Add new mappings here when the AI pipeline identifies new field types
FIELD_TO_COLUMN = {
    # Contract dates
    "Start Date": "Start Dt Tm",
    "End Date": "End Dt Tm",
    
    # Rate information
    "Room Capping": "Room Rate",        # Primary rate with LRA info
    "Single Room Rate": "Room Rate",    # Alternative rate field
    "Ad Hoc Rate": "Ad Hoc Room Rate",
    
    # Financial terms
    "Currency": "Currency Cd",
    "Tax Rate and Exemption": "Tax Rate",
    "Other Tax / Flat Tax": "Flat Tax",
    "Commission Rate": "Comm Rate",
    
    # Policies and rules
    "Layover Rules": "Layover Rule Text",
    "Cancellation Policy": "CancelTxt",
    
    # TODO: Add these mappings if they appear in your data:
    # "Weekend Rates": "Weekend Rate",
    # "Special Day Rates": "Special Rate",
    # "Check-in Policy": "Checkin Policy",
}

# NOTE: Columns that are typically marked as "N/A" unless specifically provided by the pipeline
# These are specialized fields not commonly found in standard hotel contracts
DEFAULT_NA_COLUMNS = {"Tax Reclaim Len", "Tax Rate Reclaim"}

# NOTE: Critical fields that should always have values for a complete contract
REQUIRED_FIELDS = {"Airline", "Name Full", "HC Key", "Start Dt Tm", "End Dt Tm", "Room Rate"}

# NOTE: Fields that commonly have compliance issues (for reporting)
HIGH_RISK_FIELDS = {"Currency Cd", "Tax Rate", "Layover Rule Text", "CancelTxt"}


def _excel_safe_sheet_name(name: str) -> str:
    """
    Excel limits: 31 chars, cannot contain: : \\ / ? * [ ]
    """
    name = name or "Sheet"
    name = re.sub(r"[:\\/?*\[\]]", " ", name)
    name = name.strip() or "Sheet"
    return name[:31]


def validate_export_data(review_rows: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    NOTE: Validate the export data and return a report of issues found.
    This helps identify data quality problems before generating the Excel.
    
    Returns:
        {
            "is_valid": bool,
            "missing_required": [field_names],
            "unmapped_fields": [field_names],
            "compliance_summary": {"Y": count, "N": count, "total": count},
            "warnings": [warning_messages]
        }
    """
    if not review_rows:
        return {
            "is_valid": False,
            "missing_required": list(REQUIRED_FIELDS),
            "unmapped_fields": [],
            "compliance_summary": {"Y": 0, "N": 0, "total": 0},
            "warnings": ["No review data provided"]
        }
    
    # Check for unmapped fields from AI pipeline
    found_fields = {r.get("field", "").strip() for r in review_rows if r.get("field")}
    unmapped_fields = [f for f in found_fields if f and f not in FIELD_TO_COLUMN]
    
    # Check compliance summary
    compliance_counts = {"Y": 0, "N": 0, "total": len(review_rows)}
    for r in review_rows:
        comp = (r.get("compliant") or "").strip()
        if comp == "Y":
            compliance_counts["Y"] += 1
        elif comp == "N":
            compliance_counts["N"] += 1
    
    # Check for missing required fields
    base_row = review_rows[0] if review_rows else {}
    mapped_columns = set()
    for r in review_rows:
        field = r.get("field", "").strip()
        if field in FIELD_TO_COLUMN:
            mapped_columns.add(FIELD_TO_COLUMN[field])
    
    # Add header fields that are always present
    if base_row.get("airline_name"):
        mapped_columns.add("Airline")
    if base_row.get("hotel_name"):
        mapped_columns.add("Name Full")
    if base_row.get("station_or_airport_code"):
        mapped_columns.add("HC Key")
    
    missing_required = [f for f in REQUIRED_FIELDS if f not in mapped_columns]
    
    # Generate warnings
    warnings = []
    if unmapped_fields:
        warnings.append(f"Found {len(unmapped_fields)} unmapped AI fields: {', '.join(list(unmapped_fields)[:3])}{'...' if len(unmapped_fields) > 3 else ''}")
    
    if compliance_counts["N"] > compliance_counts["Y"]:
        warnings.append(f"More non-compliant ({compliance_counts['N']}) than compliant ({compliance_counts['Y']}) fields found")
    
    if missing_required:
        warnings.append(f"Missing critical fields: {', '.join(missing_required)}")
    
    return {
        "is_valid": len(missing_required) == 0 and len(warnings) <= 1,  # Allow minor warnings
        "missing_required": missing_required,
        "unmapped_fields": list(unmapped_fields),
        "compliance_summary": compliance_counts,
        "warnings": warnings
    }


def build_compliance_wide_from_review_rows(review_rows: List[Dict[str, Any]]) -> pd.DataFrame:
    """
    Takes rows like:
      { airline_name, hotel_name, station_or_airport_code, field, actual_content, compliant, ... }
    Returns a 2-row dataframe:
      row0 = values
      row1 = Y/N/N/A flags
    """
    if not review_rows:
        # empty shell
        values = {c: "" for c in DESIRED_COLUMNS}
        flags = {c: "" for c in DESIRED_COLUMNS}
        return pd.DataFrame([values, flags], columns=DESIRED_COLUMNS)

    base0 = review_rows[0]

    values = {c: "" for c in DESIRED_COLUMNS}
    flags = {c: "" for c in DESIRED_COLUMNS}

    # Header-level fields (prefer meta fields you already produce)
    values["Airline"] = base0.get("airline_name", "") or ""
    values["Name Full"] = base0.get("hotel_name", "") or ""
    values["HC Key"] = base0.get("station_or_airport_code", "") or ""

    # Default N/A flags for some columns if not present
    for c in DEFAULT_NA_COLUMNS:
        flags[c] = "N/A"

    # Fill from review items
    for r in review_rows:
        f = (r.get("field") or "").strip()
        col = FIELD_TO_COLUMN.get(f)
        if not col:
            continue

        # value
        values[col] = r.get("actual_content", "") or ""

        # compliant flag
        comp = (r.get("compliant") or "").strip()
        # Normalize a bit (your data uses 'Y')
        if comp in {"Y", "N"}:
            flags[col] = comp
        elif comp:
            flags[col] = comp  # keep as-is if pipeline returns something else

    # End Dt Tm Other: if you want it equal to End Dt Tm (as your sample shows)
    if not values["End Dt Tm Other"]:
        values["End Dt Tm Other"] = values["End Dt Tm"]
        flags["End Dt Tm Other"] = flags["End Dt Tm"] or ""

    # For Airline / Name Full / HC Key: mark Y if present, else blank
    flags["Airline"] = "Y" if values["Airline"] else ""
    flags["Name Full"] = "Y" if values["Name Full"] else ""
    flags["HC Key"] = "Y" if values["HC Key"] else ""

    # If you want Start/End always flagged from their review items, they already are.
    # If not present, leave blank.

    df_out = pd.DataFrame([values, flags], columns=DESIRED_COLUMNS)
    return df_out


def generate_summary_stats(grouped_review_rows: Dict[str, List[Dict[str, Any]]]) -> Dict[str, Any]:
    """
    NOTE: Generate summary statistics for all processed contracts.
    This provides an overview of data quality and compliance across all files.
    """
    total_files = len(grouped_review_rows)
    total_fields = sum(len(rows) for rows in grouped_review_rows.values())
    
    all_validations = []
    compliance_totals = {"Y": 0, "N": 0, "total": 0}
    
    for file_name, rows in grouped_review_rows.items():
        validation = validate_export_data(rows)
        all_validations.append({"file": file_name, **validation})
        
        # Aggregate compliance stats
        compliance_totals["Y"] += validation["compliance_summary"]["Y"]
        compliance_totals["N"] += validation["compliance_summary"]["N"]
        compliance_totals["total"] += validation["compliance_summary"]["total"]
    
    files_with_issues = sum(1 for v in all_validations if not v["is_valid"])
    
    return {
        "total_files": total_files,
        "total_fields": total_fields,
        "files_with_issues": files_with_issues,
        "overall_compliance": compliance_totals,
        "compliance_rate": round(compliance_totals["Y"] / max(compliance_totals["total"], 1) * 100, 1),
        "validations": all_validations
    }


def write_compliance_workbook(
    grouped_review_rows: Dict[str, List[Dict[str, Any]]],
    rate_period_rows: Optional[List[Dict[str, Any]]] = None,
    yearly_term_rows: Optional[List[Dict[str, Any]]] = None,
) -> bytes:
    """
    NOTE: Generate the main compliance Excel workbook with enhanced formatting and validation.
    
    Structure:
    - Summary sheet: Overall statistics and validation results
    - One sheet per contract file: 2-row format (values + compliance flags)
    - Enhanced formatting with conditional formatting for compliance flags
    
    Args:
        grouped_review_rows: { file_name: [review_row, ...] }
    
    Returns:
        Excel file as bytes
    """
    # NOTE: Generate summary statistics first
    summary_stats = generate_summary_stats(grouped_review_rows)
    
    buf = io.BytesIO()
    with pd.ExcelWriter(buf, engine="xlsxwriter") as writer:
        workbook = writer.book
        
        # NOTE: Define enhanced formatting styles
        header_fmt = workbook.add_format({
            "bold": True, 
            "text_wrap": True, 
            "bg_color": "#4472C4", 
            "font_color": "white",
            "border": 1
        })
        
        wrap_fmt = workbook.add_format({
            "text_wrap": True, 
            "valign": "top",
            "border": 1
        })
        
        # NOTE: Conditional formatting for compliance flags
        compliant_fmt = workbook.add_format({
            "bg_color": "#C6EFCE",  # Light green
            "font_color": "#006100", # Dark green
            "text_wrap": True,
            "border": 1
        })
        
        non_compliant_fmt = workbook.add_format({
            "bg_color": "#FFC7CE",  # Light red
            "font_color": "#9C0006", # Dark red
            "text_wrap": True,
            "border": 1
        })
        
        na_fmt = workbook.add_format({
            "bg_color": "#FFEB9C",  # Light yellow
            "font_color": "#9C6500", # Dark yellow
            "text_wrap": True,
            "border": 1
        })
        
        # NOTE: Create summary sheet first
        summary_data = [
            ["Metric", "Value"],
            ["Total Files Processed", summary_stats["total_files"]],
            ["Total Fields Extracted", summary_stats["total_fields"]],
            ["Files with Issues", summary_stats["files_with_issues"]],
            ["Overall Compliance Rate", f"{summary_stats['compliance_rate']}%"],
            ["Compliant Fields", summary_stats["overall_compliance"]["Y"]],
            ["Non-Compliant Fields", summary_stats["overall_compliance"]["N"]],
            ["", ""],  # Empty row
            ["File-Level Validation Results", ""],
        ]
        
        # Add validation details for each file
        for validation in summary_stats["validations"]:
            file_status = "✓ Valid" if validation["is_valid"] else "⚠ Issues Found"
            summary_data.append([validation["file"], file_status])
            if validation["warnings"]:
                for warning in validation["warnings"][:2]:  # Limit to 2 warnings per file
                    summary_data.append(["", f"  • {warning}"])
        
        summary_df = pd.DataFrame(summary_data)
        summary_df.to_excel(writer, sheet_name="Summary", index=False, header=False)
        
        # Format summary sheet
        summary_ws = writer.sheets["Summary"]
        summary_ws.set_column(0, 0, 35)  # File/Metric column
        summary_ws.set_column(1, 1, 50)  # Value/Status column
        
        # Apply header formatting to summary
        summary_ws.set_row(0, 20, header_fmt)
        summary_ws.set_row(8, 20, header_fmt)  # "File-Level Validation Results" header

        # NOTE: Optional Rate Periods sheet (one row per date-range rate block)
        if rate_period_rows:
            cols = [
                "file_name",
                "rate_period_label",
                "rate_period_start_date",
                "rate_period_end_date",
                "rate_period_room_rate",
                "rate_period_currency",
                "rate_period_taxes_and_fees",
            ]
            df_rp = pd.DataFrame(rate_period_rows)
            for c in cols:
                if c not in df_rp.columns:
                    df_rp[c] = ""
            df_rp = df_rp[cols]
            df_rp.to_excel(writer, sheet_name="Rate Periods", index=False)
            rp_ws = writer.sheets["Rate Periods"]
            rp_ws.set_row(0, 25, header_fmt)
            rp_ws.set_column(0, 0, 45, wrap_fmt)
            rp_ws.set_column(1, 1, 18, wrap_fmt)
            rp_ws.set_column(2, 3, 22, wrap_fmt)
            rp_ws.set_column(4, 4, 50, wrap_fmt)
            rp_ws.set_column(5, 5, 16, wrap_fmt)
            rp_ws.set_column(6, 6, 60, wrap_fmt)

        if yearly_term_rows:
            cols = [
                "file_name",
                "segment_year",
                "segment_start_date",
                "segment_end_date",
                "segment_room_rate",
                "segment_currency",
            ]
            df_yt = pd.DataFrame(yearly_term_rows)
            for c in cols:
                if c not in df_yt.columns:
                    df_yt[c] = ""
            df_yt = df_yt[cols]
            df_yt.to_excel(writer, sheet_name="Yearly Terms", index=False)
            yt_ws = writer.sheets["Yearly Terms"]
            yt_ws.set_row(0, 25, header_fmt)
            yt_ws.set_column(0, 0, 45, wrap_fmt)
            yt_ws.set_column(1, 1, 12, wrap_fmt)
            yt_ws.set_column(2, 3, 22, wrap_fmt)
            yt_ws.set_column(4, 4, 50, wrap_fmt)
            yt_ws.set_column(5, 5, 16, wrap_fmt)

        # NOTE: Create individual contract sheets with enhanced formatting
        for file_name, rows in grouped_review_rows.items():
            sheet = _excel_safe_sheet_name(file_name)
            validation = validate_export_data(rows)

            df_sheet = build_compliance_wide_from_review_rows(rows)
            df_sheet.to_excel(writer, sheet_name=sheet, index=False)

            ws = writer.sheets[sheet]

            # NOTE: Apply row formatting
            ws.set_row(0, 25, header_fmt)   # Header row
            ws.set_row(1, 100, wrap_fmt)    # Values row (increased height for long text)
            ws.set_row(2, 20, wrap_fmt)     # Compliance flags row

            # NOTE: Apply conditional formatting to compliance flags (row 2)
            for i, col in enumerate(DESIRED_COLUMNS):
                # Set column widths based on content type
                if col in {"Layover Rule Text", "CancelTxt", "Room Rate", "Ad Hoc Room Rate", "Tax Rate"}:
                    ws.set_column(i, i, 45, wrap_fmt)  # Wider for text-heavy columns
                elif col in {"Start Dt Tm", "End Dt Tm", "End Dt Tm Other"}:
                    ws.set_column(i, i, 15, wrap_fmt)  # Narrower for dates
                else:
                    ws.set_column(i, i, 20, wrap_fmt)  # Standard width
                
                # NOTE: Apply conditional formatting to compliance flags
                cell_range = f"{chr(65 + i)}3:{chr(65 + i)}3"  # Row 3 (compliance flags)
                ws.conditional_format(cell_range, {
                    'type': 'text',
                    'criteria': 'containing',
                    'value': 'Y',
                    'format': compliant_fmt
                })
                ws.conditional_format(cell_range, {
                    'type': 'text',
                    'criteria': 'containing',
                    'value': 'N',
                    'format': non_compliant_fmt
                })
                ws.conditional_format(cell_range, {
                    'type': 'text',
                    'criteria': 'containing',
                    'value': 'N/A',
                    'format': na_fmt
                })
            
            # NOTE: Add validation notes as a comment on the sheet
            if not validation["is_valid"] and validation["warnings"]:
                warning_text = "\\n".join([f"⚠ {w}" for w in validation["warnings"][:3]])
                ws.write_comment('A1', f"Data Quality Issues:\\n{warning_text}", 
                               {'width': 300, 'height': 100})

    buf.seek(0)
    return buf.read()

def contract_rows_from_vs_output(
    vs_output: Any,
    meta: Dict[str, Any],
) -> List[Dict[str, Any]]:
    """
    Turn one contract JSON (output_parsed-style) into tabular rows.

    Expected vs_output shape:
    {
      "meta": {...},
      "review": [ {field, actual_content, compliant, comment}, ... ],
      "snippets": [...],
      "flags": { "missing_fields": [...], "ambiguous_points": [...] }
    }

    We produce one row *per review item*.
    """

    # If it's a string, try to parse JSON
    if isinstance(vs_output, str):
        try:
            vs_output = json.loads(vs_output)
        except Exception:
            # Fallback: single row with a "value" column
            return [{
                "timestamp": meta.get("timestamp", ""),
                "file_name": meta.get("file_name", ""),
                "run_id": meta.get("run_id", ""),
                "value": vs_output,
            }]

    if not isinstance(vs_output, dict):
        # Fallback: just flatten generically
        return _generic_flatten(vs_output, meta)

    inner_meta = vs_output.get("meta") or {}
    flags = vs_output.get("flags") or {}
    review_list = vs_output.get("review") or []
    yearly_terms = vs_output.get("yearly_terms") or []
    rate_periods = vs_output.get("rate_periods") or []

    missing = flags.get("missing_fields") or []
    ambiguous = flags.get("ambiguous_points") or []

    missing_str = ", ".join(missing) if isinstance(missing, list) else str(missing or "")
    ambiguous_str = " | ".join(ambiguous) if isinstance(ambiguous, list) else str(ambiguous or "")

    base = {
        "timestamp": meta.get("timestamp", ""),
        "file_name": meta.get("file_name", ""),
        "run_id": meta.get("run_id", ""),
        "document_title": inner_meta.get("document_title", ""),
        "station_or_airport_code": inner_meta.get("station_or_airport_code", ""),
        "hotel_name": inner_meta.get("hotel_name", ""),
        "airline_name": inner_meta.get("airline_name", ""),
        "missing_fields": missing_str,
        "ambiguous_points": ambiguous_str,
    }

    if not isinstance(review_list, list) or not review_list:
        # If no proper review list, flatten everything
        return _generic_flatten(vs_output, meta)

    rows: List[Dict[str, Any]] = []
    for item in review_list:
        if not isinstance(item, dict):
            continue
        row = base.copy()
        row["field"] = item.get("field", "")
        row["actual_content"] = item.get("actual_content", "")
        row["compliant"] = item.get("compliant", "")
        row["comment"] = item.get("comment", "")
        rows.append(row)

    # Optional: add year-wise term/rate segments as extra rows (if present)
    # This keeps backward compatibility while letting exports/consumers use split data.
    if isinstance(yearly_terms, list) and yearly_terms:
        for seg in yearly_terms:
            if not isinstance(seg, dict):
                continue
            seg_year = seg.get("year", "")
            seg_row = base.copy()
            seg_row["field"] = f"Yearly Term Segment ({seg_year})"
            seg_row["actual_content"] = seg.get("source_text", "") or ""
            seg_row["compliant"] = "Y" if seg.get("start_date") and seg.get("end_date") and seg.get("room_rate") else "N"
            seg_row["comment"] = "Year-wise split term/rate segment"
            seg_row["segment_year"] = seg_year
            seg_row["segment_start_date"] = seg.get("start_date", "") or ""
            seg_row["segment_end_date"] = seg.get("end_date", "") or ""
            seg_row["segment_room_rate"] = seg.get("room_rate", "") or ""
            seg_row["segment_currency"] = seg.get("currency", "") or ""
            rows.append(seg_row)

    if isinstance(rate_periods, list) and rate_periods:
        for p in rate_periods:
            if not isinstance(p, dict):
                continue
            label = p.get("period_label", "") or ""
            p_row = base.copy()
            p_row["field"] = f"Rate Period ({label})" if label else "Rate Period"
            p_row["actual_content"] = p.get("source_text", "") or ""
            p_row["compliant"] = "Y" if p.get("start_date") and p.get("end_date") and p.get("room_rate") else "N"
            p_row["comment"] = "Multi-period room rate block"
            p_row["rate_period_label"] = label
            p_row["rate_period_start_date"] = p.get("start_date", "") or ""
            p_row["rate_period_end_date"] = p.get("end_date", "") or ""
            p_row["rate_period_room_rate"] = p.get("room_rate", "") or ""
            p_row["rate_period_currency"] = p.get("currency", "") or ""
            p_row["rate_period_taxes_and_fees"] = p.get("taxes_and_fees", "") or ""
            rows.append(p_row)

    return rows


def _generic_flatten(vs_output: Any, meta: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Old generic flattener: json_normalize + prepend meta.
    Used as a fallback when the structure is unknown.
    """
    # Normalize to list[dict]
    if isinstance(vs_output, dict):
        rows = [vs_output]
    elif isinstance(vs_output, list):
        if all(isinstance(x, dict) for x in vs_output) and vs_output:
            rows = vs_output
        else:
            rows = [{"value": json.dumps(vs_output, ensure_ascii=False)}]
    else:
        rows = [{"value": str(vs_output)}]

    df = pd.json_normalize(rows, sep=".")
    for k in ["timestamp", "file_name", "run_id"]:
        df.insert(0, k, meta.get(k, ""))

    return df.to_dict(orient="records")


def rows_from_export_entry(entry: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Normalize a SINGLE 'result' object into rows.

    Supports entries like the ones under response.json.additionalProp1.results[*]
    """
    run_id = entry.get("run_id", "")
    fname = entry.get("file_name", "uploaded_file")
    meta_obj = entry.get("meta") or {}

    ts = (
        entry.get("timestamp")
        or meta_obj.get("timestamp")
        or datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )

    # Prefer explicit vs_output, then output_parsed, then output_raw
    vs_output = entry.get("vs_output")
    if vs_output is None:
        vs_output = entry.get("output_parsed")
    if vs_output is None:
        vs_output = entry.get("output_raw")

    if vs_output is None:
        return []

    meta = {"timestamp": ts, "file_name": fname, "run_id": run_id}
    return contract_rows_from_vs_output(vs_output, meta)


def _normalize_export_payload_to_items(payload: Union[Dict[str, Any], List[Dict[str, Any]]]) -> List[Dict[str, Any]]:
    raw: Union[Dict[str, Any], List[Dict[str, Any]]] = payload

    if isinstance(raw, dict) and len(raw) == 1:
        only_value = list(raw.values())[0]
        if isinstance(only_value, (dict, list)):
            raw = only_value

    items: List[Dict[str, Any]] = []
    if isinstance(raw, list):
        items = [x for x in raw if isinstance(x, dict)]
    elif isinstance(raw, dict):
        if "results" in raw and isinstance(raw["results"], list):
            items = [r for r in raw["results"] if isinstance(r, dict)]
        else:
            items = [raw]
    else:
        raise HTTPException(status_code=400, detail="Unsupported JSON structure.")

    if not items:
        raise HTTPException(status_code=400, detail="No valid items found in payload.")
    return items


def _rows_from_payload(payload: Union[Dict[str, Any], List[Dict[str, Any]]]) -> List[Dict[str, Any]]:
    items = _normalize_export_payload_to_items(payload)
    all_rows: List[Dict[str, Any]] = []
    for entry in items:
        all_rows.extend(rows_from_export_entry(entry))
    return all_rows


def _filter_rows_to_file(rows: List[Dict[str, Any]], file_name: str) -> List[Dict[str, Any]]:
    fn = (file_name or "").strip().lower()
    if not fn:
        return rows
    # substring match to be robust to minor naming differences
    return [r for r in rows if fn in str(r.get("file_name") or "").lower()]


def _make_single_file_workbook_bytes(
    file_rows: List[Dict[str, Any]],
    yearly_terms: List[Dict[str, Any]],
    rate_periods: List[Dict[str, Any]],
    file_name: str,
) -> bytes:
    buf = io.BytesIO()
    with pd.ExcelWriter(buf, engine="xlsxwriter") as writer:
        # Main review rows
        df_main = pd.DataFrame(file_rows or [])
        df_main.to_excel(writer, sheet_name="Review Items", index=False)

        if yearly_terms:
            cols = [
                "file_name",
                "hotel_name",
                "station_or_airport_code",
                "segment_year",
                "segment_start_date",
                "segment_end_date",
                "segment_room_rate",
                "segment_currency",
            ]
            df_yt = pd.DataFrame(yearly_terms)
            for c in cols:
                if c not in df_yt.columns:
                    df_yt[c] = ""
            df_yt = df_yt[cols]
            df_yt.to_excel(writer, sheet_name="Yearly Terms", index=False)

        if rate_periods:
            cols = [
                "file_name",
                "hotel_name",
                "station_or_airport_code",
                "rate_period_label",
                "rate_period_start_date",
                "rate_period_end_date",
                "rate_period_room_rate",
                "rate_period_currency",
                "rate_period_taxes_and_fees",
            ]
            df_rp = pd.DataFrame(rate_periods)
            for c in cols:
                if c not in df_rp.columns:
                    df_rp[c] = ""
            df_rp = df_rp[cols]
            df_rp.to_excel(writer, sheet_name="Rate Periods", index=False)

    buf.seek(0)
    return buf.read()


@app.post("/analyze-batch")
async def analyze_batch(
    files: List[UploadFile] = File(..., description="Upload up to 5 files"),
    try_parse_json: bool = Form(True),
    include_ocr: bool = Form(False),
    prev_ocr_session_id: Optional[str] = Form(None),
):
    """
    Upload up to 5 files in a single multipart/form-data request.
    For each file, call VectorShift and return the same shape as /analyze.
    Response:
    {
      "status": "success",
      "results": [
        {
          "status": "success",
          "run_id": "...",
          "file_name": "...",
          "output_raw": "...",
          "output_parsed": {...} | null,
          "flat_rows": [...],
          "meta": {...}
        },
        {
          "status": "error",
          "file_name": "...",
          "detail": {... original error payload ...}
        },
        ...
      ]
    }
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files provided.")
    if len(files) > 5:
        raise HTTPException(status_code=400, detail="You can upload up to 5 files per request.")

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    ocr_session_clear(prev_ocr_session_id)
    ocr_session_id = str(uuid.uuid4())

    # NOTE: Process files concurrently. Landing.ai OCR + requests.post are blocking,
    # so we run them in a threadpool to avoid blocking the FastAPI event loop.
    sem = asyncio.Semaphore(5)

    async def _process_one(f: UploadFile) -> Dict[str, Any]:
        filename = f.filename
        try:
            content = await f.read()
        except Exception as e:
            return {
                "status": "error",
                "file_name": filename or "",
                "detail": {"error": f"Failed to read file: {e}"},
            }

        async with sem:
            try:
                mime = guess_mime(filename)

                # --- ALL FILES: First OCR via Landing.ai, then send to VectorShift ---
                try:
                    ocr_md = await run_in_threadpool(landing_ocr_to_markdown, content, filename)
                    ocr_session_put_markdown(ocr_session_id, filename, ocr_md)
                    ocr_payload_text = f"FILE_NAME: {filename}\n\n{ocr_md}"
                    status_code, payload = await run_in_threadpool(
                        call_vectorshift_with_text,
                        ocr_payload_text,
                        f"{Path(filename).stem}_landing_ocr.txt",
                    )
                except Exception as e:
                    return {
                        "status": "error",
                        "file_name": filename or "",
                        "detail": {"error": f"Landing.ai OCR failed for {filename}: {str(e)}"},
                    }

                if status_code != 200 or payload.get("status") != "success":
                    return {
                        "status": "error",
                        "file_name": filename,
                        "detail": payload,
                    }

                run_id = payload.get("run_id")
                outputs = payload.get("outputs", {})
                raw_output = outputs.get("output_0", "")

                parsed = None
                if try_parse_json:
                    try:
                        parsed = json.loads(raw_output)
                    except Exception:
                        parsed = None

                meta = {"timestamp": now_str, "file_name": filename, "run_id": run_id}

                vs_out = parsed if parsed is not None else raw_output
                if not isinstance(vs_out, (dict, list)):
                    try:
                        vs_out = json.loads(str(vs_out))
                    except Exception:
                        vs_out = {"value": str(vs_out)}

                flat_rows = flatten_to_records(vs_out, meta)

                return {
                    "status": "success",
                    "run_id": run_id,
                    "file_name": filename,
                    "ocr_markdown": ocr_md if include_ocr else None,
                    "output_raw": raw_output,
                    "output_parsed": parsed,
                    "flat_rows": flat_rows,
                    "meta": meta,
                }

            except Exception as e:
                return {
                    "status": "error",
                    "file_name": filename or "",
                    "detail": {"error": str(e)},
                }

    results = await asyncio.gather(*[_process_one(f) for f in files])

    # Review session: allows reviewer to fetch tables & save per-file Excel before creating a submission.
    review_session_id = str(uuid.uuid4())
    review_payload = {"ocr_session_id": ocr_session_id, "results": results}
    review_session_put(review_session_id, review_payload)

    return JSONResponse(
        content={
            "status": "success",
            "ocr_session_id": ocr_session_id,
            "review_session_id": review_session_id,
            "results": results,
        }
    )


@app.get("/review-sessions/{review_session_id}/file-review")
async def get_single_file_review_table_from_session(
    review_session_id: str,
    file_name: str,
    x_api_key: Optional[str] = Header(None),
):
    _require_reviewer_or_approver(x_api_key)

    saved = _load_saved_clean_table(review_session_id, file_name)
    if saved:
        return JSONResponse(
            content={
                "status": "success",
                "review_session_id": review_session_id,
                "file_name": file_name,
                **saved,
            }
        )

    sess = review_session_get(review_session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="Review session not found or expired")

    review_payload = sess.get("payload")
    if not isinstance(review_payload, dict):
        raise HTTPException(status_code=400, detail="Review session payload missing")

    rows_all = _rows_from_review_session_payload(review_payload)
    rows = _filter_rows_to_file(rows_all, file_name)
    clean = _clean_tables_from_rows(rows)
    return JSONResponse(
        content={
            "status": "success",
            "review_session_id": review_session_id,
            "file_name": file_name,
            **clean,
        }
    )


@app.post("/review-sessions/{review_session_id}/file-review/save")
async def save_single_file_review_excel_from_session(
    review_session_id: str,
    payload: Dict[str, Any],
    x_api_key: Optional[str] = Header(None),
):
    _require_reviewer(x_api_key)
    sess = review_session_get(review_session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="Review session not found or expired")

    file_name = payload.get("file_name")
    if not file_name or not isinstance(file_name, str):
        raise HTTPException(status_code=400, detail="file_name is required")

    # Preferred (clean) shape: { meta: {...}, tables: { compliance: {columns,rows}, yearly_terms: {columns,rows} } }
    clean_obj = None
    if isinstance(payload.get("tables"), dict) and isinstance((payload.get("tables") or {}).get("compliance"), dict):
        clean_obj = {
            "meta": payload.get("meta") or {},
            "tables": payload.get("tables") or {},
        }
    else:
        # Backward compatible legacy save shape
        tables = payload.get("tables") or {}
        review_items = tables.get("review_items") or []
        yearly_terms = tables.get("yearly_terms") or []
        rate_periods = tables.get("rate_periods") or []

        if not isinstance(review_items, list) or not isinstance(yearly_terms, list) or not isinstance(rate_periods, list):
            raise HTTPException(status_code=400, detail="tables.* must be lists or provide clean tables.compliance/yearly_terms")

        # convert legacy list-of-dicts to clean columns+rows
        compliance_cols = ["field", "actual_content", "compliant", "comment"]
        compliance_rows = [
            [r.get("field") or "", r.get("actual_content") or "", (r.get("compliant") or "").strip(), r.get("comment") or ""]
            for r in review_items
            if isinstance(r, dict) and r.get("field")
        ]
        yt_cols = ["segment_year", "segment_start_date", "segment_end_date", "segment_room_rate", "segment_currency"]
        yt_rows = [
            [r.get("segment_year") or "", r.get("segment_start_date") or "", r.get("segment_end_date") or "", r.get("segment_room_rate") or "", r.get("segment_currency") or ""]
            for r in yearly_terms
            if isinstance(r, dict)
        ]
        clean_obj = {
            "meta": payload.get("meta") or {},
            "tables": {
                "compliance": {"columns": compliance_cols, "rows": compliance_rows},
                "yearly_terms": {"columns": yt_cols, "rows": yt_rows},
            },
        }

    # Persist clean JSON (for approver to see same edits)
    _save_clean_table(review_session_id, file_name, clean_obj)

    # Persist Excel
    excel_bytes = _excel_bytes_from_clean_tables(clean_obj)

    out_path = _reviewed_excel_path(review_session_id, file_name)
    with open(out_path, "wb") as f:
        f.write(excel_bytes)

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    _append_audit_log({
        "timestamp": now_str,
        "submission_id": review_session_id,
        "action": "file_review_saved",
        "actor": "reviewer",
        "decision": "saved",
        "comment": os.path.basename(out_path),
    })

    return JSONResponse(
        content={
            "status": "success",
            "review_session_id": review_session_id,
            "file_name": file_name,
            "saved_excel": os.path.basename(out_path),
        }
    )


@app.get("/review-sessions/{review_session_id}/file-review/download")
async def download_single_file_review_excel_from_session(
    review_session_id: str,
    file_name: str,
    x_api_key: Optional[str] = Header(None),
):
    _require_reviewer_or_approver(x_api_key)
    path = _reviewed_excel_path(review_session_id, file_name)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Reviewed Excel not found")
    return FileResponse(
        path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=os.path.basename(path),
    )


@app.post("/review-sessions/{review_session_id}/submit")
async def submit_review_from_session(review_session_id: str, x_api_key: Optional[str] = Header(None)):
    _require_reviewer(x_api_key)
    sess = review_session_get(review_session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="Review session not found or expired")
    review_payload = sess.get("payload")
    if not isinstance(review_payload, dict):
        raise HTTPException(status_code=400, detail="Review session payload missing")

    submission_id = str(uuid.uuid4())
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    obj = {
        "submission_id": submission_id,
        "created_at": now_str,
        "status": "submitted",
        "reviewer": "reviewer",
        "payload": review_payload,
        "source_review_session_id": review_session_id,
    }
    _write_submission(submission_id, obj)

    # Copy any saved reviewed artifacts (JSON/XLSX) from review_session namespace -> submission namespace
    try:
        # If reviewer saved per-file tables, they are stored in reviewed_files/<review_session_id>__<file>.json/xlsx
        # We copy them to reviewed_files/<submission_id>__<file>.json/xlsx
        for root, _, files in os.walk(REVIEWED_FILES_DIR):
            for name in files:
                if not name.startswith(f"{review_session_id}__"):
                    continue
                src = os.path.join(root, name)
                dst = os.path.join(root, name.replace(f"{review_session_id}__", f"{submission_id}__", 1))
                try:
                    shutil.copyfile(src, dst)
                except Exception:
                    pass
    except Exception:
        pass
    _append_audit_log({
        "timestamp": now_str,
        "submission_id": submission_id,
        "action": "submitted",
        "actor": "reviewer",
        "decision": "submitted",
        "comment": f"source_review_session_id={review_session_id}",
    })
    return JSONResponse(content={"status": "success", "submission_id": submission_id})




@app.post("/export")
async def export_excel(payload: Union[Dict[str, Any], List[Dict[str, Any]]]):
    """
    Flexible export endpoint.

    Works with JSON shaped like your curl example:

    {
      "additionalProp1": {
        "status": "success",
        "results": [ { ... result1 ... }, { ... result2 ... }, ... ]
      }
    }

    And also with:
    - { "status": "success", "results": [ ... ] }
    - [ {result1}, {result2} ]
    - a single result object.
    """
    # ---- 0) Optional: clear OCR session after export ----
    # Frontend can pass { "ocr_session_id": "...", ... } and we will clear it after the
    # export is generated. We keep it optional for backward compatibility.
    ocr_session_id_to_clear: Optional[str] = None
    if isinstance(payload, dict):
        ocr_session_id_to_clear = (
            payload.get("ocr_session_id")
            or (payload.get("meta") or {}).get("ocr_session_id")
        )

    # ---- 1) Unwrap "additionalProp1" or any single top-level wrapper ----
    raw = payload

    if isinstance(raw, dict) and len(raw) == 1:
        only_value = list(raw.values())[0]
        if isinstance(only_value, (dict, list)):
            raw = only_value  # Now raw is the inner {status, results:[...]} or a list

    # ---- 2) Normalize to a list of result objects ----
    items: List[Dict[str, Any]] = []

    if isinstance(raw, list):
        items = [x for x in raw if isinstance(x, dict)]
    elif isinstance(raw, dict):
        if "results" in raw and isinstance(raw["results"], list):
            items = [r for r in raw["results"] if isinstance(r, dict)]
        else:
            # treat whole dict as a single entry
            items = [raw]
    else:
        raise HTTPException(status_code=400, detail="Unsupported JSON structure for export.")

    if not items:
        raise HTTPException(status_code=400, detail="No valid export items found in payload.")

    # ---- 3) Build rows from all items ----
    all_rows: List[Dict[str, Any]] = []
    for entry in items:
        rows = rows_from_export_entry(entry)
        all_rows.extend(rows)

    if not all_rows:
        raise HTTPException(status_code=400, detail="No rows could be generated from the provided JSON.")

    df = pd.DataFrame(all_rows)

    # ---- 4) Nice column order ----
    preferred_order = [
        "timestamp",
        "file_name",
        "run_id",
        "document_title",
        "station_or_airport_code",
        "hotel_name",
        "airline_name",
        "field",
        "actual_content",
        "compliant",
        "comment",
        "missing_fields",
        "ambiguous_points",
    ]
    existing_cols = list(df.columns)
    ordered = [c for c in preferred_order if c in existing_cols]
    extras = [c for c in existing_cols if c not in ordered]
    df = df[ordered + extras]

    # ---- 5) Write Excel ----
    # buf = io.BytesIO()
    # with pd.ExcelWriter(buf, engine="xlsxwriter") as writer:
    #     df.to_excel(writer, sheet_name="Review", index=False)
    # buf.seek(0)

        # ---- 5) Build ONE sheet per file (wide format) ----
    grouped: Dict[str, List[Dict[str, Any]]] = defaultdict(list)

    # Optional: extract rate period rows for a dedicated sheet
    rate_period_rows: List[Dict[str, Any]] = []

    yearly_term_rows: List[Dict[str, Any]] = []

    # We already built all_rows = one row per review item (field, actual_content, compliant...)
    # Group by file_name so each file becomes its own sheet.
    for r in all_rows:
        grouped[r.get("file_name") or "uploaded_file"].append(r)

        if (
            r.get("rate_period_start_date")
            or r.get("rate_period_end_date")
            or r.get("rate_period_room_rate")
        ):
            rate_period_rows.append(r)

        if (
            r.get("segment_year")
            or r.get("segment_start_date")
            or r.get("segment_end_date")
            or r.get("segment_room_rate")
        ):
            yearly_term_rows.append(r)

    excel_bytes = write_compliance_workbook(grouped, rate_period_rows=rate_period_rows, yearly_term_rows=yearly_term_rows)

    # Clear OCR cache only after we successfully generated the Excel bytes.
    ocr_session_clear(ocr_session_id_to_clear)

    suggested_name = f"compliance-report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    headers = {"Content-Disposition": f'attachment; filename="{suggested_name}"'}
    return StreamingResponse(
        io.BytesIO(excel_bytes),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers=headers,
    )


@app.post("/reviews/submit")
async def submit_review(payload: Dict[str, Any], x_api_key: Optional[str] = Header(None)):
    _require_reviewer(x_api_key)
    submission_id = str(uuid.uuid4())
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # If frontend submits the clean file-level reviewed tables, persist only those (not full VS output)
    stored_payload: Any = payload
    reviewed_tables = payload.get("reviewed_tables") if isinstance(payload, dict) else None
    if isinstance(reviewed_tables, dict) and isinstance(reviewed_tables.get("tables"), dict):
        stored_payload = reviewed_tables
        fn = reviewed_tables.get("file_name")
        if isinstance(fn, str) and fn.strip():
            # Persist as reviewed artifact so approver endpoints return exactly the edited tables
            _save_clean_table(submission_id, fn.strip(), {
                "meta": reviewed_tables.get("meta") or {},
                "tables": reviewed_tables.get("tables") or {},
            })
            try:
                excel_bytes = _excel_bytes_from_clean_tables({
                    "meta": reviewed_tables.get("meta") or {},
                    "tables": reviewed_tables.get("tables") or {},
                })
                with open(_reviewed_excel_path(submission_id, fn.strip()), "wb") as f:
                    f.write(excel_bytes)
            except Exception:
                pass

    obj = {
        "submission_id": submission_id,
        "created_at": now_str,
        "status": "submitted",
        "reviewer": "reviewer",
        "payload": stored_payload,
    }
    _write_submission(submission_id, obj)
    _append_audit_log({
        "timestamp": now_str,
        "submission_id": submission_id,
        "action": "submitted",
        "actor": "reviewer",
        "decision": "submitted",
        "comment": "",
    })
    return JSONResponse(content={"status": "success", "submission_id": submission_id})


@app.get("/reviews")
async def list_reviews(status: Optional[str] = None, x_api_key: Optional[str] = Header(None)):
    _require_approver(x_api_key)
    items = _list_submissions()
    if status:
        items = [x for x in items if (x.get("status") or "").lower() == status.lower()]

    # Expand into file-level view for UI (because you review file-by-file now)
    file_items: List[Dict[str, Any]] = []
    for it in items:
        sid = it.get("submission_id")
        if not sid:
            continue
        try:
            sub = _read_submission(str(sid))
        except Exception:
            continue
        payload = sub.get("payload")
        fns = _extract_file_names_from_submission_payload(payload)
        for fn in fns:
            file_items.append({
                "submission_id": sid,
                "file_name": fn,
                "created_at": it.get("created_at"),
                "status": it.get("status"),
                "reviewer": it.get("reviewer"),
            })

    return JSONResponse(content={"status": "success", "items": items, "files": file_items})


@app.get("/reviews/{submission_id}")
async def get_review(submission_id: str, file_name: Optional[str] = None, x_api_key: Optional[str] = Header(None)):
    _require_reviewer_or_approver(x_api_key)
    if file_name:
        saved = _load_saved_clean_table(submission_id, file_name)
        if saved:
            return JSONResponse(
                content={
                    "status": "success",
                    "submission_id": submission_id,
                    "file_name": file_name,
                    **saved,
                }
            )

        obj = _read_submission(submission_id)
        payload = obj.get("payload")
        if payload is None:
            raise HTTPException(status_code=400, detail="Submission payload missing")
        rows_all = _rows_from_payload(payload)
        rows = _filter_rows_to_file(rows_all, file_name)
        clean = _clean_tables_from_rows(rows)
        return JSONResponse(
            content={
                "status": "success",
                "submission_id": submission_id,
                "file_name": file_name,
                **clean,
            }
        )

    obj = _read_submission(submission_id)
    return JSONResponse(content={"status": "success", **obj})


@app.get("/reviews/{submission_id}/tables/yearly-terms")
async def get_yearly_terms_table(
    submission_id: str,
    hotel_name: Optional[str] = None,
    year: Optional[int] = None,
    file_name: Optional[str] = None,
    x_api_key: Optional[str] = Header(None),
):
    _require_reviewer_or_approver(x_api_key)
    obj = _read_submission(submission_id)
    payload = obj.get("payload")
    if payload is None:
        raise HTTPException(status_code=400, detail="Submission payload missing")

    rows = _rows_from_payload(payload)
    out = []
    for r in rows:
        if not (
            r.get("segment_year")
            or r.get("segment_start_date")
            or r.get("segment_end_date")
            or r.get("segment_room_rate")
        ):
            continue
        out.append(r)

    if file_name:
        fn = file_name.strip().lower()
        out = [r for r in out if fn in str(r.get("file_name") or "").lower()]
    if year is not None:
        out = [r for r in out if str(r.get("segment_year") or "") == str(year)]
    if hotel_name:
        hn = hotel_name.strip().lower()
        out = [r for r in out if hn in str(r.get("hotel_name") or "").lower()]

    def _yt_sort_key(x: Dict[str, Any]):
        y_raw = x.get("segment_year")
        try:
            y = int(str(y_raw).strip())
        except Exception:
            y = 10**9
        return (y, str(x.get("segment_start_date") or ""))

    out.sort(key=_yt_sort_key)

    table = [
        {
            "file_name": r.get("file_name"),
            "hotel_name": r.get("hotel_name"),
            "station_or_airport_code": r.get("station_or_airport_code"),
            "segment_year": r.get("segment_year"),
            "segment_start_date": r.get("segment_start_date"),
            "segment_end_date": r.get("segment_end_date"),
            "segment_room_rate": r.get("segment_room_rate"),
            "segment_currency": r.get("segment_currency"),
        }
        for r in out
    ]

    return JSONResponse(content={"status": "success", "submission_id": submission_id, "count": len(table), "items": table})


@app.get("/reviews/{submission_id}/file-review")
async def get_single_file_review_table(
    submission_id: str,
    file_name: str,
    x_api_key: Optional[str] = Header(None),
):
    _require_reviewer_or_approver(x_api_key)

    saved = _load_saved_clean_table(submission_id, file_name)
    if saved:
        return JSONResponse(
            content={
                "status": "success",
                "submission_id": submission_id,
                "file_name": file_name,
                **saved,
            }
        )

    obj = _read_submission(submission_id)
    payload = obj.get("payload")
    if payload is None:
        raise HTTPException(status_code=400, detail="Submission payload missing")

    rows_all = _rows_from_payload(payload)
    rows = _filter_rows_to_file(rows_all, file_name)
    clean = _clean_tables_from_rows(rows)
    return JSONResponse(
        content={
            "status": "success",
            "submission_id": submission_id,
            "file_name": file_name,
            **clean,
        }
    )


@app.post("/reviews/{submission_id}/file-review/save")
async def save_single_file_review_excel(
    submission_id: str,
    payload: Dict[str, Any],
    x_api_key: Optional[str] = Header(None),
):
    _require_reviewer(x_api_key)

    file_name = payload.get("file_name")
    if not file_name or not isinstance(file_name, str):
        raise HTTPException(status_code=400, detail="file_name is required")

    # Preferred (clean) shape: { meta: {...}, tables: { compliance: {columns,rows}, yearly_terms: {columns,rows} } }
    clean_obj = None
    if isinstance(payload.get("tables"), dict) and isinstance((payload.get("tables") or {}).get("compliance"), dict):
        clean_obj = {
            "meta": payload.get("meta") or {},
            "tables": payload.get("tables") or {},
        }
    else:
        # Backward compatible legacy save shape
        tables = payload.get("tables") or {}
        review_items = tables.get("review_items") or []
        yearly_terms = tables.get("yearly_terms") or []
        rate_periods = tables.get("rate_periods") or []

        if not isinstance(review_items, list) or not isinstance(yearly_terms, list) or not isinstance(rate_periods, list):
            raise HTTPException(status_code=400, detail="tables.* must be lists or provide clean tables.compliance/yearly_terms")

        compliance_cols = ["field", "actual_content", "compliant", "comment"]
        compliance_rows = [
            [r.get("field") or "", r.get("actual_content") or "", (r.get("compliant") or "").strip(), r.get("comment") or ""]
            for r in review_items
            if isinstance(r, dict) and r.get("field")
        ]
        yt_cols = ["segment_year", "segment_start_date", "segment_end_date", "segment_room_rate", "segment_currency"]
        yt_rows = [
            [r.get("segment_year") or "", r.get("segment_start_date") or "", r.get("segment_end_date") or "", r.get("segment_room_rate") or "", r.get("segment_currency") or ""]
            for r in yearly_terms
            if isinstance(r, dict)
        ]
        clean_obj = {
            "meta": payload.get("meta") or {},
            "tables": {
                "compliance": {"columns": compliance_cols, "rows": compliance_rows},
                "yearly_terms": {"columns": yt_cols, "rows": yt_rows},
            },
        }

    # Persist clean JSON (approver sees same edits)
    _save_clean_table(submission_id, file_name, clean_obj)

    # Persist Excel
    excel_bytes = _excel_bytes_from_clean_tables(clean_obj)

    out_path = _reviewed_excel_path(submission_id, file_name)
    with open(out_path, "wb") as f:
        f.write(excel_bytes)

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    _append_audit_log({
        "timestamp": now_str,
        "submission_id": submission_id,
        "action": "file_review_saved",
        "actor": "reviewer",
        "decision": "saved",
        "comment": os.path.basename(out_path),
    })

    return JSONResponse(
        content={
            "status": "success",
            "submission_id": submission_id,
            "file_name": file_name,
            "saved_excel": os.path.basename(out_path),
        }
    )


@app.get("/reviews/{submission_id}/file-review/download")
async def download_single_file_review_excel(
    submission_id: str,
    file_name: str,
    x_api_key: Optional[str] = Header(None),
):
    _require_reviewer_or_approver(x_api_key)
    path = _reviewed_excel_path(submission_id, file_name)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Reviewed Excel not found")
    return FileResponse(
        path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=os.path.basename(path),
    )


@app.get("/reviews/{submission_id}/tables/rate-periods")
async def get_rate_periods_table(
    submission_id: str,
    hotel_name: Optional[str] = None,
    year: Optional[int] = None,
    file_name: Optional[str] = None,
    x_api_key: Optional[str] = Header(None),
):
    _require_reviewer_or_approver(x_api_key)
    obj = _read_submission(submission_id)
    payload = obj.get("payload")
    if payload is None:
        raise HTTPException(status_code=400, detail="Submission payload missing")

    rows = _rows_from_payload(payload)
    out = []
    for r in rows:
        if not (
            r.get("rate_period_start_date")
            or r.get("rate_period_end_date")
            or r.get("rate_period_room_rate")
        ):
            continue
        out.append(r)

    if file_name:
        out = [r for r in out if (r.get("file_name") or "") == file_name]
    if year is not None:
        out = [r for r in out if str(year) in (str(r.get("rate_period_start_date") or "") + " " + str(r.get("rate_period_end_date") or ""))]
    if hotel_name:
        hn = hotel_name.strip().lower()
        out = [r for r in out if hn in str(r.get("hotel_name") or "").lower()]

    table = [
        {
            "file_name": r.get("file_name"),
            "hotel_name": r.get("hotel_name"),
            "station_or_airport_code": r.get("station_or_airport_code"),
            "rate_period_label": r.get("rate_period_label"),
            "rate_period_start_date": r.get("rate_period_start_date"),
            "rate_period_end_date": r.get("rate_period_end_date"),
            "rate_period_room_rate": r.get("rate_period_room_rate"),
            "rate_period_currency": r.get("rate_period_currency"),
            "rate_period_taxes_and_fees": r.get("rate_period_taxes_and_fees"),
        }
        for r in out
    ]

    return JSONResponse(content={"status": "success", "submission_id": submission_id, "count": len(table), "items": table})


@app.get("/reviews/audit-log")
async def download_audit_log(x_api_key: Optional[str] = Header(None)):
    _require_approver(x_api_key)
    if not os.path.exists(REVIEW_AUDIT_LOG_XLSX):
        raise HTTPException(status_code=404, detail="Audit log not found")
    return FileResponse(
        REVIEW_AUDIT_LOG_XLSX,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=os.path.basename(REVIEW_AUDIT_LOG_XLSX),
    )


@app.post("/reviews/{submission_id}/decision")
async def decide_review(submission_id: str, payload: Dict[str, Any], x_api_key: Optional[str] = Header(None)):
    _require_approver(x_api_key)
    decision = (payload.get("decision") or "").strip().lower()
    comment = (payload.get("comment") or "").strip()
    if decision not in {"approved", "rejected"}:
        raise HTTPException(status_code=400, detail="decision must be 'approved' or 'rejected'")

    obj = _read_submission(submission_id)
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    obj["status"] = decision
    obj["decided_at"] = now_str
    obj["approver"] = "approver"
    obj["decision_comment"] = comment
    _write_submission(submission_id, obj)

    _append_audit_log({
        "timestamp": now_str,
        "submission_id": submission_id,
        "action": "decision",
        "actor": "approver",
        "decision": decision,
        "comment": comment,
    })
    return JSONResponse(content={"status": "success", "submission_id": submission_id, "decision": decision})


@app.post("/reviews/{submission_id}/resubmit")
async def resubmit_review(submission_id: str, payload: Dict[str, Any], x_api_key: Optional[str] = Header(None)):
    _require_reviewer(x_api_key)
    obj = _read_submission(submission_id)
    if (obj.get("status") or "").lower() not in {"rejected", "submitted"}:
        raise HTTPException(status_code=400, detail="Only rejected (or submitted) reviews can be resubmitted")

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    obj["payload"] = payload
    obj["status"] = "submitted"
    obj["resubmitted_at"] = now_str
    obj["reviewer"] = "reviewer"
    obj["revision"] = int(obj.get("revision") or 0) + 1
    _write_submission(submission_id, obj)
    _append_audit_log({
        "timestamp": now_str,
        "submission_id": submission_id,
        "action": "resubmitted",
        "actor": "reviewer",
        "decision": "submitted",
        "comment": "",
    })
    return JSONResponse(content={"status": "success", "submission_id": submission_id, "revision": obj.get("revision")})
