"use client";

import { useState, useEffect, useRef } from "react";
import { X, ZoomIn, ZoomOut, FileText, Loader2 } from "lucide-react";
import mammoth from "mammoth";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("./PdfViewver"), { ssr: false });

interface ActualFilePopupProps {
  file: File;
  onClose: () => void;
}

export default function ActualFilePopup({ file, onClose }: ActualFilePopupProps) {
  const [zoom, setZoom] = useState(100);
  const [htmlContent, setHtmlContent] = useState("");
  const [isPdf, setIsPdf] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const convertDocument = async () => {
      setIsLoading(true);
      setError(null);
      setIsPdf(false);
      setHtmlContent("");

      try {
        const fileName = file.name.toLowerCase();

        if (file.type === "application/pdf" || fileName.endsWith(".pdf")) {
          setIsPdf(true);
          setIsLoading(false);
          return;
        }

        if (fileName.endsWith(".doc")) {
          setError("Preview for .doc files is not supported.");
          return;
        }

        // Default: treat as .docx and convert via mammoth
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setHtmlContent(result.value);
      } catch (err) {
        console.error("Failed to convert document:", err);
        setError("Failed to load document.");
      } finally {
        setIsLoading(false);
      }
    };

    convertDocument();
  }, [file]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleZoomIn = () => setZoom((prev) => Math.min(200, prev + 25));
  const handleZoomOut = () => setZoom((prev) => Math.max(50, prev - 25));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Popup container */}
      <div className="relative w-[90vw] h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: '#e5d0da' }}>
          <div className="flex items-center gap-2">
            <FileText size={18} style={{ color: '#be1549' }} />
            <h3 className="text-sm font-semibold text-gray-800 truncate max-w-[400px]">
              {file.name}
            </h3>
            <span className="text-xs text-gray-500 ml-2">
              (Original File)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Zoom Controls */}
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:brightness-95"
              style={{ color: '#be1549' }}
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[50px] text-center">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="p-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:brightness-95"
              style={{ color: '#be1549' }}
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="ml-2 p-1.5 rounded-lg transition-colors hover:bg-gray-100"
              style={{ color: '#be1549' }}
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-100">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: '#be1549' }} />
                <p className="text-gray-600">Loading document...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-red-600">
                <p className="text-lg font-medium">{error}</p>
              </div>
            </div>
          ) : isPdf ? (
            <PdfViewer file={file} zoom={zoom} highlightText="" onLoadSuccess={setNumPages} />
          ) : (
            <div
              className="mx-auto bg-white shadow-lg transition-all duration-200"
              style={{
                width: `${zoom}%`,
                maxWidth: "850px",
                minWidth: "400px",
              }}
            >
              <div
                ref={contentRef}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                className="prose prose-sm max-w-none p-8 
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-p:text-gray-900 prose-p:leading-relaxed
                prose-strong:text-gray-900 prose-strong:font-bold
                prose-ul:list-disc prose-ol:list-decimal
                prose-li:text-gray-900
                **:text-gray-900"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
