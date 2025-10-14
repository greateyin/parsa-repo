# Performance Tests Documentation

This document describes the comprehensive performance testing suite for the Hugo theme analytics enhancements, focusing on script loading performance and Core Web Vitals compliance.

## Overview

The performance testing suite consists of multiple test modules that validate:

- **Script Loading Performance**: Tests async loading, conditional loading, and third-party script impact
- **Core Web Vitals Compliance**: Validates FCP, LCP, CLS, FID, and TTFB metrics
- **Analytics Performance**: Tests Google Analytics, Facebook Pixel, and AdSense performance impact
- **Resource Optimization**: Validates compression, caching, and lazy loading implementation

## Test Modules

### 1. Analytics Performance Tests (`analytics-performance-tests.js`)

Tests the performance impact of analytics and advertising integrations:

- **Script Loading Performance**: Validates async loading of analytics scripts
- **Core Web Vitals**: Measures performance metrics with analytics enabled
- **Async Script Loading**: Tests preconnect hints and non-blocking script loading
- **Lazy Loading**: Validates ad lazy loading and Intersection Observer usage
- **Third-Party Impact**: Measures performance impact of external scripts
- **Mermaid Performance**: Tests conditional loading of Mermaid.js

**Usage:**
```bash
npm run test:analytics-performance
```

### 2. Core Web Vitals Tests (`core-web-vitals-tests.js`)

Comprehensive Core Web Vitals testing across multiple device configurations:

- **Multi-Device Testing**: Desktop, mobile, and tablet configurations
- **Core Web Vitals Metrics**: FCP, LCP, CLS, FID, TTFB measurement
- **Performance Budgets**: Resource size validation
- **Resource Optimization**: Compression and caching validation

**Usage:**
```bash
npm run test:core-web-vitals
```

### 3. Enhanced Performance Tests (`performance-tests.js`)

Extended version of the original performance tests with analytics-specific validations:

- **Page Load Times**: Multi-page performance measurement
- **Resource Loading**: Asset size and optimization validation
- **Analytics Script Performance**: Script loading timing and initialization
- **JavaScript Performance**: Error detection and console monitoring

**Usage:**
```bash
npm run test:performance
```

### 4. Comprehensive Performance Test Runner (`run-performance-tests.js`)

Orchestrates all performance tests and generates consolidated reports:

- **Lighthouse Integration**: Runs Lighthouse Core Web Vitals tests
- **Custom Test Execution**: Runs all custom performance test suites
- **Consolidated Reporting**: Generates HTML and JSON summary reports
- **Success Rate Calculation**: Provides overall performance score

**Usage:**
```bash
npm run test:performance-all
```

## Performance Thresholds

### Core Web Vitals Thresholds

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| First Contentful Paint (FCP) | ≤ 1.8s | ≤ 3.0s | > 3.0s |
| Largest Contentful Paint (LCP) | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| Cumulative Layout Shift (CLS) | ≤ 0.1 | ≤ 0.25 | > 0.25 |
| First Input Delay (FID) | ≤ 100ms | ≤ 300ms | > 300ms |
| Time to First Byte (TTFB) | ≤ 800ms | ≤ 1.8s | > 1.8s |

### Performance Budgets

| Resource Type | Budget | Description |
|---------------|--------|-------------|
| Total Page Size | 2MB | Maximum total page weight |
| JavaScript | 500KB | Maximum JavaScript bundle size |
| CSS | 100KB | Maximum CSS bundle size |
| Images | 1MB | Maximum image assets size |

### Script Loading Requirements

- All analytics scripts must be loaded asynchronously
- Preconnect hints should be present for external domains
- Mermaid.js should only load when diagrams are present
- Third-party scripts should not increase load time by more than 50%

## Test Configuration

### Device Configurations

The tests run across multiple device configurations:

1. **Desktop**: 1920x1080 viewport
2. **Mobile**: 375x667 viewport (iPhone-like)
3. **Tablet**: 768x1024 viewport (iPad-like)

### Test URLs

The following URLs are tested for performance:

- Homepage: `http://localhost:1313/`
- Blog List: `http://localhost:1313/blog/`
- Blog Post with Mermaid: `http://localhost:1313/blog/mermaid-diagrams-demo/`
- Search Page: `http://localhost:1313/search/`

## Running Tests

### Prerequisites

1. **Hugo Server**: Start the Hugo development server:
   ```bash
   cd exampleSite
   hugo server --port 1313
   ```

2. **Dependencies**: Install test dependencies:
   ```bash
   cd tests
   npm install
   ```

### Individual Test Suites

```bash
# Run analytics performance tests
npm run test:analytics-performance

# Run Core Web Vitals tests
npm run test:core-web-vitals

# Run enhanced performance tests
npm run test:performance

# Run Lighthouse tests
npm run test:lighthouse
```

### Comprehensive Test Suite

```bash
# Run all performance tests
npm run test:performance-all

# Run all tests (including performance)
npm run test
```

## Report Generation

### Report Types

1. **JSON Reports**: Machine-readable test results
   - `analytics-performance-tests.json`
   - `core-web-vitals-tests.json`
   - `performance-tests.json`
   - `performance-summary.json`

2. **HTML Reports**: Human-readable visual reports
   - `analytics-performance-tests.html`
   - `core-web-vitals-tests.html`
   - `performance-summary.html`

3. **Lighthouse Reports**: Generated in `reports/lighthouse/`

### Report Location

All reports are generated in the `tests/reports/` directory.

## Continuous Integration

### GitHub Actions Integration

Add to your `.github/workflows/test.yml`:

```yaml
- name: Run Performance Tests
  run: |
    cd tests
    npm install
    npm run test:performance-all
```

### Performance Monitoring

The tests can be integrated with performance monitoring tools:

- **Lighthouse CI**: Automated Lighthouse testing
- **Web Vitals**: Real user monitoring integration
- **Performance Budgets**: Automated budget enforcement

## Troubleshooting

### Common Issues

1. **Server Not Running**: Ensure Hugo server is running on port 1313
2. **Timeout Errors**: Increase timeout values for slow environments
3. **Missing Dependencies**: Run `npm install` in the tests directory
4. **Browser Issues**: Ensure Chromium is available for Puppeteer

### Debug Mode

Enable debug logging by setting environment variables:

```bash
DEBUG=puppeteer:* npm run test:performance-all
```

### Performance Optimization Tips

Based on test results, consider these optimizations:

1. **Script Loading**: Ensure all external scripts use `async` attribute
2. **Resource Hints**: Add `preconnect` for external domains
3. **Lazy Loading**: Implement for below-the-fold content
4. **Compression**: Enable gzip/brotli compression
5. **Caching**: Set appropriate cache headers
6. **Critical CSS**: Inline critical CSS for faster rendering

## Requirements Validation

These tests validate the following requirements from the analytics enhancements specification:

- **Requirement 8.1**: Asynchronous loading prevents blocking page rendering
- **Requirement 8.5**: Core Web Vitals scores within acceptable ranges

The tests ensure that the analytics enhancements maintain excellent performance while providing comprehensive tracking capabilities.