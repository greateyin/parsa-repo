# Analytics Configuration Unit Tests

This document describes the unit tests implemented for analytics configuration parsing and validation.

## Overview

The analytics configuration unit tests verify that the Hugo theme correctly parses, validates, and handles analytics configurations for Google Analytics 4 and Facebook Pixel integrations, with proper privacy settings and Do Not Track functionality.

## Requirements Coverage

### Requirement 1.1: Google Analytics 4 Integration
- ✅ GA4 tracking ID format validation
- ✅ Configuration parameter extraction
- ✅ Services configuration override handling  
- ✅ Privacy settings integration

### Requirement 1.2: Privacy settings and Do Not Track functionality
- ✅ Do Not Track detection logic
- ✅ Cookie consent configuration
- ✅ IP anonymization settings
- ✅ Analytics manager DNT integration

## Test Files

### `analytics-config-unit-tests.js`
Main unit test suite that tests configuration parsing and validation logic without requiring Hugo builds.

**Test Categories:**
1. **Google Analytics Configuration Parsing**
   - GA4 tracking ID format validation (valid/invalid formats)
   - Configuration parameter extraction from Hugo config
   - Privacy settings integration
   - Services configuration override handling

2. **Facebook Pixel Configuration Parsing**
   - Pixel ID validation (15-digit format)
   - Event configuration parsing (selective events)
   - Privacy integration with DNT and cookie consent

3. **Privacy Settings Parsing**
   - Do Not Track configuration parsing
   - Cookie consent configuration
   - IP anonymization settings
   - String boolean handling

4. **Do Not Track Functionality**
   - DNT detection logic (navigator.doNotTrack, window.doNotTrack, navigator.msDoNotTrack)
   - Analytics manager DNT integration
   - Conditional tracking based on DNT status

5. **Configuration Validation**
   - Required field validation
   - Type validation and normalization
   - Default value handling

### `run-analytics-tests.js`
Test runner that executes all analytics-related tests and provides a summary report.

## Running the Tests

### Individual Test Suite
```bash
# Run the unit tests directly
node analytics-config-unit-tests.js

# Or using npm script
npm run test:analytics-unit
```

### All Analytics Tests
```bash
# Run all analytics tests with summary
node run-analytics-tests.js

# Or using npm script
npm run test:analytics-all
```

## Test Results

The tests generate detailed reports in the `reports/` directory:
- `analytics-config-unit-tests.json` - Detailed test results with individual test outcomes

### Sample Output
```
🚀 Starting Analytics Configuration Unit Tests...

🧪 Testing Google Analytics configuration parsing...
  ✅ GA4 Tracking ID Format Validation - Valid IDs: Valid IDs correctly identified: 3/3
  ✅ GA4 Tracking ID Format Validation - Invalid IDs: Invalid IDs correctly rejected: 5/5
  ✅ GA4 Configuration Override Handling: Services config overrides base config: G-OVERRIDE123
  ✅ GA4 Privacy Settings Extraction: DNT: true, Anonymize IP: true

📘 Testing Facebook Pixel configuration parsing...
  ✅ Facebook Pixel ID Validation - Valid IDs: Valid Pixel IDs correctly identified: 3/3
  ✅ Facebook Pixel Event Configuration Parsing: Enabled: true, Pixel ID: 123456789012345

🔒 Testing privacy settings parsing...
  ✅ Do Not Track Configuration Parsing: Results: [true, false, true, false, true]
  ✅ Cookie Consent Configuration Parsing: Config 1: enabled=true, banner=true, custom=true

🚫 Testing Do Not Track functionality...
  ✅ Do Not Track Detection Logic: Correct detections: 8/8
  ✅ Analytics Manager DNT Integration: Correct DNT handling: 4/4 scenarios

✅ Testing configuration validation...
  ✅ GA Configuration Required Field Validation: Valid configs: 2/2 expected
  ✅ Configuration Type Validation and Normalization: Successfully normalized different data types

Total Tests: 19
Passed: 19
Failed: 0
Success Rate: 100.0%
```

## Test Coverage Areas

1. **Configuration Parsing**: Google Analytics and Facebook Pixel configuration extraction and validation
2. **Privacy Settings**: Do Not Track, IP anonymization, and cookie consent configuration  
3. **Type Validation**: Handling of different data types and string booleans
4. **Default Values**: Application of default values for incomplete configurations
5. **DNT Functionality**: Do Not Track detection logic and analytics manager integration

## Configuration Examples Tested

### Google Analytics 4
```toml
GoogleAnalyticsID = "G-JKSVCT23D1"

[services]
  [services.googleAnalytics]
    ID = "G-OVERRIDE123"  # Overrides GoogleAnalyticsID

[privacy]
  [privacy.googleAnalytics]
    respectDoNotTrack = true
    anonymizeIP = true
```

### Facebook Pixel
```toml
[params]
  [params.facebookPixel]
    enabled = true
    pixelId = "123456789012345"
    
    [params.facebookPixel.events]
      pageView = true
      viewContent = false
      search = true
      contact = false
      lead = true
```

### Privacy Settings
```toml
[params]
  [params.privacy]
    respectDoNotTrack = true
    cookieConsent = true
    
    [params.privacy.consentBanner]
      enabled = true
      message = "This website uses cookies to enhance your experience."
```

## Implementation Notes

- Tests use pure JavaScript logic to simulate the Hugo template parsing behavior
- No external dependencies required (uses only Node.js built-in modules)
- Tests validate both positive and negative cases
- Comprehensive error handling and edge case testing
- String boolean handling for TOML configuration compatibility
- Default value testing ensures robust configuration handling

## Future Enhancements

- Integration tests with actual Hugo builds (when build environment is stable)
- Performance testing for configuration parsing
- Additional analytics service configurations (e.g., Google Tag Manager)
- Cross-browser DNT detection testing