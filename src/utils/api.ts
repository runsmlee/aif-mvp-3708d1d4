import type { Ecosystem, PackageData } from '../types';

interface NpmDownloadResponse {
  downloads: number;
  package: string;
}

interface NpmPackageInfo {
  repository?: {
    url?: string;
  };
}

interface PyPIPackageInfo {
  info: {
    github_url?: string;
    project_urls?: Record<string, string>;
    home_page?: string;
  };
  releases: Record<string, unknown[]>;
}

/**
 * Extract GitHub owner/repo from various URL formats.
 */
function extractGitHubRepo(url: string): { owner: string; repo: string } | null {
  // Handle github.com/owner/repo format
  const match = url.match(/github\.com[/:]([^/]+)\/([^/.]+)/);
  if (match) {
    return { owner: match[1], repo: match[2] };
  }
  return null;
}

/**
 * Fetch GitHub stars for a repository.
 */
async function fetchGitHubStars(owner: string, repo: string): Promise<number> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    if (!response.ok) {
      return 0;
    }
    const data = await response.json();
    return data.stargazers_count ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Fetch npm package data (downloads and GitHub repo info).
 */
async function fetchNpmData(packageName: string): Promise<PackageData> {
  // Fetch downloads
  const downloadsRes = await fetch(
    `https://api.npmjs.org/downloads/point/last-month/${encodeURIComponent(packageName)}`
  );
  if (!downloadsRes.ok) {
    throw new Error('Package not found');
  }
  const downloadsData: NpmDownloadResponse = await downloadsRes.json();

  // Fetch package metadata for GitHub URL
  let githubStars = 0;
  try {
    const metaRes = await fetch(
      `https://registry.npmjs.org/${encodeURIComponent(packageName)}`
    );
    if (metaRes.ok) {
      const metaData: NpmPackageInfo = await metaRes.json();
      const repoUrl = metaData.repository?.url ?? '';
      const repo = extractGitHubRepo(repoUrl);
      if (repo) {
        githubStars = await fetchGitHubStars(repo.owner, repo.repo);
      }
    }
  } catch {
    // Non-critical: continue with 0 stars
  }

  return {
    packageName,
    ecosystem: 'npm',
    githubStars,
    monthlyDownloads: downloadsData.downloads,
  };
}

/**
 * Fetch PyPI package data (downloads and GitHub repo info).
 */
async function fetchPyPIData(packageName: string): Promise<PackageData> {
  const res = await fetch(`https://pypi.org/pypi/${encodeURIComponent(packageName)}/json`);
  if (!res.ok) {
    throw new Error('Package not found');
  }
  const data: PyPIPackageInfo = await res.json();

  // Calculate total downloads from recent releases
  let monthlyDownloads = 0;
  try {
    const statsRes = await fetch(
      `https://pypistats.org/api/packages/${encodeURIComponent(packageName)}/recent`
    );
    if (statsRes.ok) {
      const statsData = await statsRes.json();
      monthlyDownloads = statsData.data?.last_month ?? 0;
    }
  } catch {
    // Fallback: estimate from release count
    const releases = Object.values(data.releases).flat();
    monthlyDownloads = releases.length * 1000;
  }

  // Extract GitHub URL
  let githubStars = 0;
  const allUrls = [
    data.info.github_url,
    data.info.home_page,
    ...(data.info.project_urls ? Object.values(data.info.project_urls) : []),
  ];

  for (const url of allUrls) {
    if (!url) continue;
    const repo = extractGitHubRepo(url);
    if (repo) {
      githubStars = await fetchGitHubStars(repo.owner, repo.repo);
      break;
    }
  }

  return {
    packageName,
    ecosystem: 'pypi',
    githubStars,
    monthlyDownloads,
  };
}

/**
 * Fetch package data from the appropriate registry.
 *
 * If the primary ecosystem returns "Package not found" and allowFallback is true,
 * automatically tries the other ecosystem (npm ↔ PyPI).
 */
export async function fetchPackageData(
  packageName: string,
  ecosystem: Ecosystem,
  allowFallback = true
): Promise<PackageData> {
  const fetcher = ecosystem === 'pypi' ? fetchPyPIData : fetchNpmData;

  try {
    return await fetcher(packageName);
  } catch (err) {
    if (!allowFallback) {
      throw err;
    }

    const message = err instanceof Error ? err.message : '';
    if (message === 'Package not found') {
      // Try the other ecosystem
      const fallbackEcosystem: Ecosystem = ecosystem === 'npm' ? 'pypi' : 'npm';
      const fallbackFetcher = fallbackEcosystem === 'pypi' ? fetchPyPIData : fetchNpmData;
      try {
        return await fallbackFetcher(packageName);
      } catch {
        // Throw the original error
        throw err;
      }
    }

    throw err;
  }
}
