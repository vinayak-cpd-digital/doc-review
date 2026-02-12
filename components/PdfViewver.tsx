"use client";

import { useEffect, useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2 } from "lucide-react";
import Tesseract from "tesseract.js";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  file: File | null;
  zoom: number;
  highlightText?: string;
  onLoadSuccess?: (numPages: number) => void;
}

interface OcrWord {
  text: string;
  bbox: { x0: number; y0: number; x1: number; y1: number };
  pageIndex: number;
}

export default function PdfViewer({
  file,
  zoom,
  highlightText = "",
  onLoadSuccess,
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [hasTextLayer, setHasTextLayer] = useState<boolean | null>(null);
  const [ocrWords, setOcrWords] = useState<OcrWord[]>([]);
  const [ocrRunning, setOcrRunning] = useState(false);
  const [ocrDone, setOcrDone] = useState(false);

  // After PDF loads, check if it has a text layer
  const checkTextLayer = useCallback(async () => {
    if (!file) return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let totalChars = 0;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        for (const item of textContent.items) {
          if ("str" in item) totalChars += item.str.trim().length;
        }
        if (totalChars > 10) break;
      }
      console.log(`[PdfViewer] Text layer chars found: ${totalChars}`);
      setHasTextLayer(totalChars > 10);
    } catch (err) {
      console.error("[PdfViewer] Error checking text layer:", err);
      setHasTextLayer(false);
    }
  }, [file]);

  // Run OCR for image-based PDFs
  const runOcr = useCallback(async () => {
    if (!file || ocrRunning || ocrDone) return;
    setOcrRunning(true);
    console.log("[PdfViewer] Starting OCR...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const allWords: OcrWord[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, canvas, viewport }).promise;

        const dataUrl = canvas.toDataURL("image/png");
        const result = await Tesseract.recognize(dataUrl, "eng");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const words = (result.data as any).words as Array<{ text: string; bbox: { x0: number; y0: number; x1: number; y1: number } }> | undefined;
        if (words) {
          for (const word of words) {
            allWords.push({
              text: word.text,
              bbox: word.bbox,
              pageIndex: i - 1,
            });
          }
          console.log(`[PdfViewer] OCR page ${i}: ${words.length} words`);
        }
      }

      setOcrWords(allWords);
      setOcrDone(true);
      console.log(`[PdfViewer] OCR complete. Total words: ${allWords.length}`);
    } catch (err) {
      console.error("[PdfViewer] OCR error:", err);
    } finally {
      setOcrRunning(false);
    }
  }, [file, ocrRunning, ocrDone]);

  // Check text layer when PDF loads
  useEffect(() => {
    if (numPages > 0 && file) {
      checkTextLayer();
    }
  }, [numPages, file, checkTextLayer]);

  // Trigger OCR if no text layer
  useEffect(() => {
    if (hasTextLayer === false && !ocrDone && !ocrRunning) {
      runOcr();
    }
  }, [hasTextLayer, ocrDone, ocrRunning, runOcr]);

  const escapeRegex = (text: string) =>
    text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // ===== Scroll + DOM fallback for highlighting =====
  useEffect(() => {
    if (!highlightText || numPages === 0) return;
    if (hasTextLayer === false) return;

    const highlightStyle = "background-color: #fde047; padding: 0 2px; border-radius: 4px; position: relative; z-index: 10;";

    const clearExisting = (container: HTMLElement) => {
      container.querySelectorAll(".auto-highlight").forEach((el) => {
        (el as HTMLElement).style.cssText = (el as HTMLElement).style.cssText.replace(highlightStyle, "");
        el.classList.remove("auto-highlight", "animate-pulse");
      });
    };

    const applyHighlight = (el: HTMLElement) => {
      el.classList.add("auto-highlight");
      el.style.cssText += highlightStyle;
    };

    const scrollAndPulse = (el: HTMLElement) => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("animate-pulse");
      window.setTimeout(() => el.classList.remove("animate-pulse"), 1500);
    };

    let timeoutId: number | undefined;

    const tryHighlight = (attempt: number) => {
      const container = document.getElementById("document-scroll-container");
      if (!container) return;

      // First, check if customTextRenderer already injected <mark> tags
      const mark = container.querySelector("mark") as HTMLElement | null;
      if (mark) {
        mark.scrollIntoView({ behavior: "smooth", block: "center" });
        mark.style.transition = "background-color 0.3s";
        mark.style.backgroundColor = "#f97316";
        setTimeout(() => { mark.style.backgroundColor = "#fde047"; }, 800);
        return;
      }

      // If no <mark> found, do DOM-based multi-span highlighting
      const allSpans = Array.from(
        container.querySelectorAll(".react-pdf__Document .textLayer span")
      ) as HTMLSpanElement[];

      if (allSpans.length === 0) {
        if (attempt < 25) timeoutId = window.setTimeout(() => tryHighlight(attempt + 1), 300);
        return;
      }

      clearExisting(container);

      const lowerSearch = highlightText.toLowerCase().trim();
      if (!lowerSearch) return;

      // --- Strategy 1: Exact match in a single span ---
      let exactEqual: HTMLSpanElement | null = null;
      let firstContains: HTMLSpanElement | null = null;

      for (const el of allSpans) {
        const text = (el.textContent || "").toLowerCase().trim();
        if (text === lowerSearch && !exactEqual) {
          exactEqual = el;
          break;
        }
        if (!firstContains && text.includes(lowerSearch)) {
          firstContains = el;
        }
      }

      const bestExact = exactEqual || firstContains;
      if (bestExact) {
        applyHighlight(bestExact);
        scrollAndPulse(bestExact);
        return;
      }

      // --- Strategy 2: Multi-span concatenation ---
      const leafSpans = allSpans.filter((s) => s.querySelector("span") === null);
      const spanTexts = leafSpans.map((el) => ({
        el,
        lower: (el.textContent || "").toLowerCase().trim(),
        raw: (el.textContent || "").toLowerCase(),
      }));

      for (let i = 0; i < spanTexts.length; i++) {
        let concatSpace = "";
        let concatNoSpace = "";
        let concatRaw = "";
        for (let j = i; j < spanTexts.length && j < i + 15; j++) {
          concatSpace += (j > i ? " " : "") + spanTexts[j].lower;
          concatNoSpace += spanTexts[j].lower;
          concatRaw += spanTexts[j].raw;
          if (concatSpace.includes(lowerSearch) || concatNoSpace.includes(lowerSearch) || concatRaw.includes(lowerSearch)) {
            for (let k = i; k <= j; k++) applyHighlight(spanTexts[k].el);
            scrollAndPulse(spanTexts[i].el);
            return;
          }
        }
      }

      // --- Strategy 3: Word-based fuzzy match ---
      const normalizeText = (str: string) =>
        str.toLowerCase().replace(/\s+/g, " ").replace(/[^\w\s]/g, "").trim();
      const searchWords = normalizeText(highlightText).split(" ").filter((w) => w.length > 1);

      if (searchWords.length > 0) {
        for (let i = 0; i < spanTexts.length; i++) {
          const matchedSet = new Set<string>();
          let lastJ = i;
          for (let j = i; j < spanTexts.length && j < i + searchWords.length + 5; j++) {
            const norm = normalizeText(spanTexts[j].lower);
            if (norm) {
              for (const w of searchWords) {
                if (norm.includes(w)) matchedSet.add(w);
              }
            }
            lastJ = j;
            if (matchedSet.size === searchWords.length) {
              for (let k = i; k <= lastJ; k++) applyHighlight(spanTexts[k].el);
              scrollAndPulse(spanTexts[i].el);
              return;
            }
          }
        }
      }
    };

    // Wait for text layer to render (customTextRenderer needs time to inject <mark> tags)
    timeoutId = window.setTimeout(() => tryHighlight(0), 500);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [highlightText, numPages, hasTextLayer]);

  // ===== OCR highlight scroll =====
  useEffect(() => {
    if (!highlightText || !ocrDone || hasTextLayer !== false) return;
    const timer = setTimeout(() => {
      const overlay = document.querySelector(".ocr-highlight-active");
      if (overlay) {
        overlay.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [highlightText, ocrDone, hasTextLayer]);


  // Find OCR words that match the highlight text
  const getOcrHighlights = useCallback(() => {
    if (!highlightText || ocrWords.length === 0) return [];

    const lowerSearch = highlightText.toLowerCase().trim();
    const searchWords = lowerSearch.split(/\s+/);
    const highlights: { pageIndex: number; bbox: { x0: number; y0: number; x1: number; y1: number } }[] = [];

    for (let i = 0; i < ocrWords.length; i++) {
      let concat = "";
      for (let j = i; j < ocrWords.length && j < i + searchWords.length + 5; j++) {
        concat += (j > i ? " " : "") + ocrWords[j].text.toLowerCase();
        if (concat.includes(lowerSearch)) {
          const matchedWords = ocrWords.slice(i, j + 1);
          const pageIndex = matchedWords[0].pageIndex;
          const x0 = Math.min(...matchedWords.map((w) => w.bbox.x0));
          const y0 = Math.min(...matchedWords.map((w) => w.bbox.y0));
          const x1 = Math.max(...matchedWords.map((w) => w.bbox.x1));
          const y1 = Math.max(...matchedWords.map((w) => w.bbox.y1));
          highlights.push({ pageIndex, bbox: { x0, y0, x1, y1 } });
          return highlights;
        }
      }
    }

    if (highlights.length === 0) {
      for (const word of ocrWords) {
        if (word.text.toLowerCase().includes(lowerSearch)) {
          highlights.push({ pageIndex: word.pageIndex, bbox: word.bbox });
          return highlights;
        }
      }
    }

    return highlights;
  }, [highlightText, ocrWords]);

  const ocrHighlights = getOcrHighlights();

  return (
    <div className="flex justify-center">
      <div className="bg-white shadow-lg rounded p-4 max-w-[900px] w-full">
        {ocrRunning && (
          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
            <Loader2 className="w-4 h-4 animate-spin" />
            Running OCR to extract text from image-based PDF...
          </div>
        )}

        <Document
          file={file ?? undefined}
          onLoadSuccess={({ numPages: n }) => {
            setNumPages(n);
            onLoadSuccess?.(n);
          }}
          loading={
            <div className="flex items-center justify-center py-10 text-gray-500">
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
              Loading PDF...
            </div>
          }
          error={
            <div className="text-center text-red-400 py-10">
              Failed to load PDF preview.
            </div>
          }
        >
          {Array.from(new Array(numPages), (_, index) => (
            <div key={`page_${index + 1}`} className="mb-4 last:mb-0 relative">
              <Page
                pageNumber={index + 1}
                scale={zoom / 100}
                renderTextLayer={true}
                renderAnnotationLayer={false}
                customTextRenderer={
                  highlightText
                    ? ({ str }) => {
                        const escaped = escapeRegex(highlightText);
                        const regex = new RegExp(`(${escaped})`, "gi");
                        return str.replace(
                          regex,
                          `<mark style="background-color: #fde047; padding: 0 2px; border-radius: 3px;">$1</mark>`
                        );
                      }
                    : undefined
                }
              />
              {/* OCR highlight overlays for image-based PDFs */}
              {hasTextLayer === false &&
                ocrHighlights
                  .filter((h) => h.pageIndex === index)
                  .map((h, hIdx) => {
                    const scale = (zoom / 100) / 2;
                    return (
                      <div
                        key={`ocr-hl-${index}-${hIdx}`}
                        className="ocr-highlight-active animate-pulse"
                        style={{
                          position: "absolute",
                          left: h.bbox.x0 * scale,
                          top: h.bbox.y0 * scale,
                          width: (h.bbox.x1 - h.bbox.x0) * scale,
                          height: (h.bbox.y1 - h.bbox.y0) * scale,
                          backgroundColor: "rgba(253, 224, 71, 0.5)",
                          border: "2px solid #f59e0b",
                          borderRadius: 4,
                          pointerEvents: "none",
                          zIndex: 20,
                        }}
                      />
                    );
                  })}
              <p className="text-xs text-gray-400 text-center mt-1">
                Page {index + 1} of {numPages}
              </p>
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}
