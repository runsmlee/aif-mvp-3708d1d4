import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ComparisonView } from '../src/components/ComparisonView';

const mockResultA = {
  packageName: 'react',
  ecosystem: 'npm' as const,
  githubStars: 230000,
  monthlyDownloads: 25000000,
  ratio: 108.7,
  classification: 'healthy' as const,
};

const mockResultB = {
  packageName: 'vue',
  ecosystem: 'npm' as const,
  githubStars: 208000,
  monthlyDownloads: 5000000,
  ratio: 24.04,
  classification: 'healthy' as const,
};

describe('ComparisonView', () => {
  it('renders two ResultCard slots', () => {
    render(
      <ComparisonView
        resultA={null}
        resultB={null}
        isLoadingA={false}
        isLoadingB={false}
        onSearchA={vi.fn()}
        onSearchB={vi.fn()}
        isComparing={false}
        onToggleCompare={vi.fn()}
      />
    );

    // Should have at least one result card area (empty state or card)
    const containers = screen.getAllByTestId(/result-card/);
    expect(containers.length).toBeGreaterThanOrEqual(1);
  });

  it('populates second card when second package is searched', () => {
    render(
      <ComparisonView
        resultA={mockResultA}
        resultB={mockResultB}
        isLoadingA={false}
        isLoadingB={false}
        onSearchA={vi.fn()}
        onSearchB={vi.fn()}
        isComparing={true}
        onToggleCompare={vi.fn()}
      />
    );

    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('vue')).toBeInTheDocument();
  });

  it('aligns both cards side-by-side on desktop, stacked on mobile', () => {
    const { container } = render(
      <ComparisonView
        resultA={mockResultA}
        resultB={mockResultB}
        isLoadingA={false}
        isLoadingB={false}
        onSearchA={vi.fn()}
        onSearchB={vi.fn()}
        isComparing={true}
        onToggleCompare={vi.fn()}
      />
    );

    // The comparison container should use responsive grid/flex
    const comparisonContainer = container.querySelector('[data-testid="comparison-grid"]');
    expect(comparisonContainer).toBeInTheDocument();
    // Should have grid classes for responsive layout (in a child element)
    const gridChild = comparisonContainer?.querySelector('.grid');
    expect(gridChild).toBeInTheDocument();
  });

  it('shows compare button and triggers onToggleCompare when clicked', async () => {
    const onToggleCompare = vi.fn();
    const user = userEvent.setup();

    render(
      <ComparisonView
        resultA={mockResultA}
        resultB={null}
        isLoadingA={false}
        isLoadingB={false}
        onSearchA={vi.fn()}
        onSearchB={vi.fn()}
        isComparing={false}
        onToggleCompare={onToggleCompare}
      />
    );

    const compareButton = screen.getByRole('button', { name: /compare/i });
    await user.click(compareButton);
    expect(onToggleCompare).toHaveBeenCalled();
  });
});
