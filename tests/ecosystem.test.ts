import { describe, it, expect } from 'vitest';
import { detectEcosystem } from '../src/utils/ecosystem';

describe('detectEcosystem', () => {
  it('detects npm for scoped packages like @babel/core', () => {
    expect(detectEcosystem('@babel/core')).toBe('npm');
  });

  it('detects npm for scoped packages like @types/react', () => {
    expect(detectEcosystem('@types/react')).toBe('npm');
  });

  it('detects pypi for names with underscores (Python convention)', () => {
    expect(detectEcosystem('django_rest_framework')).toBe('pypi');
  });

  it('detects pypi for names with dots (Python convention)', () => {
    expect(detectEcosystem('zope.interface')).toBe('pypi');
  });

  it('defaults to npm for hyphenated npm packages like react-router', () => {
    // Hyphenated names are ambiguous — default to npm (larger ecosystem)
    // API fallback handles cases where it's actually a PyPI package
    expect(detectEcosystem('react-router')).toBe('npm');
  });

  it('defaults to npm for simple package names like react', () => {
    expect(detectEcosystem('react')).toBe('npm');
  });

  it('defaults to npm for hyphenated packages like express-validator', () => {
    expect(detectEcosystem('express-validator')).toBe('npm');
  });

  it('handles package names with underscores AND hyphens correctly', () => {
    // Underscore takes precedence for Python convention
    expect(detectEcosystem('some_python_lib-v2')).toBe('pypi');
  });

  it('trims whitespace from package names', () => {
    expect(detectEcosystem('  react  ')).toBe('npm');
    expect(detectEcosystem('  my_python_pkg  ')).toBe('pypi');
  });
});
