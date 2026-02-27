// ======================================================
// Hotel Agreement Review System - Type Definitions
// ======================================================

// ==============================
// API ROOT RESPONSE
// ==============================

export interface ApiResponse {
  status: "success" | "error";
  ocr_session_id: string;
  results: BatchResult[];
}

// ==============================
// PER FILE RESULT
// ==============================

export interface BatchResult {
  status: "success" | "error";
  run_id: string;
  file_name: string;

  ocr_markdown?: string | null;
  output_raw?: string;
  output_parsed: OutputParsed;

  flat_rows?: FlatRow[];
  meta?: FileMeta;

  file?: string; // Optional translated file path from backend
}

// ==============================
// PARSED OUTPUT STRUCTURE
// ==============================

export interface OutputParsed {
  meta: DocumentMeta;
  review: ReviewField[];
  snippets: Snippet[];
  flags: Flags;
}

// ==============================
// DOCUMENT META
// ==============================

export interface DocumentMeta {
  document_title: string;
  station_or_airport_code: string;
  hotel_name: string;
  airline_name: string;
}

export interface FileMeta {
  timestamp: string;
  file_name: string;
  run_id: string;
}

// ==============================
// REVIEW SECTION
// ==============================

export interface ReviewField {
  field: string;
  actual_content: string;
  compliant: "Y" | "N";
  comment: string;
}

// ==============================
// SNIPPETS SECTION
// ==============================

export interface Snippet {
  label: string;
  text: string;
  page_or_section: string;
}

// ==============================
// FLAGS SECTION
// ==============================

export interface Flags {
  missing_fields: string[];
  ambiguous_points: string[];
}

// ==============================
// FLAT ROWS (Export Structure)
// ==============================

export interface FlatRow {
  run_id: string;
  file_name: string;
  timestamp: string;

  review: ReviewField[];
  snippets: Snippet[];

  "meta.document_title": string;
  "meta.station_or_airport_code": string;
  "meta.hotel_name": string;
  "meta.airline_name": string;

  "flags.missing_fields": string[];
  "flags.ambiguous_points": string[];
}

// ==============================
// OCR RESPONSE (Second API Call)
// ==============================

export interface OcrResponse {
  status: "success" | "error";
  ocr_session_id: string;
  created_at: number;
  files: Record<string, string>; // { "filename.pdf": "<html content>" }
}

// ==============================
// UI FILE DATA (Frontend Model)
// ==============================

export interface FileData {
  file: File;
  fileName: string;
  parsed: OutputParsed;
  runId: string;

  translatedFilePath?: string;
  translatedContent?: string; // OCR HTML/markdown content to render directly
  isApproved?: boolean;
  batchResult?: BatchResult;

  submissionId?: string;
  submissionStatus?: "idle" | "loading" | "submitted" | "rejected" | "approved" | "error";
  submissionError?: string;
}

// ==============================
// COMPLIANCE STATS (UI Derived)
// ==============================

export interface ComplianceStats {
  total: number;
  compliant: number;
  nonCompliant: number;
  percentage: number;
}