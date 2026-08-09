"use client";

import { useTranslation } from "@/lib/translation-context";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  const next = language === "en" ? "hi" : "en";

  const handleToggle = () => {
    // Set cookie FIRST for server-side rendering
    document.cookie = `language=${next}; path=/; max-age=31536000`;
    // Set localStorage for client-side
    localStorage.setItem("language", next);
    // Update state
    setLanguage(next);
    // Reload page to apply server-side translations
    window.location.reload();
  };

  return (
    <button
      onClick={handleToggle}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-sm transition-all duration-200 border border-green-200 shadow-sm hover:shadow-md hover:scale-105 bg-white"
      title={language === "en" ? "हिंदी में देखें" : "View in English"}
      aria-label={language === "en" ? "Switch to Hindi" : "Switch to English"}
    >
      <Globe className="w-4 h-4 text-green-700" />
      {language === "en" ? (
        <>
          <span className="text-green-800">EN</span>
          <span className="text-gray-300">|</span>
          <span className="text-green-700 font-bold">हिं</span>
        </>
      ) : (
        <>
          <span className="text-green-700 font-bold">हिं</span>
          <span className="text-gray-300">|</span>
          <span className="text-green-800">EN</span>
        </>
      )}
    </button>
  );
}