import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDate, formatDateTime, formatRelative, parseDate, isValidDate, getTodayISO, formatDateForInput } from './date-utils';

describe('date-utils', () => {
  beforeEach(() => {
    // Mock system time to a fixed date for reliable relative time testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatDate', () => {
    it('formats valid ISO string correctly in English', () => {
      expect(formatDate('2024-01-15T00:00:00Z', 'PPP', 'en')).toBe('January 15th, 2024');
    });
    
    it('returns "-" for invalid date string', () => {
      expect(formatDate('invalid-date', 'PPP', 'en')).toBe('-');
    });

    it('returns "-" for null/undefined', () => {
      expect(formatDate(null)).toBe('-');
      expect(formatDate(undefined)).toBe('-');
    });
  });

  describe('parseDate', () => {
    it('parses valid ISO string to Date object', () => {
      const date = parseDate('2024-01-15T00:00:00Z');
      expect(date).toBeInstanceOf(Date);
      expect(date?.toISOString()).toBe('2024-01-15T00:00:00.000Z');
    });

    it('returns null for invalid strings', () => {
      expect(parseDate('not-a-date')).toBeNull();
      expect(parseDate(null)).toBeNull();
    });
  });

  describe('isValidDate', () => {
    it('returns true for valid dates', () => {
      expect(isValidDate('2024-01-15')).toBe(true);
    });

    it('returns false for invalid dates', () => {
      expect(isValidDate('2024-13-45')).toBe(false);
      expect(isValidDate('random')).toBe(false);
    });
  });

  describe('formatDateForInput', () => {
    it('formats date correctly for HTML input type="date"', () => {
      expect(formatDateForInput('2024-01-15T14:30:00Z')).toBe('2024-01-15');
    });

    it('returns empty string for invalid inputs', () => {
      expect(formatDateForInput(null)).toBe('');
      expect(formatDateForInput('invalid')).toBe('');
    });
  });
});
