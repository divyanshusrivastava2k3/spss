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
const PageWrapper = forwardRef<HTMLDivElement, { pageNumber: number; width?: number; className?: string }>(
  ({ pageNumber, width, className, ...props }, ref) => {
    return (
      <div ref={ref} className={`bg-white shadow-sm overflow-hidden flex justify-center items-center ${className || ''}`} {...props}>
        <Page
          pageNumber={pageNumber}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          width={width}
          className="object-contain"
        />
      </div>
    );
  }
);
PageWrapper.displayName = "PageWrapper";

export function PdfFlipbook({ pdfUrl }: PdfFlipbookProps) {
  const [numPages, setNumPages] = useState<number>();
  const flipBookRef = useRef<any>(null);
  const FlipBook = HTMLFlipBook as any;

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
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
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
            <div className="shadow-2xl rounded-lg overflow-hidden border border-gray-200 bg-[#f8f5ee] p-4 md:p-6 pb-12 w-full max-w-lg mx-auto">
              <FlipBook
                width={400}
                height={566}
                size="stretch"
                minWidth={280}
                maxWidth={600}
                minHeight={400}
                maxHeight={850}
                maxShadowOpacity={0.3}
                showCover={true}
                mobileScrollSupport={true}
                className="flipbook-wrapper mx-auto drop-shadow-2xl"
                ref={flipBookRef}
              >
                {pages.map((page) => (
                  <PageWrapper key={page} pageNumber={page} width={400} className="border border-gray-300" />
                ))}
              </FlipBook>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="bg-white/90 backdrop-blur px-6 py-2 rounded-full shadow border border-gray-100 flex items-center gap-4 text-sm text-gray-600 font-medium">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
                    Swipe to flip
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
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
