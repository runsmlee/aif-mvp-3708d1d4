import { SearchInput } from './SearchInput';
import type { SearchInputHandle } from './SearchInput';
import { ResultCard } from './ResultCard';
import type { AnalysisResult } from '../types';
import type { RefObject } from 'react';

interface ComparisonViewProps {
  resultA: AnalysisResult | null;
  resultB: AnalysisResult | null;
  isLoadingA: boolean;
  isLoadingB: boolean;
  errorA?: string | null;
  errorB?: string | null;
  onSearchA: (value: string) => void;
  onSearchB: (value: string) => void;
  onRetryA?: () => void;
  onRetryB?: () => void;
  isComparing: boolean;
  onToggleCompare: () => void;
  searchInputRef?: RefObject<SearchInputHandle | null>;
}

export function ComparisonView({
  resultA,
  resultB,
  isLoadingA,
  isLoadingB,
  errorA,
  errorB,
  onSearchA,
  onSearchB,
  onRetryA,
  onRetryB,
  isComparing,
  onToggleCompare,
  searchInputRef,
}: ComparisonViewProps) {
  if (isComparing) {
    return (
      <div
        data-testid="comparison-grid"
        className="animate-fade-in"
      >
        {/* Comparison header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-text-muted">
            Compare Packages
          </h3>
          <button
            onClick={onToggleCompare}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-text-tertiary transition-colors duration-200 hover:bg-border-subtle hover:text-text-secondary"
            aria-label="Exit comparison mode"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Exit comparison
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
          {/* Card A */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white" aria-hidden="true">A</div>
              <p className="text-sm font-medium text-text-secondary">Package A</p>
            </div>
            <ResultCard
              result={resultA}
              isLoading={isLoadingA}
              error={errorA}
              onRetry={onRetryA}
            />
          </div>

          {/* Card B */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-info text-xs font-bold text-white" aria-hidden="true">B</div>
              <p className="text-sm font-medium text-text-secondary">Package B</p>
            </div>
            <SearchInput
              onSearch={onSearchB}
              isLoading={isLoadingB}
              autoFocus={true}
              placeholder="Enter a second package name"
              label="Second package name"
              id="package-search-b"
            />
            <ResultCard
              result={resultB}
              isLoading={isLoadingB}
              error={errorB}
              onRetry={onRetryB}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Primary search */}
      <div className="space-y-6">
        <SearchInput ref={searchInputRef} onSearch={onSearchA} isLoading={isLoadingA} autoFocus={true} />
        <ResultCard
          result={resultA}
          isLoading={isLoadingA}
          error={errorA}
          onRetry={onRetryA}
        />
      </div>

      {/* Compare button */}
      <div className="flex justify-center">
        <button
          onClick={onToggleCompare}
          className="group inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-secondary shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-surface-alt hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/10"
          aria-label="Compare with another package"
        >
          <svg className="h-4 w-4 text-text-muted transition-colors duration-200 group-hover:text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
          Compare with another package
        </button>
      </div>
    </div>
  );
}
