# Hugo Theme Redesign - Testing Suite

This comprehensive testing suite validates the Hugo theme redesign across multiple dimensions: template rendering, performance, accessibility, cross-browser compatibility, and visual regression.

## Overview

The testing suite consists of five main test categories:

1. **Hugo Template Tests** - Validates Hugo template compilation and rendering
2. **Performance Tests** - Measures Core Web Vitals and performance metrics
3. **Accessibility Tests** - Ensures WCAG 2.1 AA compliance
4. **Cross-Browser Tests** - Validates functionality across different browsers
5. **Visual Regression Tests** - Ensures visual consistency across viewports

## Prerequisites

### System Requirements

- Node.js 16+ 
- Hugo 0.147.2+
- Chrome/Chromium browser (for Lighthouse and Puppeteer)

### Installation

1. Install test dependencies:
```bash
cd tests
npm install
```

2. Ensure Hugo site can be built:
```bash
cd ../exampleSite
hugo server --port 1313
```

## Running Tests

### Run All Tests

Execute the complete test suite:

```bash
npm run test
```

This will run all test categories and generate a comprehensive report.

### Run Individual Test Suites

#### Hugo Template Tests
```bash
npm run test:hugo
```

Tests Hugo template rendering, content types, taxonomies, and multilingual support.

#### Performance Tests
```bash
npm run test:performance
```

Runs Lighthouse audits and custom performance tests measuring:
- Page load times
- Core Web Vitals (LCP, FID, CLS)
- Resource optimization
- JavaScript performance

#### Accessibility Tests
```bash
npm run test:accessibility
```

Validates WCAG 2.1 AA compliance including:
- Keyboard navigation
- Screen reader support
- Color contrast
- ARIA implementation
- Semantic HTML structure

#### Cross-Browser Tests
```bash
npm run test:cross-browser
```

Tests functionality across:
- Desktop: Chrome, Firefox, Safari, Edge
- Mobile: Chrome Mobile, Safari Mobile
- Tablet: iPad Pro

#### Visual Regression Tests
```bash
npm run test:visual
```

Captures and compares screenshots across:
- Phone (375px)
- Tablet (768px) 
- Desktop (1920px)

## Test Configuration

### Performance Thresholds

The performance tests enforce these thresholds:

- **Performance Score**: ≥ 85%
- **Accessibility Score**: ≥ 90%
- **Best Practices Score**: ≥ 85%
- **SEO Score**: ≥ 90%
- **First Contentful Paint**: ≤ 2.0s
- **Largest Contentful Paint**: ≤ 2.5s
- **Cumulative Layout Shift**: ≤ 0.1

### Accessibility Standards

Tests validate compliance with:

- WCAG 2.1 AA guidelines
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios ≥ 4.5:1
- Proper heading hierarchy
- ARIA implementation

### Visual Regression Tolerance

- **Mismatch Threshold**: 0.1% for most elements
- **Header/Footer**: 0.05% (stricter)
- **Dynamic Content**: Hidden during tests

## Reports

All test results are saved to the `reports/` directory:

### Generated Reports

- `test-summary.html` - Comprehensive HTML report
- `test-summary.json` - Machine-readable summary
- `hugo-template-tests.json` - Hugo template test results
- `performance-tests.json` - Performance test results
- `accessibility-tests.json` - Accessibility test results
- `playwright-report/` - Cross-browser test results
- `lighthouse/` - Lighthouse audit reports

### Viewing Reports

1. **Summary Report**: Open `reports/test-summary.html` in a browser
2. **Lighthouse Reports**: Open `reports/lighthouse/index.html`
3. **Playwright Reports**: Open `reports/playwright-report/index.html`
4. **Visual Tests**: Open `backstop_data/html_report/index.html`

## Continuous Integration

### GitHub Actions Example

```yaml
name: Theme Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Hugo
        run: |
          wget https://github.com/gohugoio/hugo/releases/download/v0.147.2/hugo_extended_0.147.2_linux-amd64.deb
          sudo dpkg -i hugo_extended_0.147.2_linux-amd64.deb
      
      - name: Install dependencies
        run: |
          cd tests
          npm install
      
      - name: Run tests
        run: |
          cd tests
          npm run test
      
      - name: Upload reports
        uses: actions/upload-artifact@v3
        with:
          name: test-reports
          path: tests/reports/
```

## Troubleshooting

### Common Issues

#### Hugo Server Not Starting
```bash
# Check if port 1313 is available
lsof -i :1313
# Kill existing process if needed
kill -9 <PID>
```

#### Puppeteer/Chrome Issues
```bash
# Install Chrome dependencies (Ubuntu/Debian)
sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

#### Visual Test Failures
```bash
# Update reference images
npm run reference
# Approve new changes
npm run approve
```

### Debug Mode

Enable debug output for individual test suites:

```bash
# Debug Hugo tests
DEBUG=true npm run test:hugo

# Debug performance tests  
DEBUG=true npm run test:performance

# Debug accessibility tests
DEBUG=true npm run test:accessibility
```

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Add appropriate error handling
3. Update this documentation
4. Ensure tests are deterministic
5. Add proper assertions and thresholds

### Test Categories

- **Unit Tests**: Individual component functionality
- **Integration Tests**: Component interaction
- **E2E Tests**: Full user workflows
- **Performance Tests**: Speed and optimization
- **Accessibility Tests**: WCAG compliance
- **Visual Tests**: UI consistency

## License

This testing suite is part of the Hugo Theme Redesign project and follows the same MIT license.