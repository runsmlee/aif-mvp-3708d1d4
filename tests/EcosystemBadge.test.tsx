import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EcosystemBadge } from '../src/components/EcosystemBadge';

describe('EcosystemBadge', () => {
  it('displays "npm" label when ecosystem is "npm"', () => {
    render(<EcosystemBadge ecosystem="npm" />);
    expect(screen.getByText('npm')).toBeInTheDocument();
  });

  it('displays "PyPI" label when ecosystem is "pypi"', () => {
    render(<EcosystemBadge ecosystem="pypi" />);
    expect(screen.getByText('PyPI')).toBeInTheDocument();
  });

  it('applies correct color variant per ecosystem', () => {
    const { rerender } = render(<EcosystemBadge ecosystem="npm" />);
    const npmBadge = screen.getByText('npm');
    expect(npmBadge.className).toContain('text-red');

    rerender(<EcosystemBadge ecosystem="pypi" />);
    const pypiBadge = screen.getByText('PyPI');
    expect(pypiBadge.className).toContain('text-blue');
  });
});
