import { describe, it, expect } from 'vitest';
import { classify } from '../src/utils/classification';

describe('classify', () => {
  it('returns "niche" when stars < 100 and downloads < 10,000', () => {
    expect(classify(5, 50, 5000)).toBe('niche');
    expect(classify(0, 0, 0)).toBe('niche');
    expect(classify(50, 10, 100)).toBe('niche');
  });

  it('returns "hype" when ratio < 10 and not niche', () => {
    expect(classify(5, 5000, 25000)).toBe('hype');
    expect(classify(0.5, 10000, 5000)).toBe('hype');
    expect(classify(9.9, 1000, 9900)).toBe('hype');
  });

  it('returns "hidden-infrastructure" when ratio > 1000', () => {
    expect(classify(2500, 100, 250000)).toBe('hidden-infrastructure');
    expect(classify(1001, 50, 50050)).toBe('hidden-infrastructure');
    expect(classify(Infinity, 0, 5000000)).toBe('hidden-infrastructure');
  });

  it('returns "healthy" when ratio is between 10 and 1000 inclusive', () => {
    expect(classify(100, 1000, 100000)).toBe('healthy');
    expect(classify(500, 100, 50000)).toBe('healthy');
    expect(classify(108.7, 230000, 25000000)).toBe('healthy');
  });

  // Boundary: ratio exactly 10 → healthy (not hype)
  it('returns "healthy" at ratio boundary of exactly 10', () => {
    expect(classify(10, 1000, 10000)).toBe('healthy');
    // Not niche because downloads >= 10000
    expect(classify(10, 10000, 100000)).toBe('healthy');
  });

  // Boundary: ratio exactly 1000 → healthy (not hidden-infrastructure)
  it('returns "healthy" at ratio boundary of exactly 1000', () => {
    expect(classify(1000, 1000, 1000000)).toBe('healthy');
  });

  // Boundary: niche threshold — exactly 100 stars / 10000 downloads
  it('at niche boundary: exactly 100 stars is not niche (stars >= 100)', () => {
    // 100 stars, 5000 downloads → ratio 50, stars >= 100 so NOT niche
    expect(classify(50, 100, 5000)).toBe('healthy');
  });

  it('at niche boundary: exactly 10000 downloads is not niche (downloads >= 10000)', () => {
    // 50 stars, 10000 downloads → ratio 200, downloads >= 10000 so NOT niche
    expect(classify(200, 50, 10000)).toBe('healthy');
  });

  it('prioritizes niche check over ratio-based classification', () => {
    // ratio is 0.5 (would be "hype") but niche conditions met
    expect(classify(0.5, 50, 5000)).toBe('niche');
    // ratio is 500 (would be "healthy") but niche conditions met
    expect(classify(500, 10, 5000)).toBe('niche');
  });

  it('handles Infinity ratio from zero stars with positive downloads', () => {
    // 0 stars, positive downloads → Infinity ratio → hidden-infrastructure
    expect(classify(Infinity, 0, 5000000)).toBe('hidden-infrastructure');
  });

  it('handles zero ratio from zero downloads with positive stars', () => {
    // Positive stars, 0 downloads → ratio 0 → hype (ratio < 10)
    expect(classify(0, 5000, 0)).toBe('hype');
  });
});
