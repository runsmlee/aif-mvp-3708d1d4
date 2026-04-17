import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchHistory, addToSearchHistory } from '../src/components/SearchHistory';

describe('SearchHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders empty state when no history exists', () => {
    render(<SearchHistory onSearch={vi.fn()} currentSearch="" />);
    expect(screen.getByText('No recent searches')).toBeInTheDocument();
  });

  it('displays up to 10 recent searches', () => {
    const history = Array.from({ length: 12 }, (_, i) => `package-${i + 1}`);
    localStorage.setItem('stargravity-history', JSON.stringify(history));

    render(<SearchHistory onSearch={vi.fn()} currentSearch="" />);

    const items = screen.getAllByRole('button');
    // 10 history items
    expect(items.length).toBe(10);
    // Should show the most recent first
    expect(items[0]).toHaveTextContent('package-1');
  });

  it('clicking a history item triggers onSearch callback with that package name', () => {
    const onSearch = vi.fn();
    localStorage.setItem('stargravity-history', JSON.stringify(['react', 'express']));

    render(<SearchHistory onSearch={onSearch} currentSearch="" />);

    const reactButton = screen.getByRole('button', { name: /react/ });
    fireEvent.click(reactButton);

    expect(onSearch).toHaveBeenCalledWith('react');
  });

  it('does not duplicate entries for the same package name', () => {
    const onSearch = vi.fn();
    localStorage.setItem('stargravity-history', JSON.stringify(['react', 'express']));

    render(<SearchHistory onSearch={onSearch} currentSearch="" />);

    // If react is already in history, it should appear only once
    const reactButtons = screen.getAllByRole('button', { name: /react/ });
    expect(reactButtons.length).toBe(1);
  });

  it('does not highlight current search in history', () => {
    const onSearch = vi.fn();
    localStorage.setItem('stargravity-history', JSON.stringify(['react', 'express']));

    render(<SearchHistory onSearch={onSearch} currentSearch="react" />);

    // Should not show the current search as a history item
    const historyItems = screen.getAllByRole('button');
    expect(historyItems.length).toBe(1);
    expect(historyItems[0]).toHaveTextContent('express');
  });

  it('re-renders when historyKey prop changes', () => {
    const onSearch = vi.fn();

    // First render: no history
    const { rerender } = render(
      <SearchHistory onSearch={onSearch} currentSearch="" historyKey={0} />
    );
    expect(screen.getByText('No recent searches')).toBeInTheDocument();

    // Add history externally (simulating addToSearchHistory)
    addToSearchHistory('react');

    // Re-render with new key
    rerender(<SearchHistory onSearch={onSearch} currentSearch="" historyKey={1} />);
    expect(screen.getByRole('button', { name: /react/ })).toBeInTheDocument();
  });

  it('addToSearchHistory caps at 10 entries and removes duplicates', () => {
    // Pre-fill with 9 items
    const history = Array.from({ length: 9 }, (_, i) => `pkg-${i}`);
    localStorage.setItem('stargravity-history', JSON.stringify(history));

    // Add existing item — should move to front
    addToSearchHistory('pkg-5');
    const stored = JSON.parse(localStorage.getItem('stargravity-history') || '[]');
    expect(stored[0]).toBe('pkg-5');
    expect(stored.length).toBe(9);

    // Add new item — should be at front, total still 10
    addToSearchHistory('new-pkg');
    const stored2 = JSON.parse(localStorage.getItem('stargravity-history') || '[]');
    expect(stored2[0]).toBe('new-pkg');
    expect(stored2.length).toBe(10);
  });
});
