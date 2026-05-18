import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

import { fetchPackageData } from '../src/utils/api';

describe('fetchPackageData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches npm data directly for npm ecosystem', async () => {
    // Mock npm downloads endpoint
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ downloads: 25000000, package: 'react' }),
    });
    // Mock npm registry endpoint (for GitHub URL)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ repository: { url: 'git+https://github.com/facebook/react.git' } }),
    });
    // Mock GitHub API
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ stargazers_count: 230000 }),
    });

    const data = await fetchPackageData('react', 'npm');
    expect(data.packageName).toBe('react');
    expect(data.ecosystem).toBe('npm');
    expect(data.monthlyDownloads).toBe(25000000);
    expect(data.githubStars).toBe(230000);
  });

  it('falls back to PyPI when npm returns 404', async () => {
    // npm downloads 404
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });
    // PyPI succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        info: {
          github_url: 'https://github.com/encode/django-rest-framework',
          project_urls: {},
          home_page: '',
        },
        releases: { '3.14.0': [] },
      }),
    });
    // PyPI stats
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { last_month: 5000000 } }),
    });
    // GitHub API
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ stargazers_count: 28000 }),
    });

    const data = await fetchPackageData('django-rest-framework', 'npm', { allowFallback: true });
    expect(data.packageName).toBe('django-rest-framework');
    expect(data.ecosystem).toBe('pypi');
    expect(data.monthlyDownloads).toBe(5000000);
  });

  it('throws original error when both ecosystems fail', async () => {
    // npm 404
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });
    // PyPI 404
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(fetchPackageData('nonexistent-pkg-xyz', 'npm', { allowFallback: true }))
      .rejects.toThrow('Package not found');
  });

  it('does not fall back when allowFallback is false', async () => {
    // npm 404
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(fetchPackageData('some-pkg', 'npm', { allowFallback: false }))
      .rejects.toThrow('Package not found');

    // Should only have called npm (1 fetch call), not PyPI
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
