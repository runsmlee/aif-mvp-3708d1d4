/**
 * Format a number with locale-appropriate commas.
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format a ratio to one decimal place.
 */
export function formatRatio(ratio: number): string {
  return ratio.toFixed(1);
}
