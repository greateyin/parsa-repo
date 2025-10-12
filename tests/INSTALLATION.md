# Testing Suite Installation Guide

## Quick Start

1. **Install test dependencies:**
   ```bash
   cd tests
   npm install
   ```

2. **Validate setup:**
   ```bash
   npm run validate
   ```

3. **Run all tests:**
   ```bash
   npm run test
   ```

## Prerequisites

- Node.js 16+ 
- Hugo 0.147.2+ (extended version recommended)
- Chrome/Chromium browser

## Installation Steps

### 1. Install Node.js Dependencies

```bash
cd tests
npm install
```

This will install all required testing tools:
- Playwright (cross-browser testing)
- Lighthouse (performance testing)
- pa11y (accessibility testing)
- BackstopJS (visual regression testing)
- Puppeteer (browser automation)
- axe-core (accessibility validation)

### 2. Install Playwright Browsers

```bash
cd tests
npx playwright install
```

### 3. Validate Installation

```bash
cd tests
npm run validate
```

This will check:
- Node.js version compatibility
- Hugo installation and version
- Test dependencies installation
- Example site build capability
- Required test files presence

### 4. Generate Visual Test References

For visual regression testing, generate reference images:

```bash
cd tests
npm run reference
```

## Usage

### Run Complete Test Suite

```bash
npm run test
```

### Run Individual Test Categories

```bash
# Hugo template tests
npm run test:hugo

# Performance tests
npm run test:performance

# Accessibility tests
npm run test:accessibility

# Cross-browser tests
npm run test:cross-browser

# Visual regression tests
npm run test:visual
```

### View Test Reports

After running tests, reports are available in:
- `tests/reports/test-summary.html` - Main summary report
- `tests/reports/` - Individual test reports
- `tests/backstop_data/html_report/` - Visual regression reports

## Troubleshooting

### Common Issues

1. **Hugo not found:**
   - Install Hugo: https://gohugo.io/installation/
   - Ensure Hugo is in your PATH

2. **Puppeteer/Chrome issues:**
   - Install Chrome dependencies (Linux): `sudo apt-get install -y chromium-browser`
   - Use `--no-sandbox` flag if running in Docker

3. **Port 1313 already in use:**
   - Kill existing Hugo server: `lsof -ti:1313 | xargs kill -9`

4. **Visual test failures:**
   - Update references: `npm run reference`
   - Approve changes: `npm run approve`

### Debug Mode

Enable debug output:

```bash
DEBUG=true npm run test:hugo
DEBUG=true npm run test:performance
DEBUG=true npm run test:accessibility
```

## CI/CD Integration

The testing suite includes GitHub Actions workflow (`.github/workflows/theme-tests.yml`) for automated testing on:
- Push to main/develop branches
- Pull requests
- Multiple Node.js versions (18.x, 20.x)

Test reports are automatically uploaded as artifacts and PR comments are generated with test results.