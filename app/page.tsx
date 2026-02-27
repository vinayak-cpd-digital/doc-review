"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";
import DocumentPreview from "@/components/DocumentPreview";
import ReviewInterface from "@/components/ReviewInterface";
import FileTabs from "@/components/FileTabs";
import ActualFilePopup from "@/components/ActualFilePopup";
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

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    router.replace("/login");
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

  const handleSubmitFile = async (index: number) => {
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm px-6 py-3.5 flex items-center justify-between z-10">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <Image
            src={logo} // Adjust path if your logo file lives elsewhere
            alt="Copperpod Logo"
            width={240}
            height={82}
            className="h-8 w-auto object-contain"
            priority
          />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
          Hotel Agreement Review System
        </h1>
        <div className="flex items-center gap-4">
          {currentFile && (
            <button
              onClick={() => setShowActualFile(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all border hover:brightness-95 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: '#fdf2f7', color: '#be1549', borderColor: '#e5d0da' }}
              title="View the original uploaded file"
            >
              <Eye size={16} />
              <span>Show Actual File</span>
            </button>
          )}
          <FileUpload
            onUploadSuccess={handleUploadSuccess}
            apiResponse={filesData}
          />
          {filesData.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <span className="text-base">📄</span>
              <span className="font-semibold">{filesData.length}</span>
              <span className="font-medium">
                file{filesData.length > 1 ? "s" : ""} uploaded
              </span>
            </div>
          )}
          {/* Mock / API toggle — unlabeled radio */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={() => setUseMock(true)}
              className={`w-3 h-3 rounded-full transition-all ${
                useMock ? 'bg-amber-400 shadow-sm' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              title="Mock data"
            />
            <button
              type="button"
              onClick={() => setUseMock(false)}
              className={`w-3 h-3 rounded-full transition-all ${
                !useMock ? 'bg-emerald-500 shadow-sm' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              title="Live API"
            />
          </div>
          {/* User dropdown */}
          {user && (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all text-sm font-medium text-gray-700"
                title={user.email}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#be1549' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={14} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ backgroundColor: '#be1549' }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <span className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full font-semibold capitalize" style={{ backgroundColor: '#fdf2f7', color: '#be1549' }}>
                      {user.role}
                    </span>
                  </div>
                  {/* Logout */}
                  <button
                    onClick={() => { setShowUserMenu(false); handleLogout(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all"
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

      {/* File Tabs */}
      {filesData.length > 0 && (
        <FileTabs
          files={filesData}
          activeIndex={activeFileIndex}
          onSelectFile={handleSelectFile}
          onRemoveFile={handleRemoveFile}
        />
      )}

      {/* Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Document Preview */}
        <div className="w-1/2 border-r border-gray-200">
          <DocumentPreview
            file={currentFile?.file || null}
            highlightText={highlightText}
            translatedFilePath={currentFile?.translatedFilePath}
            translatedContent={currentFile?.translatedContent}
          />
        </div>

        {/* Right Panel - Review Interface */}
        <div className="w-1/2">
          <ReviewInterface
            data={currentFile?.parsed || null}
            onApprove={handleApprove}
            onReject={handleReject}
            isApproved={currentFile?.isApproved || false}
            onHighlightRequest={handleHighlightRequest}
            role={user?.role}
            onSubmit={() => handleSubmitFile(activeFileIndex)}
            onResubmit={() => handleResubmitFile(activeFileIndex)}
            onCheckStatus={() => handleCheckStatus(activeFileIndex)}
            submissionStatus={currentFile?.submissionStatus}
            submissionId={currentFile?.submissionId}
            submissionError={currentFile?.submissionError}
          />
        </div>
      </div>
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
