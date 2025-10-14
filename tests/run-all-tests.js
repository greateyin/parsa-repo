#!/usr/bin/env node

/**
 * Comprehensive Test Suite Runner
 * Runs all tests for the Hugo theme redesign
 */

const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

class TestRunner {
  constructor() {
    this.reportsDir = path.join(__dirname, 'reports');
    this.results = {
      hugo: null,
      analytics: null,
      search: null,
      performance: null,
      accessibility: null,
      crossBrowser: null,
      visual: null
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive Test Suite for Hugo Theme Redesign\n');
    console.log('=' .repeat(60));
    
    try {
      await this.setupReports();
      await this.checkPrerequisites();
      
      // Run all test suites
      await this.runHugoTests();
      await this.runAnalyticsTests();
      await this.runSearchTests();
      await this.runPerformanceTests();
      await this.runAccessibilityTests();
      await this.runCrossBrowserTests();
      await this.runVisualTests();
      
      await this.generateSummaryReport();
      
      console.log('\n✅ All test suites completed!');
      console.log('📊 Check the reports directory for detailed results.');
      
      return true;
    } catch (error) {
      console.error('\n❌ Test suite failed:', error.message);
      return false;
    }
  }

  async setupReports() {
    console.log('📁 Setting up reports directory...');
    await fs.ensureDir(this.reportsDir);
    await fs.emptyDir(this.reportsDir);
  }

  async checkPrerequisites() {
    console.log('🔍 Checking prerequisites...');
    
    // Check if Hugo is installed
    try {
      execSync('hugo version', { stdio: 'pipe' });
      console.log('  ✅ Hugo is installed');
    } catch (error) {
      throw new Error('Hugo is not installed or not in PATH');
    }
    
    // Check if Node.js dependencies are installed
    const packageJsonPath = path.join(__dirname, 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
      throw new Error('Test dependencies not installed. Run: cd tests && npm install');
    }
    
    console.log('  ✅ Prerequisites check passed');
  }

  async runHugoTests() {
    console.log('\n🧪 Running Hugo Template Tests...');
    console.log('-'.repeat(40));
    
    try {
      const HugoTemplateTests = require('./hugo-template-tests');
      const tester = new HugoTemplateTests();
      this.results.hugo = await tester.runAllTests();
      console.log('  ✅ Hugo template tests completed');
      
      // Run template integration tests
      console.log('\n🔧 Running Template Integration Tests...');
      const TemplateIntegrationTests = require('./template-integration-tests');
      const integrationTester = new TemplateIntegrationTests();
      const integrationResult = await integrationTester.runAllTests();
      
      // Run partial integration tests
      console.log('\n🤝 Running Partial Integration Tests...');
      const PartialIntegrationTests = require('./partial-integration-tests');
      const partialTester = new PartialIntegrationTests();
      const partialResult = await partialTester.runAllTests();
      
      // Combine results
      this.results.hugo = this.results.hugo && integrationResult && partialResult;
      console.log('  ✅ All Hugo tests completed');
    } catch (error) {
      console.error('  ❌ Hugo template tests failed:', error.message);
      this.results.hugo = false;
    }
  }

  async runAnalyticsTests() {
    console.log('\n📊 Running Analytics Configuration Tests...');
    console.log('-'.repeat(40));
    
    try {
      const AnalyticsConfigurationTests = require('./analytics-configuration-tests');
      const tester = new AnalyticsConfigurationTests();
      this.results.analytics = await tester.runAllTests();
      console.log('  ✅ Analytics configuration tests completed');
    } catch (error) {
      console.error('  ❌ Analytics configuration tests failed:', error.message);
      this.results.analytics = false;
    }
  }

  async runSearchTests() {
    console.log('\n🔍 Running Search Functionality Tests...');
    console.log('-'.repeat(40));
    
    try {
      const SearchUnitTests = require('./search-unit-tests');
      const tester = new SearchUnitTests();
      this.results.search = await tester.runAllTests();
      console.log('  ✅ Search functionality tests completed');
    } catch (error) {
      console.error('  ❌ Search functionality tests failed:', error.message);
      this.results.search = false;
    }
  }

  async runPerformanceTests() {
    console.log('\n⚡ Running Performance Tests...');
    console.log('-'.repeat(40));
    
    try {
      // Run comprehensive performance test suite
      const PerformanceTestRunner = require('./run-performance-tests');
      const runner = new PerformanceTestRunner();
      this.results.performance = await runner.runAllPerformanceTests();
      console.log('  ✅ Performance tests completed');
    } catch (error) {
      console.error('  ❌ Performance tests failed:', error.message);
      this.results.performance = false;
    }
  } 
 async runAccessibilityTests() {
    console.log('\n♿ Running Accessibility Tests...');
    console.log('-'.repeat(40));
    
    try {
      const AccessibilityTests = require('./accessibility-tests');
      const tester = new AccessibilityTests();
      this.results.accessibility = await tester.runAllTests();
      console.log('  ✅ Accessibility tests completed');
    } catch (error) {
      console.error('  ❌ Accessibility tests failed:', error.message);
      this.results.accessibility = false;
    }
  }

  async runCrossBrowserTests() {
    console.log('\n🌐 Running Cross-Browser Tests...');
    console.log('-'.repeat(40));
    
    try {
      // Run Playwright tests
      execSync('npx playwright test', { 
        stdio: 'inherit',
        cwd: __dirname
      });
      this.results.crossBrowser = true;
      console.log('  ✅ Cross-browser tests completed');
    } catch (error) {
      console.error('  ❌ Cross-browser tests failed');
      this.results.crossBrowser = false;
    }
  }

  async runVisualTests() {
    console.log('\n👁️ Running Visual Regression Tests...');
    console.log('-'.repeat(40));
    
    try {
      // Run BackstopJS tests
      execSync('npx backstop test', { 
        stdio: 'inherit',
        cwd: __dirname
      });
      this.results.visual = true;
      console.log('  ✅ Visual regression tests completed');
    } catch (error) {
      console.error('  ❌ Visual regression tests failed');
      this.results.visual = false;
    }
  }

  async generateSummaryReport() {
    console.log('\n📊 Generating Summary Report...');
    
    const summary = {
      timestamp: new Date().toISOString(),
      testSuites: {
        hugoTemplates: {
          name: 'Hugo Template Rendering',
          passed: this.results.hugo,
          description: 'Tests Hugo template compilation and rendering'
        },
        analyticsConfiguration: {
          name: 'Analytics Configuration',
          passed: this.results.analytics,
          description: 'Tests analytics configuration parsing, validation, and privacy settings'
        },
        searchFunctionality: {
          name: 'Search Functionality',
          passed: this.results.search,
          description: 'Tests Google Custom Search integration and local search fallback'
        },
        performance: {
          name: 'Performance & Core Web Vitals',
          passed: this.results.performance,
          description: 'Tests page load times, resource optimization, and performance metrics'
        },
        accessibility: {
          name: 'Accessibility (WCAG 2.1 AA)',
          passed: this.results.accessibility,
          description: 'Tests keyboard navigation, screen reader support, and ARIA implementation'
        },
        crossBrowser: {
          name: 'Cross-Browser Compatibility',
          passed: this.results.crossBrowser,
          description: 'Tests functionality across different browsers and devices'
        },
        visual: {
          name: 'Visual Regression',
          passed: this.results.visual,
          description: 'Tests visual consistency across different viewports'
        }
      },
      overallResult: Object.values(this.results).every(result => result === true)
    };
    
    const reportPath = path.join(this.reportsDir, 'test-summary.json');
    await fs.writeJson(reportPath, summary, { spaces: 2 });
    
    // Generate HTML summary
    const htmlReport = this.generateHTMLSummary(summary);
    const htmlPath = path.join(this.reportsDir, 'test-summary.html');
    await fs.writeFile(htmlPath, htmlReport);
    
    console.log(`\n📋 Summary Report: ${reportPath}`);
    console.log(`🌐 HTML Report: ${htmlPath}`);
    
    // Print summary to console
    console.log('\n' + '='.repeat(60));
    console.log('TEST SUITE SUMMARY');
    console.log('='.repeat(60));
    
    Object.entries(summary.testSuites).forEach(([key, suite]) => {
      const status = suite.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${suite.name}`);
    });
    
    console.log('='.repeat(60));
    const overallStatus = summary.overallResult ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED';
    console.log(`OVERALL RESULT: ${overallStatus}`);
    console.log('='.repeat(60));
  }  gene
rateHTMLSummary(summary) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hugo Theme Test Summary</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .overall-result { padding: 20px; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold; }
        .pass { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .fail { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .test-suite { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .test-suite h3 { margin: 0 0 10px 0; }
        .status { font-weight: bold; }
        .status.pass { color: #28a745; }
        .status.fail { color: #dc3545; }
        .timestamp { color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Hugo Theme Redesign - Test Summary</h1>
        <p class="timestamp">Generated: ${new Date(summary.timestamp).toLocaleString()}</p>
    </div>
    
    <div class="overall-result ${summary.overallResult ? 'pass' : 'fail'}">
        ${summary.overallResult ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}
    </div>
    
    <h2>Test Suite Results</h2>
    
    ${Object.entries(summary.testSuites).map(([key, suite]) => `
        <div class="test-suite">
            <h3>${suite.name} <span class="status ${suite.passed ? 'pass' : 'fail'}">${suite.passed ? '✅ PASS' : '❌ FAIL'}</span></h3>
            <p>${suite.description}</p>
        </div>
    `).join('')}
    
    <h2>Detailed Reports</h2>
    <ul>
        <li><a href="hugo-template-tests.json">Hugo Template Tests (JSON)</a></li>
        <li><a href="analytics-configuration-tests.json">Analytics Configuration Tests (JSON)</a></li>
        <li><a href="search-unit-tests.json">Search Functionality Tests (JSON)</a></li>
        <li><a href="performance-tests.json">Performance Tests (JSON)</a></li>
        <li><a href="accessibility-tests.json">Accessibility Tests (JSON)</a></li>
        <li><a href="playwright-report/index.html">Cross-Browser Tests (HTML)</a></li>
        <li><a href="../backstop_data/html_report/index.html">Visual Regression Tests (HTML)</a></li>
    </ul>
</body>
</html>`;
  }
}

// Run tests if called directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = TestRunner;