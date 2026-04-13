# Test Specifications

## Unit Tests (Vitest + React Testing Library)

### SearchInput.test.tsx
- [ ] renders input field with placeholder text
- [ ] calls onSearch with trimmed value when Enter key is pressed
- [ ] calls onSearch when search button is clicked
- [ ] disables input and shows spinner while search is in progress
- [ ] does not call onSearch with empty input

### EcosystemBadge.test.tsx
- [ ] displays "npm" label when ecosystem is "npm"
- [ ] displays "PyPI" label when ecosystem is "pypi"
- [ ] applies correct color variant per ecosystem

### ClassificationLabel.test.tsx
- [ ] renders "Hype" classification when ratio < 10
- [ ] renders "Hidden Infrastructure" classification when ratio > 1000
- [ ] renders "Healthy" classification when ratio is between 10 and 1000
- [ ] renders "Niche" classification when both stars and downloads are below thresholds
- [ ] applies correct color for each classification (red, green, blue, gray)

### ResultCard.test.tsx
- [ ] renders package name, ecosystem badge, stars, downloads, ratio, and classification
- [ ] formats download numbers with locale-appropriate commas (e.g., "1,234,567")
- [ ] displays loading skeleton when data is null and loading is true
- [ ] displays error state with retry button when fetch fails
- [ ] highlights ratio as the most prominent number on the card

### usePackageAnalysis.test.ts (hook)
- [ ] returns idle state initially
- [ ] returns loading state after search is called
- [ ] returns result with stars, downloads, ratio, and classification on success
- [ ] returns error state when API request fails
- [ ] correctly calculates ratio as monthly_downloads / github_stars
- [ ] auto-detects npm ecosystem for package names containing scoped format (e.g., @org/pkg)
- [ ] auto-detects pypi ecosystem for names with hyphens and no scope prefix

### ComparisonView.test.tsx
- [ ] renders two ResultCard slots
- [ ] populates second card when second package is searched
- [ ] aligns both cards side-by-side on desktop, stacked on mobile

### SearchHistory.test.tsx
- [ ] renders empty state when no history exists
- [ ] displays up to 10 recent searches
- [ ] clicking a history item triggers onSearch callback with that package name
- [ ] does not duplicate entries for the same package name

## User Journey Tests

### Primary Workflow
1. App loads → search input is focused, placeholder reads "Enter a package name (npm or PyPI)"
2. User types "react" and presses Enter → loading spinner appears in input
3. Within 4 seconds → ResultCard appears showing stars (~230k), monthly downloads (~25M), ratio (~109), and classification "Healthy"
4. ResultCard has a prominent ratio number and color-coded classification badge

### Error Workflow
1. User types "nonexistent-package-xyz-123" and searches
2. System attempts fetch → API returns 404
3. Error message displayed: "Package not found" with a "Try again" prompt
4. Input remains focused for retry

### Comparison Workflow
1. User searches "react" → first result card appears
2. User clicks "Compare" button → second search input appears
3. User searches "vue" → second result card appears alongside first
4. Both cards are visible and aligned for comparison

## Acceptance Criteria Checklist
(Reviewer verifies these against PRD.md Must Have features)
- [ ] AC: User types a valid package name, system identifies ecosystem (npm/PyPI), and fetches data within 3 seconds
- [ ] AC: Ratio is displayed as a prominent number alongside the raw star count and download count within 4 seconds of search
- [ ] AC: A color-coded label appears with the ratio, correctly classifying packages per defined thresholds
- [ ] AC: All five data points are visible in one card without scrolling (package name, ecosystem badge, stars, downloads, ratio, classification)
