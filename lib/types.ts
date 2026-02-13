// TypeScript interfaces for the Hotel Agreement Review System

export interface ApiResponse {
  status: "success" | "error";
  file_name: string;
  output_parsed: OutputParsed;
}

export interface BatchApiResponse {
  status: "success" | "error";
  results: BatchResult[];
}

export interface BatchResult {
  status: "success" | "error";
  run_id: string;
  file_name: string;
  file?: string; // Path to translated text file from backend
  output_raw: string;
  output_parsed: OutputParsed;
}

export interface FileData {
  file: File;
  fileName: string;
  parsed: OutputParsed;
  runId: string;
  translatedFilePath?: string; // Path to translated text file from API
  isApproved?: boolean;
  batchResult?: BatchResult; // Store the complete batch result for export
}

export interface OutputParsed {
  meta: DocumentMeta;
  review: ReviewField[];
  snippets: Snippet[];
  flags: Flags;
}

export interface DocumentMeta {
  document_title: string;
  station_or_airport_code: string;
  hotel_name: string;
  airline_name: string;
}

export interface ReviewField {
  field: string;              // Dynamic field name
  actual_content: string;     // Extracted text
  compliant: "Y" | "N";       // Compliance status
  comment: string;            // Review comment
}

export interface Snippet {
  label: string;              // Section label
  text: string;               // Full text
  page_or_section: string;    // Location reference
}

export interface Flags {
  missing_fields: string[];
  ambiguous_points: string[];
}

export interface ComplianceStats {
  total: number;
  compliant: number;
  nonCompliant: number;
  percentage: number;
}
