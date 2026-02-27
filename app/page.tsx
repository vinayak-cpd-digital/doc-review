"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";
import DocumentPreview from "@/components/DocumentPreview";
import ReviewInterface from "@/components/ReviewInterface";
import ActualFilePopup from "@/components/ActualFilePopup";
import ReviewTablePopup from "@/components/ReviewTablePopup";
import { FileData } from "@/lib/types";
import { fetchOcrContent } from "@/lib/ocrService";
import { mockOcrResponse } from "@/lib/mockOcrData";
import { useAuth } from "@/context/AuthContext";
import { useMockMode } from "@/context/MockModeContext";
import { Eye, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";
import logo from "@/public/copperpod-logo.png";

export default function Home() {
  const { user, logout, isLoading } = useAuth();
  const { useMock, setUseMock } = useMockMode();
  const router = useRouter();
  const [filesData, setFilesData] = useState<FileData[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [highlightText, setHighlightText] = useState<string>("");
  const [showActualFile, setShowActualFile] = useState(false);
  const [showReviewTable, setShowReviewTable] = useState(false);
  const [ocrSessionId, setOcrSessionId] = useState<string | null>(null);
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

  // Redirect to login if not authenticated; redirect approver to their page
  if (!isLoading && !user) {
    router.replace("/login");
    return null;
  }
  if (!isLoading && user?.role === "approver") {
    router.replace("/approver");
    return null;
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin h-8 w-8 border-4 rounded-full border-t-transparent" style={{ borderColor: '#be1549', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const handleUploadSuccess = (files: FileData[], ocrSessionId?: string) => {
    setFilesData(files);
    setActiveFileIndex(0);
    setHighlightText("");
    if (ocrSessionId) setOcrSessionId(ocrSessionId);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = filesData.filter((_, i) => i !== index);
    setFilesData(newFiles);

    if (newFiles.length === 0) {
      setActiveFileIndex(0);
    } else if (activeFileIndex >= newFiles.length) {
      setActiveFileIndex(newFiles.length - 1);
    }
  };

  const handleHighlightRequest = (text: string) => {
    console.log("Highlight request:", text);
    // Clear first so re-clicking the same text still triggers the useEffect
    setHighlightText("");
    setTimeout(() => setHighlightText(text), 0);
  };

  const handleApprove = () => {
    const updatedFiles = [...filesData];
    updatedFiles[activeFileIndex] = {
      ...updatedFiles[activeFileIndex],
      isApproved: true,
    };
    setFilesData(updatedFiles);
  };

  const handleReject = () => {
    const updatedFiles = [...filesData];
    updatedFiles[activeFileIndex] = {
      ...updatedFiles[activeFileIndex],
      isApproved: false,
    };
    setFilesData(updatedFiles);
  };

  const updateFileSubmission = (index: number, patch: Partial<FileData>) => {
    setFilesData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...patch };
      return updated;
    });
  };

  const handleSubmitFile = async (
    index: number,
    reviewedData?: { file_name: string; meta: unknown; tables: unknown }
  ) => {
    const f = filesData[index];
    if (!f) return;
    updateFileSubmission(index, { submissionStatus: "loading", submissionError: undefined });
    try {
      const res = await fetch("http://localhost:8000/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": "reviewer" },
        body: JSON.stringify({
          file_name: f.fileName,
          run_id: f.runId,
          output_parsed: f.parsed,
          batchResult: f.batchResult,
          ...(reviewedData ? { reviewed_tables: reviewedData } : {}),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }
      const data = await res.json();
      updateFileSubmission(index, { submissionStatus: "submitted", submissionId: data.submission_id });
    } catch (e: unknown) {
      updateFileSubmission(index, {
        submissionStatus: "error",
        submissionError: e instanceof Error ? e.message : "Submission failed",
      });
    }
  };

  const handleResubmitFile = async (index: number) => {
    const f = filesData[index];
    if (!f?.submissionId) return;
    updateFileSubmission(index, { submissionStatus: "loading", submissionError: undefined });
    try {
      const res = await fetch(`http://localhost:8000/reviews/${f.submissionId}/resubmit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": "reviewer" },
        body: JSON.stringify({
          file_name: f.fileName,
          run_id: f.runId,
          output_parsed: f.parsed,
          batchResult: f.batchResult,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }
      updateFileSubmission(index, { submissionStatus: "submitted" });
    } catch (e: unknown) {
      updateFileSubmission(index, {
        submissionStatus: "error",
        submissionError: e instanceof Error ? e.message : "Resubmission failed",
      });
    }
  };

  const handleCheckStatus = async (index: number) => {
    const f = filesData[index];
    if (!f?.submissionId) return;
    try {
      const res = await fetch(`http://localhost:8000/reviews/${f.submissionId}`, {
        headers: { "x-api-key": "reviewer" },
      });
      if (!res.ok) return;
      const data = await res.json();
      const status = (data.status || "").toLowerCase();
      if (status === "approved" || status === "rejected" || status === "submitted") {
        updateFileSubmission(index, { submissionStatus: status as FileData["submissionStatus"] });
      }
    } catch {
      // silently ignore
    }
  };

  const currentFile = filesData[activeFileIndex] || null;

  // Ordered list of mock OCR file keys for index-based fallback
  const mockOcrKeys = Object.keys(mockOcrResponse.files);

  // Close popup when switching tabs so it doesn't show a stale file,
  // and fetch OCR translated content for the newly selected file.
  const handleSelectFile = async (index: number) => {
    setActiveFileIndex(index);
    setShowActualFile(false);

    const selectedFile = filesData[index];
    if (!selectedFile) return;

    // Already have OCR content — nothing to do
    if (selectedFile.translatedContent) return;

    let content: string | null = null;

    if (useMock) {
      // Mock mode: look up by mock file_name key, fall back by index
      const mockFiles = mockOcrResponse.files as Record<string, string>;
      content =
        mockFiles[selectedFile.fileName] ??
        mockFiles[mockOcrKeys[index % mockOcrKeys.length]] ??
        null;
    } else if (ocrSessionId) {
      // Live mode: try real API, fall back to mock by index
      content = await fetchOcrContent(ocrSessionId, selectedFile.fileName, false);
      if (!content) {
        const mockFiles = mockOcrResponse.files as Record<string, string>;
        content =
          mockFiles[selectedFile.fileName] ??
          mockFiles[mockOcrKeys[index % mockOcrKeys.length]] ??
          null;
      }
    }

    if (content) {
      setFilesData((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], translatedContent: content! };
        return updated;
      });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* ── TOP HEADER ─────────────────────────────────────────────── */}
      <header className="h-14 shrink-0 bg-white border-b border-gray-200 shadow-sm px-5 flex items-center justify-between z-20">

        {/* Left: logo */}
        <div className="flex items-center gap-3">
          <Image
            src={logo}
            alt="Copperpod Logo"
            width={200}
            height={68}
            className="h-7 w-auto object-contain"
            priority
          />
          <div className="h-5 w-px bg-gray-200" />
          <span className="text-sm font-semibold text-gray-700 tracking-tight">
            Contract Agent Platform
          </span>
        </div>

        {/* Right: mock toggle + user */}
        <div className="flex items-center gap-3">
          {/* Mock / Live pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 bg-gray-50 text-xs font-medium text-gray-500">
            <button
              type="button"
              onClick={() => setUseMock(true)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-all ${useMock ? 'bg-amber-100 text-amber-700 font-semibold' : 'hover:text-gray-700'}`}
              title="Use mock data"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${useMock ? 'bg-amber-500' : 'bg-gray-300'}`} />
              
            </button>
            <button
              type="button"
              onClick={() => setUseMock(false)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-all ${!useMock ? 'bg-emerald-100 text-emerald-700 font-semibold' : 'hover:text-gray-700'}`}
              title="Use live API"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${!useMock ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              
            </button>
          </div>

          {/* User dropdown */}
          {user && (
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
          )}
        </div>
      </header>

      {/* ── BODY: sidebar + main ────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT SIDEBAR ─────────────────────────────────────────── */}
        <aside className="w-52 shrink-0 bg-white border-r border-gray-200 flex flex-col">

          {/* Upload button */}
          <div className="px-3 pt-4 pb-3 border-b border-gray-100">
            <FileUpload
              onUploadSuccess={handleUploadSuccess}
              apiResponse={filesData}
            />
          </div>

          {/* File list */}
          <div className="flex-1 overflow-y-auto py-2">
            {filesData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <p className="text-xs font-medium text-gray-500">No agreements uploaded</p>
                <p className="text-xs text-gray-400 mt-1">Upload files to begin review</p>
              </div>
            ) : (
              filesData.map((f, i) => {
                const isActive = i === activeFileIndex;
                const statusDot = f.submissionStatus === "submitted" ? "bg-blue-400"
                  : f.submissionStatus === "approved" ? "bg-emerald-500"
                  : f.submissionStatus === "rejected" ? "bg-red-400"
                  : f.submissionStatus === "error" ? "bg-orange-400"
                  : "";
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectFile(i)}
                    className={`w-full text-left px-3 py-2.5 mx-1 rounded-lg transition-all group flex items-start gap-2.5 ${isActive ? 'bg-rose-50 border border-rose-200' : 'hover:bg-gray-50 border border-transparent'}`}
                    style={{ width: 'calc(100% - 8px)' }}
                  >
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${isActive ? 'text-white' : 'bg-gray-100 text-gray-500'}`} style={isActive ? { backgroundColor: '#be1549' } : {}}>
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold truncate leading-tight ${isActive ? 'text-rose-800' : 'text-gray-700'}`}>
                        {f.fileName}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {statusDot && <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />}
                        <span className="text-xs text-gray-400 capitalize">
                          {f.submissionStatus && f.submissionStatus !== "idle" ? f.submissionStatus : "pending"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemoveFile(i); }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400 shrink-0 mt-0.5"
                      title="Remove file"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </button>
                );
              })
            )}
          </div>

          {/* Bottom actions */}
          {currentFile && (
            <div className="px-3 py-3 border-t border-gray-100 space-y-2">
              <button
                onClick={() => setShowActualFile(true)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all hover:brightness-95"
                style={{ backgroundColor: '#fdf2f7', color: '#be1549', borderColor: '#f5c6d3' }}
              >
                <Eye size={13} />
                View Original File
              </button>
            </div>
          )}
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* File context bar — shown when a file is active */}
          {currentFile && (
            <div className="shrink-0 h-10 bg-white border-b border-gray-200 px-5 flex items-center gap-3">
              <span className="text-xs text-gray-400 font-medium">Reviewing:</span>
              <span className="text-xs font-semibold text-gray-700 truncate max-w-sm">{currentFile.fileName}</span>
              {currentFile.parsed?.meta?.hotel_name && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-500">{currentFile.parsed.meta.hotel_name}</span>
                </>
              )}
              {currentFile.parsed?.meta?.station_or_airport_code && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                    {currentFile.parsed.meta.station_or_airport_code}
                  </span>
                </>
              )}
              <div className="ml-auto flex items-center gap-3">
                <span className="text-xs text-gray-400">{filesData.length} file{filesData.length !== 1 ? "s" : ""}</span>
                <button
                  onClick={() => setShowReviewTable(true)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all hover:brightness-95"
                  style={{ backgroundColor: '#fdf2f7', color: '#be1549', borderColor: '#f5c6d3' }}
                  title="View and edit review tables for this file"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                  Review Table
                </button>
              </div>
            </div>
          )}

          {/* Split: doc preview + review panel */}
          <div className="flex-1 flex overflow-hidden">
            {filesData.length === 0 ? (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 shadow-inner" style={{ backgroundColor: '#fdf2f7' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#be1549" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">No agreements loaded</h2>
                <p className="text-sm text-gray-400 max-w-xs">Upload contract agreements using the sidebar to start reviewing compliance data.</p>
              </div>
            ) : (
              <>
                {/* Document preview — 40% */}
                <div className="w-[40%] border-r border-gray-200 bg-white">
                  <DocumentPreview
                    file={currentFile?.file || null}
                    highlightText={highlightText}
                    translatedFilePath={currentFile?.translatedFilePath}
                    translatedContent={currentFile?.translatedContent}
                  />
                </div>

                {/* Review panel — 60% */}
                <div className="w-[60%] bg-gray-50">
                  <ReviewInterface
                    data={currentFile?.parsed || null}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    isApproved={currentFile?.isApproved || false}
                    onHighlightRequest={handleHighlightRequest}
                    role={user?.role}
                    onResubmit={() => handleResubmitFile(activeFileIndex)}
                    onCheckStatus={() => handleCheckStatus(activeFileIndex)}
                    submissionStatus={currentFile?.submissionStatus}
                    submissionId={currentFile?.submissionId}
                    submissionError={currentFile?.submissionError}
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Review Table Popup */}
      {showReviewTable && currentFile && (
        <ReviewTablePopup
          reviewSessionId={currentFile.reviewSessionId || "184ab8f3-db0e-488b-ac2b-a9eee6007be0"}
          fileName={currentFile.fileName}
          useMock={useMock}
          parsedData={currentFile.parsed}
          onSubmitToApprover={(reviewedData) => handleSubmitFile(activeFileIndex, reviewedData)}
          onClose={() => setShowReviewTable(false)}
        />
      )}

      {/* Actual File Popup */}
      {showActualFile && currentFile && (
        <ActualFilePopup
          file={currentFile.file}
          onClose={() => setShowActualFile(false)}
        />
      )}
    </div>
  );
}
