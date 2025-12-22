"use client";

import { useState } from "react";
import Image from "next/image";
import FileUpload from "@/components/FileUpload";
import DocumentPreview from "@/components/DocumentPreview";
import ReviewInterface from "@/components/ReviewInterface";
import { OutputParsed, ApiResponse } from "@/lib/types";
import logo from "../public/copperpod-logo.png";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [reviewData, setReviewData] = useState<OutputParsed | null>(null);
  const [fileName, setFileName] = useState("");
  const [fullApiResponse, setFullApiResponse] = useState<
    ApiResponse["output_parsed"] | null
  >(null);
  const [isApproved, setIsApproved] = useState(false);

  const handleUploadSuccess = ({
    parsed,
    fileName: name,
    file: uploadedFile,
  }: {
    parsed: OutputParsed;
    fileName: string;
    file: File;
  }) => {
    setReviewData(parsed);
    setFileName(name);
    setFile(uploadedFile);
    setFullApiResponse(parsed);
    setIsApproved(false); // Reset approval status on new upload
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-6 py-3.5 flex items-center justify-between z-10">
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
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">
            Hotel Agreement Review System
          </h1>
        </div>
        {/* Right: File upload + current file name */}
        <div className="flex items-center gap-4">
          <FileUpload
            onUploadSuccess={handleUploadSuccess}
            apiResponse={fullApiResponse}
            isApproved={isApproved}
          />
          {fileName && (
            <div className="flex items-center gap-2 text-sm text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
              <span className="text-base">📄</span>
              <span className="max-w-md truncate font-medium text-gray-900">
                {fileName}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Document Preview */}
        <div className="w-1/2 border-r border-border">
          <DocumentPreview file={file} />
        </div>

        {/* Right Panel - Review Interface */}
        <div className="w-1/2">
          <ReviewInterface
            data={reviewData}
            onApprove={() => setIsApproved(true)}
            onReject={() => setIsApproved(false)}
            isApproved={isApproved}
          />
        </div>
      </div>
    </div>
  );
}
