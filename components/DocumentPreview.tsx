"use client";

import { useState, useEffect } from "react";
import { FileText, Loader2, ZoomIn, ZoomOut } from "lucide-react";
import mammoth from "mammoth";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("./PdfViewer"), { ssr: false });

interface DocumentPreviewProps {
  file: File | null;
}

export default function DocumentPreview({ file }: DocumentPreviewProps) {
  const [htmlContent, setHtmlContent] = useState("");
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);

  useEffect(() => {
    // Reset state when file changes
    setIsPdf(false);
    setHtmlContent("");
    setError(null);
    setNumPages(null);

    const convertDocument = async () => {
      if (!file) {
        setHtmlContent("");
        return;
      }

      setIsLoading(true);
      try {
        const fileName = file.name.toLowerCase();

        // Handle PDF: use react-pdf to render without conversion
        if (file.type === "application/pdf" || fileName.endsWith(".pdf")) {
          setIsPdf(true);
          setHtmlContent("");
          setIsLoading(false);
          return;
        }

        // Handle legacy .doc: upload is allowed, but preview is not supported client-side
        if (fileName.endsWith(".doc")) {
          setHtmlContent("");
          setError("Preview for .doc files is not supported, but your file was uploaded successfully.");
          return;
        }

        // Default: treat as .docx and convert via mammoth
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setHtmlContent(result.value);
      } catch (err) {
        console.error("Failed to convert document:", err);
        setError("Failed to load document. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    convertDocument();
  }, [file]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(50, prev - 25));
  };

  if (!file) {
    return (
      <div className="flex items-center justify-center h-full bg-background/60">
        <div className="text-center text-foreground/60">
          <FileText className="w-16 h-16 mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-lg font-medium">No Document Uploaded</p>
          <p className="text-sm mt-2">Upload a .docx file to preview</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-card">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-foreground/80">Converting document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-background/60">
        <div className="text-center text-red-400">
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background/60">
      {/* Zoom Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <h3 className="text-sm font-medium text-foreground/80">Document Preview</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            className="p-1.5 rounded hover:bg-background/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-foreground"
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
            className="p-1.5 rounded hover:bg-background/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-foreground"
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
        </div>
      </div>

      {/* Document Content */}
      <div className="flex-1 overflow-auto p-6">
        {isPdf ? (
          <PdfViewer file={file} zoom={zoom} onLoadSuccess={setNumPages} />
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
  );
}
