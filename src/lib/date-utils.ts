import { format, parseISO, isValid, formatDistanceToNow, Locale } from 'date-fns';
import { enUS, hi } from 'date-fns/locale';

/**
 * Supported locales for date formatting
 */
export type SupportedLocale = 'en' | 'hi';

/**
 * Get date-fns locale from supported locale
 */
function getLocale(locale: SupportedLocale): Locale {
  switch (locale) {
    case 'hi':
      return hi;
    case 'en':
    default:
      return enUS;
  }
}

/**
 * Format a date string to a readable format
 * @param dateString - ISO date string or Date object
 * @param pattern - date-fns format pattern (default: 'PPP' - e.g., "Jan 15, 2024")
 * @param locale - Language locale (default: 'en')
 * @returns Formatted date string or '-' if invalid
 */
export function formatDate(
  dateString: string | Date | null | undefined,
  pattern: string = 'PPP',
  locale: SupportedLocale = 'en'
): string {
  if (!dateString) return '-';

  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return '-';
    return format(date, pattern, { locale: getLocale(locale) });
  } catch {
    return '-';
  }
}

/**
 * Format a date with time
 * @param dateString - ISO date string or Date object
 * @param locale - Language locale (default: 'en')
 * @returns Formatted date-time string (e.g., "Jan 15, 2024, 2:30 PM")
 */
export function formatDateTime(
  dateString: string | Date | null | undefined,
  locale: SupportedLocale = 'en'
): string {
  return formatDate(dateString, 'PPpp', locale);
}

/**
 * Format a date relative to now (e.g., "2 days ago", "in 3 hours")
 * @param dateString - ISO date string or Date object
 * @param locale - Language locale (default: 'en')
 * @returns Relative time string or '-' if invalid
 */
export function formatRelative(
  dateString: string | Date | null | undefined,
  locale: SupportedLocale = 'en'
): string {
  if (!dateString) return '-';

  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return '-';
    return formatDistanceToNow(date, { addSuffix: true, locale: getLocale(locale) });
  } catch {
    return '-';
  }
}

/**
 * Parse ISO date string to Date object
 * @param dateString - ISO date string
 * @returns Date object or null if invalid
 */
export function parseDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  try {
    const date = parseISO(dateString);
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
}

/**
 * Check if a date string is valid
 * @param dateString - ISO date string
 * @returns boolean
 */
export function isValidDate(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  try {
    const date = parseISO(dateString);
    return isValid(date);
  } catch {
    return false;
  }
}

/**
 * Get current date as ISO string (for form defaults)
 * @returns Current date in YYYY-MM-DD format
 */
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Format date for HTML input[type="date"] (YYYY-MM-DD)
 * @param dateString - ISO date string or Date object
 * @returns Date string in YYYY-MM-DD format or empty string
 */
export function formatDateForInput(dateString: string | Date | null | undefined): string {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return '';
    return format(date, 'yyyy-MM-dd');
  } catch {
    return '';
  }
}

/**
 * Get date range presets for filters
 */
export interface DateRangePreset {
  label: string;
  labelHi: string;
  start: Date;
  end: Date;
}

export function getDateRangePresets(locale: SupportedLocale = 'en'): DateRangePreset[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d;
  };

  const getStartOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
  const getStartOfYear = (date: Date) => new Date(date.getFullYear(), 0, 1);

  const t = locale === 'hi' ? 'labelHi' : 'label';

  return [
    {
      label: 'Today',
      labelHi: 'आज',
      start: today,
      end: now,
    },
    {
      label: 'This Week',
      labelHi: 'इस सप्ताह',
      start: getStartOfWeek(today),
      end: now,
    },
    {
      label: 'This Month',
      labelHi: 'इस महीने',
      start: getStartOfMonth(today),
      end: now,
    },
    {
      label: 'This Year',
      labelHi: 'इस वर्ष',
      start: getStartOfYear(today),
      end: now,
    },
    {
      label: 'Last 7 Days',
      labelHi: 'पिछले 7 दिन',
      start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
      end: now,
    },
    {
      label: 'Last 30 Days',
      labelHi: 'पिछले 30 दिन',
      start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
      end: now,
    },
  ].map(preset => ({
    ...preset,
    [t]: preset[t],
  }));
}