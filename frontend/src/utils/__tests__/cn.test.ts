import { describe, it, expect } from 'vitest';
import { cn } from '../cn';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('should handle conditional classes', () => {
    expect(cn('base-class', true && 'truthy-class', false && 'falsy-class')).toBe('base-class truthy-class');
  });

  it('should resolve tailwind conflicts', () => {
    // twMerge will take the last conflicting tailwind class
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});
