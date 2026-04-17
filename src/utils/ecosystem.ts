import type { Ecosystem } from '../types';

/**
 * Auto-detect ecosystem from package name.
 *
 * Strategy:
 * - Scoped npm packages (e.g., @babel/core) → npm
 * - Names containing underscores or dots (Python convention) → pypi
 * - Everything else → npm (default, since npm is the larger ecosystem)
 *
 * Note: Hyphenated names are ambiguous (both npm and PyPI use them).
 * The API layer includes automatic fallback to handle cross-ecosystem cases.
 */
export function detectEcosystem(packageName: string): Ecosystem {
  const trimmed = packageName.trim();

  // Scoped npm package (e.g., @babel/core, @types/react)
  if (trimmed.startsWith('@')) {
    return 'npm';
  }

  // Python convention: names with underscores or dots (e.g., django_rest_framework, zope.interface)
  if (/[_\.]/.test(trimmed) && !trimmed.includes('/')) {
    return 'pypi';
  }

  // Default to npm for everything else (including hyphenated names)
  return 'npm';
}
