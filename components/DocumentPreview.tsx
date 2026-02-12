"use client";

import { useState, useEffect, useRef } from "react";
import { FileText, Loader2, ZoomIn, ZoomOut } from "lucide-react";
import mammoth from "mammoth";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("./PdfViewver"), { ssr: false });

interface DocumentPreviewProps {
  file: File | null;
  highlightText?: string;
}

export default function DocumentPreview({ file, highlightText = "" }: DocumentPreviewProps) {
  const [htmlContent, setHtmlContent] = useState("");
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdf, setIsPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const convertDocument = async () => {
  //     if (!file) {
  //       setHtmlContent("");
  //       return;
  //     }

  //     setIsLoading(true);
  //     setError(null);

  //     try {
  //       const arrayBuffer = await file.arrayBuffer();
  //       const result = await mammoth.convertToHtml({ arrayBuffer });
  //       setHtmlContent(result.value);
  //     } catch (err) {
  //       console.error("Failed to convert document:", err);
  //       setError("Failed to load document. Please try again.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   convertDocument();
  // }, [file]);

    useEffect(() => {
    // Reset state when file changes
    setIsPdf(false);
    setHtmlContent("");
    setError(null);
    setNumPages(null);

    const convertDocument = async () => {
      if (!file) {
        setHtmlContent("");
        return;
      }

      setIsLoading(true);
      try {
        const fileName = file.name.toLowerCase();

        // Handle PDF: use react-pdf to render without conversion
        if (file.type === "application/pdf" || fileName.endsWith(".pdf")) {
          setIsPdf(true);
          setHtmlContent("");
          setIsLoading(false);
          return;
        }

        // Handle legacy .doc: upload is allowed, but preview is not supported client-side
        if (fileName.endsWith(".doc")) {
          setHtmlContent("");
          setError("Preview for .doc files is not supported, but your file was uploaded successfully.");
          return;
        }

        // Default: treat as .docx and convert via mammoth
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setHtmlContent(result.value);
      } catch (err) {
        console.error("Failed to convert document:", err);
        setError("Failed to load document. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    convertDocument();
  }, [file]);
  
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(50, prev - 25));
  };

  // Handle text highlighting and scrolling with fuzzy search
  useEffect(() => {
    if (!highlightText || !contentRef.current) return;

    const container = contentRef.current;
    
    // Remove previous highlights
    const existingHighlights = container.querySelectorAll('.auto-highlight');
    existingHighlights.forEach(el => {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent || ''), el);
        parent.normalize();
      }
    });

    // Normalize text for better matching
    const normalizeText = (str: string) => {
      return str
        .toLowerCase()
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .trim();
    };

    // Split search text into words for partial matching
    const searchWords = normalizeText(highlightText).split(' ').filter(w => w.length > 2);
    
    // Find and highlight the text
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    );

    const textNodes: Text[] = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    let firstMatch: HTMLElement | null = null;
    const matches: Array<{ node: Text; start: number; length: number; score: number }> = [];

    // First pass: collect all potential matches with scores
    textNodes.forEach((textNode) => {
      const text = textNode.textContent || '';
      const normalizedText = normalizeText(text);
      const lowerText = text.toLowerCase();
      const lowerSearch = highlightText.toLowerCase();
      
      // Strategy 1: Exact match (highest priority)
      if (lowerText.includes(lowerSearch)) {
        const index = lowerText.indexOf(lowerSearch);
        matches.push({
          node: textNode,
          start: index,
          length: highlightText.length,
          score: 100
        });
        return;
      }

      // Strategy 2: Normalized match (remove extra spaces and punctuation)
      const normalizedSearch = normalizeText(highlightText);
      if (normalizedText.includes(normalizedSearch)) {
        // Find approximate position in original text
        const words = text.toLowerCase().split(/\s+/);
        const searchWordsLower = highlightText.toLowerCase().split(/\s+/);
        
        for (let i = 0; i <= words.length - searchWordsLower.length; i++) {
          const segment = words.slice(i, i + searchWordsLower.length).join(' ');
          if (normalizeText(segment) === normalizedSearch) {
            const startPos = text.toLowerCase().indexOf(words[i]);
            const endWord = words[i + searchWordsLower.length - 1];
            const endPos = text.toLowerCase().lastIndexOf(endWord) + endWord.length;
            
            matches.push({
              node: textNode,
              start: startPos,
              length: endPos - startPos,
              score: 90
            });
            break;
          }
        }
        return;
      }

      // Strategy 3: Partial word match (at least 70% of words present)
      if (searchWords.length > 0) {
        const matchedWords = searchWords.filter(word => normalizedText.includes(word));
        const matchRatio = matchedWords.length / searchWords.length;
        
        if (matchRatio >= 0.7) {
          // Find the span containing most matched words
          const words = text.split(/\s+/);
          let bestStart = 0;
          let bestEnd = 0;
          let bestScore = 0;

          for (let i = 0; i < words.length; i++) {
            for (let j = i + 1; j <= words.length; j++) {
              const segment = words.slice(i, j).join(' ');
              const segmentNorm = normalizeText(segment);
              const segmentMatches = searchWords.filter(w => segmentNorm.includes(w));
              const score = segmentMatches.length;
              
              if (score > bestScore) {
                bestScore = score;
                bestStart = i;
                bestEnd = j;
              }
            }
          }

          if (bestScore > 0) {
            const startText = words.slice(0, bestStart).join(' ');
            const matchText = words.slice(bestStart, bestEnd).join(' ');
            const startPos = startText.length + (startText.length > 0 ? 1 : 0);
            
            matches.push({
              node: textNode,
              start: startPos,
              length: matchText.length,
              score: matchRatio * 80
            });
          }
        }
      }
    });

    // Sort by score and highlight
    matches.sort((a, b) => b.score - a.score);

    matches.forEach((match, index) => {
      const { node: textNode, start, length } = match;
      const text = textNode.textContent || '';
      
      const before = text.substring(0, start);
      const matchText = text.substring(start, start + length);
      const after = text.substring(start + length);

      const fragment = document.createDocumentFragment();
      
      if (before) fragment.appendChild(document.createTextNode(before));
      
      const mark = document.createElement('mark');
      mark.className = `auto-highlight bg-yellow-300 px-1 rounded transition-all duration-300 ${
        match.score < 100 ? 'opacity-80' : ''
      }`;
      mark.textContent = matchText;
      fragment.appendChild(mark);
      
      if (index === 0) firstMatch = mark;
      
      if (after) fragment.appendChild(document.createTextNode(after));

      textNode.parentNode?.replaceChild(fragment, textNode);
    });

    // Scroll to first match
    if (firstMatch) {
      setTimeout(() => {
        if (firstMatch) {
          firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add pulse animation
          firstMatch.classList.add('animate-pulse');
          setTimeout(() => {
            if (firstMatch) {
              firstMatch.classList.remove('animate-pulse');
            }
          }, 1500);
        }
      }, 100);
    }
  }, [highlightText, htmlContent]);

  if (!file) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center text-gray-400">
          <FileText className="w-16 h-16 mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-lg font-medium">No Document Uploaded</p>
          <p className="text-sm mt-2">Upload a .docx file to preview</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-600" />
          <p className="text-gray-600">Converting document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Zoom Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
        <h3 className="text-sm font-medium text-gray-700">Document Preview</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[50px] text-center">
            {zoom}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
        </div>
      </div>

      {/* Document Content */}
      <div className="flex-1 overflow-auto p-6" id="document-scroll-container">
        {isPdf ?
          (<PdfViewer file={file} zoom={zoom} highlightText={highlightText} onLoadSuccess={setNumPages} />)
          :
          <div
            className="mx-auto bg-white shadow-lg transition-all duration-200"
            style={{
              width: `${zoom}%`,
              maxWidth: "850px",
              minWidth: "400px",
            }}
          >
            <div
              ref={contentRef}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              className="prose prose-sm max-w-none p-8 
              prose-headings:text-gray-900 prose-headings:font-bold
              prose-p:text-gray-900 prose-p:leading-relaxed
              prose-strong:text-gray-900 prose-strong:font-bold
              prose-ul:list-disc prose-ol:list-decimal
              prose-li:text-gray-900
              **:text-gray-900"
            />
          </div>
        }
      </div>
    </div>
  );
}
