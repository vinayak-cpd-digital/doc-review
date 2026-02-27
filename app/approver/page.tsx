"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LogOut, ChevronDown, RefreshCw, FileText, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import Image from "next/image";
import logo from "@/public/copperpod-logo.png";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FileItem {
  submission_id: string;
  file_name: string;
  created_at: string;
  status: string;
  reviewer: string;
}

type DecisionStatus = "idle" | "loading" | "approved" | "rejected" | "error";

interface FileItemState extends FileItem {
  decisionStatus: DecisionStatus;
  decisionError?: string;
  commentOpen: boolean;
  comment: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function statusBadge(status: string) {
  const map: Record<string, { label: string; bg: string; color: string; border: string; dot: string }> = {
    submitted: { label: "Pending Review", bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", dot: "#3b82f6" },
    approved:  { label: "Approved",       bg: "#f0fdf4", color: "#166534", border: "#bbf7d0", dot: "#22c55e" },
    rejected:  { label: "Rejected",       bg: "#fef2f2", color: "#991b1b", border: "#fecaca", dot: "#ef4444" },
  };
  const s = map[status?.toLowerCase()] ?? { label: status, bg: "#f9fafb", color: "#4b5563", border: "#e5e7eb", dot: "#9ca3af" };
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border"
      style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}
    >
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: s.dot }} />
      {s.label}
    </span>
  );
}

function formatDate(str: string) {
  try {
    const d = new Date(str.replace(" ", "T"));
    return d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return str;
  }
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ApproverPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<FileItemState[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Route guard
  useEffect(() => {
    if (!user) { router.replace("/login"); return; }
    if (user.role !== "approver") { router.replace("/"); }
  }, [user, router]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Fetch submissions ──────────────────────────────────────────────────────

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const url = statusFilter !== "all"
        ? `http://localhost:8000/reviews?status=${encodeURIComponent(statusFilter)}`
        : "http://localhost:8000/reviews";
      const res = await fetch(url, { headers: { "x-api-key": "approver" } });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(body.detail || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const fileItems: FileItem[] = data.files ?? [];
      setItems(fileItems.map((f) => ({
        ...f,
        decisionStatus: (f.status === "approved" || f.status === "rejected") ? f.status as DecisionStatus : "idle",
        decisionError: undefined,
        commentOpen: false,
        comment: "",
      })));
    } catch (e: unknown) {
      setFetchError(e instanceof Error ? e.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  // ── Decision handler ───────────────────────────────────────────────────────

  const handleDecision = async (idx: number, decision: "approved" | "rejected") => {
    const item = items[idx];
    setItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], decisionStatus: "loading", decisionError: undefined };
      return next;
    });
    try {
      const res = await fetch(`http://localhost:8000/reviews/${item.submission_id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": "approver" },
        body: JSON.stringify({ decision, comment: item.comment || "" }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(body.detail || `HTTP ${res.status}`);
      }
      setItems((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], decisionStatus: decision, status: decision, commentOpen: false };
        return next;
      });
    } catch (e: unknown) {
      setItems((prev) => {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          decisionStatus: "error",
          decisionError: e instanceof Error ? e.message : "Decision failed",
        };
        return next;
      });
    }
  };

  const toggleComment = (idx: number) => {
    setItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], commentOpen: !next[idx].commentOpen };
      return next;
    });
  };

  const setComment = (idx: number, val: string) => {
    setItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], comment: val };
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (!user || user.role !== "approver") return null;

  // ── Render ─────────────────────────────────────────────────────────────────

  const filtered = statusFilter === "all" ? items : items.filter((i) => i.status?.toLowerCase() === statusFilter);

  const counts = {
    all: items.length,
    submitted: items.filter((i) => i.status?.toLowerCase() === "submitted").length,
    approved: items.filter((i) => i.status?.toLowerCase() === "approved").length,
    rejected: items.filter((i) => i.status?.toLowerCase() === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 shrink-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-4">
          {/* Logo + title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="rounded-lg overflow-hidden border border-gray-100 shadow-sm p-1 bg-white">
              <Image src={logo} alt="Logo" width={90} height={30} className="h-6 w-auto object-contain" priority />
            </div>
            <div className="h-5 w-px bg-gray-200" />
            <span className="text-sm font-bold text-gray-800 tracking-tight">Contract Agent Platform</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Refresh */}
            <button
              onClick={fetchReviews}
              disabled={loading}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-sm"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: "#be1549" }}
                >
                  {user.email[0].toUpperCase()}
                </div>
                <span className="text-gray-700 font-medium max-w-[140px] truncate hidden sm:block">{user.email}</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold hidden sm:block">Approver</span>
                <ChevronDown size={13} className="text-gray-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                    <span className="mt-1 inline-block text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold">Approver</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Page content ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">

        {/* Page title + filter tabs */}
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Submitted Reviews</h1>
            <p className="text-sm text-gray-500 mt-0.5">Approve or reject contract files submitted by reviewers</p>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-1 shadow-sm flex-wrap">
            {(["all", "submitted", "approved", "rejected"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                  statusFilter === f
                    ? "text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
                style={statusFilter === f ? { backgroundColor: "#be1549" } : {}}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  statusFilter === f ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── States ── */}
        {loading && (
          <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
            <span className="animate-spin w-5 h-5 border-2 rounded-full border-t-transparent inline-block" style={{ borderColor: "#be1549", borderTopColor: "transparent" }} />
            <span className="text-sm font-medium">Loading reviews…</span>
          </div>
        )}

        {!loading && fetchError && (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <AlertCircle size={32} className="text-red-400" />
            <p className="text-sm font-semibold text-red-600">Failed to load reviews</p>
            <p className="text-xs text-gray-400">{fetchError}</p>
            <button
              onClick={fetchReviews}
              className="mt-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#be1549" }}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !fetchError && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#fdf2f7" }}>
              <FileText size={28} style={{ color: "#be1549" }} />
            </div>
            <p className="text-sm font-semibold text-gray-600">No reviews found</p>
            <p className="text-xs text-gray-400">
              {statusFilter === "all" ? "No files have been submitted yet." : `No files with status "${statusFilter}".`}
            </p>
          </div>
        )}

        {/* ── File cards grid ── */}
        {!loading && !fetchError && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((item, idx) => (
              <FileCard
                key={`${item.submission_id}-${item.file_name}`}
                item={item}
                onApprove={() => handleDecision(idx, "approved")}
                onReject={() => handleDecision(idx, "rejected")}
                onToggleComment={() => toggleComment(idx)}
                onCommentChange={(v) => setComment(idx, v)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ── File Card ─────────────────────────────────────────────────────────────────

function FileCard({
  item,
  onApprove,
  onReject,
  onToggleComment,
  onCommentChange,
}: {
  item: FileItemState;
  onApprove: () => void;
  onReject: () => void;
  onToggleComment: () => void;
  onCommentChange: (v: string) => void;
}) {
  const isLoading = item.decisionStatus === "loading";
  const isDecided = item.decisionStatus === "approved" || item.decisionStatus === "rejected";
  const isPending = item.status?.toLowerCase() === "submitted";

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden transition-all hover:shadow-md ${
        item.decisionStatus === "approved"
          ? "border-emerald-200"
          : item.decisionStatus === "rejected"
          ? "border-red-200"
          : "border-gray-200"
      }`}
    >
      {/* Card top accent */}
      <div
        className="h-1 w-full shrink-0"
        style={{
          backgroundColor:
            item.decisionStatus === "approved" ? "#22c55e"
            : item.decisionStatus === "rejected" ? "#ef4444"
            : "#be1549",
        }}
      />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* File icon + name */}
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#fdf2f7" }}
          >
            <FileText size={18} style={{ color: "#be1549" }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-900 leading-snug break-words line-clamp-2" title={item.file_name}>
              {item.file_name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{formatDate(item.created_at)}</p>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap">
          {statusBadge(item.status)}
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
              {(item.reviewer || "r")[0].toUpperCase()}
            </span>
            {item.reviewer || "reviewer"}
          </span>
          <span className="text-xs text-gray-300 ml-auto font-mono">{item.submission_id.slice(0, 8)}…</span>
        </div>

        {/* Decision feedback */}
        {item.decisionStatus === "approved" && (
          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-xs font-semibold">
            <CheckCircle size={14} />
            Approved
          </div>
        )}
        {item.decisionStatus === "rejected" && (
          <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs font-semibold">
            <XCircle size={14} />
            Rejected
          </div>
        )}
        {item.decisionStatus === "error" && item.decisionError && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs">
            <AlertCircle size={13} />
            {item.decisionError}
          </div>
        )}

        {/* Comment box (collapsible) */}
        {item.commentOpen && isPending && !isDecided && (
          <textarea
            value={item.comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Optional comment…"
            rows={2}
            className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 resize-none text-gray-700 focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-100 transition-all"
          />
        )}

        {/* Action buttons */}
        {isPending && !isDecided && (
          <div className="flex items-center gap-2 mt-auto pt-1">
            {/* Comment toggle */}
            <button
              onClick={onToggleComment}
              className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all shrink-0"
              title="Add comment"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </button>

            {/* Reject */}
            <button
              onClick={onReject}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border-2 transition-all hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#fff5f5", color: "#dc2626", borderColor: "#fca5a5" }}
            >
              {isLoading ? (
                <span className="animate-spin w-3 h-3 border-2 border-current border-t-transparent rounded-full inline-block" />
              ) : (
                <XCircle size={13} />
              )}
              Reject
            </button>

            {/* Approve */}
            <button
              onClick={onApprove}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border-2 transition-all hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#f0fdf4", color: "#16a34a", borderColor: "#86efac" }}
            >
              {isLoading ? (
                <span className="animate-spin w-3 h-3 border-2 border-current border-t-transparent rounded-full inline-block" />
              ) : (
                <CheckCircle size={13} />
              )}
              Approve
            </button>
          </div>
        )}

        {/* Already decided — show clock for when it was decided */}
        {!isPending && !isDecided && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-auto pt-1">
            <Clock size={12} />
            Decision already recorded
          </div>
        )}
      </div>
    </div>
  );
}
