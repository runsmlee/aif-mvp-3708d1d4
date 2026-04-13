import type { Ecosystem } from '../types';

interface EcosystemBadgeProps {
  ecosystem: Ecosystem;
}

const ECOSYSTEM_STYLES: Record<Ecosystem, { classes: string; dotColor: string }> = {
  npm: { classes: 'bg-brand-subtle text-red-700 border-brand-light/50', dotColor: 'bg-brand' },
  pypi: { classes: 'bg-info-subtle text-blue-700 border-blue-200/60', dotColor: 'bg-info' },
};

export function EcosystemBadge({ ecosystem }: EcosystemBadgeProps) {
  const label = ecosystem === 'npm' ? 'npm' : 'PyPI';
  const { classes, dotColor } = ECOSYSTEM_STYLES[ecosystem];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${classes}`}
      role="status"
      aria-label={`Ecosystem: ${label}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} aria-hidden="true" />
      {label}
    </span>
  );
}
