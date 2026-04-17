import { describe, it, expect } from 'vitest';
import { formatNumber, formatRatio } from '../src/utils/formatting';

describe('formatNumber', () => {
  it('formats numbers with locale-appropriate commas', () => {
    expect(formatNumber(230000)).toBe('230,000');
    expect(formatNumber(25000000)).toBe('25,000,000');
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(1)).toBe('1');
  });
});

describe('formatRatio', () => {
  it('formats finite ratios to one decimal place', () => {
    expect(formatRatio(108.7)).toBe('108.7');
    expect(formatRatio(1000)).toBe('1000.0');
    expect(formatRatio(0)).toBe('0.0');
  });

  it('displays ∞ symbol for Infinity values', () => {
    expect(formatRatio(Infinity)).toBe('∞');
  });
});
