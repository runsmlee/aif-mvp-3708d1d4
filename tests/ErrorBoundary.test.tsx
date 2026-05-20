import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

// Create a component that throws on render for testing
function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test render error');
  }
  return <div data-testid="child-content">Content rendered</div>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for expected error boundary calls
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Content rendered')).toBeInTheDocument();
  });

  it('renders error fallback when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();
  });

  it('renders a retry button in the error state', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('recovers when retry button is clicked and error is resolved', () => {
    // We need to test the retry flow: error -> click retry -> child renders
    // Since the child will re-render after state reset, we use a variable
    let shouldThrow = true;

    function ControlledChild() {
      if (shouldThrow) {
        throw new Error('Test render error');
      }
      return <div data-testid="child-content">Content rendered</div>;
    }

    const { rerender } = render(
      <ErrorBoundary>
        <ControlledChild />
      </ErrorBoundary>
    );

    // Should show error state
    expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();

    // Fix the error before retrying
    shouldThrow = false;

    // Click retry
    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);

    // Rerender to pick up the fixed state
    rerender(
      <ErrorBoundary>
        <ControlledChild />
      </ErrorBoundary>
    );

    // Now the child should render successfully
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Content rendered')).toBeInTheDocument();
  });

  it('has proper ARIA attributes on error fallback', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const fallback = screen.getByTestId('error-boundary-fallback');
    expect(fallback).toHaveAttribute('role', 'alert');
    expect(fallback).toHaveAttribute('aria-live', 'assertive');
  });

  it('does not show error boundary fallback when children are healthy', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.queryByTestId('error-boundary-fallback')).not.toBeInTheDocument();
  });
});
