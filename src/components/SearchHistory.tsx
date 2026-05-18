import { useEffect, useState } from 'react';

const STORAGE_KEY = 'stargravity-history';
const MAX_HISTORY = 10;

interface SearchHistoryProps {
  onSearch: (value: string) => void;
  currentSearch: string;
  /** Increment to trigger a re-read from localStorage */
  historyKey?: number;
}

function readHistory(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    // Validate all elements are strings
    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
}

export function SearchHistory({ onSearch, currentSearch, historyKey }: SearchHistoryProps) {
  const [history, setHistory] = useState<string[]>(readHistory);

  // Re-read from localStorage when historyKey changes
  useEffect(() => {
    setHistory(readHistory());
  }, [historyKey]);

  const handleClick = (packageName: string) => {
    onSearch(packageName);
  };

  const filteredHistory = history.filter(
    (item) => item.toLowerCase() !== currentSearch.toLowerCase()
  );

  if (filteredHistory.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-8 text-center" role="status" aria-live="polite">
        <svg className="mx-auto h-5 w-5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <p className="mt-2 text-sm text-text-muted">No recent searches</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Recent searches">
      {filteredHistory.slice(0, MAX_HISTORY).map((packageName) => (
        <li key={packageName}>
          <button
            onClick={() => handleClick(packageName)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-secondary shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-surface-alt hover:shadow-sm active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/10"
            aria-label={`Search for ${packageName}`}
          >
            <svg className="h-3.5 w-3.5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            {packageName}
          </button>
        </li>
      ))}
    </ul>
  );
}

/**
 * Add a package name to search history (exported for App to use).
 */
export function addToSearchHistory(packageName: string): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let history: string[];
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      history = Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === 'string')
        : [];
    } else {
      history = [];
    }

    // Remove duplicate if it exists
    const filtered = history.filter(
      (item) => item.toLowerCase() !== packageName.toLowerCase()
    );

    // Add to front
    const updated = [packageName, ...filtered].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore localStorage errors
  }
}
