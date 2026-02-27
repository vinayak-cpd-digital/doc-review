"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, X, ExternalLink } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

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
}

interface ApproverTablePopupProps {
  submissionId: string;
  fileName: string;
  onClose: () => void;
}

// ── Column config ─────────────────────────────────────────────────────────────

const COMPLIANCE_COL_WIDTHS = ["w-[20%]", "w-[35%]", "w-[8%]", "w-[37%]"];
const COMPLIANCE_COL_LABELS = ["Field", "Actual Content", "OK?", "Comment"];

const YT_COL_WIDTHS = ["w-[10%]", "w-[18%]", "w-[18%]", "w-[40%]", "w-[14%]"];
const YT_COL_LABELS = ["Year", "Start Date", "End Date", "Room Rate", "Currency"];

// ── Main Component ────────────────────────────────────────────────────────────

export default function ApproverTablePopup({
  submissionId,
  fileName,
  onClose,
}: ApproverTablePopupProps) {
  const [data, setData] = useState<ReviewTableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"compliance" | "yearly_terms">("compliance");
  const [showPdfPanel, setShowPdfPanel] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  // ── Fetch table data ───────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/reviews/${submissionId}?file_name=${encodeURIComponent(fileName)}`,
          { headers: { "x-api-key": "approver" } }
        );
        if (!res.ok) {
          const body = await res.json().catch(() => ({ detail: res.statusText }));
          throw new Error(body.detail || `HTTP ${res.status}`);
        }
        const result: ReviewTableData = await res.json();
        if (!cancelled) setData(result);
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load table data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [submissionId, fileName]);

  // ── Escape key ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const compTab = data?.tables?.compliance;
  const ytTab = data?.tables?.yearly_terms;

  // PDF URL for the original file — served from the backend uploads dir if available
  const pdfUrl = `http://localhost:8000/submissions/${submissionId}/original?file_name=${encodeURIComponent(fileName)}`;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 flex w-full max-w-6xl max-h-[92vh]"
        style={{ minHeight: 0 }}>

        {/* ── Left: table panel ── */}
        <div className={`flex flex-col ${showPdfPanel ? "w-[55%]" : "w-full"} transition-all duration-300 min-w-0`}>

          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#fdf2f7" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#be1549" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="3" y1="15" x2="21" y2="15" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">Review Tables</p>
                <p className="text-xs text-gray-400 truncate max-w-[320px]">{fileName}</p>
              </div>
              {data?.meta?.hotel_name && (
                <span className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium hidden sm:block">
                  {data.meta.hotel_name}
                </span>
              )}
              <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold border border-purple-200">
                Approver View
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-4">
              {/* View Original PDF button */}
              <button
                onClick={() => setShowPdfPanel((v) => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${
                  showPdfPanel
                    ? "text-white border-rose-600"
                    : "border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-700 hover:bg-rose-50"
                }`}
                style={showPdfPanel ? { backgroundColor: "#be1549", borderColor: "#be1549" } : {}}
                title="Toggle original PDF viewer"
              >
                <FileText size={13} />
                {showPdfPanel ? "Hide PDF" : "View Original PDF"}
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Tabs */}
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

          {/* Body */}
          <div className="flex-1 overflow-auto">
            {loading && (
              <div className="flex items-center justify-center h-48 gap-3 text-gray-500">
                <span className="animate-spin w-5 h-5 border-2 border-rose-400 border-t-transparent rounded-full inline-block" />
                <span className="text-sm font-medium">Loading table data…</span>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center h-48 gap-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm font-semibold text-red-600">Failed to load</p>
                <p className="text-xs text-gray-400">{error}</p>
              </div>
            )}

            {!loading && !error && data && (
              <>
                {activeTab === "compliance" && compTab && (
                  <ReadOnlyComplianceTable
                    columns={COMPLIANCE_COL_LABELS}
                    widths={COMPLIANCE_COL_WIDTHS}
                    rows={compTab.rows}
                  />
                )}
                {activeTab === "yearly_terms" && ytTab && (
                  <ReadOnlyTable
                    columns={YT_COL_LABELS}
                    widths={YT_COL_WIDTHS}
                    rows={ytTab.rows}
                  />
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {data && !loading && (
            <div className="px-6 py-2.5 border-t border-gray-100 bg-gray-50 flex items-center gap-4 text-xs text-gray-400 shrink-0">
              {data.meta?.airline_name && <span>Airline: <strong className="text-gray-600">{data.meta.airline_name}</strong></span>}
              {data.meta?.station_or_airport_code && <span>Code: <strong className="text-gray-600">{data.meta.station_or_airport_code}</strong></span>}
              <span className="ml-auto text-gray-400 italic">Read-only view — approver mode</span>
            </div>
          )}
        </div>

        {/* ── Right: PDF panel ── */}
        {showPdfPanel && (
          <div className="w-[45%] border-l border-gray-200 flex flex-col shrink-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
              <div className="flex items-center gap-2">
                <FileText size={14} style={{ color: "#be1549" }} />
                <span className="text-xs font-semibold text-gray-700 truncate max-w-[200px]">Original PDF</span>
              </div>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                title="Open in new tab"
              >
                <ExternalLink size={12} />
                Open
              </a>
            </div>
            <div className="flex-1 bg-gray-100 relative overflow-hidden">
              <PdfFrame url={pdfUrl} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── PDF Frame ─────────────────────────────────────────────────────────────────

function PdfFrame({ url }: { url: string }) {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  return (
    <div className="w-full h-full relative">
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <span className="animate-spin w-6 h-6 border-2 rounded-full inline-block mb-2" style={{ borderColor: "#be1549", borderTopColor: "transparent" }} />
            <p className="text-xs text-gray-500">Loading PDF…</p>
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-50 z-10 p-6">
          <FileText size={32} className="text-gray-300" />
          <p className="text-sm font-semibold text-gray-600 text-center">Original PDF unavailable</p>
          <p className="text-xs text-gray-400 text-center">
            The original file may not be stored on the server. Please request it from the reviewer.
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border-2 transition-all"
            style={{ color: "#be1549", borderColor: "#be1549", backgroundColor: "#fdf2f7" }}
          >
            <ExternalLink size={12} />
            Try opening directly
          </a>
        </div>
      )}
      <iframe
        src={url}
        className="w-full h-full border-0"
        title="Original PDF"
        onLoad={() => setStatus("ok")}
        onError={() => setStatus("error")}
      />
    </div>
  );
}

// ── Read-only Compliance Table ────────────────────────────────────────────────

function ReadOnlyComplianceTable({
  columns,
  widths,
  rows,
}: {
  columns: string[];
  widths: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b-2 border-gray-200">
            {columns.map((col, ci) => (
              <th key={ci} className={`text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3 ${widths[ci]}`}>
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
                className={`border-b border-gray-100 ${isCompliant ? "hover:bg-emerald-50/40" : "bg-red-50/30 hover:bg-red-50/60"}`}
              >
                {row.map((cell, ci) => {
                  if (ci === 2) {
                    return (
                      <td key={ci} className={`px-4 py-2.5 ${widths[ci]}`}>
                        <span
                          className={`inline-flex items-center justify-center w-9 h-6 rounded-full text-xs font-bold border-2 ${
                            isCompliant
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "bg-red-100 border-red-400 text-red-600"
                          }`}
                        >
                          {isCompliant ? "Y" : "N"}
                        </span>
                      </td>
                    );
                  }
                  return (
                    <td key={ci} className={`px-4 py-2.5 text-sm text-gray-800 leading-snug ${widths[ci]} ${ci === 0 ? "font-semibold text-gray-900" : ""}`}>
                      {String(cell ?? "")}
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

// ── Read-only Generic Table ───────────────────────────────────────────────────

function ReadOnlyTable({
  columns,
  widths,
  rows,
}: {
  columns: string[];
  widths: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b-2 border-gray-200">
            {columns.map((col, ci) => (
              <th key={ci} className={`text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3 ${widths[ci]}`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className={`px-4 py-2.5 text-sm text-gray-800 leading-snug ${widths[ci]} ${ci === 0 ? "font-semibold text-gray-900" : ""}`}>
                  {String(cell ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
