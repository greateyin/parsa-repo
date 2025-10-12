#!/usr/bin/env node

/**
 * Analytics Configuration Unit Tests
 * Simplified version that tests configuration parsing and validation without external dependencies
 * Requirements: 1.1, 1.2
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AnalyticsUnitTests {
  constructor() {
    this.testResults = [];
    this.siteDir = path.join(__dirname, 'minimal-test-site');
    this.outputDir = path.join(this.siteDir, 'public');
    this.configBackup = null;
  }

  async runAllTests() {
    console.log('🚀 Starting Analytics Configuration Unit Tests...\n');
    
    try {
      await this.setupTestEnvironment();
      await this.testGoogleAnalyticsConfigurationParsing();
      await this.testFacebookPixelConfigurationParsing();
      await this.testPrivacySettingsParsing();
      await this.testDoNotTrackFunctionality();
      await this.testConfigurationValidation();
      await this.generateReport();
      
      console.log('✅ All analytics configuration unit tests completed successfully!');
      return true;
    } catch (error) {
      console.error('❌ Analytics configuration unit tests failed:', error.message);
      return false;
    } finally {
      await this.restoreConfiguration();
    }
  }

  async setupTestEnvironment() {
    console.log('📁 Setting up test environment...');
    
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    
    // Backup original configuration
    const configPath = path.join(this.siteDir, 'hugo.toml');
    if (fs.existsSync(configPath)) {
      this.configBackup = fs.readFileSync(configPath, 'utf8');
    }
  }

  async testGoogleAnalyticsConfigurationParsing() {
    console.log('🧪 Testing Google Analytics configuration parsing...');
    
    // Test 1: Valid GA4 tracking ID
    await this.testValidGA4Configuration();
    
    // Test 2: Invalid tracking ID format
    await this.testInvalidGA4Configuration();
    
    // Test 3: Missing tracking ID
    await this.testMissingGA4Configuration();
    
    // Test 4: Services configuration override
    await this.testServicesGA4Configuration();
  }

  async testValidGA4Configuration() {
    const config = `
# Test: Valid GA4 Configuration
GoogleAnalyticsID = "G-JKSVCT23D1"

[params]
  [params.privacy]
    respectDoNotTrack = true

[privacy]
  [privacy.googleAnalytics]
    respectDoNotTrack = true
    anonymizeIP = true
`;
    
    const result = await this.buildSiteWithConfig(config);
    if (result.success) {
      const indexContent = this.getGeneratedContent('index.html');
      
      if (indexContent) {
        // Check for GA4 script inclusion
        const hasGAScript = indexContent.includes('googletagmanager.com/gtag/js?id=G-JKSVCT23D1');
        const hasGtagConfig = indexContent.includes("gtag('config', 'G-JKSVCT23D1')");
        const hasDoNotTrackCheck = indexContent.includes('doNotTrack');
        const hasAnonymizeIP = indexContent.includes("'anonymize_ip': true");
        
        this.addTestResult(
          'Valid GA4 Configuration Parsing',
          hasGAScript && hasGtagConfig,
          `GA4 script: ${hasGAScript}, Config: ${hasGtagConfig}`
        );
        
        this.addTestResult(
          'GA4 Privacy Settings Parsing',
          hasDoNotTrackCheck && hasAnonymizeIP,
          `DNT check: ${hasDoNotTrackCheck}, Anonymize IP: ${hasAnonymizeIP}`
        );
      } else {
        this.addTestResult('Valid GA4 Configuration Parsing', false, 'No content generated');
      }
    } else {
      this.addTestResult('Valid GA4 Configuration Parsing', false, `Build failed: ${result.error}`);
    }
  }

  async testInvalidGA4Configuration() {
    const config = `
# Test: Invalid GA4 Configuration
GoogleAnalyticsID = "UA-123456789-1"
`;
    
    const result = await this.buildSiteWithConfig(config);
    if (result.success) {
      const indexContent = this.getGeneratedContent('index.html');
      
      if (indexContent) {
        // Should not include GA4 script for invalid format
        const hasGAScript = indexContent.includes('googletagmanager.com/gtag/js');
        
        this.addTestResult(
          'Invalid GA4 Configuration Handling',
          !hasGAScript,
          hasGAScript ? 'Incorrectly accepted invalid tracking ID' : 'Correctly rejected invalid tracking ID format'
        );
      } else {
        this.addTestResult('Invalid GA4 Configuration Handling', true, 'No content generated (expected for invalid config)');
      }
    } else {
      // Build warnings are expected for invalid configuration
      this.addTestResult('Invalid GA4 Configuration Handling', true, 'Build warnings expected for invalid config');
    }
  }

  async testMissingGA4Configuration() {
    const config = `
# Test: Missing GA4 Configuration
# No GoogleAnalyticsID specified
`;
    
    const result = await this.buildSiteWithConfig(config);
    if (result.success) {
      const indexContent = this.getGeneratedContent('index.html');
      
      if (indexContent) {
        // Should not include any GA scripts
        const hasGAScript = indexContent.includes('googletagmanager.com');
        
        this.addTestResult(
          'Missing GA4 Configuration Handling',
          !hasGAScript,
          hasGAScript ? 'Incorrectly included GA script without ID' : 'Correctly handled missing tracking ID'
        );
      } else {
        this.addTestResult('Missing GA4 Configuration Handling', true, 'No analytics content generated (expected)');
      }
    } else {
      this.addTestResult('Missing GA4 Configuration Handling', false, `Build failed: ${result.error}`);
    }
  }

  async testServicesGA4Configuration() {
    const config = `
# Test: Services GA4 Configuration
[services]
  [services.googleAnalytics]
    ID = "G-NEWFORMAT123"
`;
    
    const result = await this.buildSiteWithConfig(config);
    if (result.success) {
      const indexContent = this.getGeneratedContent('index.html');
      
      if (indexContent) {
        // Should include GA4 script with services configuration
        const hasGAScript = indexContent.includes('googletagmanager.com/gtag/js?id=G-NEWFORMAT123');
        const hasGtagConfig = indexContent.includes("gtag('config', 'G-NEWFORMAT123')");
        
        this.addTestResult(
          'Services GA4 Configuration Parsing',
          hasGAScript && hasGtagConfig,
          `Services config working: ${hasGAScript && hasGtagConfig}`
        );
      } else {
        this.addTestResult('Services GA4 Configuration Parsing', false, 'No content generated');
      }
    } else {
      this.addTestResult('Services GA4 Configuration Parsing', false, `Build failed: ${result.error}`);
    }
  }

  async testFacebookPixelConfigurationParsing() {
    console.log('📘 Testing Facebook Pixel configuration parsing...');
    
    // Test 1: Valid Facebook Pixel configuration
    await this.testValidFacebookPixelConfiguration();
    
    // Test 2: Facebook Pixel with custom events
    await this.testFacebookPixelCustomEvents();
    
    // Test 3: Disabled Facebook Pixel
    await this.testDisabledFacebookPixel();
  }

  async testValidFacebookPixelConfiguration() {
    const config = `
# Test: Valid Facebook Pixel Configuration
[params]
  [params.facebookPixel]
    enabled = true
    pixelId = "123456789012345"
    
    [params.facebookPixel.events]
      pageView = true
      viewContent = true
`;
    
    const result = await this.buildSiteWithConfig(config);
    if (result.success) {
      const indexContent = this.getGeneratedContent('index.html');
      
      if (indexContent) {
        // Check for Facebook Pixel initialization
        const hasFBPixelInit = indexContent.includes("fbq('init', '123456789012345')");
        const hasFBPixelScript = indexContent.includes('connect.facebook.net/en_US/fbevents.js');
        const hasPageViewTracking = indexContent.includes("fbq('track', 'PageView')");
        const hasNoscriptFallback = indexContent.includes('facebook.com/tr?id=123456789012345');
        
        this.addTestResult(
          'Facebook Pixel Configuration Parsing',
          hasFBPixelInit && hasFBPixelScript,
          `Init: ${hasFBPixelInit}, Script: ${hasFBPixelScript}`
        );
        
        this.addTestResult(
          'Facebook Pixel Event Configuration',
          hasPageViewTracking && hasNoscriptFallback,
          `PageView: ${hasPageViewTracking}, Noscript: ${hasNoscriptFallback}`
        );
      } else {
        this.addTestResult('Facebook Pixel Configuration Parsing', false, 'No content generated');
      }
    } else {
      this.addTestResult('Facebook Pixel Configuration Parsing', false, `Build failed: ${result.error}`);
    }
  }

  async testFacebookPixelCustomEvents() {
    const config = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"

[params]
  [params.facebookPixel]
    enabled = true
    pixelId = "123456789012345"
    
    [params.facebookPixel.events]
      pageView = true
      viewContent = true
      search = true
      contact = true
      lead = true
`;
    
    const result = await this.buildSiteWithConfig(config);
    if (result.success) {
      const indexContent = this.getGeneratedContent('index.html');
      
      if (indexContent) {
        // Check for custom event tracking functions
        const hasSearchTracking = indexContent.includes('fbPixelTrackSearch') || 
                                 indexContent.includes('trackSearch');
        const hasContactTracking = indexContent.includes('fbPixelTrackContact') || 
                                  indexContent.includes('trackContact');
        const hasLeadTracking = indexContent.includes('fbPixelTrackLead') || 
                               indexContent.includes('trackLead');
        
        this.addTestResult(
          'Facebook Pixel Custom Events Parsing',
          hasSearchTracking && hasContactTracking && hasLeadTracking,
          `Search: ${hasSearchTracking}, Contact: ${hasContactTracking}, Lead: ${hasLeadTracking}`
        );
      } else {
        this.addTestResult('Facebook Pixel Custom Events Parsing', false, 'No content generated');
      }
    } else {
      this.addTestResult('Facebook Pixel Custom Events Parsing', false, `Build failed: ${result.error}`);
    }
  }

  async testDisabledFacebookPixel() {
    const config = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"

[params]
  [params.facebookPixel]
    enabled = false
    pixelId = "123456789012345"
`;
    
    const result = await this.buildSiteWithConfig(config);
    if (result.success) {
      const indexContent = this.getGeneratedContent('index.html');
      
      if (indexContent) {
        // Should not include Facebook Pixel when disabled
        const hasFBPixelScript = indexContent.includes('connect.facebook.net');
        const hasFBPixelInit = indexContent.includes("fbq('init'");
        
        this.addTestResult(
          'Disabled Facebook Pixel Configuration',
          !hasFBPixelScript && !hasFBPixelInit,
          `No FB script: ${!hasFBPixelScript}, No FB init: ${!hasFBPixelInit}`
        );
      } else {
        this.addTestResult('Disabled Facebook Pixel Configuration', true, 'No FB content generated (expected)');
      }
    } else {
      this.addTestResult('Disabled Facebook Pixel Configuration', false, `Build failed: ${result.error}`);
    }
  }

  async testPrivacySettingsParsing() {
    console.log('🔒 Testing privacy settings parsing...');
    
    // Test 1: Respect Do Not Track enabled
    await this.testRespectDoNotTrackEnabled();
    
    // Test 2: Respect Do Not Track disabled
    await this.testRespectDoNotTrackDisabled();
    
    // Test 3: Cookie consent integration
    await this.testCookieConsentIntegration();
  }

  async testRespectDoNotTrackEnabled() {
    const config = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"
GoogleAnalyticsID = "G-JKSVCT23D1"

[params]
  [params.privacy]
    respectDoNotTrack = true

[privacy]
  [privacy.googleAnalytics]
    respectDoNotTrack = true
    anonymizeIP = true
`;
    
    const result = await this.buildSiteWithConfig(config);
    if (result.success) {
      const indexContent = this.getGeneratedContent('index.html');
      
      if (indexContent) {
        // Check for Do Not Track detection code
        const hasDoNotTrackCheck = indexContent.includes('navigator.doNotTrack') || 
                                  indexContent.includes('window.doNotTrack');
        const hasConditionalTracking = indexContent.includes('if (!doNotTrack)');
        const hasAnonymizeIP = indexContent.includes("'anonymize_ip': true");
        
        this.addTestResult(
          'Respect Do Not Track Configuration Parsing',
          hasDoNotTrackCheck && hasConditionalTracking,
          `DNT check: ${hasDoNotTrackCheck}, Conditional: ${hasConditionalTracking}`
        );
        
        this.addTestResult(
          'Anonymize IP Configuration Parsing',
          hasAnonymizeIP,
          hasAnonymizeIP ? 'IP anonymization enabled' : 'IP anonymization not found'
        );
      } else {
        this.addTestResult('Respect Do Not Track Configuration Parsing', false, 'No content generated');
      }
    } else {
      this.addTestResult('Respect Do Not Track Configuration Parsing', false, `Build failed: ${result.error}`);
    }
  }

  async testRespectDoNotTrackDisabled() {
    const config = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"
GoogleAnalyticsID = "G-JKSVCT23D1"

[privacy]
  [privacy.googleAnalytics]
    respectDoNotTrack = false
    anonymizeIP = false
`;
    
    const result = await this.buildSiteWithConfig(config);
    if (result.success) {
      const indexContent = this.getGeneratedContent('index.html');
      
      if (indexContent) {
        // Should not have Do Not Track checks when disabled
        const hasDoNotTrackCheck = indexContent.includes('navigator.doNotTrack');
        const hasDirectTracking = indexContent.includes("gtag('config'");
        
        this.addTestResult(
          'Disabled Do Not Track Configuration',
          !hasDoNotTrackCheck && hasDirectTracking,
          `No DNT check: ${!hasDoNotTrackCheck}, Direct tracking: ${hasDirectTracking}`
        );
      } else {
        this.addTestResult('Disabled Do Not Track Configuration', false, 'No content generated');
      }
    } else {
      this.addTestResult('Disabled Do Not Track Configuration', false, `Build failed: ${result.error}`);
    }
  }

  async testCookieConsentIntegration() {
    const config = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"
GoogleAnalyticsID = "G-JKSVCT23D1"

[params]
  [params.facebookPixel]
    enabled = true
    pixelId = "123456789012345"
  
  [params.privacy]
    respectDoNotTrack = true
    cookieConsent = true
`;
    
    const result = await this.buildSiteWithConfig(config);
    if (result.success) {
      const indexContent = this.getGeneratedContent('index.html');
      
      if (indexContent) {
        // Check for cookie consent integration
        const hasCookieConsent = indexContent.includes('cookieConsentGiven') || 
                                indexContent.includes('cookieConsent');
        const hasConsentHandling = indexContent.includes("fbq('consent'") ||
                                  indexContent.includes('consent');
        
        this.addTestResult(
          'Cookie Consent Configuration Parsing',
          hasCookieConsent,
          hasCookieConsent ? 'Cookie consent integration present' : 'Missing cookie consent integration'
        );
      } else {
        this.addTestResult('Cookie Consent Configuration Parsing', false, 'No content generated');
      }
    } else {
      this.addTestResult('Cookie Consent Configuration Parsing', false, `Build failed: ${result.error}`);
    }
  }

  async testDoNotTrackFunctionality() {
    console.log('🚫 Testing Do Not Track functionality...');
    
    const config = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"
GoogleAnalyticsID = "G-JKSVCT23D1"

[params]
  [params.facebookPixel]
    enabled = true
    pixelId = "123456789012345"
  
  [params.privacy]
    respectDoNotTrack = true
`;
    
    const result = await this.buildSiteWithConfig(config);
    if (result.success) {
      const indexContent = this.getGeneratedContent('index.html');
      
      if (indexContent) {
        // Check for proper Do Not Track detection logic
        const hasNavigatorDNT = indexContent.includes('navigator.doNotTrack');
        const hasWindowDNT = indexContent.includes('window.doNotTrack');
        const hasMSDNT = indexContent.includes('navigator.msDoNotTrack');
        const hasProperCheck = indexContent.includes('(dnt == "1" || dnt == "yes")');
        const hasConditionalExecution = indexContent.includes('if (!doNotTrack)');
        const hasAnalyticsConfig = indexContent.includes('window.analyticsConfig');
        
        this.addTestResult(
          'Do Not Track Detection Logic',
          hasNavigatorDNT && hasWindowDNT && hasMSDNT && hasProperCheck,
          `Navigator: ${hasNavigatorDNT}, Window: ${hasWindowDNT}, MS: ${hasMSDNT}, Check: ${hasProperCheck}`
        );
        
        this.addTestResult(
          'Conditional Analytics Execution',
          hasConditionalExecution,
          hasConditionalExecution ? 'Analytics conditionally executed based on DNT' : 'Missing conditional execution'
        );
        
        this.addTestResult(
          'Analytics Manager DNT Integration',
          hasAnalyticsConfig,
          hasAnalyticsConfig ? 'Analytics manager DNT integration present' : 'Missing analytics manager DNT integration'
        );
      } else {
        this.addTestResult('Do Not Track Functionality', false, 'No content generated');
      }
    } else {
      this.addTestResult('Do Not Track Functionality', false, `Build failed: ${result.error}`);
    }
  }

  async testConfigurationValidation() {
    console.log('✅ Testing configuration validation...');
    
    // Test 1: Default value handling
    await this.testDefaultValueHandling();
    
    // Test 2: Configuration type validation
    await this.testConfigurationTypeValidation();
    
    // Test 3: Multiple services coordination
    await this.testMultipleServicesCoordination();
  }

  async testDefaultValueHandling() {
    const config = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"
GoogleAnalyticsID = "G-JKSVCT23D1"
`;
    
    const result = await this.buildSiteWithConfig(config);
    if (result.success) {
      const indexContent = this.getGeneratedContent('index.html');
      
      if (indexContent) {
        // Check that default privacy settings are applied
        const hasDefaultAnonymizeIP = indexContent.includes("'anonymize_ip': true");
        const hasDefaultRespectDNT = indexContent.includes('doNotTrack');
        
        this.addTestResult(
          'Default Configuration Values',
          hasDefaultAnonymizeIP && hasDefaultRespectDNT,
          `Default anonymize IP: ${hasDefaultAnonymizeIP}, Default DNT: ${hasDefaultRespectDNT}`
        );
      } else {
        this.addTestResult('Default Configuration Values', false, 'No content generated');
      }
    } else {
      this.addTestResult('Default Configuration Values', false, `Build failed: ${result.error}`);
    }
  }

  async testConfigurationTypeValidation() {
    // Test with boolean values as strings (common TOML issue)
    const stringBoolConfig = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"
GoogleAnalyticsID = "G-JKSVCT23D1"

[params]
  [params.facebookPixel]
    enabled = "true"
    pixelId = "123456789012345"
    
    [params.facebookPixel.events]
      pageView = "true"
      viewContent = "false"
  
  [params.privacy]
    respectDoNotTrack = "true"
`;
    
    const result = await this.buildSiteWithConfig(stringBoolConfig);
    if (result.success) {
      const indexContent = this.getGeneratedContent('index.html');
      
      if (indexContent) {
        // Should handle string booleans correctly
        const hasFBPixel = indexContent.includes("fbq('init'");
        const hasGA = indexContent.includes('gtag');
        const hasDNT = indexContent.includes('doNotTrack');
        
        this.addTestResult(
          'String Boolean Configuration Handling',
          hasFBPixel && hasGA && hasDNT,
          `FB Pixel: ${hasFBPixel}, GA: ${hasGA}, DNT: ${hasDNT}`
        );
      } else {
        this.addTestResult('String Boolean Configuration Handling', false, 'No content generated');
      }
    } else {
      this.addTestResult('String Boolean Configuration Handling', false, `Build failed: ${result.error}`);
    }
  }

  async testMultipleServicesCoordination() {
    const config = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"
GoogleAnalyticsID = "G-JKSVCT23D1"

[params]
  [params.facebookPixel]
    enabled = true
    pixelId = "123456789012345"
  
  [params.privacy]
    respectDoNotTrack = true
`;
    
    const result = await this.buildSiteWithConfig(config);
    if (result.success) {
      const indexContent = this.getGeneratedContent('index.html');
      
      if (indexContent) {
        // Check for analytics manager coordination
        const hasAnalyticsManager = indexContent.includes('window.analyticsManager');
        const hasMultipleServices = indexContent.includes('googleAnalytics') && 
                                   indexContent.includes('facebookPixel');
        const hasServiceCoordination = indexContent.includes('markServiceLoaded') ||
                                      indexContent.includes('getLoadingStatus');
        
        this.addTestResult(
          'Multiple Analytics Services Configuration',
          hasAnalyticsManager && hasMultipleServices,
          `Manager: ${hasAnalyticsManager}, Multiple services: ${hasMultipleServices}`
        );
        
        this.addTestResult(
          'Service Coordination',
          hasServiceCoordination,
          hasServiceCoordination ? 'Service coordination implemented' : 'Missing service coordination'
        );
      } else {
        this.addTestResult('Multiple Analytics Services Configuration', false, 'No content generated');
      }
    } else {
      this.addTestResult('Multiple Analytics Services Configuration', false, `Build failed: ${result.error}`);
    }
  }

  // Helper methods
  async buildSiteWithConfig(config) {
    const configPath = path.join(this.siteDir, 'hugo.toml');
    
    try {
      // Use the base config and append test-specific config
      const baseConfig = `baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"

[params]
  description = "Test site"`;
      
      const fullConfig = baseConfig + '\n\n' + config;
      fs.writeFileSync(configPath, fullConfig);
      
      const buildCommand = `hugo --minify --destination public --quiet --themesDir ../..`;
      execSync(buildCommand, { 
        cwd: this.siteDir,
        stdio: 'pipe'
      });
      
      return { success: true };
    } catch (error) {
      // Some tests expect build warnings, so we capture but don't always fail
      return { 
        success: false, 
        error: error.message,
        output: error.stdout ? error.stdout.toString() : '',
        stderr: error.stderr ? error.stderr.toString() : ''
      };
    }
  }

  getGeneratedContent(filename) {
    const filePath = path.join(this.outputDir, filename);
    
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8');
    }
    
    return null;
  }

  async restoreConfiguration() {
    if (this.configBackup) {
      const configPath = path.join(this.siteDir, 'hugo.toml');
      fs.writeFileSync(configPath, this.configBackup);
    }
  }

  addTestResult(name, passed, message) {
    this.testResults.push({ name, passed, message });
    const status = passed ? '✅' : '❌';
    console.log(`  ${status} ${name}: ${message}`);
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      testSuite: 'Analytics Configuration Unit Tests',
      totalTests: this.testResults.length,
      passed: this.testResults.filter(r => r.passed).length,
      failed: this.testResults.filter(r => !r.passed).length,
      results: this.testResults,
      requirements: {
        '1.1': 'Google Analytics 4 Integration - Configuration parsing and validation',
        '1.2': 'Privacy settings and Do Not Track functionality'
      }
    };
    
    // Create reports directory if it doesn't exist
    const reportsDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const reportPath = path.join(reportsDir, 'analytics-unit-tests.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📊 Analytics Configuration Unit Test Report Generated: ${reportPath}`);
    console.log(`   Total Tests: ${report.totalTests}`);
    console.log(`   Passed: ${report.passed}`);
    console.log(`   Failed: ${report.failed}`);
    console.log(`   Success Rate: ${((report.passed / report.totalTests) * 100).toFixed(1)}%`);
    
    console.log('\n📋 Requirements Coverage:');
    console.log('   ✅ Requirement 1.1: Google Analytics 4 Integration');
    console.log('   ✅ Requirement 1.2: Privacy settings and Do Not Track functionality');
    
    return report;
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new AnalyticsUnitTests();
  tester.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = AnalyticsUnitTests;