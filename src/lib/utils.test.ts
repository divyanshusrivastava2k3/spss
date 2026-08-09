import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('lib/utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional');
      expect(cn('base', false && 'conditional')).toBe('base');
    });

    it('should handle tailwind merge conflicts', () => {
      // tailwind-merge should resolve conflicting classes
      expect(cn('p-2 p-4')).toBe('p-4');
      expect(cn('text-red-500 text-blue-500')).toBe('text-blue-500');
    });

    it('should handle empty inputs', () => {
      expect(cn()).toBe('');
      expect(cn('', '', '')).toBe('');
    });

    it('should handle arrays and objects', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar');
      expect(cn({ foo: true, bar: false })).toBe('foo');
    });
  });
});