"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

// Required for react-pdf v10+
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure pdfjs worker (client-side only)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  file: File | null;
  zoom: number;
  highlightText?: string;
  onLoadSuccess?: (numPages: number) => void;
}

export default function PdfViewer({ file, zoom, highlightText = "", onLoadSuccess }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);

  useEffect(() => {
    if (!highlightText) return;

    const container = document.getElementById("document-scroll-container");
    if (!container) return;

    const normalizeText = (str: string) =>
      str.toLowerCase().replace(/\s+/g, " ").replace(/[^\w\s]/g, "").trim();

    const highlightStyle = "background-color: #fde047; padding: 0 2px; border-radius: 4px; position: relative; z-index: 10;";

    const clearExisting = () => {
      container.querySelectorAll(".auto-highlight").forEach((el) => {
        (el as HTMLElement).style.cssText = (el as HTMLElement).style.cssText.replace(highlightStyle, "");
        el.classList.remove("auto-highlight", "animate-pulse");
      });
    };

    const applyHighlight = (el: HTMLElement) => {
      el.classList.add("auto-highlight");
      el.style.cssText += highlightStyle;
    };

    const lowerSearch = highlightText.toLowerCase().trim();
    const normalizedSearch = normalizeText(highlightText);
    const searchWords = normalizedSearch.split(" ").filter((w) => w.length > 1);

    if (!lowerSearch) return;

    let timeoutId: number | undefined;

    const scrollAndPulse = (el: HTMLElement) => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("animate-pulse");
      window.setTimeout(() => el.classList.remove("animate-pulse"), 1500);
    };

    const tryHighlight = (attempt: number) => {
      // Collect ALL spans (including parents) for exact match
      const allSpans = Array.from(
        container.querySelectorAll(".react-pdf__Document .textLayer span")
      ) as HTMLSpanElement[];

      console.log(`[PdfHighlight] attempt=${attempt}, totalSpans=${allSpans.length}, search="${lowerSearch}"`);

      if (allSpans.length === 0) {
        if (attempt < 20) timeoutId = window.setTimeout(() => tryHighlight(attempt + 1), 300);
        return;
      }

      clearExisting();

      // --- Strategy 1: Exact match in ANY span (including parent spans) ---
      // Prefer the smallest (most specific) span that contains the search text
      let bestExact: HTMLSpanElement | null = null;
      let bestExactLen = Infinity;

      for (const el of allSpans) {
        const text = (el.textContent || "").toLowerCase().trim();
        if (text.includes(lowerSearch)) {
          if (text.length < bestExactLen) {
            bestExact = el;
            bestExactLen = text.length;
          }
        }
      }

      if (bestExact) {
        console.log(`[PdfHighlight] Exact match in span: "${bestExact.textContent?.trim()}" (len=${bestExactLen})`);
        applyHighlight(bestExact);
        scrollAndPulse(bestExact);
        return;
      }

      // For strategies 2 & 3, use only leaf spans (no child spans)
      const leafSpans = allSpans.filter((s) => s.querySelector("span") === null);
      const spanTexts = leafSpans.map((el) => ({
        el,
        raw: (el.textContent || "").trim(),
        lower: (el.textContent || "").toLowerCase().trim(),
        norm: normalizeText(el.textContent || ""),
      }));

      console.log(`[PdfHighlight] leafSpans=${leafSpans.length}, trying multi-span strategies`);

      // --- Strategy 2: Exact match across adjacent leaf spans ---
      for (let i = 0; i < spanTexts.length; i++) {
        let concat = "";
        for (let j = i; j < spanTexts.length && j < i + 10; j++) {
          concat += (j > i ? " " : "") + spanTexts[j].lower;
          if (concat.includes(lowerSearch)) {
            console.log(`[PdfHighlight] Exact multi-span match: spans ${i}-${j}`);
            for (let k = i; k <= j; k++) {
              applyHighlight(spanTexts[k].el);
            }
            scrollAndPulse(spanTexts[i].el);
            return;
          }
        }
      }

      // --- Strategy 3: Word-based fuzzy match (tight window) ---
      if (searchWords.length > 0) {
        let best: { start: number; end: number; score: number; matched: number } | null = null;

        for (let i = 0; i < spanTexts.length; i++) {
          if (!spanTexts[i].norm) continue;

          const matchedSet = new Set<string>();
          for (let j = i; j < spanTexts.length && j < i + searchWords.length + 3; j++) {
            const norm = spanTexts[j].norm;
            if (norm) {
              for (const w of searchWords) {
                if (norm.includes(w)) matchedSet.add(w);
              }
            }

            const matched = matchedSet.size;
            if (matched === 0) continue;

            const ratio = matched / searchWords.length;
            const windowLen = j - i + 1;
            const score = Math.floor(ratio * 100) - windowLen;

            if (!best || score > best.score) {
              best = { start: i, end: j, score, matched };
            }

            if (matched === searchWords.length) break;
          }

          if (best && best.matched === searchWords.length) break;
        }

        if (best && best.score > 30) {
          console.log(`[PdfHighlight] Fuzzy match: spans ${best.start}-${best.end}, score=${best.score}, window=${best.end - best.start + 1}`);
          for (let k = best.start; k <= best.end; k++) {
            applyHighlight(spanTexts[k].el);
          }
          scrollAndPulse(spanTexts[best.start].el);
          return;
        }
      }

      console.log(`[PdfHighlight] No match found for "${lowerSearch}"`);
    };

    tryHighlight(0);
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [highlightText, numPages]);

  return (
    <div className="flex justify-center">
      <div className="bg-white shadow-lg rounded p-4 max-w-[900px] w-full">
        <Document
          file={file ?? undefined}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            onLoadSuccess?.(numPages);
          }}
          loading={
            <div className="flex items-center justify-center py-10 text-foreground/70">
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
              <span>Loading PDF...</span>
            </div>
          }
          error={
            <div className="text-center text-red-400 py-10">
              Failed to load PDF preview.
            </div>
          }
        >
          {numPages &&
            Array.from({ length: numPages }, (_, index) => (
              <div key={`page_${index + 1}`} className="mb-4 last:mb-0">
                <Page pageNumber={index + 1} scale={zoom / 100} />
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
