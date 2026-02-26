"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import DocumentPreview from "@/components/DocumentPreview";
import ReviewInterface from "@/components/ReviewInterface";
import FileTabs from "@/components/FileTabs";
import ActualFilePopup from "@/components/ActualFilePopup";
import { FileData } from "@/lib/types";
import { Eye } from "lucide-react";
import Image from "next/image";
import logo from "@/public/copperpod-logo.png";

export default function Home() {
  const [filesData, setFilesData] = useState<FileData[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [highlightText, setHighlightText] = useState<string>("");
  const [showActualFile, setShowActualFile] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ocrSessionId, setOcrSessionId] = useState<string | null>(null);

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

  const currentFile = filesData[activeFileIndex] || null;

  // Close popup when switching tabs so it doesn't show a stale file
  const handleSelectFile = (index: number) => {
    setActiveFileIndex(index);
    setShowActualFile(false);
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
