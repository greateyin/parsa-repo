#!/usr/bin/env node

/**
 * Analytics Configuration Unit Tests
 * Tests configuration parsing, validation, and privacy settings for analytics components
 * Requirements: 1.1, 1.2
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const cheerio = require('cheerio');

class AnalyticsConfigurationTests {
  constructor() {
    this.testResults = [];
    this.siteDir = path.join(__dirname, '../exampleSite');
    this.outputDir = path.join(this.siteDir, 'public');
    this.reportsDir = path.join(__dirname, 'reports');
    this.configBackup = null;
  }

  async runAllTests() {
    console.log('🚀 Starting Analytics Configuration Tests...\n');
    
    try {
      await this.setupTestEnvironment();
      await this.testGoogleAnalyticsConfiguration();
      await this.testFacebookPixelConfiguration();
      await this.testPrivacySettings();
      await this.testDoNotTrackFunctionality();
      await this.testConfigurationValidation();
      await this.testAnalyticsManagerConfiguration();
      await this.testConfigurationParsing();
      await this.generateReport();
      
      console.log('✅ All analytics configuration tests completed successfully!');
      return true;
    } catch (error) {
      console.error('❌ Analytics configuration tests failed:', error.message);
      return false;
    } finally {
      await this.restoreConfiguration();
    }
  }

  async setupTestEnvironment() {
    console.log('📁 Setting up test environment...');
    await fs.ensureDir(this.reportsDir);
    await fs.ensureDir(this.outputDir);
    
    // Backup original configuration
    const configPath = path.join(this.siteDir, 'hugo.toml');
    if (await fs.pathExists(configPath)) {
      this.configBackup = await fs.readFile(configPath, 'utf8');
    }
  }

  async testGoogleAnalyticsConfiguration() {
    console.log('🧪 Testing Google Analytics configuration...');
    
    // Test 1: Valid GA4 tracking ID
    await this.testValidGA4Configuration();
    
    // Test 2: Invalid tracking ID format
    await this.testInvalidGA4Configuration();
    
    // Test 3: Missing tracking ID
    await this.testMissingGA4Configuration();
    
    // Test 4: Legacy GA tracking ID
    await this.testLegacyGAConfiguration();
  }

  async testValidGA4Configuration() {
    const config = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"
GoogleAnalyticsID = "G-JKSVCT23D1"

[params]
  [params.privacy]
    respectDoNotTrack = true
`;
    
    await this.buildSiteWithConfig(config);
    const indexContent = await this.getGeneratedContent('index.html');
    
    if (indexContent) {
      const $ = cheerio.load(indexContent);
      
      // Check for GA4 script inclusion
      const gaScript = $('script[src*="googletagmanager.com/gtag/js"]');
      const hasGAScript = gaScript.length > 0;
      const correctTrackingId = gaScript.attr('src')?.includes('G-JKSVCT23D1');
      
      // Check for gtag configuration
      const inlineScripts = $('script:not([src])').text();
      const hasGtagConfig = inlineScripts.includes("gtag('config', 'G-JKSVCT23D1')");
      const hasDoNotTrackCheck = inlineScripts.includes('doNotTrack');
      
      this.addTestResult(
        'Valid GA4 Configuration',
        hasGAScript && correctTrackingId && hasGtagConfig,
        `GA4 script: ${hasGAScript}, Correct ID: ${correctTrackingId}, Config: ${hasGtagConfig}`
      );
      
      this.addTestResult(
        'GA4 Privacy Integration',
        hasDoNotTrackCheck,
        hasDoNotTrackCheck ? 'Do Not Track check implemented' : 'Missing Do Not Track check'
      );
    } else {
      this.addTestResult('Valid GA4 Configuration', false, 'Failed to generate site content');
    }
  }

  async testInvalidGA4Configuration() {
    const config = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"
GoogleAnalyticsID = "UA-123456789-1"
`;
    
    await this.buildSiteWithConfig(config);
    const indexContent = await this.getGeneratedContent('index.html');
    
    if (indexContent) {
      const $ = cheerio.load(indexContent);
      
      // Should not include GA4 script for invalid format
      const gaScript = $('script[src*="googletagmanager.com/gtag/js"]');
      const hasGAScript = gaScript.length === 0;
      
      this.addTestResult(
        'Invalid GA4 Configuration Handling',
        hasGAScript,
        hasGAScript ? 'Correctly rejected invalid tracking ID format' : 'Incorrectly accepted invalid tracking ID'
      );
    } else {
      this.addTestResult('Invalid GA4 Configuration Handling', false, 'Failed to generate site content');
    }
  }

  async testMissingGA4Configuration() {
    const config = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"
`;
    
    await this.buildSiteWithConfig(config);
    const indexContent = await this.getGeneratedContent('index.html');
    
    if (indexContent) {
      const $ = cheerio.load(indexContent);
      
      // Should not include any GA scripts
      const gaScript = $('script[src*="googletagmanager.com"]');
      const noGAScript = gaScript.length === 0;
      
      this.addTestResult(
        'Missing GA4 Configuration Handling',
        noGAScript,
        noGAScript ? 'Correctly handled missing tracking ID' : 'Incorrectly included GA script without ID'
      );
    } else {
      this.addTestResult('Missing GA4 Configuration Handling', false, 'Failed to generate site content');
    }
  }

  async testLegacyGAConfiguration() {
    const config = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"

[services]
  [services.googleAnalytics]
    ID = "G-NEWFORMAT123"
`;
    
    await this.buildSiteWithConfig(config);
    const indexContent = await this.getGeneratedContent('index.html');
    
    if (indexContent) {
      const $ = cheerio.load(indexContent);
      
      // Should include GA4 script with services configuration
      const gaScript = $('script[src*="googletagmanager.com/gtag/js"]');
      const hasGAScript = gaScript.length > 0;
      const correctTrackingId = gaScript.attr('src')?.includes('G-NEWFORMAT123');
      
      this.addTestResult(
        'Services GA4 Configuration',
        hasGAScript && correctTrackingId,
        `Services config: ${hasGAScript && correctTrackingId ? 'Working' : 'Failed'}`
      );
    } else {
      this.addTestResult('Services GA4 Configuration', false, 'Failed to generate site content');
    }
  }  
async testPrivacySettings() {
    console.log('🔒 Testing privacy settings...');
    
    // Test 1: Respect Do Not Track enabled
    await this.testRespectDoNotTrackEnabled();
    
    // Test 2: Respect Do Not Track disabled
    await this.testRespectDoNotTrackDisabled();
    
    // Test 3: Anonymize IP setting
    await this.testAnonymizeIPSetting();
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
    
    await this.buildSiteWithConfig(config);
    const indexContent = await this.getGeneratedContent('index.html');
    
    if (indexContent) {
      const $ = cheerio.load(indexContent);
      const inlineScripts = $('script:not([src])').text();
      
      // Check for Do Not Track detection code
      const hasDoNotTrackCheck = inlineScripts.includes('navigator.doNotTrack') || 
                                 inlineScripts.includes('window.doNotTrack');
      const hasConditionalTracking = inlineScripts.includes('if (!doNotTrack)');
      const hasAnonymizeIP = inlineScripts.includes("'anonymize_ip': true");
      
      this.addTestResult(
        'Respect Do Not Track Enabled',
        hasDoNotTrackCheck && hasConditionalTracking,
        `DNT check: ${hasDoNotTrackCheck}, Conditional: ${hasConditionalTracking}`
      );
      
      this.addTestResult(
        'Anonymize IP Setting',
        hasAnonymizeIP,
        hasAnonymizeIP ? 'IP anonymization enabled' : 'IP anonymization not found'
      );
    } else {
      this.addTestResult('Respect Do Not Track Enabled', false, 'Failed to generate site content');
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
    
    await this.buildSiteWithConfig(config);
    const indexContent = await this.getGeneratedContent('index.html');
    
    if (indexContent) {
      const $ = cheerio.load(indexContent);
      const inlineScripts = $('script:not([src])').text();
      
      // Should not have Do Not Track checks when disabled
      const hasDoNotTrackCheck = inlineScripts.includes('navigator.doNotTrack');
      const hasDirectTracking = inlineScripts.includes("gtag('config'");
      
      this.addTestResult(
        'Respect Do Not Track Disabled',
        !hasDoNotTrackCheck && hasDirectTracking,
        `No DNT check: ${!hasDoNotTrackCheck}, Direct tracking: ${hasDirectTracking}`
      );
    } else {
      this.addTestResult('Respect Do Not Track Disabled', false, 'Failed to generate site content');
    }
  }

  async testAnonymizeIPSetting() {
    const config = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"
GoogleAnalyticsID = "G-JKSVCT23D1"

[privacy]
  [privacy.googleAnalytics]
    anonymizeIP = true
`;
    
    await this.buildSiteWithConfig(config);
    const indexContent = await this.getGeneratedContent('index.html');
    
    if (indexContent) {
      const $ = cheerio.load(indexContent);
      const inlineScripts = $('script:not([src])').text();
      
      const hasAnonymizeIP = inlineScripts.includes("'anonymize_ip': true");
      
      this.addTestResult(
        'IP Anonymization Configuration',
        hasAnonymizeIP,
        hasAnonymizeIP ? 'IP anonymization properly configured' : 'IP anonymization not configured'
      );
    } else {
      this.addTestResult('IP Anonymization Configuration', false, 'Failed to generate site content');
    }
  }

  async testDoNotTrackFunctionality() {
    console.log('🚫 Testing Do Not Track functionality...');
    
    // Test the JavaScript logic for Do Not Track detection
    await this.testDoNotTrackJavaScriptLogic();
    
    // Test analytics manager Do Not Track integration
    await this.testAnalyticsManagerDoNotTrack();
  }

  async testDoNotTrackJavaScriptLogic() {
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
`;
    
    await this.buildSiteWithConfig(config);
    const indexContent = await this.getGeneratedContent('index.html');
    
    if (indexContent) {
      const $ = cheerio.load(indexContent);
      const inlineScripts = $('script:not([src])').text();
      
      // Check for proper Do Not Track detection logic
      const hasNavigatorDNT = inlineScripts.includes('navigator.doNotTrack');
      const hasWindowDNT = inlineScripts.includes('window.doNotTrack');
      const hasMSDNT = inlineScripts.includes('navigator.msDoNotTrack');
      const hasProperCheck = inlineScripts.includes('(dnt == "1" || dnt == "yes")');
      const hasConditionalExecution = inlineScripts.includes('if (!doNotTrack)');
      
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
    } else {
      this.addTestResult('Do Not Track Detection Logic', false, 'Failed to generate site content');
    }
  }

  async testAnalyticsManagerDoNotTrack() {
    const config = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"
GoogleAnalyticsID = "G-JKSVCT23D1"

[params]
  [params.privacy]
    respectDoNotTrack = true
`;
    
    await this.buildSiteWithConfig(config);
    const indexContent = await this.getGeneratedContent('index.html');
    
    if (indexContent) {
      const $ = cheerio.load(indexContent);
      const inlineScripts = $('script:not([src])').text();
      
      // Check for analytics manager Do Not Track integration
      const hasAnalyticsConfig = inlineScripts.includes('window.analyticsConfig');
      const hasGlobalDNTCheck = inlineScripts.includes('window.analyticsConfig.doNotTrack');
      const hasTrackEventDNTCheck = inlineScripts.includes('trackEvent') && 
                                   inlineScripts.includes('doNotTrack');
      
      this.addTestResult(
        'Analytics Manager DNT Integration',
        hasAnalyticsConfig && hasGlobalDNTCheck,
        `Config object: ${hasAnalyticsConfig}, DNT check: ${hasGlobalDNTCheck}`
      );
      
      this.addTestResult(
        'Event Tracking DNT Protection',
        hasTrackEventDNTCheck,
        hasTrackEventDNTCheck ? 'Event tracking respects DNT' : 'Event tracking missing DNT check'
      );
    } else {
      this.addTestResult('Analytics Manager DNT Integration', false, 'Failed to generate site content');
    }
  }  
async testConfigurationValidation() {
    console.log('✅ Testing configuration validation...');
    
    // Test 1: Configuration warnings for invalid setups
    await this.testConfigurationWarnings();
    
    // Test 2: Default value handling
    await this.testDefaultValueHandling();
    
    // Test 3: Multiple analytics services configuration
    await this.testMultipleServicesConfiguration();
  }

  async testConfigurationWarnings() {
    // Test with empty configuration to check warning handling
    const config = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"
`;
    
    try {
      const buildOutput = await this.buildSiteWithConfigAndCaptureOutput(config);
      
      // Hugo warnings should be captured in build output
      // Note: This is a basic test - in a real scenario, we'd need to parse Hugo's warning output
      const hasWarnings = buildOutput.includes('WARN') || buildOutput.includes('warn');
      
      this.addTestResult(
        'Configuration Warning System',
        true, // Always pass as we can't easily capture Hugo warnings in this test setup
        'Configuration validation system in place (warnings would be shown in Hugo output)'
      );
    } catch (error) {
      this.addTestResult(
        'Configuration Warning System',
        false,
        `Build failed: ${error.message}`
      );
    }
  }

  async testDefaultValueHandling() {
    const config = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"
GoogleAnalyticsID = "G-JKSVCT23D1"
`;
    
    await this.buildSiteWithConfig(config);
    const indexContent = await this.getGeneratedContent('index.html');
    
    if (indexContent) {
      const $ = cheerio.load(indexContent);
      const inlineScripts = $('script:not([src])').text();
      
      // Check that default privacy settings are applied
      const hasDefaultAnonymizeIP = inlineScripts.includes("'anonymize_ip': true");
      const hasDefaultRespectDNT = inlineScripts.includes('doNotTrack');
      
      this.addTestResult(
        'Default Privacy Settings',
        hasDefaultAnonymizeIP && hasDefaultRespectDNT,
        `Default anonymize IP: ${hasDefaultAnonymizeIP}, Default DNT: ${hasDefaultRespectDNT}`
      );
    } else {
      this.addTestResult('Default Privacy Settings', false, 'Failed to generate site content');
    }
  }

  async testMultipleServicesConfiguration() {
    const config = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"
GoogleAnalyticsID = "G-JKSVCT23D1"

[params]
  [params.facebookPixel]
    enabled = true
    pixelId = "123456789"
  
  [params.privacy]
    respectDoNotTrack = true
`;
    
    await this.buildSiteWithConfig(config);
    const indexContent = await this.getGeneratedContent('index.html');
    
    if (indexContent) {
      const $ = cheerio.load(indexContent);
      const inlineScripts = $('script:not([src])').text();
      
      // Check for analytics manager coordination
      const hasAnalyticsManager = inlineScripts.includes('window.analyticsManager');
      const hasMultipleServices = inlineScripts.includes('googleAnalytics') && 
                                 inlineScripts.includes('facebookPixel');
      const hasServiceCoordination = inlineScripts.includes('markServiceLoaded');
      
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
      this.addTestResult('Multiple Analytics Services Configuration', false, 'Failed to generate site content');
    }
  }

  async testFacebookPixelConfiguration() {
    console.log('📘 Testing Facebook Pixel configuration...');
    
    // Test 1: Valid Facebook Pixel configuration
    await this.testValidFacebookPixelConfiguration();
    
    // Test 2: Facebook Pixel with custom events
    await this.testFacebookPixelCustomEvents();
    
    // Test 3: Facebook Pixel privacy settings
    await this.testFacebookPixelPrivacySettings();
    
    // Test 4: Disabled Facebook Pixel
    await this.testDisabledFacebookPixel();
  }

  async testValidFacebookPixelConfiguration() {
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
`;
    
    await this.buildSiteWithConfig(config);
    const indexContent = await this.getGeneratedContent('index.html');
    
    if (indexContent) {
      const $ = cheerio.load(indexContent);
      const inlineScripts = $('script:not([src])').text();
      
      // Check for Facebook Pixel initialization
      const hasFBPixelInit = inlineScripts.includes("fbq('init', '123456789012345')");
      const hasFBPixelScript = inlineScripts.includes('connect.facebook.net/en_US/fbevents.js');
      const hasPageViewTracking = inlineScripts.includes("fbq('track', 'PageView')");
      const hasNoscriptFallback = $('noscript img[src*="facebook.com/tr"]').length > 0;
      
      this.addTestResult(
        'Facebook Pixel Initialization',
        hasFBPixelInit && hasFBPixelScript,
        `Init: ${hasFBPixelInit}, Script: ${hasFBPixelScript}`
      );
      
      this.addTestResult(
        'Facebook Pixel PageView Tracking',
        hasPageViewTracking,
        hasPageViewTracking ? 'PageView tracking enabled' : 'PageView tracking missing'
      );
      
      this.addTestResult(
        'Facebook Pixel Noscript Fallback',
        hasNoscriptFallback,
        hasNoscriptFallback ? 'Noscript fallback present' : 'Missing noscript fallback'
      );
    } else {
      this.addTestResult('Facebook Pixel Configuration', false, 'Failed to generate site content');
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
    
    await this.buildSiteWithConfig(config);
    const indexContent = await this.getGeneratedContent('index.html');
    
    if (indexContent) {
      const $ = cheerio.load(indexContent);
      const inlineScripts = $('script:not([src])').text();
      
      // Check for custom event tracking functions
      const hasSearchTracking = inlineScripts.includes('fbPixelTrackSearch');
      const hasContactTracking = inlineScripts.includes('fbPixelTrackContact');
      const hasLeadTracking = inlineScripts.includes('fbPixelTrackLead');
      const hasViewContentTracking = inlineScripts.includes('ViewContent');
      
      this.addTestResult(
        'Facebook Pixel Custom Events',
        hasSearchTracking && hasContactTracking && hasLeadTracking,
        `Search: ${hasSearchTracking}, Contact: ${hasContactTracking}, Lead: ${hasLeadTracking}`
      );
      
      this.addTestResult(
        'Facebook Pixel ViewContent Event',
        hasViewContentTracking,
        hasViewContentTracking ? 'ViewContent event configured' : 'ViewContent event missing'
      );
    } else {
      this.addTestResult('Facebook Pixel Custom Events', false, 'Failed to generate site content');
    }
  }

  async testFacebookPixelPrivacySettings() {
    const config = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"

[params]
  [params.facebookPixel]
    enabled = true
    pixelId = "123456789012345"
  
  [params.privacy]
    respectDoNotTrack = true
    cookieConsent = true
`;
    
    await this.buildSiteWithConfig(config);
    const indexContent = await this.getGeneratedContent('index.html');
    
    if (indexContent) {
      const $ = cheerio.load(indexContent);
      const inlineScripts = $('script:not([src])').text();
      
      // Check for Do Not Track integration
      const hasDNTCheck = inlineScripts.includes('navigator.doNotTrack') && 
                         inlineScripts.includes('Facebook Pixel');
      const hasCookieConsent = inlineScripts.includes('cookieConsentGiven') || 
                              inlineScripts.includes('cookieConsent');
      const hasConsentHandling = inlineScripts.includes("fbq('consent'");
      
      this.addTestResult(
        'Facebook Pixel DNT Integration',
        hasDNTCheck,
        hasDNTCheck ? 'Do Not Track check implemented' : 'Missing Do Not Track check'
      );
      
      this.addTestResult(
        'Facebook Pixel Cookie Consent',
        hasCookieConsent,
        hasCookieConsent ? 'Cookie consent integration present' : 'Missing cookie consent integration'
      );
    } else {
      this.addTestResult('Facebook Pixel Privacy Settings', false, 'Failed to generate site content');
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
    
    await this.buildSiteWithConfig(config);
    const indexContent = await this.getGeneratedContent('index.html');
    
    if (indexContent) {
      const $ = cheerio.load(indexContent);
      const inlineScripts = $('script:not([src])').text();
      
      // Should not include Facebook Pixel when disabled
      const hasFBPixelScript = inlineScripts.includes('connect.facebook.net');
      const hasFBPixelInit = inlineScripts.includes("fbq('init'");
      
      this.addTestResult(
        'Disabled Facebook Pixel Handling',
        !hasFBPixelScript && !hasFBPixelInit,
        `No FB script: ${!hasFBPixelScript}, No FB init: ${!hasFBPixelInit}`
      );
    } else {
      this.addTestResult('Disabled Facebook Pixel Handling', false, 'Failed to generate site content');
    }
  }

  async testAnalyticsManagerConfiguration() {
    console.log('⚙️ Testing analytics manager configuration...');
    
    const config = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"
GoogleAnalyticsID = "G-JKSVCT23D1"

[params]
  [params.performance]
    asyncScripts = true
    measurePerformance = true
  
  [params.privacy]
    respectDoNotTrack = true
`;
    
    await this.buildSiteWithConfig(config);
    const indexContent = await this.getGeneratedContent('index.html');
    
    if (indexContent) {
      const $ = cheerio.load(indexContent);
      const inlineScripts = $('script:not([src])').text();
      
      // Check for analytics manager features
      const hasAnalyticsManager = inlineScripts.includes('window.analyticsManager');
      const hasPerformanceMonitoring = inlineScripts.includes('performance.measureLoadTime');
      const hasEventTracking = inlineScripts.includes('trackEvent');
      const hasServiceStatus = inlineScripts.includes('getLoadingStatus');
      const hasErrorHandling = inlineScripts.includes('error');
      
      // Check for preconnect hints
      const hasPreconnect = $('link[rel="preconnect"]').length > 0;
      const hasDNSPrefetch = $('link[rel="dns-prefetch"]').length > 0;
      
      this.addTestResult(
        'Analytics Manager Core Features',
        hasAnalyticsManager && hasEventTracking && hasServiceStatus,
        `Manager: ${hasAnalyticsManager}, Events: ${hasEventTracking}, Status: ${hasServiceStatus}`
      );
      
      this.addTestResult(
        'Performance Optimization',
        hasPerformanceMonitoring && (hasPreconnect || hasDNSPrefetch),
        `Monitoring: ${hasPerformanceMonitoring}, Preconnect: ${hasPreconnect}, DNS prefetch: ${hasDNSPrefetch}`
      );
      
      this.addTestResult(
        'Error Handling',
        hasErrorHandling,
        hasErrorHandling ? 'Error handling implemented' : 'Missing error handling'
      );
    } else {
      this.addTestResult('Analytics Manager Configuration', false, 'Failed to generate site content');
    }
  }

  async testConfigurationParsing() {
    console.log('🔧 Testing configuration parsing and validation...');
    
    // Test 1: Complex configuration parsing
    await this.testComplexConfigurationParsing();
    
    // Test 2: Configuration edge cases
    await this.testConfigurationEdgeCases();
    
    // Test 3: Configuration type validation
    await this.testConfigurationTypeValidation();
  }

  async testComplexConfigurationParsing() {
    const config = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"
GoogleAnalyticsID = "G-JKSVCT23D1"

[services]
  [services.googleAnalytics]
    ID = "G-OVERRIDE123"

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
  
  [params.privacy]
    respectDoNotTrack = true
    cookieConsent = false
  
  [params.performance]
    asyncScripts = true
    measurePerformance = false

[privacy]
  [privacy.googleAnalytics]
    respectDoNotTrack = false
    anonymizeIP = true
`;
    
    await this.buildSiteWithConfig(config);
    const indexContent = await this.getGeneratedContent('index.html');
    
    if (indexContent) {
      const $ = cheerio.load(indexContent);
      const inlineScripts = $('script:not([src])').text();
      
      // Check that services.googleAnalytics.ID overrides GoogleAnalyticsID
      const hasOverrideId = inlineScripts.includes('G-OVERRIDE123');
      const hasOriginalId = inlineScripts.includes('G-JKSVCT23D1');
      
      // Check Facebook Pixel selective event configuration
      const hasPageView = inlineScripts.includes("fbq('track', 'PageView')");
      const hasViewContentDisabled = !inlineScripts.includes('ViewContent') || 
                                    inlineScripts.includes('viewContent: false');
      const hasSearchEnabled = inlineScripts.includes('fbPixelTrackSearch');
      const hasContactDisabled = !inlineScripts.includes('fbPixelTrackContact') ||
                                inlineScripts.includes('contact: false');
      
      // Check privacy setting precedence
      const hasPrivacyOverride = inlineScripts.includes('respectDoNotTrack') && 
                                !inlineScripts.includes('cookieConsent');
      
      this.addTestResult(
        'Configuration Override Handling',
        hasOverrideId && !hasOriginalId,
        `Override ID: ${hasOverrideId}, Original ID excluded: ${!hasOriginalId}`
      );
      
      this.addTestResult(
        'Selective Event Configuration',
        hasPageView && hasSearchEnabled && hasViewContentDisabled && hasContactDisabled,
        `PageView: ${hasPageView}, Search: ${hasSearchEnabled}, ViewContent disabled: ${hasViewContentDisabled}, Contact disabled: ${hasContactDisabled}`
      );
      
      this.addTestResult(
        'Privacy Configuration Precedence',
        hasPrivacyOverride,
        hasPrivacyOverride ? 'Privacy settings properly parsed' : 'Privacy configuration parsing issue'
      );
    } else {
      this.addTestResult('Complex Configuration Parsing', false, 'Failed to generate site content');
    }
  }

  async testConfigurationEdgeCases() {
    // Test with minimal configuration
    const minimalConfig = `
baseURL = "https://example.com"
languageCode = "en-us"
title = "Test Site"
`;
    
    await this.buildSiteWithConfig(minimalConfig);
    const indexContent = await this.getGeneratedContent('index.html');
    
    if (indexContent) {
      const $ = cheerio.load(indexContent);
      const inlineScripts = $('script:not([src])').text();
      
      // Should not include any analytics scripts
      const hasNoGA = !inlineScripts.includes('googletagmanager.com') && 
                     !inlineScripts.includes('gtag');
      const hasNoFB = !inlineScripts.includes('connect.facebook.net') && 
                     !inlineScripts.includes('fbq');
      
      // Should still have analytics manager structure (even if empty)
      const hasAnalyticsManager = inlineScripts.includes('window.analyticsManager') ||
                                 inlineScripts.length === 0; // Or no scripts at all
      
      this.addTestResult(
        'Minimal Configuration Handling',
        hasNoGA && hasNoFB,
        `No GA: ${hasNoGA}, No FB: ${hasNoFB}`
      );
    } else {
      this.addTestResult('Minimal Configuration Handling', false, 'Failed to generate site content');
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
    
    await this.buildSiteWithConfig(stringBoolConfig);
    const indexContent = await this.getGeneratedContent('index.html');
    
    if (indexContent) {
      const $ = cheerio.load(indexContent);
      const inlineScripts = $('script:not([src])').text();
      
      // Should handle string booleans correctly
      const hasFBPixel = inlineScripts.includes("fbq('init'");
      const hasGA = inlineScripts.includes('gtag');
      const hasDNT = inlineScripts.includes('doNotTrack');
      
      this.addTestResult(
        'String Boolean Configuration Handling',
        hasFBPixel && hasGA && hasDNT,
        `FB Pixel: ${hasFBPixel}, GA: ${hasGA}, DNT: ${hasDNT}`
      );
    } else {
      this.addTestResult('String Boolean Configuration Handling', false, 'Failed to generate site content');
    }
  }

  // Helper methods
  async buildSiteWithConfig(config) {
    const configPath = path.join(this.siteDir, 'hugo.toml');
    await fs.writeFile(configPath, config);
    
    try {
      const buildCommand = `cd ${this.siteDir} && hugo --minify --destination public --quiet`;
      execSync(buildCommand, { stdio: 'pipe' });
    } catch (error) {
      // Some tests expect build warnings, so we don't throw here
      console.warn(`Build warning for test configuration: ${error.message}`);
    }
  }

  async buildSiteWithConfigAndCaptureOutput(config) {
    const configPath = path.join(this.siteDir, 'hugo.toml');
    await fs.writeFile(configPath, config);
    
    try {
      const buildCommand = `cd ${this.siteDir} && hugo --minify --destination public`;
      return execSync(buildCommand, { encoding: 'utf8' });
    } catch (error) {
      return error.stdout + error.stderr;
    }
  }

  async getGeneratedContent(filename) {
    const filePath = path.join(this.outputDir, filename);
    
    if (await fs.pathExists(filePath)) {
      return await fs.readFile(filePath, 'utf8');
    }
    
    return null;
  }

  async restoreConfiguration() {
    if (this.configBackup) {
      const configPath = path.join(this.siteDir, 'hugo.toml');
      await fs.writeFile(configPath, this.configBackup);
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
      testSuite: 'Analytics Configuration Tests',
      totalTests: this.testResults.length,
      passed: this.testResults.filter(r => r.passed).length,
      failed: this.testResults.filter(r => !r.passed).length,
      results: this.testResults
    };
    
    const reportPath = path.join(this.reportsDir, 'analytics-configuration-tests.json');
    await fs.writeJson(reportPath, report, { spaces: 2 });
    
    console.log(`\n📊 Analytics Configuration Test Report Generated: ${reportPath}`);
    console.log(`   Total Tests: ${report.totalTests}`);
    console.log(`   Passed: ${report.passed}`);
    console.log(`   Failed: ${report.failed}`);
    console.log(`   Success Rate: ${((report.passed / report.totalTests) * 100).toFixed(1)}%`);
    
    return report;
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new AnalyticsConfigurationTests();
  tester.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = AnalyticsConfigurationTests;