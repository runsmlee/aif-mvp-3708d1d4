import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePackageAnalysis } from '../src/hooks/usePackageAnalysis';

// Mock the API module
vi.mock('../src/utils/api', () => ({
  fetchPackageData: vi.fn(),
}));

// Import the mocked module
import { fetchPackageData } from '../src/utils/api';

const mockedFetchPackageData = vi.mocked(fetchPackageData);

describe('usePackageAnalysis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns idle state initially', () => {
    const { result } = renderHook(() => usePackageAnalysis());
    expect(result.current.state.status).toBe('idle');
    expect(result.current.search).toBeDefined();
  });

  it('returns loading state after search is called', async () => {
    mockedFetchPackageData.mockImplementation(
      () => new Promise(() => {}) // never resolves
    );

    const { result } = renderHook(() => usePackageAnalysis());

    act(() => {
      result.current.search('react');
    });

    expect(result.current.state.status).toBe('loading');
  });

  it('returns result with stars, downloads, ratio, and classification on success', async () => {
    mockedFetchPackageData.mockResolvedValue({
      packageName: 'react',
      ecosystem: 'npm',
      githubStars: 230000,
      monthlyDownloads: 25000000,
    });

    const { result } = renderHook(() => usePackageAnalysis());

    await act(async () => {
      await result.current.search('react');
    });

    expect(result.current.state.status).toBe('success');
    if (result.current.state.status === 'success') {
      expect(result.current.state.data.githubStars).toBe(230000);
      expect(result.current.state.data.monthlyDownloads).toBe(25000000);
      expect(result.current.state.data.ratio).toBeCloseTo(108.7, 0);
      expect(result.current.state.data.classification).toBe('healthy');
    }
  });

  it('returns error state when API request fails', async () => {
    mockedFetchPackageData.mockRejectedValue(new Error('Package not found'));

    const { result } = renderHook(() => usePackageAnalysis());

    await act(async () => {
      await result.current.search('nonexistent-package-xyz-123');
    });

    expect(result.current.state.status).toBe('error');
  });

  it('correctly calculates ratio as monthly_downloads / github_stars', async () => {
    mockedFetchPackageData.mockResolvedValue({
      packageName: 'lodash',
      ecosystem: 'npm',
      githubStars: 58000,
      monthlyDownloads: 58000000,
    });

    const { result } = renderHook(() => usePackageAnalysis());

    await act(async () => {
      await result.current.search('lodash');
    });

    expect(result.current.state.status).toBe('success');
    if (result.current.state.status === 'success') {
      // 58,000,000 / 58,000 = 1000
      expect(result.current.state.data.ratio).toBe(1000);
    }
  });

  it('auto-detects npm ecosystem for package names containing scoped format', async () => {
    mockedFetchPackageData.mockResolvedValue({
      packageName: '@babel/core',
      ecosystem: 'npm',
      githubStars: 43000,
      monthlyDownloads: 25000000,
    });

    const { result } = renderHook(() => usePackageAnalysis());

    await act(async () => {
      await result.current.search('@babel/core');
    });

    expect(mockedFetchPackageData).toHaveBeenCalledWith('@babel/core', 'npm', expect.objectContaining({ signal: expect.any(AbortSignal) }));
  });

  it('defaults hyphenated package names to npm (API fallback handles PyPI)', async () => {
    // Hyphenated names are ambiguous — heuristic defaults to npm
    // API layer has fallback to PyPI if npm 404s
    mockedFetchPackageData.mockResolvedValue({
      packageName: 'react-router-dom',
      ecosystem: 'npm',
      githubStars: 53000,
      monthlyDownloads: 8000000,
    });

    const { result } = renderHook(() => usePackageAnalysis());

    await act(async () => {
      await result.current.search('react-router-dom');
    });

    // Should default to npm for hyphenated names
    expect(mockedFetchPackageData).toHaveBeenCalledWith('react-router-dom', 'npm', expect.objectContaining({ signal: expect.any(AbortSignal) }));
    expect(result.current.state.status).toBe('success');
  });

  it('handles Infinity ratio when downloads > 0 but stars = 0', async () => {
    mockedFetchPackageData.mockResolvedValue({
      packageName: 'some-critical-infra',
      ecosystem: 'npm',
      githubStars: 0,
      monthlyDownloads: 5000000,
    });

    const { result } = renderHook(() => usePackageAnalysis());

    await act(async () => {
      await result.current.search('some-critical-infra');
    });

    expect(result.current.state.status).toBe('success');
    if (result.current.state.status === 'success') {
      expect(result.current.state.data.ratio).toBe(Infinity);
      expect(result.current.state.data.classification).toBe('hidden-infrastructure');
    }
  });

  it('ignores empty search strings', async () => {
    const { result } = renderHook(() => usePackageAnalysis());

    await act(async () => {
      await result.current.search('');
      await result.current.search('   ');
    });

    expect(mockedFetchPackageData).not.toHaveBeenCalled();
    expect(result.current.state.status).toBe('idle');
  });
});
