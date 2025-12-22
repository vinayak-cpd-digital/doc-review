import { ReviewField, ComplianceStats } from "./types";

/**
 * Calculate compliance statistics from review data
 */
export function calculateComplianceStats(review: ReviewField[]): ComplianceStats {
  const total = review.length;
  const compliant = review.filter((item) => item.compliant === "Y").length;
  const nonCompliant = total - compliant;
  const percentage = total > 0 ? Math.round((compliant / total) * 100) : 0;

  return {
    total,
    compliant,
    nonCompliant,
    percentage,
  };
}

/**
 * Highlight search term in text - returns array of parts for rendering
 */
export function highlightText(text: string, searchTerm: string): Array<{ text: string; highlight: boolean }> {
  if (!searchTerm || !text) return [{ text, highlight: false }];

  const regex = new RegExp(`(${escapeRegex(searchTerm)})`, "gi");
  const parts = text.split(regex);

  return parts
    .filter(part => part.length > 0)
    .map((part) => ({
      text: part,
      highlight: regex.test(part),
    }));
}

/**
 * Escape special regex characters
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Validate file type and size
 */
// export function validateFile(file: File): { valid: boolean; error?: string } {
//   const validExtensions = [".doc", ".docx", ".pdf"];
//   const validMimeTypes = [
//     "application/msword", // .doc
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
//     "application/pdf", // .pdf
//   ];
//   const maxSizeInBytes = 10 * 1024 * 1024; // 10MB

//   const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));

//   if (!validExtensions.includes(extension)) {
//     return {
//       valid: false,
//       error: "Please upload a .doc, .docx, or .pdf file",
//     };
//   }

//   if (!validMimeTypes.includes(file.type)) {
//     return {
//       valid: false,
//       error: "Invalid file type. Please upload a valid .doc, .docx, or .pdf file",
//     };
//   }

//   if (file.size > maxSizeInBytes) {
//     return {
//       valid: false,
//       error: "File size must be less than 10MB",
//     };
//   }

//   return { valid: true };
// }

export const validateFile = (file: File) => {
  const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const isValidExtension = allowedExtensions.test(file.name);
  const isValidMime = allowedMimeTypes.includes(file.type);

  if (!isValidExtension || !isValidMime) {
    return {
      valid: false,
      error: "Only .pdf, .doc and .docx formats are allowed",
    };
  }

  return { valid: true, error: null };
};


/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
