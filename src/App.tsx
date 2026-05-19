import { useState, useCallback, useEffect, useRef } from 'react';
import { usePackageAnalysis } from './hooks/usePackageAnalysis';
import { ComparisonView } from './components/ComparisonView';
import { SearchHistory, addToSearchHistory } from './components/SearchHistory';
import type { SearchInputHandle } from './components/SearchInput';

function trackEvent(event: string, props?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.aif?.track) {
    window.aif.track(event, props);
  }
}

export function App() {
  const { state: stateA, search: searchA } = usePackageAnalysis();
  const { state: stateB, search: searchB } = usePackageAnalysis();
  const [isComparing, setIsComparing] = useState(false);
  const [lastSearch, setLastSearch] = useState('');
  const [lastSearchB, setLastSearchB] = useState('');
  const [historyKey, setHistoryKey] = useState(0);
  const searchInputRef = useRef<SearchInputHandle>(null);

  const bumpHistory = useCallback(() => {
    setHistoryKey((k) => k + 1);
  }, []);

  const handleSearchA = useCallback((packageName: string) => {
    setLastSearch(packageName);
    addToSearchHistory(packageName);
    bumpHistory();
    searchA(packageName);
    trackEvent('package_search', { package: packageName, slot: 'primary' });
  }, [searchA, bumpHistory]);

  const handleSearchB = useCallback((packageName: string) => {
    setLastSearchB(packageName);
    addToSearchHistory(packageName);
    bumpHistory();
    searchB(packageName);
    trackEvent('package_search', { package: packageName, slot: 'comparison' });
  }, [searchB, bumpHistory]);

  const handleRetryA = useCallback(() => {
    if (lastSearch) {
      searchA(lastSearch);
    }
  }, [searchA, lastSearch]);

  const handleRetryB = useCallback(() => {
    if (lastSearchB) {
      searchB(lastSearchB);
    }
  }, [searchB, lastSearchB]);

  // Track page view on mount
  useEffect(() => {
    trackEvent('page_view', { path: window.location.pathname });
  }, []);

  // Keyboard shortcut: "/" focuses the primary search input
  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if (
        e.key === '/' &&
        !isComparing &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isComparing]);

  const resultA = stateA.status === 'success' ? stateA.data : null;
  const resultB = stateB.status === 'success' ? stateB.data : null;
  const errorA = stateA.status === 'error' ? stateA.error : null;
  const errorB = stateB.status === 'error' ? stateB.error : null;

  return (
    <div className="flex min-h-screen flex-col bg-surface-alt">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand shadow-sm" aria-hidden="true">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-text-primary sm:text-xl">
                Star<span className="text-brand">Gravity</span>
              </h1>
            </div>
          </div>
          <p className="hidden text-sm text-text-tertiary sm:block">
            Downloads per star — the metric that matters
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        {!isComparing ? (
          <div className="space-y-8">
            {/* Hero text */}
            <div className="text-center animate-fade-in">
              <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                Is your package actually used?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-text-tertiary">
                Enter a package name to see its downloads-per-star ratio and find out if it&apos;s essential infrastructure or just hype.
              </p>
              <p className="mt-2 text-xs text-text-muted">
                Press <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-xs text-text-secondary">/</kbd> to focus search
              </p>
            </div>

            <ComparisonView
              resultA={resultA}
              resultB={resultB}
              isLoadingA={stateA.status === 'loading'}
              isLoadingB={stateB.status === 'loading'}
              errorA={errorA}
              errorB={errorB}
              onSearchA={handleSearchA}
              onSearchB={handleSearchB}
              onRetryA={handleRetryA}
              onRetryB={handleRetryB}
              isComparing={false}
              onToggleCompare={() => { setIsComparing(true); trackEvent('comparison_toggle', { mode: 'open' }); }}
              searchInputRef={searchInputRef}
            />

            {/* Search History */}
            <section aria-label="Recent searches" className="animate-fade-in">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
                Recent Searches
              </h2>
              <SearchHistory onSearch={handleSearchA} currentSearch={lastSearch} historyKey={historyKey} />
            </section>
          </div>
        ) : (
          <ComparisonView
            resultA={resultA}
            resultB={resultB}
            isLoadingA={stateA.status === 'loading'}
            isLoadingB={stateB.status === 'loading'}
            errorA={errorA}
            errorB={errorB}
            onSearchA={handleSearchA}
            onSearchB={handleSearchB}
            onRetryA={handleRetryA}
            onRetryB={handleRetryB}
            isComparing={true}
            onToggleCompare={() => { setIsComparing(false); trackEvent('comparison_toggle', { mode: 'close' }); }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-6">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-center text-xs text-text-muted">
            StarGravity — Built for developers who care about real adoption, not vanity metrics.
          </p>
        </div>
      </footer>
    </div>
  );
}
