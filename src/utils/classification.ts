import type { Classification } from '../types';

/**
 * Classify a package based on its star-to-download ratio and absolute thresholds.
 *
 * Thresholds:
 * - Niche: stars < 100 AND downloads < 10,000
 * - Hype: ratio < 10 (lots of stars, relatively few downloads)
 * - Hidden Infrastructure: ratio > 1000 (lots of downloads, relatively few stars)
 * - Healthy: 10 <= ratio <= 1000 (good balance)
 */
export function classify(
  ratio: number,
  githubStars: number,
  monthlyDownloads: number
): Classification {
  if (githubStars < 100 && monthlyDownloads < 10_000) {
    return 'niche';
  }
  if (ratio < 10) {
    return 'hype';
  }
  if (ratio > 1000) {
    return 'hidden-infrastructure';
  }
  return 'healthy';
}
