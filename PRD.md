# StarGravity — Product Requirements Document

## Problem
Developers evaluating open-source libraries rely on GitHub stars as a proxy for adoption, but stars measure visibility, not usage. This leads to choosing "hyped" packages over battle-tested alternatives, wasting time on poorly maintained or over-marketed tools. There is no quick, single-metric view that answers: "Is this package actually used in production, or just starred on GitHub?"

## Target Users
Software engineers and technical leads selecting dependencies for new projects, performing due diligence during library evaluation, or benchmarking competing libraries. These users are pragmatic decision-makers who want data, not marketing.

## Core Features

### Must Have
- **Universal Package Search**: Single input field accepting any npm or PyPI package name, auto-detecting the ecosystem. — Acceptance Criteria: User types a valid package name, system identifies ecosystem (npm/PyPI), and fetches data within 3 seconds.

- **StarGravity Ratio Calculator**: Fetches GitHub stars and monthly package downloads, computes a single "downloads per star" ratio in real time. — Acceptance Criteria: Ratio is displayed as a prominent number alongside the raw star count and download count within 4 seconds of search.

- **Classification Label**: Automatically assigns a category (Hype / Healthy / Hidden Infrastructure / Niche) based on ratio thresholds. — Acceptance Criteria: A color-coded label appears with the ratio, correctly classifying packages per defined thresholds.

- **Results Summary Card**: Displays the package name, ecosystem badge, GitHub star count, monthly downloads, ratio, and classification in a single scannable card. — Acceptance Criteria: All five data points are visible in one card without scrolling.

### Should Have
- **Comparison Mode**: Side-by-side comparison of two packages on the same screen. — Acceptance Criteria: User can search a second package and see both results cards aligned for direct comparison.

- **Search History**: Persist recently searched packages in localStorage with one-click re-query. — Acceptance Criteria: Last 10 searches appear in a dropdown, clicking one re-runs the analysis.

### Out of Scope (v1)
- GitHub authentication or rate-limit bypass (uses unauthenticated API with graceful fallback)
- Trend data over time (only current snapshot)
- Support for ecosystems beyond npm and PyPI (e.g., RubyGems, crates.io, Maven)
- Package dependency tree analysis

## Success Metrics
- Primary: User completes a package lookup and sees a classified result in under 5 seconds
- Secondary: User performs at least 2 searches in a single session (indicates the tool is useful enough to return to)

## Design Principles
- **Data-first clarity**: Every pixel should serve the numbers. Minimal decoration, maximum readability.
- **Instant comprehension**: The ratio and classification label should be understandable in under 1 second without reading documentation.
- **Professional restraint**: No animations for decoration. Only transitional feedback (loading spinners, subtle fade-in of results).
