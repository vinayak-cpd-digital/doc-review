"use client";

import {
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  Download,
} from "lucide-react";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { BatchApiResponse, FileData } from "@/lib/types";

interface FileUploadProps {
  onUploadSuccess: (files: FileData[]) => void;
  apiResponse: FileData[] | null;
}

export default function FileUpload({
  onUploadSuccess,
  apiResponse,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError(null);
    setSuccess(false);

    // Validate all files are .docx
    const fileArray = Array.from(files);
    const invalidFiles = fileArray.filter((f) => !f.name.endsWith(".docx"));

    // if (invalidFiles.length > 0) {
    //   const errorMessage = "Please upload only .docx files";
    //   setError(errorMessage);
    //   toast.error(errorMessage);
    //   return;
    // }

    setIsUploading(true);

    try {
      const formData = new FormData();
      fileArray.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/analyze-batch", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data: BatchApiResponse = await response.json();

      if (data.status === "success" && data.results) {
        setSuccess(true);

        // Map results to FileData with actual File objects and complete batch result
        const filesData: FileData[] = data.results.map((result, index) => ({
          file: fileArray[index],
          fileName: result.file_name,
          parsed: result.output_parsed,
          runId: result.run_id,
          batchResult: result, // Store complete batch result for export
        }));

        onUploadSuccess(filesData);

        toast.success(
          `${fileArray.length} file${fileArray.length > 1 ? "s" : ""} analyzed successfully!`,
        );

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error("Analysis failed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to analyze documents";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle export
  const handleExport = async () => {
    if (!apiResponse) {
      return;
    }

    // Filter only approved files
    const approvedFiles = apiResponse.filter(
      (file) => file.isApproved === true,
    );

    if (approvedFiles.length === 0) {
      const errorMessage =
        "No approved files to export. Please approve at least one file.";
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      // Reconstruct the batch response format expected by the export API
      const exportPayload = {
        additionalProp1: {
          status: "success",
          results: approvedFiles
            .map((file) => file.batchResult)
            .filter(Boolean),
        },
      };

      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exportPayload),
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
      a.download = `compliance-report-${Date.now()}.xlsx`; // Excel file
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(
        `Excel report exported successfully! (${approvedFiles.length} approved file${approvedFiles.length > 1 ? "s" : ""})`,
      );
    } catch (err) {
      console.error("Export error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to export report";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex items-center gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        multiple
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      <button
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        disabled={isUploading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
          isUploading
            ? "bg-blue-400 cursor-not-allowed"
            : success
              ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        } text-white shadow-lg hover:shadow-xl disabled:shadow-md transform hover:scale-[1.02] active:scale-[0.98]`}
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
            <span>Upload Agreements</span>
          </>
        )}
      </button>

      {/* Export Button - Only enabled when there are approved files */}
      <button
        onClick={handleExport}
        disabled={
          isExporting ||
          !apiResponse ||
          apiResponse.filter((f) => f.isApproved).length === 0
        }
        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
          apiResponse &&
          apiResponse.filter((f) => f.isApproved).length > 0 &&
          !isExporting
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-70 shadow-sm"
        }`}
        title={
          !apiResponse || apiResponse.filter((f) => f.isApproved).length === 0
            ? "Please approve at least one file before exporting"
            : `Export ${apiResponse.filter((f) => f.isApproved).length} approved file(s)`
        }
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
