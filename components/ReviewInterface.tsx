"use client";

import { useState, useMemo, useCallback } from "react";
import {
  AlertCircle,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { OutputParsed } from "@/lib/types";
import { calculateComplianceStats } from "@/lib/utils";
import SearchBar from "./SearchBar";
import FilterButtons from "./FilterButtons";
import ReviewCard from "./ReviewCard";

interface ReviewInterfaceProps {
  data: OutputParsed | null;
  onApprove: () => void;
  onReject: () => void;
  isApproved: boolean;
}

export default function ReviewInterface({
  data,
  onApprove,
  onReject,
  isApproved,
}: ReviewInterfaceProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompliance, setFilterCompliance] = useState<"all" | "Y" | "N">("all");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [expandAll, setExpandAll] = useState(false);
  const [isAlertExpanded, setIsAlertExpanded] = useState(true);

  // Calculate compliance stats
  const stats = useMemo(() => {
    if (!data) return { total: 0, compliant: 0, nonCompliant: 0, percentage: 0 };
    return calculateComplianceStats(data.review);
  }, [data]);

  // Filter and search logic
  const filteredReview = useMemo(() => {
    if (!data) return [];

    let filtered = data.review;

    // Apply compliance filter
    if (filterCompliance !== "all") {
      filtered = filtered.filter((item) => item.compliant === filterCompliance);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.field.toLowerCase().includes(term) ||
          item.comment.toLowerCase().includes(term) ||
          item.actual_content.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [data, filterCompliance, searchTerm]);

  // Toggle individual card
  const toggleCard = useCallback((fieldName: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fieldName)) {
        newSet.delete(fieldName);
      } else {
        newSet.add(fieldName);
      }
      return newSet;
    });
  }, []);

  // Toggle expand all
  const handleExpandAll = () => {
    if (expandAll) {
      setExpandedItems(new Set());
    } else {
      setExpandedItems(new Set(filteredReview.map((item) => item.field)));
    }
    setExpandAll(!expandAll);
  };

  // Get snippet for field
  const getSnippet = (fieldName: string) => {
    if (!data) return undefined;
    return data.snippets.find(
      (s) =>
        s.label.toLowerCase().includes(fieldName.toLowerCase()) ||
        fieldName.toLowerCase().includes(s.label.toLowerCase())
    );
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full bg-background/60">
        <div className="text-center text-foreground/60">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-lg font-medium">No Review Data</p>
          <p className="text-sm mt-2">Upload a document to see the compliance review</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
        {/* Document Metadata */}
        <div className="flex items-start justify-between p-4 border-b border-border/60">
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground mb-2 tracking-tight">
              {data.meta.document_title}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span className="flex items-center gap-1.5">
                <span className="text-base">🏨</span>
                <strong className="font-semibold">Hotel:</strong>
                <span className="font-medium">{data.meta.hotel_name}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-base">✈️</span>
                <strong className="font-semibold">Airline:</strong>
                <span className="font-medium">{data.meta.airline_name}</span>
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold text-xs border border-primary/40">
                {data.meta.station_or_airport_code}
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="p-3 space-y-2">
          {/* First Row: Search and Filter Buttons */}
          <div className="flex items-center gap-2">
            <SearchBar
              onSearch={setSearchTerm}
              placeholder="Search fields, comments, or content..."
            />
            <FilterButtons
              activeFilter={filterCompliance}
              onFilterChange={setFilterCompliance}
              counts={{
                all: data.review.length,
                compliant: stats.compliant,
                nonCompliant: stats.nonCompliant,
              }}
            />
          </div>

          {/* Second Row: Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExpandAll}
              className="px-3 py-1.5 rounded-md border border-border bg-background/40 hover:bg-background/70 font-medium text-xs transition-colors flex items-center gap-1.5 text-foreground"
            >
              {expandAll ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              {expandAll ? "Collapse" : "Expand"}
            </button>

            {/* Approve/Reject Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={onApprove}
                disabled={isApproved}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm ${
                  isApproved
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white cursor-default shadow-md"
                    : "bg-primary text-primary-foreground border-2 border-primary hover:bg-primary/90 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                <CheckCircle size={14} />
                {isApproved ? "Approved" : "Approve"}
              </button>
              <button
                onClick={onReject}
                disabled={!isApproved}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm ${
                  !isApproved
                    ? "bg-white border-2 border-red-600 text-red-700 hover:bg-red-50 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-300"
                }`}
              >
                <XCircle size={14} />
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner - Collapsible */}
      {(data.flags.missing_fields.length > 0 || data.flags.ambiguous_points.length > 0) && (
        <div className="mx-4 mt-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg overflow-hidden">
          <button
            onClick={() => setIsAlertExpanded(!isAlertExpanded)}
            className="w-full p-4 flex items-center gap-3 hover:bg-amber-100/50 transition-colors"
          >
            <AlertCircle className="text-amber-600 shrink-0" size={20} />
            <h3 className="font-semibold text-amber-900 flex-1 text-left">
              Attention Required (
              {data.flags.missing_fields.length + data.flags.ambiguous_points.length} issues)
            </h3>
            {isAlertExpanded ? (
              <ChevronDown className="text-amber-700 shrink-0" size={20} />
            ) : (
              <ChevronRight className="text-amber-700 shrink-0" size={20} />
            )}
          </button>

          {isAlertExpanded && (
            <div className="px-4 pb-4 pl-11">
              {data.flags.missing_fields.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-amber-800 mb-1">Missing Fields:</p>
                  <ul className="list-disc list-inside text-sm text-amber-700 space-y-0.5">
                    {data.flags.missing_fields.map((field, index) => (
                      <li key={index}>{field}</li>
                    ))}
                  </ul>
                </div>
              )}
              {data.flags.ambiguous_points.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-amber-800 mb-1">Ambiguous Points:</p>
                  <ul className="list-disc list-inside text-sm text-amber-700 space-y-0.5">
                    {data.flags.ambiguous_points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Review Cards */}
      <div className="flex-1 overflow-auto p-4 space-y-3 bg-background/40">
        {filteredReview.length > 0 ? (
          filteredReview.map((item) => (
            <ReviewCard
              key={item.field}
              field={item}
              snippet={getSnippet(item.field)}
              searchTerm={searchTerm}
              isExpanded={expandedItems.has(item.field)}
              onToggle={() => toggleCard(item.field)}
            />
          ))
        ) : (
          <div className="text-center py-12 text-foreground/50">
            <p className="text-lg">No results found</p>
            <p className="text-sm mt-2">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
