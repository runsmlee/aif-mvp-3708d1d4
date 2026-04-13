import type { Ecosystem } from '../types';

/**
 * Auto-detect ecosystem from package name.
 * - Scoped npm packages (e.g., @babel/core) → npm
 * - Names containing underscores and no hyphens → pypi
 * - Names with dots → pypi (Python convention)
 * - Default → npm
 */
export function detectEcosystem(packageName: string): Ecosystem {
  const trimmed = packageName.trim();

  // Scoped npm package (e.g., @babel/core, @types/react)
  if (trimmed.startsWith('@')) {
    return 'npm';
  }

  // Python convention: names with underscores or dots (e.g., django_rest_framework)
  if (/[_\.]/.test(trimmed) && !trimmed.includes('/')) {
    return 'pypi';
  }

  // Hyphenated names without scope: check for known pypi patterns
  // We'll use the heuristic from the spec: hyphens and no scope → pypi
  if (trimmed.includes('-') && !trimmed.includes('@')) {
    return 'pypi';
  }

  // Default to npm for everything else
  return 'npm';
}
