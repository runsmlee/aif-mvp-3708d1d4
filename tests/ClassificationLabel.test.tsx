import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ClassificationLabel } from '../src/components/ClassificationLabel';

describe('ClassificationLabel', () => {
  it('renders "Hype" classification when ratio < 10', () => {
    render(<ClassificationLabel classification="hype" ratio={5} />);
    expect(screen.getByText('Hype')).toBeInTheDocument();
  });

  it('renders "Hidden Infrastructure" classification when ratio > 1000', () => {
    render(<ClassificationLabel classification="hidden-infrastructure" ratio={2500} />);
    expect(screen.getByText('Hidden Infra')).toBeInTheDocument();
  });

  it('renders "Healthy" classification when ratio is between 10 and 1000', () => {
    render(<ClassificationLabel classification="healthy" ratio={109} />);
    expect(screen.getByText('Healthy')).toBeInTheDocument();
  });

  it('renders "Niche" classification when both stars and downloads are below thresholds', () => {
    render(<ClassificationLabel classification="niche" ratio={2} />);
    expect(screen.getByText('Niche')).toBeInTheDocument();
  });

  it('applies correct color for each classification', () => {
    const { rerender } = render(<ClassificationLabel classification="hype" ratio={5} />);
    let label = screen.getByText('Hype');
    expect(label.className).toContain('text-red');

    rerender(<ClassificationLabel classification="healthy" ratio={109} />);
    label = screen.getByText('Healthy');
    expect(label.className).toContain('text-green');

    rerender(<ClassificationLabel classification="hidden-infrastructure" ratio={2500} />);
    label = screen.getByText('Hidden Infra');
    expect(label.className).toContain('text-blue');

    rerender(<ClassificationLabel classification="niche" ratio={2} />);
    label = screen.getByText('Niche');
    expect(label.className).toContain('text-gray');
  });
});
