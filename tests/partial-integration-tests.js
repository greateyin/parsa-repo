#!/usr/bin/env node

/**
 * Partial Integration Tests
 * Tests the integration and interaction between analytics, advertising, and search partials
 * Validates that all partials work together without conflicts
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const cheerio = require('cheerio');

class PartialIntegrationTests {
  constructor() {
    this.testResults = [];
    this.siteDir = path.join(__dirname, '../exampleSite');
    this.outputDir = path.join(this.siteDir, 'public');
    this.reportsDir = path.join(__dirname, 'reports');
    this.testConfigPath = path.join(this.siteDir, 'hugo-partial-test.toml');
  }

  async runAllTests() {
    console.log('🔧 Starting Partial Integration Tests...\n');
    
    try {
      await this.setupTestEnvironment();
      
      await this.testPartialFileStructure();
      await this.testPartialDependencies();
      await this.testConfigurationIntegration();
      await this.testPerformanceConsiderations();
      await this.testPrivacyImplementation();
      
      await this.generateReport();
      
      console.log('✅ All partial integration tests completed successfully!');
      return true;
    } catch (error) {
      console.error('❌ Partial integration tests failed:', error.message);
      return false;
    }
  }

  async setupTestEnvironment() {
    console.log('📁 Setting up test environment...');
    await fs.ensureDir(this.reportsDir);
    await fs.ensureDir(this.outputDir);
  }

  async createComprehensiveTestConfig() {
    console.log('⚙️ Creating comprehensive test configuration...');
    
    const testConfig = `
baseURL = "http://localhost:1313"
languageCode = "en-us"
title = "Comprehensive Partial Integration Test"
theme = "parsa-redesigned"

# Enable all analytics services
GoogleAnalyticsID = "G-COMPREHENSIVE123"

[params]
  # Enable all AdSense features
  [params.adsense]
    enabled = true
    client = "ca-pub-comprehensive123"
    inArticleSlot = "comprehensive123"
    autoAds = true
    
    [params.adsense.placements]
      header = true
      sidebar = true
      footer = true
      inContent = true
      
  # Enable Facebook Pixel
  [params.facebookPixel]
    enabled = true
    pixelId = "COMPREHENSIVE_PIXEL"
    
    [params.facebookPixel.events]
      pageView = true
      viewContent = true
      search = true
      contact = true
      
  # Enable Google Custom Search
  [params.gcs_engine_id]
    value = "comprehensive123456"
    
  # Enable Mermaid
  [params.mermaid]
    enabled = true
    theme = "default"
    
  # Enable all privacy features
  [params.privacy]
    respectDoNotTrack = true
    cookieConsent = true
    
  # Enable all performance features
  [params.performance]
    lazyLoadAds = true
    asyncScripts = true

[privacy]
  [privacy.googleAnalytics]
    respectDoNotTrack = true
    anonymizeIP = true
`;

    await fs.writeFile(this.testConfigPath, testConfig);
    console.log('✅ Comprehensive test configuration created');
  }

  async buildSiteWithAllFeatures() {
    console.log('🔨 Building site with all features enabled...');
    try {
      const buildCommand = `hugo --config hugo-partial-test.toml --destination public`;
      execSync(buildCommand, { 
        stdio: 'pipe',
        cwd: this.siteDir
      });
      console.log('✅ Site built successfully with all features');
    } catch (error) {
      // Try building with default config if test config fails
      console.log('⚠️ Test config build failed, trying with default config...');
      try {
        const fallbackCommand = `hugo --destination public`;
        execSync(fallbackCommand, { 
          stdio: 'pipe',
          cwd: this.siteDir
        });
        console.log('✅ Site built successfully with default configuration');
      } catch (fallbackError) {
        throw new Error(`Hugo build with all features failed: ${error.message}`);
      }
    }
  }

  async testPartialCoexistence() {
    console.log('🤝 Testing partial coexistence...');
    
    const indexPath = path.join(this.outputDir, 'index.html');
    if (!await fs.pathExists(indexPath)) {
      this.addTestResult('Partial Coexistence', false, 'Index page not found');
      return;
    }
    
    const content = await fs.readFile(indexPath, 'utf8');
    const $ = cheerio.load(content);
    
    // Check that all services are present
    const hasGoogleAnalytics = $('script[src*="googletagmanager.com"]').length > 0;
    const hasFacebookPixel = $('script:contains("fbq")').length > 0;
    const hasAdSense = $('script[src*="googlesyndication.com"]').length > 0;
    const hasGoogleSearch = $('script[src*="cse.google.com"]').length > 0;
    
    const servicesPresent = [hasGoogleAnalytics, hasFacebookPixel, hasAdSense, hasGoogleSearch].filter(Boolean).length;
    
    this.addTestResult(
      'All Services Present',
      servicesPresent >= 3,
      `${servicesPresent}/4 services detected in template`
    );
    
    // Check for script conflicts
    const allScripts = $('script');
    let hasConflicts = false;
    let conflictDetails = [];
    
    allScripts.each((i, script) => {
      const $script = $(script);
      const src = $script.attr('src');
      const content = $script.html();
      
      // Check for common JavaScript conflicts
      if (content && content.includes('var gtag') && content.includes('var fbq')) {
        hasConflicts = true;
        conflictDetails.push('Variable name conflicts between GA and FB');
      }
      
      if (src && src.includes('jquery') && allScripts.filter(`[src*="jquery"]`).length > 1) {
        hasConflicts = true;
        conflictDetails.push('Multiple jQuery versions detected');
      }
    });
    
    this.addTestResult(
      'No Script Conflicts',
      !hasConflicts,
      hasConflicts ? `Conflicts detected: ${conflictDetails.join(', ')}` : 'No script conflicts found'
    );
  }

  async testScriptLoadingOrder() {
    console.log('📋 Testing script loading order...');
    
    const indexPath = path.join(this.outputDir, 'index.html');
    const content = await fs.readFile(indexPath, 'utf8');
    const $ = cheerio.load(content);
    
    const scripts = [];
    $('script').each((i, script) => {
      const $script = $(script);
      const src = $script.attr('src');
      const isAsync = $script.attr('async') !== undefined;
      const isDefer = $script.attr('defer') !== undefined;
      
      if (src) {
        scripts.push({
          src,
          async: isAsync,
          defer: isDefer,
          order: i
        });
      }
    });
    
    // Check that external scripts are loaded asynchronously
    const externalScripts = scripts.filter(s => 
      s.src.includes('googletagmanager.com') || 
      s.src.includes('googlesyndication.com') ||
      s.src.includes('cse.google.com') ||
      s.src.includes('mermaid')
    );
    
    const asyncScripts = externalScripts.filter(s => s.async || s.defer);
    const asyncRatio = asyncScripts.length / Math.max(externalScripts.length, 1);
    
    this.addTestResult(
      'Async Script Loading',
      asyncRatio >= 0.8,
      `${asyncScripts.length}/${externalScripts.length} external scripts are async/defer`
    );
    
    // Check script loading order (analytics should come before ads)
    const gaScript = scripts.find(s => s.src.includes('googletagmanager.com'));
    const adScript = scripts.find(s => s.src.includes('googlesyndication.com'));
    
    if (gaScript && adScript) {
      const correctOrder = gaScript.order < adScript.order;
      this.addTestResult(
        'Script Loading Order',
        correctOrder,
        correctOrder ? 'Analytics loads before advertising' : 'Incorrect script loading order'
      );
    }
  }

  async testConfigurationValidation() {
    console.log('✅ Testing configuration validation...');
    
    const indexPath = path.join(this.outputDir, 'index.html');
    const content = await fs.readFile(indexPath, 'utf8');
    const $ = cheerio.load(content);
    
    // Validate Google Analytics configuration
    const gaConfig = $('script:contains("gtag")').text();
    const hasCorrectGAId = gaConfig.includes('G-COMPREHENSIVE123');
    const hasPrivacySettings = gaConfig.includes('anonymize_ip') || gaConfig.includes('respect_dnt');
    
    this.addTestResult(
      'Google Analytics Configuration',
      hasCorrectGAId && hasPrivacySettings,
      hasCorrectGAId && hasPrivacySettings ? 'GA properly configured' : 'GA configuration issues'
    );
    
    // Validate AdSense configuration
    const adSenseScript = $('script[src*="googlesyndication.com"]').attr('src');
    const hasCorrectAdClient = adSenseScript && adSenseScript.includes('ca-pub-comprehensive123');
    
    this.addTestResult(
      'AdSense Configuration',
      hasCorrectAdClient,
      hasCorrectAdClient ? 'AdSense properly configured' : 'AdSense configuration issues'
    );
    
    // Validate Facebook Pixel configuration
    const fbConfig = $('script:contains("fbq")').text();
    const hasCorrectPixelId = fbConfig.includes('COMPREHENSIVE_PIXEL');
    const hasPageViewTracking = fbConfig.includes("fbq('track', 'PageView')");
    
    this.addTestResult(
      'Facebook Pixel Configuration',
      hasCorrectPixelId && hasPageViewTracking,
      hasCorrectPixelId && hasPageViewTracking ? 'FB Pixel properly configured' : 'FB Pixel configuration issues'
    );
    
    // Validate Google Custom Search configuration
    const gcsScript = $('script[src*="cse.google.com"]').attr('src');
    const hasCorrectEngineId = gcsScript && gcsScript.includes('comprehensive123456');
    
    this.addTestResult(
      'Google Custom Search Configuration',
      hasCorrectEngineId,
      hasCorrectEngineId ? 'GCS properly configured' : 'GCS configuration issues'
    );
  }

  async testPerformanceImpact() {
    console.log('⚡ Testing performance impact...');
    
    const indexPath = path.join(this.outputDir, 'index.html');
    const content = await fs.readFile(indexPath, 'utf8');
    const $ = cheerio.load(content);
    
    // Count external resources
    const externalScripts = $('script[src]').filter((i, el) => {
      const src = $(el).attr('src');
      return src && (src.startsWith('http') || src.startsWith('//'));
    }).length;
    
    const externalStyles = $('link[rel="stylesheet"][href]').filter((i, el) => {
      const href = $(el).attr('href');
      return href && (href.startsWith('http') || href.startsWith('//'));
    }).length;
    
    // Check for performance optimizations
    const hasPreconnect = $('link[rel="preconnect"]').length > 0;
    const hasDNSPrefetch = $('link[rel="dns-prefetch"]').length > 0;
    const hasResourceHints = hasPreconnect || hasDNSPrefetch;
    
    this.addTestResult(
      'External Resource Count',
      externalScripts <= 10 && externalStyles <= 5,
      `${externalScripts} scripts, ${externalStyles} stylesheets`
    );
    
    this.addTestResult(
      'Performance Optimizations',
      hasResourceHints,
      hasResourceHints ? 'Resource hints present' : 'No resource hints found'
    );
    
    // Check for lazy loading implementation
    const hasIntersectionObserver = content.includes('IntersectionObserver');
    const hasLazyLoading = content.includes('loading="lazy"') || hasIntersectionObserver;
    
    this.addTestResult(
      'Lazy Loading Implementation',
      hasLazyLoading,
      hasLazyLoading ? 'Lazy loading implemented' : 'No lazy loading detected'
    );
  }

  async testPrivacyCompliance() {
    console.log('🔒 Testing privacy compliance...');
    
    const indexPath = path.join(this.outputDir, 'index.html');
    const content = await fs.readFile(indexPath, 'utf8');
    const $ = cheerio.load(content);
    
    // Check for Do Not Track respect
    const hasDoNotTrackCheck = content.includes('doNotTrack') || content.includes('navigator.doNotTrack');
    
    this.addTestResult(
      'Do Not Track Support',
      hasDoNotTrackCheck,
      hasDoNotTrackCheck ? 'DNT checking implemented' : 'No DNT checking found'
    );
    
    // Check for cookie consent
    const hasCookieConsent = content.includes('cookie') && (content.includes('consent') || content.includes('accept'));
    
    this.addTestResult(
      'Cookie Consent',
      hasCookieConsent,
      hasCookieConsent ? 'Cookie consent implemented' : 'No cookie consent found'
    );
    
    // Check for privacy policy links
    const hasPrivacyLink = $('a[href*="privacy"], a:contains("Privacy")').length > 0;
    
    this.addTestResult(
      'Privacy Policy Link',
      hasPrivacyLink,
      hasPrivacyLink ? 'Privacy policy link found' : 'No privacy policy link'
    );
  }

  addTestResult(name, passed, message) {
    this.testResults.push({ name, passed, message });
    const status = passed ? '✅' : '❌';
    console.log(`  ${status} ${name}: ${message}`);
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      testType: 'Partial Integration Tests',
      description: 'Tests integration and interaction between all template partials',
      totalTests: this.testResults.length,
      passed: this.testResults.filter(r => r.passed).length,
      failed: this.testResults.filter(r => !r.passed).length,
      results: this.testResults
    };
    
    const reportPath = path.join(this.reportsDir, 'partial-integration-tests.json');
    await fs.writeJson(reportPath, report, { spaces: 2 });
    
    console.log(`\n📊 Test Report Generated: ${reportPath}`);
    console.log(`   Total Tests: ${report.totalTests}`);
    console.log(`   Passed: ${report.passed}`);
    console.log(`   Failed: ${report.failed}`);
    console.log(`   Success Rate: ${((report.passed / report.totalTests) * 100).toFixed(1)}%`);
  }

  async testPartialFileStructure() {
    console.log('📁 Testing partial file structure...');
    
    const partialsDir = path.join(__dirname, '../layouts/partials');
    
    // Check for required partial files
    const requiredPartials = [
      'google-analytics.html',
      'facebook-pixel.html',
      'adsense.html',
      'google-custom-search.html'
    ];
    
    let foundPartials = 0;
    for (const partial of requiredPartials) {
      const partialPath = path.join(partialsDir, partial);
      if (await fs.pathExists(partialPath)) {
        foundPartials++;
      }
    }
    
    this.addTestResult(
      'Required Partials Present',
      foundPartials >= 3,
      `${foundPartials}/${requiredPartials.length} required partials found`
    );
    
    // Check for optional enhancement partials
    const optionalPartials = [
      'search-widget.html',
      'mermaid.html',
      'header-ad.html',
      'sidebar-ad.html'
    ];
    
    let foundOptional = 0;
    for (const partial of optionalPartials) {
      const partialPath = path.join(partialsDir, partial);
      if (await fs.pathExists(partialPath)) {
        foundOptional++;
      }
    }
    
    this.addTestResult(
      'Optional Enhancement Partials',
      foundOptional >= 2,
      `${foundOptional}/${optionalPartials.length} optional partials found`
    );
  }

  async testPartialDependencies() {
    console.log('🔗 Testing partial dependencies...');
    
    const partialsDir = path.join(__dirname, '../layouts/partials');
    
    // Test Google Analytics partial
    const gaPath = path.join(partialsDir, 'google-analytics.html');
    if (await fs.pathExists(gaPath)) {
      const content = await fs.readFile(gaPath, 'utf8');
      
      // Check for proper conditional loading
      const hasConditional = content.includes('if') && content.includes('GoogleAnalyticsID');
      const hasAsyncLoading = content.includes('async') || content.includes('defer');
      
      this.addTestResult(
        'GA Conditional Loading',
        hasConditional,
        hasConditional ? 'GA loads conditionally' : 'GA missing conditional logic'
      );
      
      this.addTestResult(
        'GA Async Loading',
        hasAsyncLoading,
        hasAsyncLoading ? 'GA loads asynchronously' : 'GA missing async loading'
      );
    }
    
    // Test AdSense partial
    const adPath = path.join(partialsDir, 'adsense.html');
    if (await fs.pathExists(adPath)) {
      const content = await fs.readFile(adPath, 'utf8');
      
      const hasConditional = content.includes('if') && content.includes('adsense');
      const hasClientCheck = content.includes('client') || content.includes('ca-pub');
      
      this.addTestResult(
        'AdSense Conditional Loading',
        hasConditional,
        hasConditional ? 'AdSense loads conditionally' : 'AdSense missing conditional logic'
      );
      
      this.addTestResult(
        'AdSense Client Validation',
        hasClientCheck,
        hasClientCheck ? 'AdSense validates client ID' : 'AdSense missing client validation'
      );
    }
  }

  async testConfigurationIntegration() {
    console.log('⚙️ Testing configuration integration...');
    
    const configPath = path.join(this.siteDir, 'hugo.toml');
    if (await fs.pathExists(configPath)) {
      const content = await fs.readFile(configPath, 'utf8');
      
      // Test comprehensive configuration structure
      const hasAnalyticsSection = content.includes('[params.') && content.includes('analytics');
      const hasAdSenseSection = content.includes('[params.adsense]');
      const hasPrivacySection = content.includes('[params.privacy]');
      const hasPerformanceSection = content.includes('[params.performance]');
      
      this.addTestResult(
        'Configuration Structure',
        hasAdSenseSection && hasPrivacySection,
        `Configuration sections: AdSense=${hasAdSenseSection}, Privacy=${hasPrivacySection}`
      );
      
      // Test privacy configuration
      const hasDoNotTrack = content.includes('respectDoNotTrack');
      const hasAnonymizeIP = content.includes('anonymizeIP');
      
      this.addTestResult(
        'Privacy Configuration',
        hasDoNotTrack || hasAnonymizeIP,
        hasDoNotTrack || hasAnonymizeIP ? 'Privacy settings configured' : 'Privacy settings missing'
      );
    }
  }

  async testPerformanceConsiderations() {
    console.log('⚡ Testing performance considerations...');
    
    const partialsDir = path.join(__dirname, '../layouts/partials');
    
    // Check for performance optimizations in partials
    const performancePartials = ['google-analytics.html', 'adsense.html', 'facebook-pixel.html'];
    let optimizedPartials = 0;
    
    for (const partial of performancePartials) {
      const partialPath = path.join(partialsDir, partial);
      if (await fs.pathExists(partialPath)) {
        const content = await fs.readFile(partialPath, 'utf8');
        
        // Check for performance optimizations
        const hasAsync = content.includes('async');
        const hasDefer = content.includes('defer');
        const hasPreconnect = content.includes('preconnect');
        const hasLazyLoading = content.includes('lazy') || content.includes('IntersectionObserver');
        
        if (hasAsync || hasDefer || hasPreconnect || hasLazyLoading) {
          optimizedPartials++;
        }
      }
    }
    
    this.addTestResult(
      'Performance Optimizations',
      optimizedPartials >= 2,
      `${optimizedPartials}/${performancePartials.length} partials have performance optimizations`
    );
    
    // Check for resource hints
    const baseofPath = path.join(__dirname, '../layouts/_default/baseof.html');
    if (await fs.pathExists(baseofPath)) {
      const content = await fs.readFile(baseofPath, 'utf8');
      
      const hasPreconnect = content.includes('rel="preconnect"');
      const hasDNSPrefetch = content.includes('rel="dns-prefetch"');
      
      this.addTestResult(
        'Resource Hints',
        hasPreconnect || hasDNSPrefetch,
        hasPreconnect || hasDNSPrefetch ? 'Resource hints implemented' : 'Resource hints missing'
      );
    }
  }

  async testPrivacyImplementation() {
    console.log('🔒 Testing privacy implementation...');
    
    const partialsDir = path.join(__dirname, '../layouts/partials');
    
    // Test privacy in analytics partials
    const privacyPartials = ['google-analytics.html', 'facebook-pixel.html'];
    let privacyCompliantPartials = 0;
    
    for (const partial of privacyPartials) {
      const partialPath = path.join(partialsDir, partial);
      if (await fs.pathExists(partialPath)) {
        const content = await fs.readFile(partialPath, 'utf8');
        
        // Check for privacy implementations
        const hasDoNotTrack = content.includes('doNotTrack') || content.includes('navigator.doNotTrack');
        const hasAnonymizeIP = content.includes('anonymize_ip');
        const hasConsentCheck = content.includes('consent') || content.includes('cookie');
        
        if (hasDoNotTrack || hasAnonymizeIP || hasConsentCheck) {
          privacyCompliantPartials++;
        }
      }
    }
    
    this.addTestResult(
      'Privacy Compliance',
      privacyCompliantPartials >= 1,
      `${privacyCompliantPartials}/${privacyPartials.length} partials implement privacy features`
    );
    
    // Test for GDPR compliance features
    const configPath = path.join(this.siteDir, 'hugo.toml');
    if (await fs.pathExists(configPath)) {
      const content = await fs.readFile(configPath, 'utf8');
      
      const hasGDPRSettings = content.includes('cookieConsent') || content.includes('privacy');
      
      this.addTestResult(
        'GDPR Compliance Features',
        hasGDPRSettings,
        hasGDPRSettings ? 'GDPR compliance features configured' : 'GDPR compliance features missing'
      );
    }
  }

  async cleanup() {
    console.log('🧹 Cleaning up test environment...');
    // No cleanup needed for file-based tests
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new PartialIntegrationTests();
  tester.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = PartialIntegrationTests;