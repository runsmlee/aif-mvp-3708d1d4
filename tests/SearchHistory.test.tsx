import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchHistory } from '../src/components/SearchHistory';

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
});
