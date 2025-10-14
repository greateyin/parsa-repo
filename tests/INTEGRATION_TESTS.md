# Template Integration Tests

This document describes the integration tests for template updates, specifically testing the integration of analytics, advertising, and search partials.

## Overview

The integration tests validate that template rendering works correctly with new partials for:
- **Analytics Integration (Requirement 1.1)**: Google Analytics and Facebook Pixel
- **Ad Placement Integration (Requirement 2.2)**: Google AdSense and ad placements
- **Search Integration (Requirement 3.1)**: Google Custom Search and search widgets

## Test Files

### 1. Template Integration Tests (`template-integration-tests.js`)
Tests template rendering with new analytics, advertising, and search partials.

**Features tested:**
- Analytics partial integration (Google Analytics, Facebook Pixel)
- Advertising partial integration (AdSense, ad placements)
- Search partial integration (Google Custom Search, search widgets)
- Layout file integration with partials
- Configuration file validation

### 2. Partial Integration Tests (`partial-integration-tests.js`)
Tests the interaction and coexistence between all template partials.

**Features tested:**
- Partial file structure validation
- Partial dependencies and conditional loading
- Configuration integration
- Performance considerations
- Privacy implementation compliance

### 3. Integration Test Runner (`run-integration-tests.js`)
Comprehensive runner that executes all integration tests and generates summary reports.

## Running the Tests

### Individual Test Suites

```bash
# Run template integration tests
npm run test:template-integration

# Run partial integration tests  
npm run test:partial-integration

# Run all integration tests
npm run test:integration-all
```

### Command Line Execution

```bash
# Template integration tests
node tests/template-integration-tests.js

# Partial integration tests
node tests/partial-integration-tests.js

# All integration tests
node tests/run-integration-tests.js
```

## Test Results

### Success Criteria

The tests validate:
- ✅ Configuration files contain required settings
- ✅ Layout files integrate with partials correctly
- ✅ Privacy and performance settings are configured
- ⚠️ Partial files exist (expected to fail until partials are implemented)

### Expected Results

**Template Integration Tests:**
- Configuration validation: ✅ PASS
- Layout integration: ✅ PASS (partial)
- Partial file existence: ❌ FAIL (expected until implementation)

**Partial Integration Tests:**
- Configuration structure: ✅ PASS
- Privacy compliance: ✅ PASS
- File structure: ❌ FAIL (expected until implementation)

## Reports

Test reports are generated in the `tests/reports/` directory:

- `template-integration-tests.json` - Detailed template integration results
- `partial-integration-tests.json` - Detailed partial integration results  
- `integration-test-summary.json` - Overall integration test summary

## Requirements Coverage

### Requirement 1.1 - Analytics Integration
- ✅ Google Analytics configuration validation
- ✅ Facebook Pixel configuration validation
- ❌ Partial file validation (pending implementation)

### Requirement 2.2 - Ad Placement Integration  
- ✅ AdSense configuration validation
- ✅ Ad placement configuration validation
- ❌ Partial file validation (pending implementation)

### Requirement 3.1 - Search Integration
- ✅ Google Custom Search configuration validation
- ✅ Search widget configuration validation
- ❌ Partial file validation (pending implementation)

## Integration with Main Test Suite

These integration tests are automatically included in the main test suite (`run-all-tests.js`) and will be executed as part of the comprehensive Hugo template testing.

## Next Steps

1. Implement the actual partial files tested by these integration tests
2. Update layout files to include the new partials
3. Re-run integration tests to validate full implementation
4. Use these tests for regression testing during development

## Troubleshooting

### Common Issues

**Hugo Build Failures:**
- Tests fall back to file-based validation if Hugo build fails
- Ensure Hugo is installed and accessible in PATH

**Missing Dependencies:**
- Run `npm install` in the tests directory
- Required packages: fs-extra, cheerio, glob

**Permission Issues:**
- Ensure write permissions for the `tests/reports/` directory
- Tests will create the reports directory if it doesn't exist

### Debug Mode

For detailed debugging, examine the generated JSON reports in `tests/reports/` which contain:
- Individual test results with pass/fail status
- Detailed error messages and validation results
- Timestamps and test metadata