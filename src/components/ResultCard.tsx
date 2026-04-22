import type { AnalysisResult } from '../types';
import { EcosystemBadge } from './EcosystemBadge';
import { ClassificationLabel } from './ClassificationLabel';
import { formatNumber, formatRatio } from '../utils/formatting';

interface ResultCardProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

function Skeleton({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      data-testid="skeleton"
      className="skeleton-shimmer rounded-lg"
      style={style}
      aria-hidden="true"
    />
  );
}

export function ResultCard({ result, isLoading, error, onRetry }: ResultCardProps) {
  return (
    <div
      data-testid="result-card"
      className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-8"
      role="region"
      aria-label={`Analysis result${result ? ` for ${result.packageName}` : ''}`}
    >
      {isLoading && !result && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center gap-3">
            <Skeleton style={{ width: '180px', height: '22px' }} />
            <Skeleton style={{ width: '48px', height: '24px', borderRadius: '9999px' }} />
          </div>
          <div className="py-4">
            <Skeleton style={{ width: '120px', height: '14px', margin: '0 auto 12px' }} />
            <Skeleton style={{ width: '140px', height: '44px', margin: '0 auto', borderRadius: '8px' }} />
          </div>
          <div className="grid grid-cols-3 gap-4 border-t border-border-subtle pt-5">
            <div className="space-y-2">
              <Skeleton style={{ width: '80px', height: '12px', margin: '0 auto' }} />
              <Skeleton style={{ width: '60px', height: '20px', margin: '0 auto' }} />
            </div>
            <div className="space-y-2">
              <Skeleton style={{ width: '100px', height: '12px', margin: '0 auto' }} />
              <Skeleton style={{ width: '70px', height: '20px', margin: '0 auto' }} />
            </div>
            <div className="space-y-2">
              <Skeleton style={{ width: '90px', height: '12px', margin: '0 auto' }} />
              <Skeleton style={{ width: '80px', height: '28px', margin: '0 auto', borderRadius: '9999px' }} />
            </div>
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="flex flex-col items-center gap-4 py-10 text-center animate-fade-in">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-subtle">
            <svg
              className="h-6 w-6 text-brand"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary" role="alert">Something went wrong</p>
            <p className="mt-1 text-sm text-text-tertiary">{error}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-text-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-gray-800 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-200"
              aria-label="Try again"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Try again
            </button>
          )}
        </div>
      )}

      {result && !isLoading && (
        <div className="space-y-6 animate-fade-in">
          {/* Header: Package name + Ecosystem */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-alt" aria-hidden="true">
              <svg className="h-5 w-5 text-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-semibold text-text-primary">{result.packageName}</h2>
            </div>
            <EcosystemBadge ecosystem={result.ecosystem} />
          </div>

          {/* Prominent Ratio */}
          <div className="rounded-xl bg-surface-alt py-6">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-text-muted">
              Downloads per Star
            </p>
            <p className="mt-2 text-center text-5xl font-bold tracking-tight text-text-primary" data-testid="ratio-value">
              {formatRatio(result.ratio)}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-border-subtle p-4 text-center">
              <p className="text-xs font-medium text-text-muted">GitHub Stars</p>
              <p className="mt-1 text-lg font-bold text-text-primary">
                {formatNumber(result.githubStars)}
              </p>
            </div>
            <div className="rounded-xl border border-border-subtle p-4 text-center">
              <p className="text-xs font-medium text-text-muted">Monthly Downloads</p>
              <p className="mt-1 text-lg font-bold text-text-primary">
                {formatNumber(result.monthlyDownloads)}
              </p>
            </div>
            <div className="rounded-xl border border-border-subtle p-4 text-center">
              <p className="text-xs font-medium text-text-muted">Classification</p>
              <div className="mt-1.5 flex justify-center">
                <ClassificationLabel
                  classification={result.classification}
                  ratio={result.ratio}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && !result && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 animate-fade-in">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-border-subtle" aria-hidden="true">
            <svg className="h-6 w-6 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <p className="text-sm text-text-muted">Search for a package to see its StarGravity analysis</p>
        </div>
      )}
    </div>
  );
}
