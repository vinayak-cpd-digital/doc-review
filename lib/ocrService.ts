import { mockOcrResponse } from "./mockOcrData";

/**
 * Fetch OCR translated content for a specific file.
 *
 * API:      GET http://localhost:8000/ocr/{ocrSessionId}/{encodedFileName}
 * Response: { status, ocr_session_id, file_name, ocr_markdown }
 *
 * Falls back to mockOcrData when the backend is unavailable.
 */
export async function fetchOcrContent(
  ocrSessionId: string,
  fileName: string,
  useMock = false
): Promise<string | null> {
  // Return mock OCR data directly when in mock mode
  if (useMock) {
    const mockContent = (mockOcrResponse.files as Record<string, string>)[fileName];
    return mockContent ?? null;
  }

  try {
    const encodedFileName = encodeURIComponent(fileName);
    const res = await fetch(
      `http://localhost:8000/ocr/${ocrSessionId}/${encodedFileName}`
    );
    if (!res.ok) throw new Error(`OCR API error: ${res.status}`);
    const data = await res.json();
    return data.ocr_markdown ?? null;
  } catch {
    // Fall back to mock OCR data keyed by fileName when real API fails
    const mockContent = (mockOcrResponse.files as Record<string, string>)[fileName];
    return mockContent ?? null;
  }
}
