import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { App } from '../src/App';

// Mock the API module so we don't make real network requests
vi.mock('../src/utils/api', () => ({
  fetchPackageData: vi.fn(),
}));

import { fetchPackageData } from '../src/utils/api';
const mockedFetchPackageData = vi.mocked(fetchPackageData);

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders the StarGravity header', () => {
    render(<App />);
    // Header contains "StarGravity" as "Star" + "Gravity" span
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain('Star');
    expect(heading.textContent).toContain('Gravity');
  });

  it('renders search input with correct placeholder', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Enter a package name (npm or PyPI)');
    expect(input).toBeInTheDocument();
  });

  it('renders the compare button', () => {
    render(<App />);
    const compareButton = screen.getByRole('button', { name: /compare/i });
    expect(compareButton).toBeInTheDocument();
  });

  it('renders search history section', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Recent Searches/i })).toBeInTheDocument();
  });

  it('enters comparison mode when compare button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const compareButton = screen.getByRole('button', { name: /compare/i });
    await user.click(compareButton);

    // Should show second search input for comparison
    expect(screen.getByPlaceholderText('Enter a second package name')).toBeInTheDocument();
    expect(screen.getByText(/Compare Packages/i)).toBeInTheDocument();
  });

  it('shows loading state when searching for a package', async () => {
    mockedFetchPackageData.mockImplementation(
      () => new Promise(() => {})
    );

    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Enter a package name (npm or PyPI)');
    await user.type(input, 'react');
    await user.keyboard('{Enter}');

    // Should show loading spinner
    expect(screen.getByTestId('search-spinner')).toBeInTheDocument();
  });

  it('displays result after successful search', async () => {
    mockedFetchPackageData.mockResolvedValue({
      packageName: 'react',
      ecosystem: 'npm',
      githubStars: 230000,
      monthlyDownloads: 25000000,
    });

    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Enter a package name (npm or PyPI)');
    await user.type(input, 'react');
    await user.keyboard('{Enter}');

    // Wait for result to appear
    const resultCard = await screen.findByTestId('result-card');
    expect(resultCard).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('npm')).toBeInTheDocument();
  });

  it('displays error state when package is not found', async () => {
    mockedFetchPackageData.mockRejectedValue(new Error('Package not found'));

    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Enter a package name (npm or PyPI)');
    await user.type(input, 'nonexistent-package-xyz-123');
    await user.keyboard('{Enter}');

    // Wait for error message
    const errorMessage = await screen.findByText('Package not found');
    expect(errorMessage).toBeInTheDocument();
  });

  it('focuses search input when "/" is pressed globally', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText('Enter a package name (npm or PyPI)');

    // Blur the input first (it auto-focuses on mount)
    input.blur();
    expect(input).not.toHaveFocus();

    // Simulate pressing "/" at the document level
    fireEvent.keyDown(document, { key: '/' });

    expect(input).toHaveFocus();
  });

  it('does not intercept "/" when user is already typing in the search input', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Enter a package name (npm or PyPI)');
    await user.click(input);
    await user.type(input, 're');

    // "/" should be typed normally since input is already focused
    await user.keyboard('/');
    expect(input).toHaveValue('re/');
    expect(input).toHaveFocus();
  });

  it('shows keyboard shortcut hint on first screen', () => {
    render(<App />);
    expect(screen.getByText('/', { selector: 'kbd' })).toBeInTheDocument();
  });
});
