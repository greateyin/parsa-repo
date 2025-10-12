# Analytics Configuration Tests

This document describes the unit tests for analytics configuration parsing, validation, and privacy settings.

## Overview

The analytics configuration tests (`analytics-configuration-tests.js`) provide comprehensive testing for:

- Google Analytics 4 configuration parsing and validation
- Privacy settings and Do Not Track functionality  
- Configuration validation and error handling
- Analytics manager coordination
- Multiple analytics services integration

## Requirements Coverage

These tests specifically address the following requirements:

- **Requirement 1.1**: Google Analytics 4 Integration
- **Requirement 1.2**: Privacy settings and Do Not Track functionality

## Test Categories

### 1. Google Analytics Configuration Tests

#### Valid GA4 Configuration
- Tests proper inclusion of GA4 tracking script with valid tracking ID (G-JKSVCT23D1)
- Validates gtag configuration and initialization
- Checks for Do Not Track integration

#### Invalid GA4 Configuration  
- Tests rejection of invalid tracking ID formats (e.g., legacy UA- format)
- Ensures no GA scripts are loaded with invalid configuration

#### Missing GA4 Configuration
- Tests graceful handling when no tracking ID is provided
- Ensures no analytics scripts are included without configuration

#### Services Configuration
- Tests Hugo's services.googleAnalytics.ID configuration method
- Validates backward compatibility with different configuration approaches

### 2. Privacy Settings Tests

#### Respect Do Not Track Enabled
- Tests Do Not Track detection code inclusion
- Validates conditional analytics loading based on DNT settings
- Checks IP anonymization configuration

#### Respect Do Not Track Disabled
- Tests direct analytics loading when DNT is disabled
- Ensures no DNT checks when privacy setting is disabled

#### IP Anonymization
- Tests proper configuration of IP anonymization setting
- Validates privacy compliance features

### 3. Do Not Track Functionality Tests

#### JavaScript Logic Testing
- Tests proper Do Not Track detection across browsers (navigator.doNotTrack, window.doNotTrack, navigator.msDoNotTrack)
- Validates correct DNT value checking ("1" or "yes")
- Tests conditional analytics execution based on DNT status

#### Analytics Manager Integration
- Tests global DNT configuration object
- Validates event tracking DNT protection
- Checks analytics manager coordination with privacy settings

### 4. Configuration Validation Tests

#### Configuration Warnings
- Tests warning system for invalid configurations
- Validates error handling and user feedback

#### Default Value Handling
- Tests application of default privacy settings
- Validates fallback behavior for missing configuration

#### Multiple Services Configuration
- Tests coordination between Google Analytics and Facebook Pixel
- Validates analytics manager service coordination
- Checks service loading status tracking

### 5. Analytics Manager Configuration Tests

#### Core Features
- Tests analytics manager initialization and coordination
- Validates event tracking functionality
- Checks service status monitoring

#### Performance Optimization
- Tests preconnect and DNS prefetch hints
- Validates performance monitoring integration
- Checks async script loading optimization

#### Error Handling
- Tests error handling for failed script loads
- Validates graceful degradation on service failures

## Running the Tests

### Prerequisites

1. Install test dependencies:
   ```bash
   cd tests
   npm install
   ```

2. Ensure Hugo is installed and available in PATH:
   ```bash
   hugo version
   ```

### Running Analytics Tests

Run only the analytics configuration tests:
```bash
npm run test:analytics
```

Run all tests including analytics:
```bash
npm test
```

### Test Output

The tests generate:
- Console output with pass/fail status for each test
- JSON report: `reports/analytics-configuration-tests.json`
- Integration with main test summary report

## Test Implementation Details

### Test Environment Setup
- Creates temporary Hugo configurations for testing
- Builds example site with different configurations
- Analyzes generated HTML output for validation

### Configuration Testing Approach
- Uses Hugo's TOML configuration format
- Tests various parameter combinations
- Validates HTML output using Cheerio for DOM parsing

### Privacy Testing Strategy
- Tests JavaScript code generation for DNT detection
- Validates conditional script execution
- Checks privacy compliance features

### Validation Methods
- HTML parsing to check script inclusion
- JavaScript code analysis for privacy features
- Configuration validation through Hugo build process

## Expected Test Results

When all tests pass, you should see:
- ✅ Valid GA4 Configuration
- ✅ GA4 Privacy Integration  
- ✅ Invalid GA4 Configuration Handling
- ✅ Missing GA4 Configuration Handling
- ✅ Services GA4 Configuration
- ✅ Respect Do Not Track Enabled
- ✅ Anonymize IP Setting
- ✅ Respect Do Not Track Disabled
- ✅ IP Anonymization Configuration
- ✅ Do Not Track Detection Logic
- ✅ Conditional Analytics Execution
- ✅ Analytics Manager DNT Integration
- ✅ Event Tracking DNT Protection
- ✅ Configuration Warning System
- ✅ Default Privacy Settings
- ✅ Multiple Analytics Services Configuration
- ✅ Service Coordination
- ✅ Analytics Manager Core Features
- ✅ Performance Optimization
- ✅ Error Handling

## Troubleshooting

### Common Issues

1. **Hugo not found**: Ensure Hugo is installed and in PATH
2. **Dependencies missing**: Run `npm install` in tests directory
3. **Build failures**: Check Hugo configuration syntax
4. **Test timeouts**: Increase timeout values for slower systems

### Debug Mode

To run tests with verbose output:
```bash
DEBUG=true npm run test:analytics
```

## Integration with CI/CD

These tests are designed to run in continuous integration environments:
- No external dependencies beyond Hugo and Node.js
- Deterministic test results
- JSON output for automated reporting
- Exit codes for build pipeline integration