"use client";

import { Upload, Loader2, CheckCircle, AlertCircle, Download } from "lucide-react";
import { useState, useRef } from "react";
import { validateFile } from "@/lib/utils";
import { ApiResponse } from "@/lib/types";

interface FileUploadProps {
  onUploadSuccess: (data: {
    parsed: ApiResponse["output_parsed"];
    fileName: string;
    file: File;
  }) => void;
  apiResponse: ApiResponse["output_parsed"] | null;
  isApproved: boolean;
}

export default function FileUpload({ onUploadSuccess, apiResponse, isApproved }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;

    setError(null);
    setSuccess(false);

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("try_parse_json", "true");

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();

      if (data.status === "success") {
        setSuccess(true);
        onUploadSuccess({
          parsed: data.output_parsed,
          fileName: data.file_name,
          file: file,
        });

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error("Analysis failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze document");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle export
  const handleExport = async () => {
    if (!apiResponse || !isApproved) {
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          additionalProp1: apiResponse,
        }),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      // Get the blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `compliance-report-${Date.now()}.pdf`; // or .xlsx based on backend response
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      alert("Report exported successfully!");
    } catch (err) {
      console.error("Export error:", err);
      setError(err instanceof Error ? err.message : "Failed to export report");
    } finally {
      setIsExporting(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex items-center gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx"
        onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
        className="hidden"
      />

      <button
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        disabled={isUploading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
          isUploading
            ? "bg-primary/60 cursor-not-allowed text-primary-foreground/70"
            : success
            ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        } shadow-lg hover:shadow-xl disabled:shadow-md transform hover:scale-[1.02] active:scale-[0.98]`}
      >
        {isUploading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Analyzing...</span>
          </>
        ) : success ? (
          <>
            <CheckCircle size={20} />
            <span>Success!</span>
          </>
        ) : (
          <>
            <Upload size={20} />
            <span>Upload Agreement</span>
          </>
        )}
      </button>

      {/* Export Button - Only enabled when approved */}
      <button
        onClick={handleExport}
        disabled={!isApproved || isExporting || !apiResponse}
        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
          isApproved && apiResponse && !isExporting
            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            : "bg-muted text-foreground/40 cursor-not-allowed opacity-70 shadow-sm"
        }`}
        title={!isApproved ? "Please approve the review before exporting" : "Export compliance report"}
      >
        {isExporting ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <Download size={16} />
            <span>Export Report</span>
          </>
        )}
      </button>

      {error && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
