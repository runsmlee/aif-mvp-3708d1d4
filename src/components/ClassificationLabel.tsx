import type { Classification } from '../types';

interface ClassificationLabelProps {
  classification: Classification;
  ratio: number;
}

const CLASSIFICATION_CONFIG: Record<Classification, { label: string; colorClass: string; description: string; icon: string }> = {
  hype: {
    label: 'Hype',
    colorClass: 'text-red-700 bg-red-50 border-red-200/70',
    description: 'More stars than actual downloads',
    icon: '🔥',
  },
  healthy: {
    label: 'Healthy',
    colorClass: 'text-green-700 bg-green-50 border-green-200/70',
    description: 'Good balance of stars and downloads',
    icon: '✓',
  },
  'hidden-infrastructure': {
    label: 'Hidden Infra',
    colorClass: 'text-blue-700 bg-blue-50 border-blue-200/70',
    description: 'Massively used but under-starred',
    icon: '⚙',
  },
  niche: {
    label: 'Niche',
    colorClass: 'text-gray-600 bg-gray-50 border-gray-200/70',
    description: 'Low usage and stars — specialized tool',
    icon: '▸',
  },
};

export function ClassificationLabel({ classification }: ClassificationLabelProps) {
  const config = CLASSIFICATION_CONFIG[classification];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold tracking-wide ${config.colorClass}`}
      role="status"
      aria-label={`Classification: ${config.label}`}
      title={config.description}
    >
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  );
}
