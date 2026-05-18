import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

export interface SearchInputHandle {
  focus: () => void;
}

interface SearchInputProps {
  onSearch: (value: string) => void;
  isLoading: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  label?: string;
  id?: string;
}

export const SearchInput = forwardRef<SearchInputHandle, SearchInputProps>(function SearchInput(
  {
    onSearch,
    isLoading,
    autoFocus = true,
    placeholder = 'Enter a package name (npm or PyPI)',
    label = 'Package name',
    id = 'package-search',
  },
  ref
) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed && !isLoading) {
      onSearch(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex w-full gap-3"
      role="search"
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative flex-1">
        {/* Search icon */}
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          aria-label={label}
          className="w-full rounded-xl border border-border bg-surface pl-11 pr-10 py-3.5 text-base text-text-primary shadow-sm transition-all duration-200 placeholder:text-text-muted hover:border-gray-400 focus:border-brand focus:shadow-md focus:outline-none focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-60"
        />
        {isLoading && (
          <div
            data-testid="search-spinner"
            className="absolute right-3.5 top-1/2 -translate-y-1/2"
            role="status"
            aria-label="Loading"
          >
            <svg
              className="h-5 w-5 animate-spin text-brand"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading || !value.trim()}
        aria-label="Search"
        className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-brand-dark hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
        Search
      </button>
    </form>
  );
});
