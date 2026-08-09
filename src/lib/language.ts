import { cookies } from "next/headers";
import type { Language } from "@/lib/translations";

/**
 * Read the selected language from the "language" cookie.
 * Works in Server Components / Route Handlers.
 * Falls back to "en".
 */
export async function getLanguage(): Promise<Language> {
  try {
    const cookieStore = await cookies();
    const lang = cookieStore.get("language")?.value;
    if (lang === "hi" || lang === "en") return lang;
    return "en";
  } catch {
    return "en";
  }
}

/**
 * Pick the translated string from a bilingual record.
 * Use in server components after calling getLanguage().
 */
export function pick(
  lang: Language,
  en: string | null | undefined,
  hi: string | null | undefined,
  fallback = ""
): string {
  if (lang === "hi" && hi) return hi;
  return en || fallback;
}

/**
 * Shorthand for server components: returns a "text picker" bound to a language.
 */
export function makePicker(lang: Language) {
  return (en: string | null | undefined, hi: string | null | undefined, fallback = "") =>
    pick(lang, en, hi, fallback);
}
