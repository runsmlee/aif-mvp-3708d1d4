import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ResultCard } from '../src/components/ResultCard';

const mockResult = {
  packageName: 'react',
  ecosystem: 'npm' as const,
  githubStars: 230000,
  monthlyDownloads: 25000000,
  ratio: 108.7,
  classification: 'healthy' as const,
};

describe('ResultCard', () => {
  it('renders package name, ecosystem badge, stars, downloads, ratio, and classification', () => {
    render(<ResultCard result={mockResult} isLoading={false} />);

    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('npm')).toBeInTheDocument();
    expect(screen.getByText(/230,000/)).toBeInTheDocument();
    expect(screen.getByText(/25,000,000/)).toBeInTheDocument();
    expect(screen.getByText('108.7')).toBeInTheDocument();
    expect(screen.getByText('Healthy')).toBeInTheDocument();
  });

  it('formats download numbers with locale-appropriate commas', () => {
    render(<ResultCard result={mockResult} isLoading={false} />);
    // Check formatted numbers
    expect(screen.getByText('230,000')).toBeInTheDocument();
    expect(screen.getByText('25,000,000')).toBeInTheDocument();
  });

  it('displays loading skeleton when data is null and loading is true', () => {
    render(<ResultCard result={null} isLoading={true} />);

    // Should show skeleton loading indicators, not the actual data
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
    expect(screen.queryByText('react')).not.toBeInTheDocument();
  });

  it('displays error state with retry button when fetch fails', () => {
    const onRetry = vi.fn();
    render(
      <ResultCard
        result={null}
        isLoading={false}
        error="Package not found"
        onRetry={onRetry}
      />
    );

    expect(screen.getByText('Package not found')).toBeInTheDocument();
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = vi.fn();
    render(
      <ResultCard
        result={null}
        isLoading={false}
        error="Package not found"
        onRetry={onRetry}
      />
    );

    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('highlights ratio as the most prominent number on the card', () => {
    render(<ResultCard result={mockResult} isLoading={false} />);

    const ratioElement = screen.getByText('108.7');
    // Ratio should be rendered with a larger/prominent size
    expect(ratioElement.className).toContain('text-5xl');
  });
});
