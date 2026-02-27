"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { OutputParsed } from "@/lib/types";

// ── Types ────────────────────────────────────────────────────────────────────

interface TableSection {
  columns: string[];
  rows: (string | number)[][];
}

interface TableMeta {
  hotel_name?: string | null;
  station_or_airport_code?: string | null;
  airline_name?: string | null;
  document_title?: string | null;
}

interface ReviewTableData {
  meta: TableMeta;
  tables: {
    compliance: TableSection;
    yearly_terms: TableSection;
  };
  file_name?: string;
  review_session_id?: string;
}

interface ReviewTablePopupProps {
  reviewSessionId: string;
  fileName: string;
  useMock: boolean;
  parsedData?: OutputParsed | null;
  onSubmitToApprover?: (reviewedData: { file_name: string; meta: TableMeta; tables: ReviewTableData["tables"] }) => Promise<void>;
  onClose: () => void;
}

// ── Convert OutputParsed → ReviewTableData ────────────────────────────────────

function parsedToTableData(parsed: OutputParsed, fileName: string): ReviewTableData {
  const compRows = (parsed.review ?? []).map((r) => [
    r.field ?? "",
    r.actual_content ?? "",
    (r.compliant ?? "N").trim().toUpperCase(),
    r.comment ?? "",
  ]);

  const ytRows: (string | number)[][] = ((parsed as unknown as Record<string, unknown>).yearly_terms as Array<Record<string, unknown>> ?? []).map((t) => [
    (t.year !== undefined && t.year !== null ? t.year : "") as string | number,
    String(t.start_date ?? ""),
    String(t.end_date ?? ""),
    String(t.room_rate ?? ""),
    String(t.currency ?? ""),
  ]);

  return {
    file_name: fileName,
    meta: {
      hotel_name: parsed.meta?.hotel_name ?? null,
      station_or_airport_code: parsed.meta?.station_or_airport_code ?? null,
      airline_name: parsed.meta?.airline_name ?? null,
      document_title: parsed.meta?.document_title ?? null,
    },
    tables: {
      compliance: {
        columns: ["field", "actual_content", "compliant", "comment"],
        rows: compRows,
      },
      yearly_terms: {
        columns: ["segment_year", "segment_start_date", "segment_end_date", "segment_room_rate", "segment_currency"],
        rows: ytRows,
      },
    },
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const COMPLIANCE_COL_WIDTHS = ["w-[20%]", "w-[35%]", "w-[8%]", "w-[37%]"];
const COMPLIANCE_COL_LABELS = ["Field", "Actual Content", "OK?", "Comment"];

const YT_COL_WIDTHS = ["w-[10%]", "w-[18%]", "w-[18%]", "w-[40%]", "w-[14%]"];
const YT_COL_LABELS = ["Year", "Start Date", "End Date", "Room Rate", "Currency"];

// ── Main Component ────────────────────────────────────────────────────────────

export default function ReviewTablePopup({
  reviewSessionId,
  fileName,
  useMock,
  parsedData,
  onSubmitToApprover,
  onClose,
}: ReviewTablePopupProps) {
  const [data, setData] = useState<ReviewTableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"compliance" | "yearly_terms">("compliance");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error" | "submitted">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        let result: ReviewTableData;

        if (useMock) {
          // Mock mode: derive table directly from the file's output_parsed
          await new Promise((r) => setTimeout(r, 120));
          if (parsedData) {
            result = parsedToTableData(parsedData, fileName);
          } else {
            throw new Error("No parsed data available for mock mode");
          }
        } else {
          // Live mode: call the real API
          try {
            const res = await fetch(
              `http://localhost:8000/review-sessions/${reviewSessionId}/file-review?file_name=${encodeURIComponent(fileName)}`,
              { headers: { "x-api-key": "reviewer" } }
            );
            if (!res.ok) throw new Error(`Server error ${res.status}: ${res.statusText}`);
            result = await res.json();
          } catch (apiErr) {
            // Fallback: if API fails and we have local parsed data, use it
            if (parsedData) {
              result = parsedToTableData(parsedData, fileName);
            } else {
              throw apiErr;
            }
          }
        }

        if (!cancelled) setData(deepClone(result));
      } catch (e: unknown) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load table data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [reviewSessionId, fileName, useMock, parsedData]);

  // ── Cell edit helper ───────────────────────────────────────────────────────

  const handleCellChange = useCallback(
    (section: "compliance" | "yearly_terms", rowIdx: number, colIdx: number, value: string) => {
      setData((prev) => {
        if (!prev) return prev;
        const clone = deepClone(prev);
        clone.tables[section].rows[rowIdx][colIdx] = value;
        return clone;
      });
      setSaveStatus("idle");
    },
    []
  );

  // ── Save ───────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setSaveStatus("idle");
    setSaveError(null);

    const payload = {
      file_name: fileName,
      meta: data.meta,
      tables: data.tables,
    };

    try {
      if (useMock) {
        await new Promise((r) => setTimeout(r, 300));
        // Run submit to approver if provided
        if (onSubmitToApprover) await onSubmitToApprover(payload);
        setSaveStatus("submitted");
      } else {
        // Step 1: Save the reviewed table
        const res = await fetch(
          `http://localhost:8000/review-sessions/${reviewSessionId}/file-review/save`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-api-key": "reviewer" },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) {
          const body = await res.json().catch(() => ({ detail: res.statusText }));
          throw new Error(body.detail || `HTTP ${res.status}`);
        }
        // Step 2: Submit to approver with edited data
        if (onSubmitToApprover) await onSubmitToApprover(payload);
        setSaveStatus("submitted");
        // Step 3: Trigger Excel download
        await handleDownload();
      }
    } catch (e: unknown) {
      setSaveStatus("error");
      setSaveError(e instanceof Error ? e.message : "Save / submit failed");
    } finally {
      setSaving(false);
    }
  };

  // ── Download Excel ─────────────────────────────────────────────────────────

  const handleDownload = async () => {
    if (useMock) {
      // In mock mode, build and download Excel client-side from current table data
      if (!data) return;
      setDownloading(true);
      try {
        // Build a simple CSV fallback since we can't use xlsxwriter in the browser
        // We'll generate a proper downloadable JSON instead, or just indicate it needs live API
        const blob = new Blob(
          [JSON.stringify({ file_name: fileName, meta: data.meta, tables: data.tables }, null, 2)],
          { type: "application/json" }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName.replace(/\.[^.]+$/, "")}_review.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } finally {
        setDownloading(false);
      }
      return;
    }

    setDownloading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/review-sessions/${reviewSessionId}/file-review/download?file_name=${encodeURIComponent(fileName)}`,
        { headers: { "x-api-key": "reviewer" } }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(body.detail || `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Try to get filename from Content-Disposition header
      const cd = res.headers.get("content-disposition");
      const match = cd?.match(/filename[^;=\n]*=(['"]?)([^'"\n;]+)\1/);
      a.download = match?.[2] ?? `${fileName.replace(/\.[^.]+$/, "")}_review.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : "Download failed");
      setSaveStatus("error");
    } finally {
      setDownloading(false);
    }
  };

  // ── Keyboard / backdrop close ──────────────────────────────────────────────

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // ── Render ─────────────────────────────────────────────────────────────────

  const compTab = data?.tables.compliance;
  const ytTab = data?.tables.yearly_terms;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col w-full max-w-6xl max-h-[92vh]">

        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#fdf2f7" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#be1549" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">Review Tables</p>
              <p className="text-xs text-gray-400 truncate max-w-[400px]">{fileName}</p>
            </div>
            {data?.meta?.hotel_name && (
              <span className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium hidden sm:block">
                {data.meta.hotel_name}
              </span>
            )}
            {useMock && (
              <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold border border-amber-200">
                mock
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-4">
            {/* Save/submit status */}
            {saveStatus === "submitted" && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Submitted &amp; Saved
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Saved
              </span>
            )}
            {saveStatus === "error" && saveError && (
              <span className="text-xs font-medium text-red-600 max-w-[180px] truncate" title={saveError}>{saveError}</span>
            )}

            {/* Submit for Approver & Save button */}
            <button
              onClick={handleSave}
              disabled={saving || loading || !!error || saveStatus === "submitted"}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all border-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#fdf2f7", color: "#be1549", borderColor: "#be1549" }}
              title="Save reviewed table and submit to approver"
            >
              {saving ? (
                <>
                  <span className="animate-spin w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full inline-block" />
                  Submitting…
                </>
              ) : saveStatus === "submitted" ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Submitted
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  Submit for Approver &amp; Save
                </>
              )}
            </button>

            {/* Download Excel button */}
            <button
              onClick={handleDownload}
              disabled={downloading || loading || !!error}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all border-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#f0fdf4", color: "#16a34a", borderColor: "#16a34a" }}
              title={useMock ? "Download review data as JSON (mock mode)" : "Download reviewed Excel file"}
            >
              {downloading ? (
                <>
                  <span className="animate-spin w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full inline-block" />
                  Downloading…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  {useMock ? "Download JSON" : "Download Excel"}
                </>
              )}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-1 px-6 pt-3 pb-0 border-b border-gray-200 shrink-0 bg-gray-50">
          {(["compliance", "yearly_terms"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-all ${
                activeTab === tab
                  ? "border-rose-600 text-rose-700 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab === "compliance" ? "Compliance Review" : "Yearly Terms"}
              {tab === "compliance" && compTab && (
                <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-600 font-medium">
                  {compTab.rows.length}
                </span>
              )}
              {tab === "yearly_terms" && ytTab && (
                <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-600 font-medium">
                  {ytTab.rows.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-auto">
          {loading && (
            <div className="flex items-center justify-center h-48 gap-3 text-gray-500">
              <span className="animate-spin w-5 h-5 border-2 border-rose-400 border-t-transparent rounded-full inline-block" />
              <span className="text-sm font-medium">Loading table data…</span>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p className="text-sm font-semibold text-red-600">Failed to load</p>
              <p className="text-xs text-gray-400">{error}</p>
            </div>
          )}

          {!loading && !error && data && (
            <>
              {activeTab === "compliance" && compTab && (
                <ComplianceTable
                  columns={COMPLIANCE_COL_LABELS}
                  widths={COMPLIANCE_COL_WIDTHS}
                  rows={compTab.rows}
                  onChange={(r, c, v) => handleCellChange("compliance", r, c, v)}
                />
              )}
              {activeTab === "yearly_terms" && ytTab && (
                <EditableTable
                  columns={YT_COL_LABELS}
                  widths={YT_COL_WIDTHS}
                  rows={ytTab.rows}
                  onChange={(r, c, v) => handleCellChange("yearly_terms", r, c, v)}
                />
              )}
            </>
          )}
        </div>

        {/* ── Footer info ── */}
        {data && !loading && (
          <div className="px-6 py-2.5 border-t border-gray-100 bg-gray-50 flex items-center gap-4 text-xs text-gray-400 shrink-0">
            {data.meta?.airline_name && <span>Airline: <strong className="text-gray-600">{data.meta.airline_name}</strong></span>}
            {data.meta?.station_or_airport_code && <span>Code: <strong className="text-gray-600">{data.meta.station_or_airport_code}</strong></span>}
            <span className="ml-auto">All cells are editable — click to modify, then Save.</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Compliance table (special Y/N toggle for col index 2) ─────────────────────

function ComplianceTable({
  columns,
  widths,
  rows,
  onChange,
}: {
  columns: string[];
  widths: string[];
  rows: (string | number)[][];
  onChange: (rowIdx: number, colIdx: number, value: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b-2 border-gray-200">
            {columns.map((col, ci) => (
              <th
                key={ci}
                className={`text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3 ${widths[ci]}`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const isCompliant = String(row[2] ?? "").trim().toUpperCase() === "Y";
            return (
              <tr
                key={ri}
                className={`border-b border-gray-100 transition-colors ${
                  isCompliant ? "hover:bg-emerald-50/40" : "bg-red-50/30 hover:bg-red-50/60"
                }`}
              >
                {row.map((cell, ci) => {
                  if (ci === 2) {
                    return (
                      <td key={ci} className={`px-4 py-2.5 ${widths[ci]}`}>
                        <button
                          onClick={() => onChange(ri, ci, isCompliant ? "N" : "Y")}
                          className={`w-9 h-6 rounded-full text-xs font-bold border-2 transition-all ${
                            isCompliant
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "bg-red-100 border-red-400 text-red-600"
                          }`}
                          title="Click to toggle Y/N"
                        >
                          {isCompliant ? "Y" : "N"}
                        </button>
                      </td>
                    );
                  }
                  return (
                    <td key={ci} className={`px-4 py-2 ${widths[ci]}`}>
                      <AutoResizeTextarea
                        value={String(cell ?? "")}
                        onChange={(v) => onChange(ri, ci, v)}
                        bold={ci === 0}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Generic editable table ────────────────────────────────────────────────────

function EditableTable({
  columns,
  widths,
  rows,
  onChange,
}: {
  columns: string[];
  widths: string[];
  rows: (string | number)[][];
  onChange: (rowIdx: number, colIdx: number, value: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b-2 border-gray-200">
            {columns.map((col, ci) => (
              <th
                key={ci}
                className={`text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3 ${widths[ci]}`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className={`px-4 py-2 ${widths[ci]}`}>
                  <AutoResizeTextarea
                    value={String(cell ?? "")}
                    onChange={(v) => onChange(ri, ci, v)}
                    bold={ci === 0}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Auto-resize textarea ──────────────────────────────────────────────────────

function AutoResizeTextarea({
  value,
  onChange,
  bold = false,
}: {
  value: string;
  onChange: (v: string) => void;
  bold?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      rows={1}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full resize-none bg-transparent border border-transparent rounded px-1.5 py-1 text-sm leading-snug text-gray-800 focus:outline-none focus:border-rose-300 focus:bg-white focus:shadow-sm transition-all overflow-hidden ${
        bold ? "font-semibold text-gray-900" : ""
      }`}
    />
  );
}

// ── Util ──────────────────────────────────────────────────────────────────────

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
