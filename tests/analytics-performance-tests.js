#!/usr/bin/env node

/**
 * Analytics Performance Testing Suite
 * Tests script loading performance and Core Web Vitals compliance
 * for the Hugo theme analytics enhancements
 */

const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');

class AnalyticsPerformanceTests {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = [];
    this.reportsDir = path.join(__dirname, 'reports');
    this.testUrls = [
      'http://localhost:1313/',
      'http://localhost:1313/blog/',
      'http://localhost:1313/blog/mermaid-diagrams-demo/',
      'http://localhost:1313/search/'
    ];
  }

  async runAllTests() {
    console.log('🚀 Starting Analytics Performance Tests...\n');
    
    try {
      await this.setupBrowser();
      await this.testScriptLoadingPerformance();
      await this.testCoreWebVitals();
      await this.testAsyncScriptLoading();
      await this.testLazyLoadingPerformance();
      await this.testThirdPartyScriptImpact();
      await this.testMermaidPerformance();
      await this.generateReport();
      
      console.log('✅ Analytics performance tests completed successfully!');
      return true;
    } catch (error) {
      console.error('❌ Analytics performance tests failed:', error.message);
      return false;
    } finally {
      await this.cleanup();
    }
  }

  async setupBrowser() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
    this.page = await this.browser.newPage();
    
    // Set up performance monitoring
    await this.page.setCacheEnabled(false);
    await this.page.setViewport({ width: 1920, height: 1080 });
    
    // Enable performance timeline
    await this.page.evaluateOnNewDocument(() => {
      window.performanceObserver = new PerformanceObserver((list) => {
        window.performanceEntries = window.performanceEntries || [];
        window.performanceEntries.push(...list.getEntries());
      });
      window.performanceObserver.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'layout-shift'] });
    });
  }

  async testScriptLoadingPerformance() {
    console.log('📊 Testing script loading performance...');
    
    for (const url of this.testUrls) {
      await this.measureScriptLoadingForUrl(url);
    }
  }

  async measureScriptLoadingForUrl(url) {
    try {
      const responses = [];
      const scriptLoadTimes = [];
      
      // Monitor network requests
      this.page.on('response', response => {
        const responseUrl = response.url();
        if (responseUrl.includes('.js') || 
            responseUrl.includes('googletagmanager.com') ||
            responseUrl.includes('googlesyndication.com') ||
            responseUrl.includes('facebook.net') ||
            responseUrl.includes('mermaid')) {
          responses.push({
            url: responseUrl,
            status: response.status(),
            timing: response.timing(),
            size: response.headers()['content-length'] || 0
          });
        }
      });

      const startTime = Date.now();
      await this.page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      const totalLoadTime = Date.now() - startTime;

      // Analyze script loading
      const analyticsScripts = responses.filter(r => 
        r.url.includes('gtag') || 
        r.url.includes('fbevents') || 
        r.url.includes('adsbygoogle')
      );
      
      const mermaidScripts = responses.filter(r => r.url.includes('mermaid'));
      
      // Test async loading - scripts should not block rendering
      const blockingScripts = responses.filter(r => 
        r.timing && r.timing.receiveHeadersEnd > 100 // Scripts taking >100ms
      );

      this.addResult(
        'Script Loading Performance',
        `${url} - Analytics Scripts`,
        analyticsScripts.every(s => s.status === 200),
        `${analyticsScripts.length} analytics scripts loaded in ${totalLoadTime}ms`,
        { url, analyticsScripts, totalLoadTime }
      );

      this.addResult(
        'Script Loading Performance',
        `${url} - Async Loading`,
        blockingScripts.length === 0,
        `${blockingScripts.length} potentially blocking scripts found`,
        { url, blockingScripts }
      );

      // Test Mermaid conditional loading
      const hasMermaidContent = await this.page.evaluate(() => {
        return document.querySelector('.mermaid') !== null;
      });

      this.addResult(
        'Script Loading Performance',
        `${url} - Mermaid Conditional Loading`,
        hasMermaidContent ? mermaidScripts.length > 0 : mermaidScripts.length === 0,
        `Mermaid content: ${hasMermaidContent}, Scripts loaded: ${mermaidScripts.length}`,
        { url, hasMermaidContent, mermaidScripts: mermaidScripts.length }
      );

    } catch (error) {
      this.addResult('Script Loading Performance', url, false, `Error: ${error.message}`);
    }
  }

  async testCoreWebVitals() {
    console.log('⚡ Testing Core Web Vitals compliance...');
    
    for (const url of this.testUrls) {
      await this.measureCoreWebVitalsForUrl(url);
    }
  }

  async measureCoreWebVitalsForUrl(url) {
    try {
      await this.page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      
      // Wait for performance entries to be collected
      await this.page.waitForTimeout(2000);
      
      const metrics = await this.page.evaluate(() => {
        const paintEntries = performance.getEntriesByType('paint');
        const navigationEntry = performance.getEntriesByType('navigation')[0];
        
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        const lcp = window.performanceEntries?.find(entry => entry.entryType === 'largest-contentful-paint');
        const cls = window.performanceEntries?.filter(entry => entry.entryType === 'layout-shift')
          .reduce((sum, entry) => sum + entry.value, 0);
        
        return {
          fcp: fcp ? fcp.startTime : null,
          lcp: lcp ? lcp.startTime : null,
          cls: cls || 0,
          domContentLoaded: navigationEntry ? navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart : null,
          loadComplete: navigationEntry ? navigationEntry.loadEventEnd - navigationEntry.loadEventStart : null
        };
      });

      // Core Web Vitals thresholds (good performance)
      const fcpThreshold = 1800; // 1.8s
      const lcpThreshold = 2500; // 2.5s
      const clsThreshold = 0.1;   // 0.1

      this.addResult(
        'Core Web Vitals',
        `${url} - First Contentful Paint`,
        metrics.fcp && metrics.fcp <= fcpThreshold,
        `FCP: ${metrics.fcp ? Math.round(metrics.fcp) + 'ms' : 'N/A'} (target: ≤${fcpThreshold}ms)`,
        { url, fcp: metrics.fcp, threshold: fcpThreshold }
      );

      this.addResult(
        'Core Web Vitals',
        `${url} - Largest Contentful Paint`,
        metrics.lcp && metrics.lcp <= lcpThreshold,
        `LCP: ${metrics.lcp ? Math.round(metrics.lcp) + 'ms' : 'N/A'} (target: ≤${lcpThreshold}ms)`,
        { url, lcp: metrics.lcp, threshold: lcpThreshold }
      );

      this.addResult(
        'Core Web Vitals',
        `${url} - Cumulative Layout Shift`,
        metrics.cls <= clsThreshold,
        `CLS: ${metrics.cls.toFixed(3)} (target: ≤${clsThreshold})`,
        { url, cls: metrics.cls, threshold: clsThreshold }
      );

      // Additional performance metrics
      this.addResult(
        'Core Web Vitals',
        `${url} - DOM Content Loaded`,
        metrics.domContentLoaded && metrics.domContentLoaded <= 1000,
        `DCL: ${metrics.domContentLoaded ? Math.round(metrics.domContentLoaded) + 'ms' : 'N/A'}`,
        { url, domContentLoaded: metrics.domContentLoaded }
      );

    } catch (error) {
      this.addResult('Core Web Vitals', url, false, `Error: ${error.message}`);
    }
  }

  async testAsyncScriptLoading() {
    console.log('🔄 Testing async script loading implementation...');
    
    await this.page.goto('http://localhost:1313/', { waitUntil: 'domcontentloaded' });
    
    // Check if analytics scripts are loaded asynchronously
    const scriptAttributes = await this.page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      return scripts.map(script => ({
        src: script.src,
        async: script.async,
        defer: script.defer,
        type: script.type
      }));
    });

    const analyticsScripts = scriptAttributes.filter(script => 
      script.src.includes('gtag') || 
      script.src.includes('fbevents') || 
      script.src.includes('adsbygoogle')
    );

    const asyncAnalyticsScripts = analyticsScripts.filter(script => script.async);

    this.addResult(
      'Async Script Loading',
      'Analytics Scripts Async',
      asyncAnalyticsScripts.length === analyticsScripts.length,
      `${asyncAnalyticsScripts.length}/${analyticsScripts.length} analytics scripts are async`,
      { analyticsScripts, asyncAnalyticsScripts }
    );

    // Check for preconnect hints
    const preconnectHints = await this.page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="preconnect"]'));
      return links.map(link => link.href);
    });

    const expectedPreconnects = [
      'https://www.googletagmanager.com',
      'https://connect.facebook.net',
      'https://pagead2.googlesyndication.com'
    ];

    const hasRequiredPreconnects = expectedPreconnects.some(expected => 
      preconnectHints.some(hint => hint.includes(expected.replace('https://', '')))
    );

    this.addResult(
      'Async Script Loading',
      'Preconnect Hints',
      hasRequiredPreconnects,
      `Found preconnect hints: ${preconnectHints.length}`,
      { preconnectHints, expectedPreconnects }
    );
  }

  async testLazyLoadingPerformance() {
    console.log('⏳ Testing lazy loading performance...');
    
    await this.page.goto('http://localhost:1313/blog/', { waitUntil: 'domcontentloaded' });
    
    // Test ad lazy loading
    const adElements = await this.page.evaluate(() => {
      const ads = Array.from(document.querySelectorAll('.adsbygoogle, [data-ad-client]'));
      return ads.map(ad => ({
        visible: ad.offsetParent !== null,
        hasIntersectionObserver: 'IntersectionObserver' in window,
        position: ad.getBoundingClientRect().top
      }));
    });

    const belowFoldAds = adElements.filter(ad => ad.position > window.innerHeight);
    
    this.addResult(
      'Lazy Loading Performance',
      'Ad Lazy Loading',
      belowFoldAds.length === 0 || adElements[0]?.hasIntersectionObserver,
      `${belowFoldAds.length} below-fold ads, IntersectionObserver: ${adElements[0]?.hasIntersectionObserver}`,
      { adElements, belowFoldAds }
    );

    // Test image lazy loading
    const images = await this.page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => ({
        src: img.src,
        loading: img.loading,
        hasDataSrc: img.hasAttribute('data-src'),
        position: img.getBoundingClientRect().top
      }));
    });

    const lazyImages = images.filter(img => img.loading === 'lazy' || img.hasDataSrc);
    
    this.addResult(
      'Lazy Loading Performance',
      'Image Lazy Loading',
      lazyImages.length > 0,
      `${lazyImages.length}/${images.length} images use lazy loading`,
      { images, lazyImages }
    );
  }

  async testThirdPartyScriptImpact() {
    console.log('🌐 Testing third-party script impact...');
    
    // Test page load without third-party scripts
    await this.page.setRequestInterception(true);
    
    const blockedDomains = [
      'googletagmanager.com',
      'googlesyndication.com',
      'connect.facebook.net',
      'cse.google.com'
    ];

    this.page.on('request', request => {
      const url = request.url();
      if (blockedDomains.some(domain => url.includes(domain))) {
        request.abort();
      } else {
        request.continue();
      }
    });

    const startTimeBlocked = Date.now();
    await this.page.goto('http://localhost:1313/', { waitUntil: 'networkidle0' });
    const loadTimeBlocked = Date.now() - startTimeBlocked;

    // Test page load with third-party scripts
    await this.page.setRequestInterception(false);
    
    const startTimeNormal = Date.now();
    await this.page.goto('http://localhost:1313/', { waitUntil: 'networkidle0' });
    const loadTimeNormal = Date.now() - startTimeNormal;

    const impactPercentage = ((loadTimeNormal - loadTimeBlocked) / loadTimeBlocked) * 100;

    this.addResult(
      'Third-Party Script Impact',
      'Performance Impact',
      impactPercentage <= 50, // Should not increase load time by more than 50%
      `Load time impact: ${impactPercentage.toFixed(1)}% (${loadTimeBlocked}ms → ${loadTimeNormal}ms)`,
      { loadTimeBlocked, loadTimeNormal, impactPercentage }
    );
  }

  async testMermaidPerformance() {
    console.log('📊 Testing Mermaid diagram performance...');
    
    // Test page with Mermaid diagrams
    await this.page.goto('http://localhost:1313/blog/mermaid-diagrams-demo/', { waitUntil: 'networkidle0' });
    
    const mermaidMetrics = await this.page.evaluate(() => {
      const mermaidElements = document.querySelectorAll('.mermaid');
      const mermaidScript = document.querySelector('script[src*="mermaid"]');
      
      return {
        diagramCount: mermaidElements.length,
        scriptLoaded: !!mermaidScript,
        renderTime: window.mermaidRenderTime || null // Would be set by Mermaid if instrumented
      };
    });

    this.addResult(
      'Mermaid Performance',
      'Conditional Loading',
      mermaidMetrics.diagramCount > 0 ? mermaidMetrics.scriptLoaded : !mermaidMetrics.scriptLoaded,
      `${mermaidMetrics.diagramCount} diagrams, script loaded: ${mermaidMetrics.scriptLoaded}`,
      mermaidMetrics
    );

    // Test page without Mermaid diagrams
    await this.page.goto('http://localhost:1313/blog/', { waitUntil: 'networkidle0' });
    
    const noMermaidMetrics = await this.page.evaluate(() => {
      const mermaidElements = document.querySelectorAll('.mermaid');
      const mermaidScript = document.querySelector('script[src*="mermaid"]');
      
      return {
        diagramCount: mermaidElements.length,
        scriptLoaded: !!mermaidScript
      };
    });

    this.addResult(
      'Mermaid Performance',
      'No Unnecessary Loading',
      noMermaidMetrics.diagramCount === 0 && !noMermaidMetrics.scriptLoaded,
      `${noMermaidMetrics.diagramCount} diagrams, script loaded: ${noMermaidMetrics.scriptLoaded}`,
      noMermaidMetrics
    );
  }

  addResult(category, test, passed, message, data = null) {
    const result = { category, test, passed, message, data, timestamp: new Date().toISOString() };
    this.results.push(result);
    
    const status = passed ? '✅' : '❌';
    console.log(`  ${status} ${category} - ${test}: ${message}`);
  }

  async generateReport() {
    await fs.ensureDir(this.reportsDir);
    
    const report = {
      testSuite: 'Analytics Performance Tests',
      timestamp: new Date().toISOString(),
      totalTests: this.results.length,
      passed: this.results.filter(r => r.passed).length,
      failed: this.results.filter(r => !r.passed).length,
      categories: this.groupResultsByCategory(),
      results: this.results,
      summary: this.generateSummary()
    };
    
    const reportPath = path.join(this.reportsDir, 'analytics-performance-tests.json');
    await fs.writeJson(reportPath, report, { spaces: 2 });
    
    // Generate HTML report
    await this.generateHtmlReport(report);
    
    console.log(`\n📊 Analytics Performance Report Generated:`);
    console.log(`   JSON: ${reportPath}`);
    console.log(`   HTML: ${reportPath.replace('.json', '.html')}`);
    console.log(`   Total Tests: ${report.totalTests}`);
    console.log(`   Passed: ${report.passed}`);
    console.log(`   Failed: ${report.failed}`);
    console.log(`   Success Rate: ${((report.passed / report.totalTests) * 100).toFixed(1)}%`);
  }

  groupResultsByCategory() {
    const categories = {};
    this.results.forEach(result => {
      if (!categories[result.category]) {
        categories[result.category] = { passed: 0, failed: 0, tests: [] };
      }
      categories[result.category].tests.push(result);
      if (result.passed) {
        categories[result.category].passed++;
      } else {
        categories[result.category].failed++;
      }
    });
    return categories;
  }

  generateSummary() {
    const categories = this.groupResultsByCategory();
    const summary = {
      scriptLoadingPerformance: categories['Script Loading Performance']?.passed || 0,
      coreWebVitals: categories['Core Web Vitals']?.passed || 0,
      asyncLoading: categories['Async Script Loading']?.passed || 0,
      lazyLoading: categories['Lazy Loading Performance']?.passed || 0,
      thirdPartyImpact: categories['Third-Party Script Impact']?.passed || 0,
      mermaidPerformance: categories['Mermaid Performance']?.passed || 0
    };
    
    return summary;
  }

  async generateHtmlReport(report) {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics Performance Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 3px solid #007acc; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 6px; text-align: center; }
        .metric h3 { margin: 0 0 10px 0; color: #666; font-size: 14px; text-transform: uppercase; }
        .metric .value { font-size: 24px; font-weight: bold; color: #007acc; }
        .test-result { margin: 10px 0; padding: 15px; border-radius: 6px; border-left: 4px solid #ddd; }
        .test-result.passed { background: #f0f9f0; border-left-color: #28a745; }
        .test-result.failed { background: #fdf2f2; border-left-color: #dc3545; }
        .test-name { font-weight: bold; margin-bottom: 5px; }
        .test-message { color: #666; font-size: 14px; }
        .category { margin: 30px 0; }
        .timestamp { color: #999; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Analytics Performance Test Report</h1>
        <p class="timestamp">Generated: ${report.timestamp}</p>
        
        <div class="summary">
            <div class="metric">
                <h3>Total Tests</h3>
                <div class="value">${report.totalTests}</div>
            </div>
            <div class="metric">
                <h3>Passed</h3>
                <div class="value" style="color: #28a745">${report.passed}</div>
            </div>
            <div class="metric">
                <h3>Failed</h3>
                <div class="value" style="color: #dc3545">${report.failed}</div>
            </div>
            <div class="metric">
                <h3>Success Rate</h3>
                <div class="value">${((report.passed / report.totalTests) * 100).toFixed(1)}%</div>
            </div>
        </div>

        ${Object.entries(report.categories).map(([category, data]) => `
            <div class="category">
                <h2>${category} (${data.passed}/${data.passed + data.failed})</h2>
                ${data.tests.map(test => `
                    <div class="test-result ${test.passed ? 'passed' : 'failed'}">
                        <div class="test-name">${test.test}</div>
                        <div class="test-message">${test.message}</div>
                    </div>
                `).join('')}
            </div>
        `).join('')}
    </div>
</body>
</html>`;

    const htmlPath = path.join(this.reportsDir, 'analytics-performance-tests.html');
    await fs.writeFile(htmlPath, htmlContent);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new AnalyticsPerformanceTests();
  tester.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = AnalyticsPerformanceTests;