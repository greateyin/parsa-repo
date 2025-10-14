#!/usr/bin/env node

/**
 * Custom Performance Testing Suite
 * Additional performance tests beyond Lighthouse
 */

const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');

class PerformanceTests {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = [];
    this.reportsDir = path.join(__dirname, 'reports');
  }

  async runAllTests() {
    console.log('🚀 Starting Performance Tests...\n');
    
    try {
      await this.setupBrowser();
      await this.testPageLoadTimes();
      await this.testResourceLoading();
      await this.testImageOptimization();
      await this.testCSSPerformance();
      await this.testJavaScriptPerformance();
      await this.generateReport();
      
      console.log('✅ Performance tests completed successfully!');
      return true;
    } catch (error) {
      console.error('❌ Performance tests failed:', error.message);
      return false;
    } finally {
      await this.cleanup();
    }
  }

  async setupBrowser() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // Set up performance monitoring
    await this.page.setCacheEnabled(false);
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async testPageLoadTimes() {
    console.log('⏱️ Testing page load times...');
    
    const urls = [
      'http://localhost:1313/',
      'http://localhost:1313/blog/',
      'http://localhost:1313/categories/',
      'http://localhost:1313/tags/'
    ];

    for (const url of urls) {
      await this.measurePageLoad(url);
    }
  }

  async measurePageLoad(url) {
    try {
      const startTime = Date.now();
      
      // Navigate and wait for load
      await this.page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      
      const loadTime = Date.now() - startTime;
      
      // Get performance metrics
      const metrics = await this.page.metrics();
      
      // Get paint timings
      const paintTimings = await this.page.evaluate(() => {
        const paintEntries = performance.getEntriesByType('paint');
        const result = {};
        paintEntries.forEach(entry => {
          result[entry.name] = entry.startTime;
        });
        return result;
      });

      const result = {
        url: url.replace('http://localhost:1313', ''),
        loadTime,
        metrics: {
          JSHeapUsedSize: Math.round(metrics.JSHeapUsedSize / 1024 / 1024 * 100) / 100,
          JSHeapTotalSize: Math.round(metrics.JSHeapTotalSize / 1024 / 1024 * 100) / 100,
          firstPaint: paintTimings['first-paint'] || 0,
          firstContentfulPaint: paintTimings['first-contentful-paint'] || 0
        }
      };

      this.addResult('Page Load Time', url, loadTime < 3000, `${loadTime}ms`, result);
      
    } catch (error) {
      this.addResult('Page Load Time', url, false, `Error: ${error.message}`);
    }
  }  async
 testResourceLoading() {
    console.log('📦 Testing resource loading...');
    
    const responses = [];
    
    this.page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        size: response.headers()['content-length'] || 0,
        type: response.headers()['content-type'] || 'unknown'
      });
    });

    await this.page.goto('http://localhost:1313/', { waitUntil: 'networkidle0' });
    
    // Analyze responses
    const cssFiles = responses.filter(r => r.type.includes('text/css'));
    const jsFiles = responses.filter(r => r.type.includes('javascript'));
    const images = responses.filter(r => r.type.includes('image'));
    
    // Check CSS file sizes
    const largeCSSFiles = cssFiles.filter(f => parseInt(f.size) > 100000); // > 100KB
    this.addResult('CSS File Sizes', 'CSS optimization', largeCSSFiles.length === 0, 
      `${largeCSSFiles.length} large CSS files found`);
    
    // Check JS file sizes
    const largeJSFiles = jsFiles.filter(f => parseInt(f.size) > 200000); // > 200KB
    this.addResult('JS File Sizes', 'JS optimization', largeJSFiles.length === 0, 
      `${largeJSFiles.length} large JS files found`);
    
    // Check for 404s
    const notFoundResources = responses.filter(r => r.status === 404);
    this.addResult('Resource Loading', '404 errors', notFoundResources.length === 0, 
      `${notFoundResources.length} 404 errors found`);
  }

  async testImageOptimization() {
    console.log('🖼️ Testing image optimization...');
    
    await this.page.goto('http://localhost:1313/', { waitUntil: 'networkidle0' });
    
    // Check for images without alt text
    const imagesWithoutAlt = await this.page.$$eval('img', imgs => 
      imgs.filter(img => !img.alt || img.alt.trim() === '').length
    );
    
    this.addResult('Image Accessibility', 'Alt text', imagesWithoutAlt === 0, 
      `${imagesWithoutAlt} images without alt text`);
    
    // Check for lazy loading
    const lazyImages = await this.page.$$eval('img', imgs => 
      imgs.filter(img => img.loading === 'lazy' || img.hasAttribute('data-src')).length
    );
    
    const totalImages = await this.page.$$eval('img', imgs => imgs.length);
    
    if (totalImages > 0) {
      this.addResult('Image Optimization', 'Lazy loading', lazyImages > 0, 
        `${lazyImages}/${totalImages} images use lazy loading`);
    }
  }

  async testCSSPerformance() {
    console.log('🎨 Testing CSS performance...');
    
    await this.page.goto('http://localhost:1313/', { waitUntil: 'networkidle0' });
    
    // Check for unused CSS (simplified check)
    const stylesheets = await this.page.$$eval('link[rel="stylesheet"]', links => 
      links.map(link => link.href)
    );
    
    this.addResult('CSS Performance', 'Stylesheet count', stylesheets.length <= 5, 
      `${stylesheets.length} stylesheets loaded`);
    
    // Check for inline styles (should be minimal)
    const inlineStyles = await this.page.$$eval('[style]', elements => elements.length);
    
    this.addResult('CSS Performance', 'Inline styles', inlineStyles <= 10, 
      `${inlineStyles} elements with inline styles`);
  }

  async testJavaScriptPerformance() {
    console.log('⚡ Testing JavaScript performance...');
    
    await this.page.goto('http://localhost:1313/', { waitUntil: 'networkidle0' });
    
    // Check for JavaScript errors
    const jsErrors = [];
    this.page.on('pageerror', error => {
      jsErrors.push(error.message);
    });
    
    // Wait a bit to catch any delayed errors
    await this.page.waitForTimeout(2000);
    
    this.addResult('JavaScript Performance', 'JS errors', jsErrors.length === 0, 
      `${jsErrors.length} JavaScript errors found`);
    
    // Check for console warnings
    const consoleMessages = [];
    this.page.on('console', msg => {
      if (msg.type() === 'warning' || msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });
    
    await this.page.reload({ waitUntil: 'networkidle0' });
    await this.page.waitForTimeout(1000);
    
    this.addResult('JavaScript Performance', 'Console warnings', consoleMessages.length <= 2, 
      `${consoleMessages.length} console warnings/errors`);

    // Test analytics script performance
    await this.testAnalyticsScriptPerformance();
  }

  async testAnalyticsScriptPerformance() {
    console.log('📊 Testing analytics script performance...');
    
    // Test Google Analytics performance impact
    const analyticsMetrics = await this.page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const analyticsScripts = scripts.filter(script => 
        script.src.includes('gtag') || 
        script.src.includes('fbevents') || 
        script.src.includes('adsbygoogle') ||
        script.src.includes('mermaid')
      );
      
      return {
        totalScripts: scripts.length,
        analyticsScripts: analyticsScripts.length,
        asyncScripts: analyticsScripts.filter(script => script.async).length,
        hasGoogleAnalytics: !!window.gtag,
        hasFacebookPixel: !!window.fbq,
        hasAdSense: !!window.adsbygoogle,
        hasMermaid: !!window.mermaid
      };
    });

    this.addResult('Analytics Performance', 'Script loading', 
      analyticsMetrics.asyncScripts === analyticsMetrics.analyticsScripts,
      `${analyticsMetrics.asyncScripts}/${analyticsMetrics.analyticsScripts} analytics scripts are async`);

    this.addResult('Analytics Performance', 'Google Analytics initialization', 
      analyticsMetrics.hasGoogleAnalytics,
      `Google Analytics ${analyticsMetrics.hasGoogleAnalytics ? 'loaded' : 'not loaded'}`);

    // Test script loading order and timing
    const scriptTimings = await this.page.evaluate(() => {
      const entries = performance.getEntriesByType('resource');
      const scriptEntries = entries.filter(entry => 
        entry.name.includes('.js') && (
          entry.name.includes('gtag') || 
          entry.name.includes('fbevents') || 
          entry.name.includes('adsbygoogle')
        )
      );
      
      return scriptEntries.map(entry => ({
        name: entry.name,
        duration: entry.duration,
        startTime: entry.startTime,
        transferSize: entry.transferSize
      }));
    });

    const avgScriptLoadTime = scriptTimings.length > 0 
      ? scriptTimings.reduce((sum, timing) => sum + timing.duration, 0) / scriptTimings.length 
      : 0;

    this.addResult('Analytics Performance', 'Script load timing', 
      avgScriptLoadTime <= 500,
      `Average script load time: ${Math.round(avgScriptLoadTime)}ms`);
  }  a
ddResult(category, test, passed, message, data = null) {
    const result = { category, test, passed, message, data };
    this.results.push(result);
    
    const status = passed ? '✅' : '❌';
    console.log(`  ${status} ${category} - ${test}: ${message}`);
  }

  async generateReport() {
    await fs.ensureDir(this.reportsDir);
    
    const report = {
      timestamp: new Date().toISOString(),
      totalTests: this.results.length,
      passed: this.results.filter(r => r.passed).length,
      failed: this.results.filter(r => !r.passed).length,
      results: this.results
    };
    
    const reportPath = path.join(this.reportsDir, 'performance-tests.json');
    await fs.writeJson(reportPath, report, { spaces: 2 });
    
    console.log(`\n📊 Performance Report Generated: ${reportPath}`);
    console.log(`   Total Tests: ${report.totalTests}`);
    console.log(`   Passed: ${report.passed}`);
    console.log(`   Failed: ${report.failed}`);
    console.log(`   Success Rate: ${((report.passed / report.totalTests) * 100).toFixed(1)}%`);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new PerformanceTests();
  tester.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = PerformanceTests;