import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SearchInput } from '../src/components/SearchInput';

describe('SearchInput', () => {
  it('renders input field with placeholder text', () => {
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText('Enter a package name (npm or PyPI)');
    expect(input).toBeInTheDocument();
  });

  it('calls onSearch with trimmed value when Enter key is pressed', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchInput onSearch={onSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText('Enter a package name (npm or PyPI)');
    await user.type(input, '  react  ');
    await user.keyboard('{Enter}');

    expect(onSearch).toHaveBeenCalledWith('react');
  });

  it('calls onSearch when search button is clicked', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchInput onSearch={onSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText('Enter a package name (npm or PyPI)');
    await user.type(input, 'express');
    const button = screen.getByRole('button', { name: /search/i });
    await user.click(button);

    expect(onSearch).toHaveBeenCalledWith('express');
  });

  it('disables input and shows spinner while search is in progress', () => {
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} isLoading={true} />);

    const input = screen.getByPlaceholderText('Enter a package name (npm or PyPI)');
    expect(input).toBeDisabled();

    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeDisabled();

    // Should show some loading indicator
    const spinner = screen.getByTestId('search-spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('does not call onSearch with empty input', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchInput onSearch={onSearch} isLoading={false} />);

    const button = screen.getByRole('button', { name: /search/i });
    await user.click(button);

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('does not call onSearch with whitespace-only input', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchInput onSearch={onSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText('Enter a package name (npm or PyPI)');
    await user.type(input, '   ');
    await user.keyboard('{Enter}');

    expect(onSearch).not.toHaveBeenCalled();
  });
});
