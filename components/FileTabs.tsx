"use client";

import { ChevronLeft, ChevronRight, X, FileText } from "lucide-react";
import { FileData } from "@/lib/types";

interface FileTabsProps {
  files: FileData[];
  activeIndex: number;
  onSelectFile: (index: number) => void;
  onRemoveFile: (index: number) => void;
}

export default function FileTabs({ files, activeIndex, onSelectFile, onRemoveFile }: FileTabsProps) {
  if (files.length === 0) return null;

  const handlePrevious = () => {
    if (activeIndex > 0) {
      onSelectFile(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < files.length - 1) {
      onSelectFile(activeIndex + 1);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center px-4 py-2 gap-2">
        {/* Navigation Arrows */}
        <button
          onClick={handlePrevious}
          disabled={activeIndex === 0}
          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Previous file"
        >
          <ChevronLeft size={20} />
        </button>

        {/* File Tabs */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {files.map((fileData, index) => {
            const isActive = index === activeIndex;
            const stats = calculateStats(fileData.parsed?.review ?? []);
            const key = fileData.runId || `${fileData.fileName}-${index}`;
            
            return (
              <button
                key={key}
                onClick={() => onSelectFile(index)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all min-w-fit ${
                  isActive
                    ? "bg-blue-50 border-blue-500 shadow-md"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                }`}
              >
                <FileText size={16} className={isActive ? "text-blue-600" : "text-gray-600"} />
                <div className="flex flex-col items-start">
                  <span className={`text-sm font-semibold truncate max-w-[200px] ${
                    isActive ? "text-blue-900" : "text-gray-700"
                  }`}>
                    {fileData.fileName}
                  </span>
                  <span className={`text-xs ${
                    isActive ? "text-blue-600" : "text-gray-500"
                  }`}>
                    {stats.compliant}/{stats.total} compliant
                  </span>
                </div>
                {files.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFile(index);
                    }}
                    className="ml-1 p-0.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove file"
                  >
                    <X size={14} />
                  </button>
                )}
              </button>
            );
          })}
        </div>

        {/* Next Arrow */}
        <button
          onClick={handleNext}
          disabled={activeIndex === files.length - 1}
          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Next file"
        >
          <ChevronRight size={20} />
        </button>

        {/* File Counter */}
        <div className="text-sm font-medium text-gray-600 ml-2 whitespace-nowrap">
          {activeIndex + 1} / {files.length}
        </div>
      </div>
    </div>
  );
}

function calculateStats(review: Array<{ compliant: "Y" | "N" }>) {
  const total = review.length;
  const compliant = review.filter((item) => item.compliant === "Y").length;
  return { total, compliant };
}
