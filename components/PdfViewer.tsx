"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

// Required for react-pdf v10+
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure pdfjs worker (client-side only)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  file: File | null;
  zoom: number;
  onLoadSuccess?: (numPages: number) => void;
}

export default function PdfViewer({ file, zoom, onLoadSuccess }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);

  return (
    <div className="flex justify-center">
      <div className="bg-white shadow-lg rounded p-4 max-w-[900px] w-full">
        <Document
          file={file ?? undefined}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            onLoadSuccess?.(numPages);
          }}
          loading={
            <div className="flex items-center justify-center py-10 text-foreground/70">
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
              <span>Loading PDF...</span>
            </div>
          }
          error={
            <div className="text-center text-red-400 py-10">
              Failed to load PDF preview.
            </div>
          }
        >
          <Page pageNumber={1} scale={zoom / 100} />
        </Document>

        {numPages && numPages > 1 && (
          <p className="mt-2 text-xs text-gray-500 text-center">
            Showing page 1 of {numPages}. (Multi-page navigation coming soon.)
          </p>
        )}
      </div>
    </div>
  );
}
