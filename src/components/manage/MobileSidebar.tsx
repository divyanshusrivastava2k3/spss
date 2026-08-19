"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Sidebar } from "./Sidebar";

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-xl bg-white shadow-sm border border-green-200 hover:bg-gray-50 transition mr-3"
        aria-label="Open sidebar"
      >
        <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && mounted && createPortal(
        <div className="md:hidden fixed inset-0 z-[100] flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-[280px] max-w-[80%] bg-white h-full shadow-2xl flex-col flex overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <Sidebar />
          </div>
          {/* Close button outside the sidebar */}
          <div className="relative flex-1 p-4 flex justify-end items-start" onClick={() => setIsOpen(false)}>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
