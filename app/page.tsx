"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import DocumentPreview from "@/components/DocumentPreview";
import ReviewInterface from "@/components/ReviewInterface";
import FileTabs from "@/components/FileTabs";
import { FileData } from "@/lib/types";

export default function Home() {
  const [filesData, setFilesData] = useState<FileData[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [highlightText, setHighlightText] = useState<string>("");

  const handleUploadSuccess = (files: FileData[]) => {
    setFilesData(files);
    setActiveFileIndex(0);
    setHighlightText("");
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

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm px-6 py-3.5 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <FileUpload 
            onUploadSuccess={handleUploadSuccess}
            apiResponse={filesData}
          />
          {filesData.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <span className="text-base">📄</span>
              <span className="font-semibold">{filesData.length}</span>
              <span className="font-medium">file{filesData.length > 1 ? 's' : ''} uploaded</span>
            </div>
          )}
        </div>
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
          Hotel Agreement Review System
        </h1>
      </header>

      {/* File Tabs */}
      {filesData.length > 0 && (
        <FileTabs
          files={filesData}
          activeIndex={activeFileIndex}
          onSelectFile={setActiveFileIndex}
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
    </div>
  );
}
