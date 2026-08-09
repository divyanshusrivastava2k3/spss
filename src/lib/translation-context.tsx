"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Language, getTranslation } from "@/lib/translations";

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

interface TranslationProviderProps {
  children: ReactNode;
  initialLanguage?: Language;
}

export function TranslationProvider({ children, initialLanguage = "en" }: TranslationProviderProps) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only read from localStorage/cookie if we didn't get a valid language from server
    // The server already reads the cookie and passes it via initialLanguage
    // This effect should only sync localStorage to match the server language
    const savedLang = localStorage.getItem("language") as Language | null;
    const cookieMatch = document.cookie.match(/language=([^;]+)/);
    const cookieLang = cookieMatch?.[1] as Language | undefined;

    // If localStorage has a different valid language than server, sync it
    // But prefer cookie (which server also reads) over localStorage
    if (cookieLang && (cookieLang === "hi" || cookieLang === "en")) {
      if (cookieLang !== language) {
        setLanguage(cookieLang);
      }
      localStorage.setItem("language", cookieLang);
    } else if (savedLang && (savedLang === "en" || savedLang === "hi") && savedLang !== language) {
      // Fallback to localStorage only if no cookie
      setLanguage(savedLang);
    }
  }, [language, initialLanguage]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
    // Also set cookie for SSR with secure flags
    document.cookie = `language=${newLang}; path=/; max-age=31536000; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
    // Reload page to apply server-side translations
    window.location.reload();
  };

  const t = (key: string) => {
    // Always return a translation, never the raw key.
    // On first render (before hydration) use initialLanguage from server.
    return getTranslation(key, mounted ? language : initialLanguage);
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage: handleLanguageChange, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}