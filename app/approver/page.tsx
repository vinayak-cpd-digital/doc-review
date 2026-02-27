"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LogOut, RefreshCw, FileText, CheckCircle, XCircle, Clock,
  AlertCircle, LayoutDashboard, ChevronRight, Table2, ChevronDown,
} from "lucide-react";
import Image from "next/image";
import logo from "@/public/copperpod-logo.png";
import ApproverTablePopup from "@/components/ApproverTablePopup";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FileItem {
  submission_id: string;
  file_name: string;
  created_at: string;
  status: string;
  reviewer: string;
}

type DecisionStatus = "idle" | "loading" | "approved" | "rejected" | "error";
type SidebarSection = "dashboard" | "submitted" | "approved" | "rejected";

interface FileItemState extends FileItem {
  decisionStatus: DecisionStatus;
  decisionError?: string;
  commentOpen: boolean;
  comment: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function statusBadge(status: string) {
  const map: Record<string, { label: string; bg: string; color: string; border: string; dot: string }> = {
    submitted: { label: "Pending", bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", dot: "#3b82f6" },
    approved:  { label: "Approved", bg: "#f0fdf4", color: "#166534", border: "#bbf7d0", dot: "#22c55e" },
    rejected:  { label: "Rejected", bg: "#fef2f2", color: "#991b1b", border: "#fecaca", dot: "#ef4444" },
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

function displayName(role?: string) {
  if (!role) return "Ankith V";
  const r = role.toLowerCase();
  if (r === "reviewer") return "Ankith V";
  if (r === "approver") return "Pallavi M";
  return role;
}

// ── DonutChart ────────────────────────────────────────────────────────────────

function DonutChart({ pending, approved, rejected }: { pending: number; approved: number; rejected: number }) {
  const total = pending + approved + rejected;
  if (total === 0) return (
    <div className="flex items-center justify-center w-36 h-36">
      <div className="w-28 h-28 rounded-full border-8 border-gray-100 flex items-center justify-center">
        <span className="text-xs text-gray-400 font-medium">No data</span>
      </div>
    </div>
  );

  const r = 54;
  const cx = 70;
  const cy = 70;
  const circ = 2 * Math.PI * r;

  const segments = [
    { value: pending,  color: "#3b82f6", label: "Pending" },
    { value: approved, color: "#22c55e", label: "Approved" },
    { value: rejected, color: "#ef4444", label: "Rejected" },
  ];

  let offset = 0;
  const arcs = segments.map((seg) => {
    const dash = (seg.value / total) * circ;
    const arc = { ...seg, dash, offset };
    offset += dash;
    return arc;
  });

  return (
    <div className="flex items-center justify-center w-36 h-36 relative">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="16" />
        {arcs.map((arc, i) =>
          arc.value > 0 ? (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={arc.color}
              strokeWidth="16"
              strokeDasharray={`${arc.dash} ${circ - arc.dash}`}
              strokeDashoffset={-arc.offset + circ * 0.25}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.5s ease" }}
            />
          ) : null
        )}
        <text x={cx} y={cy - 7} textAnchor="middle" className="fill-gray-800" style={{ fontSize: 22, fontWeight: 700 }}>{total}</text>
        <text x={cx} y={cy + 11} textAnchor="middle" className="fill-gray-400" style={{ fontSize: 11 }}>Total</text>
      </svg>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ApproverPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<FileItemState[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<SidebarSection>("dashboard");
  const [tablePopup, setTablePopup] = useState<{ submissionId: string; fileName: string } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Route guard
  useEffect(() => {
    if (!user) { router.replace("/login"); return; }
    if (user.role !== "approver") { router.replace("/"); }
  }, [user, router]);

  // ── Fetch submissions ──────────────────────────────────────────────────────

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("http://localhost:8000/reviews", { headers: { "x-api-key": "approver" } });
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
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  // ── Decision handler ───────────────────────────────────────────────────────

  const handleDecision = async (submissionId: string, decision: "approved" | "rejected", comment: string) => {
    setItems((prev) => prev.map((it) =>
      it.submission_id === submissionId ? { ...it, decisionStatus: "loading", decisionError: undefined } : it
    ));
    try {
      const res = await fetch(`http://localhost:8000/reviews/${submissionId}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": "approver" },
        body: JSON.stringify({ decision, comment }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(body.detail || `HTTP ${res.status}`);
      }
      setItems((prev) => prev.map((it) =>
        it.submission_id === submissionId
          ? { ...it, decisionStatus: decision, status: decision, commentOpen: false }
          : it
      ));
    } catch (e: unknown) {
      setItems((prev) => prev.map((it) =>
        it.submission_id === submissionId
          ? { ...it, decisionStatus: "error", decisionError: e instanceof Error ? e.message : "Decision failed" }
          : it
      ));
    }
  };

  const toggleComment = (submissionId: string) => {
    setItems((prev) => prev.map((it) =>
      it.submission_id === submissionId ? { ...it, commentOpen: !it.commentOpen } : it
    ));
  };

  const setComment = (submissionId: string, val: string) => {
    setItems((prev) => prev.map((it) =>
      it.submission_id === submissionId ? { ...it, comment: val } : it
    ));
  };

  const handleLogout = () => { logout(); router.replace("/login"); };

  if (!user || user.role !== "approver") return null;

  // ── Derived counts ─────────────────────────────────────────────────────────

  const counts = {
    total: items.length,
    submitted: items.filter((i) => i.status?.toLowerCase() === "submitted").length,
    approved:  items.filter((i) => i.status?.toLowerCase() === "approved").length,
    rejected:  items.filter((i) => i.status?.toLowerCase() === "rejected").length,
  };

  const sectionItems =
    activeSection === "dashboard" ? [] :
    activeSection === "submitted" ? items.filter((i) => i.status?.toLowerCase() === "submitted") :
    activeSection === "approved"  ? items.filter((i) => i.status?.toLowerCase() === "approved") :
    items.filter((i) => i.status?.toLowerCase() === "rejected");

  // ── Sidebar nav items ──────────────────────────────────────────────────────

  const navItems: { id: SidebarSection; label: string; icon: React.ReactNode; count?: number; accent?: string }[] = [
    { id: "dashboard", label: "Dashboard",         icon: <LayoutDashboard size={16} /> },
    { id: "submitted", label: "Submitted Reviews",  icon: <Clock size={16} />,        count: counts.submitted, accent: "#3b82f6" },
    { id: "approved",  label: "Approved",           icon: <CheckCircle size={16} />,  count: counts.approved,  accent: "#22c55e" },
    { id: "rejected",  label: "Rejected",           icon: <XCircle size={16} />,      count: counts.rejected,  accent: "#ef4444" },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">

      {/* ── Top header bar ── */}
      <header className="bg-white border-b border-gray-200 shrink-0 shadow-sm z-20 sticky top-0">
        <div className="h-14 px-6 flex items-center gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="rounded-lg overflow-hidden border border-gray-100 shadow-sm p-1 bg-white">
              <Image src={logo} alt="Logo" width={90} height={30} className="h-6 w-auto object-contain" priority />
            </div>
            <div className="h-5 w-px bg-gray-200" />
            <span className="text-sm font-bold text-gray-800 tracking-tight">Contract Agent Platform</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={fetchReviews} disabled={loading}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
            {/* User dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu((v) => !v)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all"
                title={user.email}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: '#be1549' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate hidden sm:block">{user.name.split(" ")[0]}</span>
                <ChevronDown size={13} className={`text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                  <div className="px-4 py-3.5 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0" style={{ backgroundColor: '#be1549' }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <span className="mt-2.5 inline-block text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize border" style={{ backgroundColor: '#fdf2f7', color: '#be1549', borderColor: '#f5c6d3' }}>
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={() => { setShowUserMenu(false); handleLogout(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

        {/* ── Body: sidebar + main ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ── Sidebar ── */}
        <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col pt-4 pb-6 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-5 mb-3">Navigation</p>
          <nav className="flex flex-col gap-0.5 px-3">
            {navItems.map((nav) => {
              const isActive = activeSection === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveSection(nav.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                    isActive
                      ? "text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  style={isActive ? { backgroundColor: "#be1549" } : {}}
                >
                  <span className={isActive ? "text-white" : "text-gray-400"}>{nav.icon}</span>
                  <span className="flex-1">{nav.label}</span>
                  {nav.count !== undefined && (
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                        isActive ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {nav.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar summary stats */}
          {/* <div className="mt-auto px-4">
            <div className="rounded-xl p-3 border border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 mb-2">Quick Summary</p>
              <div className="space-y-1.5">
                {[
                  { label: "Pending",  val: counts.submitted, color: "#3b82f6" },
                  { label: "Approved", val: counts.approved,  color: "#22c55e" },
                  { label: "Rejected", val: counts.rejected,  color: "#ef4444" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                      {s.label}
                    </span>
                    <span className="font-bold text-gray-700">{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div> */}
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
              <span className="animate-spin w-5 h-5 border-2 rounded-full" style={{ borderColor: "#be1549", borderTopColor: "transparent" }} />
              <span className="text-sm font-medium">Loading reviews…</span>
            </div>
          )}

          {!loading && fetchError && (
            <div className="flex flex-col items-center justify-center h-64 gap-3 p-8">
              <AlertCircle size={32} className="text-red-400" />
              <p className="text-sm font-semibold text-red-600">Failed to load reviews</p>
              <p className="text-xs text-gray-400">{fetchError}</p>
              <button onClick={fetchReviews} className="mt-2 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#be1549" }}>Retry</button>
            </div>
          )}

          {/* ── Dashboard view ── */}
          {!loading && !fetchError && activeSection === "dashboard" && (
            <DashboardView counts={counts} items={items} onNavigate={setActiveSection} />
          )}

          {/* ── List views ── */}
          {!loading && !fetchError && activeSection !== "dashboard" && (
            <div className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <ChevronRight size={16} className="text-gray-400" />
                <h2 className="text-base font-bold text-gray-800 capitalize">
                  {activeSection === "submitted" ? "Submitted Reviews" : activeSection === "approved" ? "Approved Reviews" : "Rejected Reviews"}
                </h2>
                <span className="ml-1 text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{sectionItems.length}</span>
              </div>

              {sectionItems.length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#fdf2f7" }}>
                    <FileText size={24} style={{ color: "#be1549" }} />
                  </div>
                  <p className="text-sm font-semibold text-gray-600">No files here yet</p>
                </div>
              )}

              {sectionItems.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {sectionItems.map((item) => (
                    <FileCard
                      key={`${item.submission_id}-${item.file_name}`}
                      item={item}
                      onApprove={() => handleDecision(item.submission_id, "approved", item.comment)}
                      onReject={() => handleDecision(item.submission_id, "rejected", item.comment)}
                      onToggleComment={() => toggleComment(item.submission_id)}
                      onCommentChange={(v) => setComment(item.submission_id, v)}
                      onViewTable={() => setTablePopup({ submissionId: item.submission_id, fileName: item.file_name })}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      {/* ── Approver Table Popup ── */}
      {tablePopup && (
        <ApproverTablePopup
          submissionId={tablePopup.submissionId}
          fileName={tablePopup.fileName}
          onClose={() => setTablePopup(null)}
        />
      )}
    </div>
  );
}

// ── Dashboard View ────────────────────────────────────────────────────────────

function DashboardView({
  counts,
  items,
  onNavigate,
}: {
  counts: { total: number; submitted: number; approved: number; rejected: number };
  items: FileItemState[];
  onNavigate: (s: SidebarSection) => void;
}) {
  const approvalRate = counts.total > 0
    ? Math.round((counts.approved / (counts.approved + counts.rejected || 1)) * 100)
    : 0;
  const decisionRate = counts.total > 0
    ? Math.round(((counts.approved + counts.rejected) / counts.total) * 100)
    : 0;

  const recentItems = [...items]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Approver Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Overview of all submitted contract review files</p>
      </div>

      {/* ── Stat cards row ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Total Files",
            value: counts.total,
            icon: <FileText size={20} />,
            bg: "#fdf2f7",
            color: "#be1549",
            onClick: undefined,
          },
          {
            label: "Pending Review",
            value: counts.submitted,
            icon: <Clock size={20} />,
            bg: "#eff6ff",
            color: "#1d4ed8",
            onClick: () => onNavigate("submitted"),
          },
          {
            label: "Approved",
            value: counts.approved,
            icon: <CheckCircle size={20} />,
            bg: "#f0fdf4",
            color: "#166534",
            onClick: () => onNavigate("approved"),
          },
          {
            label: "Rejected",
            value: counts.rejected,
            icon: <XCircle size={20} />,
            bg: "#fef2f2",
            color: "#991b1b",
            onClick: () => onNavigate("rejected"),
          },
        ].map((s) => (
          <div
            key={s.label}
            onClick={s.onClick}
            className={`bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3 shadow-sm ${
              s.onClick ? "cursor-pointer hover:shadow-md hover:border-gray-300 transition-all" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg, color: s.color }}>
                {s.icon}
              </div>
              {s.onClick && <ChevronRight size={14} className="text-gray-300" />}
            </div>
            <div>
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Donut chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">
          <div>
            <p className="text-sm font-bold text-gray-800">Status Breakdown</p>
            <p className="text-xs text-gray-400">Distribution of all submitted files</p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <DonutChart pending={counts.submitted} approved={counts.approved} rejected={counts.rejected} />
            <div className="flex flex-col gap-3 flex-1">
              {[
                { label: "Pending",  val: counts.submitted, color: "#3b82f6", total: counts.total },
                { label: "Approved", val: counts.approved,  color: "#22c55e", total: counts.total },
                { label: "Rejected", val: counts.rejected,  color: "#ef4444", total: counts.total },
              ].map((seg) => {
                const pct = counts.total > 0 ? Math.round((seg.val / counts.total) * 100) : 0;
                return (
                  <div key={seg.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-gray-600 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                        {seg.label}
                      </span>
                      <span className="font-bold text-gray-700">{seg.val} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: seg.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Decision metrics */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-5">
          <div>
            <p className="text-sm font-bold text-gray-800">Decision Metrics</p>
            <p className="text-xs text-gray-400">Approval rate and decision throughput</p>
          </div>

          {/* Approval rate gauge */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-gray-600">Approval Rate</span>
              <span className="font-black text-emerald-600">{approvalRate}%</span>
            </div>
            <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${approvalRate}%`, background: "linear-gradient(90deg, #22c55e, #16a34a)" }}
              />
            </div>
            <p className="text-xs text-gray-400">{counts.approved} approved of {counts.approved + counts.rejected} decided</p>
          </div>

          {/* Decision rate */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-gray-600">Files Decided</span>
              <span className="font-black" style={{ color: "#be1549" }}>{decisionRate}%</span>
            </div>
            <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${decisionRate}%`, background: "linear-gradient(90deg, #be1549, #9b1040)" }}
              />
            </div>
            <p className="text-xs text-gray-400">{counts.approved + counts.rejected} of {counts.total} files reviewed</p>
          </div>

          {/* Pending action callout */}
          {counts.submitted > 0 && (
            <button
              onClick={() => onNavigate("submitted")}
              className="flex items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #be1549 0%, #9b1040 100%)" }}
            >
              <span>{counts.submitted} file{counts.submitted !== 1 ? "s" : ""} awaiting decision</span>
              <ChevronRight size={15} />
            </button>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">
          <div>
            <p className="text-sm font-bold text-gray-800">Recent Activity</p>
            <p className="text-xs text-gray-400">Latest submissions</p>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            {recentItems.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-6">No activity yet</p>
            )}
            {recentItems.map((item) => {
              const st = item.status?.toLowerCase();
              const dotColor = st === "approved" ? "#22c55e" : st === "rejected" ? "#ef4444" : "#3b82f6";
              return (
                <div key={`${item.submission_id}-${item.file_name}`} className="flex items-start gap-2.5 py-2 border-b border-gray-50 last:border-0">
                  <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-800 truncate" title={item.file_name}>{item.file_name}</p>
                    <p className="text-xs text-gray-400">{formatDate(item.created_at)}</p>
                  </div>
                  <span className="text-xs capitalize font-medium" style={{ color: dotColor }}>{st}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
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
  onViewTable,
}: {
  item: FileItemState;
  onApprove: () => void;
  onReject: () => void;
  onToggleComment: () => void;
  onCommentChange: (v: string) => void;
  onViewTable: () => void;
}) {
  const isLoading = item.decisionStatus === "loading";
  const isDecided = item.decisionStatus === "approved" || item.decisionStatus === "rejected";
  const isPending = item.status?.toLowerCase() === "submitted";

  const accentColor =
    item.decisionStatus === "approved" ? "#22c55e" :
    item.decisionStatus === "rejected" ? "#ef4444" : "#be1549";

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden transition-all hover:shadow-md ${
        item.decisionStatus === "approved" ? "border-emerald-200" :
        item.decisionStatus === "rejected" ? "border-red-200" : "border-gray-200"
      }`}
    >
      <div className="h-0.5 w-full shrink-0" style={{ backgroundColor: accentColor }} />

      <div className="px-4 py-3.5 flex flex-col gap-3 flex-1">
        {/* File icon + name */}
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "#fdf2f7" }}>
            <FileText size={14} style={{ color: "#be1549" }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gray-900 leading-snug break-words line-clamp-2" title={item.file_name}>
              {item.file_name}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(item.created_at)}</p>
          </div>
        </div>

        {/* Meta row: status badge + reviewer + id */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {statusBadge(item.status)}
          <span className="text-[11px] text-gray-400 flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold" style={{ fontSize: 9 }}>
              {(displayName(item.reviewer))[0].toUpperCase()}
            </span>
            {displayName(item.reviewer)}
          </span>
          <span className="text-[10px] text-gray-300 ml-auto font-mono">{item.submission_id.slice(0, 8)}…</span>
        </div>

        {/* Decision result banners */}
        {item.decisionStatus === "approved" && (
          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-2.5 py-1.5 text-[11px] font-semibold">
            <CheckCircle size={12} /> Approved
          </div>
        )}
        {item.decisionStatus === "rejected" && (
          <div className="flex items-center gap-1.5 text-red-700 bg-red-50 border border-red-200 rounded-md px-2.5 py-1.5 text-[11px] font-semibold">
            <XCircle size={12} /> Rejected
          </div>
        )}
        {item.decisionStatus === "error" && item.decisionError && (
          <div className="flex items-center gap-1.5 text-red-600 bg-red-50 border border-red-200 rounded-md px-2.5 py-1.5 text-[11px]">
            <AlertCircle size={12} /> {item.decisionError}
          </div>
        )}

        {/* Comment box */}
        {item.commentOpen && isPending && !isDecided && (
          <textarea
            value={item.comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Optional comment…"
            rows={2}
            className="w-full text-[11px] rounded-md border border-gray-200 px-2.5 py-1.5 resize-none text-gray-700 focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-100 transition-all"
          />
        )}

        {/* Bottom action row — Review Table + Reject + Approve (+ comment toggle) */}
        <div className="flex items-center gap-1.5 mt-auto pt-0.5">
          {/* Review Table */}
          <button
            onClick={onViewTable}
            className="flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-semibold border transition-all hover:bg-rose-50 shrink-0"
            style={{ color: "#be1549", borderColor: "#f5c6d3", backgroundColor: "#fdf2f7" }}
            title="View reviewed table data"
          >
            <Table2 size={11} />
            Table
          </button>

          {isPending && !isDecided ? (
            <>
              {/* Comment toggle */}
              <button
                onClick={onToggleComment}
                className={`p-1.5 rounded-md border transition-all shrink-0 ${
                  item.commentOpen
                    ? "border-rose-200 text-rose-400 bg-rose-50"
                    : "border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300"
                }`}
                title="Add comment"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
              <button
                onClick={onReject} disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-semibold border transition-all hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#fff5f5", color: "#dc2626", borderColor: "#fca5a5" }}
              >
                {isLoading ? <span className="animate-spin w-2.5 h-2.5 border-2 border-current border-t-transparent rounded-full inline-block" /> : <XCircle size={11} />}
                Reject
              </button>
              <button
                onClick={onApprove} disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-semibold border transition-all hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#f0fdf4", color: "#16a34a", borderColor: "#86efac" }}
              >
                {isLoading ? <span className="animate-spin w-2.5 h-2.5 border-2 border-current border-t-transparent rounded-full inline-block" /> : <CheckCircle size={11} />}
                Approve
              </button>
            </>
          ) : !isDecided ? (
            <span className="text-[11px] text-gray-400 flex items-center gap-1 ml-1">
              <Clock size={11} /> Recorded
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
