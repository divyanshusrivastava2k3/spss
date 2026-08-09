"use client";

import { SessionProvider } from "next-auth/react";
import { TranslationProvider } from "@/lib/translation-context";

export function Providers({ children, initialLanguage }: { children: React.ReactNode; initialLanguage: "en" | "hi" }) {
  return (
    <SessionProvider>
      <TranslationProvider initialLanguage={initialLanguage}>{children}</TranslationProvider>
    </SessionProvider>
  );
}