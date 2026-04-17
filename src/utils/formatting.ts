/**
 * Format a number with locale-appropriate commas.
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format a ratio to one decimal place.
 * Displays ∞ for Infinity values.
 */
export function formatRatio(ratio: number): string {
  if (!Number.isFinite(ratio)) {
    return '∞';
  }
  return ratio.toFixed(1);
}
