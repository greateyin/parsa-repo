#!/usr/bin/env node

/**
 * Core Web Vitals Testing Suite
 * Comprehensive testing for Core Web Vitals compliance
 * with analytics enhancements enabled
 */

const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');

class CoreWebVitalsTests {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = [];
    this.reportsDir = path.join(__dirname, 'reports');
    this.testConfigurations = [
      {
        name: 'Desktop',
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      {
        name: 'Mobile',
        viewport: { width: 375, height: 667 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
      },
      {
        name: 'Tablet',
        viewport: { width: 768, height: 1024 },
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
      }
    ];
    this.testUrls = [
      { url: 'http://localhost:1313/', name: 'Homepage' },
      { url: 'http://localhost:1313/blog/', name: 'Blog List' },
      { url: 'http://localhost:1313/blog/mermaid-diagrams-demo/', name: 'Blog Post with Mermaid' },
      { url: 'http://localhost:1313/search/', name: 'Search Page' }
    ];
  }

  async runAllTests() {
    console.log('🎯 Starting Core Web Vitals Tests...\n');
    
    try {
      await this.setupBrowser();
      
      for (const config of this.testConfigurations) {
        console.log(`\n📱 Testing ${config.name} configuration...`);
        await this.testDeviceConfiguration(config);
      }
      
      await this.testPerformanceBudgets();
      await this.testResourceOptimization();
      await this.generateReport();
      
      console.log('✅ Core Web Vitals tests completed successfully!');
      return true;
    } catch (error) {
      console.error('❌ Core Web Vitals tests failed:', error.message);
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
        '--disable-features=VizDisplayCompositor',
        '--enable-precise-memory-info'
      ]
    });
  }

  async testDeviceConfiguration(config) {
    this.page = await this.browser.newPage();
    
    // Configure device
    await this.page.setViewport(config.viewport);
    await this.page.setUserAgent(config.userAgent);
    await this.page.setCacheEnabled(false);
    
    // Set up performance monitoring
    await this.page.evaluateOnNewDocument(() => {
      // Core Web Vitals measurement
      window.webVitalsData = {};
      
      // First Contentful Paint
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            window.webVitalsData.fcp = entry.startTime;
          }
        }
      }).observe({ entryTypes: ['paint'] });
      
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        window.webVitalsData.lcp = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        window.webVitalsData.cls = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });
      
      // First Input Delay (approximation)
      let fidValue = null;
      const firstInputHandler = (event) => {
        if (fidValue === null) {
          fidValue = performance.now() - event.timeStamp;
          window.webVitalsData.fid = fidValue;
          document.removeEventListener('click', firstInputHandler);
          document.removeEventListener('keydown', firstInputHandler);
        }
      };
      document.addEventListener('click', firstInputHandler);
      document.addEventListener('keydown', firstInputHandler);
    });

    for (const testUrl of this.testUrls) {
      await this.measureCoreWebVitalsForUrl(testUrl, config);
    }
    
    await this.page.close();
  }

  async measureCoreWebVitalsForUrl(testUrl, config) {
    try {
      const startTime = Date.now();
      
      // Navigate to page
      await this.page.goto(testUrl.url, { waitUntil: 'networkidle0', timeout: 30000 });
      
      // Wait for measurements to stabilize
      await this.page.waitForTimeout(3000);
      
      // Simulate user interaction for FID measurement
      await this.page.click('body');
      await this.page.waitForTimeout(100);
      
      // Get Core Web Vitals data
      const vitals = await this.page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          ...window.webVitalsData,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
          ttfb: navigation.responseStart - navigation.fetchStart
        };
      });

      const loadTime = Date.now() - startTime;

      // Core Web Vitals thresholds
      const thresholds = {
        fcp: { good: 1800, needsImprovement: 3000 },
        lcp: { good: 2500, needsImprovement: 4000 },
        cls: { good: 0.1, needsImprovement: 0.25 },
        fid: { good: 100, needsImprovement: 300 },
        ttfb: { good: 800, needsImprovement: 1800 }
      };

      // Evaluate each metric
      this.evaluateMetric('First Contentful Paint', vitals.fcp, thresholds.fcp, 'ms', testUrl, config);
      this.evaluateMetric('Largest Contentful Paint', vitals.lcp, thresholds.lcp, 'ms', testUrl, config);
      this.evaluateMetric('Cumulative Layout Shift', vitals.cls, thresholds.cls, '', testUrl, config);
      this.evaluateMetric('First Input Delay', vitals.fid, thresholds.fid, 'ms', testUrl, config);
      this.evaluateMetric('Time to First Byte', vitals.ttfb, thresholds.ttfb, 'ms', testUrl, config);

      // Additional performance metrics
      this.addResult(
        'Performance Metrics',
        `${config.name} - ${testUrl.name} - DOM Content Loaded`,
        vitals.domContentLoaded <= 1000,
        `${Math.round(vitals.domContentLoaded)}ms`,
        { url: testUrl.url, device: config.name, metric: 'domContentLoaded', value: vitals.domContentLoaded }
      );

      this.addResult(
        'Performance Metrics',
        `${config.name} - ${testUrl.name} - Total Load Time`,
        vitals.totalLoadTime <= 5000,
        `${Math.round(vitals.totalLoadTime)}ms`,
        { url: testUrl.url, device: config.name, metric: 'totalLoadTime', value: vitals.totalLoadTime }
      );

    } catch (error) {
      this.addResult(
        'Core Web Vitals',
        `${config.name} - ${testUrl.name}`,
        false,
        `Error: ${error.message}`,
        { url: testUrl.url, device: config.name, error: error.message }
      );
    }
  }

  evaluateMetric(metricName, value, thresholds, unit, testUrl, config) {
    if (value === null || value === undefined) {
      this.addResult(
        'Core Web Vitals',
        `${config.name} - ${testUrl.name} - ${metricName}`,
        false,
        'Not measured',
        { url: testUrl.url, device: config.name, metric: metricName, value: null }
      );
      return;
    }

    const isGood = value <= thresholds.good;
    const needsImprovement = value <= thresholds.needsImprovement;
    const status = isGood ? 'Good' : needsImprovement ? 'Needs Improvement' : 'Poor';
    
    this.addResult(
      'Core Web Vitals',
      `${config.name} - ${testUrl.name} - ${metricName}`,
      isGood,
      `${Math.round(value * 100) / 100}${unit} (${status})`,
      { 
        url: testUrl.url, 
        device: config.name, 
        metric: metricName, 
        value: value, 
        threshold: thresholds.good,
        status: status
      }
    );
  }

  async testPerformanceBudgets() {
    console.log('💰 Testing performance budgets...');
    
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
    
    const responses = [];
    this.page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        size: parseInt(response.headers()['content-length'] || '0'),
        type: response.headers()['content-type'] || 'unknown'
      });
    });

    await this.page.goto('http://localhost:1313/', { waitUntil: 'networkidle0' });

    // Analyze resource sizes
    const totalSize = responses.reduce((sum, r) => sum + r.size, 0);
    const jsSize = responses.filter(r => r.type.includes('javascript')).reduce((sum, r) => sum + r.size, 0);
    const cssSize = responses.filter(r => r.type.includes('css')).reduce((sum, r) => sum + r.size, 0);
    const imageSize = responses.filter(r => r.type.includes('image')).reduce((sum, r) => sum + r.size, 0);

    // Performance budgets (in bytes)
    const budgets = {
      total: 2 * 1024 * 1024,    // 2MB total
      js: 500 * 1024,           // 500KB JavaScript
      css: 100 * 1024,          // 100KB CSS
      images: 1 * 1024 * 1024   // 1MB images
    };

    this.addResult(
      'Performance Budgets',
      'Total Page Size',
      totalSize <= budgets.total,
      `${Math.round(totalSize / 1024)}KB (budget: ${Math.round(budgets.total / 1024)}KB)`,
      { size: totalSize, budget: budgets.total, type: 'total' }
    );

    this.addResult(
      'Performance Budgets',
      'JavaScript Size',
      jsSize <= budgets.js,
      `${Math.round(jsSize / 1024)}KB (budget: ${Math.round(budgets.js / 1024)}KB)`,
      { size: jsSize, budget: budgets.js, type: 'javascript' }
    );

    this.addResult(
      'Performance Budgets',
      'CSS Size',
      cssSize <= budgets.css,
      `${Math.round(cssSize / 1024)}KB (budget: ${Math.round(budgets.css / 1024)}KB)`,
      { size: cssSize, budget: budgets.css, type: 'css' }
    );

    this.addResult(
      'Performance Budgets',
      'Image Size',
      imageSize <= budgets.images,
      `${Math.round(imageSize / 1024)}KB (budget: ${Math.round(budgets.images / 1024)}KB)`,
      { size: imageSize, budget: budgets.images, type: 'images' }
    );

    await this.page.close();
  }

  async testResourceOptimization() {
    console.log('⚡ Testing resource optimization...');
    
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
    
    await this.page.goto('http://localhost:1313/', { waitUntil: 'networkidle0' });

    // Test compression
    const compressionHeaders = await this.page.evaluate(() => {
      return fetch(window.location.href).then(response => ({
        contentEncoding: response.headers.get('content-encoding'),
        contentType: response.headers.get('content-type')
      }));
    });

    this.addResult(
      'Resource Optimization',
      'Content Compression',
      compressionHeaders.contentEncoding === 'gzip' || compressionHeaders.contentEncoding === 'br',
      `Encoding: ${compressionHeaders.contentEncoding || 'none'}`,
      compressionHeaders
    );

    // Test caching headers
    const cachingHeaders = await this.page.evaluate(() => {
      return fetch(window.location.href).then(response => ({
        cacheControl: response.headers.get('cache-control'),
        etag: response.headers.get('etag'),
        lastModified: response.headers.get('last-modified')
      }));
    });

    const hasCaching = cachingHeaders.cacheControl || cachingHeaders.etag || cachingHeaders.lastModified;

    this.addResult(
      'Resource Optimization',
      'Caching Headers',
      !!hasCaching,
      `Cache-Control: ${cachingHeaders.cacheControl || 'none'}`,
      cachingHeaders
    );

    // Test critical CSS
    const criticalCSS = await this.page.evaluate(() => {
      const inlineStyles = Array.from(document.querySelectorAll('style'));
      return {
        hasInlineCSS: inlineStyles.length > 0,
        inlineStylesCount: inlineStyles.length,
        totalInlineSize: inlineStyles.reduce((sum, style) => sum + style.textContent.length, 0)
      };
    });

    this.addResult(
      'Resource Optimization',
      'Critical CSS Inlining',
      criticalCSS.hasInlineCSS && criticalCSS.totalInlineSize > 0,
      `${criticalCSS.inlineStylesCount} inline styles, ${criticalCSS.totalInlineSize} chars`,
      criticalCSS
    );

    await this.page.close();
  }

  addResult(category, test, passed, message, data = null) {
    const result = { 
      category, 
      test, 
      passed, 
      message, 
      data, 
      timestamp: new Date().toISOString() 
    };
    this.results.push(result);
    
    const status = passed ? '✅' : '❌';
    console.log(`  ${status} ${test}: ${message}`);
  }

  async generateReport() {
    await fs.ensureDir(this.reportsDir);
    
    const report = {
      testSuite: 'Core Web Vitals Tests',
      timestamp: new Date().toISOString(),
      totalTests: this.results.length,
      passed: this.results.filter(r => r.passed).length,
      failed: this.results.filter(r => !r.passed).length,
      categories: this.groupResultsByCategory(),
      deviceBreakdown: this.generateDeviceBreakdown(),
      results: this.results,
      summary: this.generateSummary()
    };
    
    const reportPath = path.join(this.reportsDir, 'core-web-vitals-tests.json');
    await fs.writeJson(reportPath, report, { spaces: 2 });
    
    // Generate detailed HTML report
    await this.generateHtmlReport(report);
    
    console.log(`\n📊 Core Web Vitals Report Generated:`);
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

  generateDeviceBreakdown() {
    const devices = {};
    this.results.forEach(result => {
      if (result.data && result.data.device) {
        const device = result.data.device;
        if (!devices[device]) {
          devices[device] = { passed: 0, failed: 0 };
        }
        if (result.passed) {
          devices[device].passed++;
        } else {
          devices[device].failed++;
        }
      }
    });
    return devices;
  }

  generateSummary() {
    const coreWebVitalsResults = this.results.filter(r => r.category === 'Core Web Vitals');
    const vitalsMetrics = {};
    
    coreWebVitalsResults.forEach(result => {
      if (result.data && result.data.metric) {
        const metric = result.data.metric;
        if (!vitalsMetrics[metric]) {
          vitalsMetrics[metric] = { good: 0, needsImprovement: 0, poor: 0 };
        }
        if (result.data.status) {
          const status = result.data.status.toLowerCase().replace(' ', '');
          if (vitalsMetrics[metric][status] !== undefined) {
            vitalsMetrics[metric][status]++;
          }
        }
      }
    });

    return {
      coreWebVitalsBreakdown: vitalsMetrics,
      overallPerformance: {
        excellent: this.results.filter(r => r.passed && r.category === 'Core Web Vitals').length,
        needsWork: this.results.filter(r => !r.passed && r.category === 'Core Web Vitals').length
      }
    };
  }

  async generateHtmlReport(report) {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Core Web Vitals Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1400px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 3px solid #007acc; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 6px; text-align: center; }
        .metric h3 { margin: 0 0 10px 0; color: #666; font-size: 14px; text-transform: uppercase; }
        .metric .value { font-size: 24px; font-weight: bold; color: #007acc; }
        .device-breakdown { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin: 20px 0; }
        .device-card { background: #f8f9fa; padding: 15px; border-radius: 6px; }
        .test-result { margin: 8px 0; padding: 12px; border-radius: 4px; border-left: 4px solid #ddd; font-size: 14px; }
        .test-result.passed { background: #f0f9f0; border-left-color: #28a745; }
        .test-result.failed { background: #fdf2f2; border-left-color: #dc3545; }
        .test-name { font-weight: bold; margin-bottom: 3px; }
        .test-message { color: #666; }
        .category { margin: 25px 0; }
        .timestamp { color: #999; font-size: 12px; }
        .vitals-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .vital-card { background: #f8f9fa; padding: 20px; border-radius: 6px; }
        .vital-score { font-size: 18px; font-weight: bold; margin: 10px 0; }
        .score-good { color: #28a745; }
        .score-needs-improvement { color: #ffc107; }
        .score-poor { color: #dc3545; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Core Web Vitals Test Report</h1>
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

        <h2>Device Performance Breakdown</h2>
        <div class="device-breakdown">
            ${Object.entries(report.deviceBreakdown).map(([device, stats]) => `
                <div class="device-card">
                    <h3>${device}</h3>
                    <div>Passed: <strong style="color: #28a745">${stats.passed}</strong></div>
                    <div>Failed: <strong style="color: #dc3545">${stats.failed}</strong></div>
                    <div>Success Rate: <strong>${((stats.passed / (stats.passed + stats.failed)) * 100).toFixed(1)}%</strong></div>
                </div>
            `).join('')}
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

    const htmlPath = path.join(this.reportsDir, 'core-web-vitals-tests.html');
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
  const tester = new CoreWebVitalsTests();
  tester.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = CoreWebVitalsTests;