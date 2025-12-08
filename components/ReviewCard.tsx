"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import ComplianceBadge from "./ComplianceBadge";
import { ReviewField, Snippet } from "@/lib/types";
import { highlightText } from "@/lib/utils";

interface ReviewCardProps {
  field: ReviewField;
  snippet?: Snippet;
  searchTerm: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function ReviewCard({ field, snippet, searchTerm, isExpanded, onToggle }: ReviewCardProps) {
  const isCompliant = field.compliant === "Y";
  const borderColor = isCompliant ? "border-green-200" : "border-red-200";
  const bgColor = isCompliant ? "bg-green-50/40" : "bg-red-50/40";

  const renderHighlightedText = (text: string) => {
    const parts = highlightText(text, searchTerm);
    return parts.map((part, index) => (
      part.highlight ? (
        <mark key={index} className="bg-yellow-200 font-semibold px-0.5">
          {part.text}
        </mark>
      ) : (
        <span key={index}>{part.text}</span>
      )
    ));
  };

  return (
    <div className={`border-2 ${borderColor} ${bgColor} rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg shadow-sm`}
    >
      {/* Collapsed Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start gap-3 text-left hover:bg-white/70 transition-all duration-150"
      >
        <div className="flex-shrink-0 mt-1">
          {isExpanded ? (
            <ChevronDown size={20} className="text-gray-600" />
          ) : (
            <ChevronRight size={20} className="text-gray-600" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1">{field.field}</h3>
          <p className={`text-sm text-gray-600 ${!isExpanded ? "line-clamp-2" : ""}`}>
            {renderHighlightedText(field.comment)}
          </p>
        </div>

        <div className="flex-shrink-0">
          <ComplianceBadge status={field.compliant} size="sm" />
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t-2 border-gray-200 bg-gradient-to-b from-white to-gray-50 p-6 space-y-5">
          {/* Review Comment */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
              Review Comment
            </h4>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 text-sm text-gray-800 leading-relaxed shadow-sm">
              {renderHighlightedText(field.comment)}
            </div>
          </div>

          {/* Extracted Content */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-gray-500 rounded-full"></span>
              Extracted Content
            </h4>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 leading-relaxed shadow-sm">
              {field.actual_content ? (
                renderHighlightedText(field.actual_content)
              ) : (
                <span className="text-gray-400 italic">No content extracted</span>
              )}
            </div>
          </div>

          {/* Full Document Section */}
          {snippet && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                Full Document Section
              </h4>
              <div className="border-2 border-gray-300 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-3 border-b border-gray-300">
                  <div className="font-semibold text-gray-900">{snippet.label}</div>
                  <div className="text-xs text-gray-600 mt-1 font-medium">{snippet.page_or_section}</div>
                </div>
                <div className="bg-white p-4 text-sm text-gray-800 leading-relaxed">
                  {renderHighlightedText(snippet.text)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
