"use client";

import { useState, useRef, forwardRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfFlipbookProps {
  pdfUrl: string;
}

// Wrapper for pages because HTMLFlipBook requires standard DOM elements or forwarded refs
const PageWrapper = forwardRef<HTMLDivElement, { pageNumber: number; className?: string }>(
  ({ pageNumber, className, ...props }, ref) => {
    return (
      <div ref={ref} className={`bg-white flex justify-center items-center overflow-hidden ${className || ''}`} {...props}>
        <Page
          pageNumber={pageNumber}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          width={800}
          className="w-full h-full flex justify-center items-center [&>.react-pdf\_\_Page\_\_canvas]:!w-full [&>.react-pdf\_\_Page\_\_canvas]:!h-full [&>.react-pdf\_\_Page\_\_canvas]:!object-contain"
        />
      </div>
    );
  }
);
PageWrapper.displayName = "PageWrapper";

export function PdfFlipbook({ pdfUrl }: PdfFlipbookProps) {
  const [numPages, setNumPages] = useState<number>();
  const [bookSize, setBookSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const flipBookRef = useRef<any>(null);
  const FlipBook = HTMLFlipBook as any;

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const cw = entry.contentRect.width;
        // Limit height to make it fit on screens without extreme scrolling
        const maxH = window.innerWidth > 1024 ? 900 : window.innerWidth > 768 ? 700 : 500;
        let w = cw;
        let h = w * 1.414;
        if (h > maxH) {
          h = maxH;
          w = h / 1.414;
        }
        setBookSize({ width: w, height: h });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const pages = numPages ? Array.from(new Array(numPages), (el, index) => index + 1) : [];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-full mx-auto relative group">
      <div className="w-full relative z-10 flex justify-center items-center">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col items-center justify-center h-80 space-y-4">
              <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[var(--primary)] font-medium animate-pulse">Loading interactive flipbook...</p>
            </div>
          }
          error={
            <div className="text-red-500 font-medium bg-red-50 p-4 rounded-xl border border-red-100">
              Failed to load PDF. Please check the URL.
            </div>
          }
        >
          {numPages && (
            <div className="relative pb-16 w-full mx-auto flex flex-col items-center" ref={containerRef}>
              
              <div className="w-full relative drop-shadow-2xl flex justify-center items-center" style={{ height: bookSize.height > 0 ? bookSize.height : 500 }}>
                {bookSize.width > 0 && (
                  <FlipBook
                    width={bookSize.width}
                    height={bookSize.height}
                    size="fixed"
                    usePortrait={true}
                    maxShadowOpacity={0.3}
                    showCover={true}
                    mobileScrollSupport={true}
                    className="flipbook-wrapper"
                    ref={flipBookRef}
                  >
                    {pages.map((page) => (
                      <PageWrapper key={page} pageNumber={page} className="border border-gray-200" />
                    ))}
                  </FlipBook>
                )}
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 flex justify-center z-20">
                <div className="bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-full shadow-lg border border-gray-200 flex items-center gap-4 text-sm text-gray-700 font-medium">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
                    Swipe to flip
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                  <span>{numPages} Pages</span>
                </div>
              </div>

            </div>
          )}
        </Document>
      </div>
    </div>
  );
}
