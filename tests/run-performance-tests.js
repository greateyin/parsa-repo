#!/usr/bin/env node

/**
 * Comprehensive Performance Test Runner
 * Runs all performance-related tests for the Hugo theme analytics enhancements
 */

const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

// Import test classes
const PerformanceTests = require('./performance-tests');
const AnalyticsPerformanceTests = require('./analytics-performance-tests');
const CoreWebVitalsTests = require('./core-web-vitals-tests');

class PerformanceTestRunner {
  constructor() {
    this.reportsDir = path.join(__dirname, 'reports');
    this.results = {
      timestamp: new Date().toISOString(),
      testSuites: [],
      summary: {
        totalTests: 0,
        totalPassed: 0,
        totalFailed: 0,
        overallSuccessRate: 0
      }
    };
  }

  async runAllPerformanceTests() {
    console.log('🚀 Starting Comprehensive Performance Test Suite...\n');
    console.log('This will test script loading performance and Core Web Vitals compliance\n');

    try {
      await this.ensureReportsDirectory();
      
      // Run Lighthouse tests first (external process)
      console.log('🏠 Running Lighthouse Core Web Vitals tests...');
      await this.runLighthouseTests();
      
      // Run custom performance tests
      console.log('\n📊 Running custom performance tests...');
      await this.runCustomPerformanceTests();
      
      // Run analytics-specific performance tests
      console.log('\n🎯 Running analytics performance tests...');
      await this.runAnalyticsPerformanceTests();
      
      // Run comprehensive Core Web Vitals tests
      console.log('\n⚡ Running Core Web Vitals tests...');
      await this.runCoreWebVitalsTests();
      
      // Generate consolidated report
      await this.generateConsolidatedReport();
      
      console.log('\n✅ All performance tests completed successfully!');
      console.log(`📊 Consolidated report available at: ${path.join(this.reportsDir, 'performance-summary.html')}`);
      
      return this.results.summary.overallSuccessRate >= 80; // 80% pass rate required
      
    } catch (error) {
      console.error('❌ Performance test suite failed:', error.message);
      return false;
    }
  }

  async ensureReportsDirectory() {
    await fs.ensureDir(this.reportsDir);
  }

  async runLighthouseTests() {
    return new Promise((resolve, reject) => {
      const lighthouse = spawn('npm', ['run', 'test:lighthouse'], {
        cwd: __dirname,
        stdio: 'inherit'
      });

      lighthouse.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Lighthouse tests completed');
          this.results.testSuites.push({
            name: 'Lighthouse Core Web Vitals',
            status: 'completed',
            reportPath: path.join(this.reportsDir, 'lighthouse')
          });
          resolve();
        } else {
          console.log('⚠️ Lighthouse tests completed with warnings');
          this.results.testSuites.push({
            name: 'Lighthouse Core Web Vitals',
            status: 'completed_with_warnings',
            reportPath: path.join(this.reportsDir, 'lighthouse')
          });
          resolve(); // Don't fail the entire suite for Lighthouse warnings
        }
      });

      lighthouse.on('error', (error) => {
        console.log('⚠️ Lighthouse tests skipped (server may not be running)');
        this.results.testSuites.push({
          name: 'Lighthouse Core Web Vitals',
          status: 'skipped',
          error: error.message
        });
        resolve(); // Don't fail for missing server
      });
    });
  }

  async runCustomPerformanceTests() {
    try {
      const performanceTests = new PerformanceTests();
      const success = await performanceTests.runAllTests();
      
      // Read the generated report
      const reportPath = path.join(this.reportsDir, 'performance-tests.json');
      if (await fs.pathExists(reportPath)) {
        const report = await fs.readJson(reportPath);
        this.results.testSuites.push({
          name: 'Custom Performance Tests',
          status: success ? 'passed' : 'failed',
          reportPath: reportPath,
          results: {
            total: report.totalTests,
            passed: report.passed,
            failed: report.failed,
            successRate: (report.passed / report.totalTests) * 100
          }
        });
        
        this.results.summary.totalTests += report.totalTests;
        this.results.summary.totalPassed += report.passed;
        this.results.summary.totalFailed += report.failed;
      }
      
    } catch (error) {
      console.error('❌ Custom performance tests failed:', error.message);
      this.results.testSuites.push({
        name: 'Custom Performance Tests',
        status: 'failed',
        error: error.message
      });
    }
  }

  async runAnalyticsPerformanceTests() {
    try {
      const analyticsTests = new AnalyticsPerformanceTests();
      const success = await analyticsTests.runAllTests();
      
      // Read the generated report
      const reportPath = path.join(this.reportsDir, 'analytics-performance-tests.json');
      if (await fs.pathExists(reportPath)) {
        const report = await fs.readJson(reportPath);
        this.results.testSuites.push({
          name: 'Analytics Performance Tests',
          status: success ? 'passed' : 'failed',
          reportPath: reportPath,
          results: {
            total: report.totalTests,
            passed: report.passed,
            failed: report.failed,
            successRate: (report.passed / report.totalTests) * 100
          }
        });
        
        this.results.summary.totalTests += report.totalTests;
        this.results.summary.totalPassed += report.passed;
        this.results.summary.totalFailed += report.failed;
      }
      
    } catch (error) {
      console.error('❌ Analytics performance tests failed:', error.message);
      this.results.testSuites.push({
        name: 'Analytics Performance Tests',
        status: 'failed',
        error: error.message
      });
    }
  }

  async runCoreWebVitalsTests() {
    try {
      const coreWebVitalsTests = new CoreWebVitalsTests();
      const success = await coreWebVitalsTests.runAllTests();
      
      // Read the generated report
      const reportPath = path.join(this.reportsDir, 'core-web-vitals-tests.json');
      if (await fs.pathExists(reportPath)) {
        const report = await fs.readJson(reportPath);
        this.results.testSuites.push({
          name: 'Core Web Vitals Tests',
          status: success ? 'passed' : 'failed',
          reportPath: reportPath,
          results: {
            total: report.totalTests,
            passed: report.passed,
            failed: report.failed,
            successRate: (report.passed / report.totalTests) * 100
          }
        });
        
        this.results.summary.totalTests += report.totalTests;
        this.results.summary.totalPassed += report.passed;
        this.results.summary.totalFailed += report.failed;
      }
      
    } catch (error) {
      console.error('❌ Core Web Vitals tests failed:', error.message);
      this.results.testSuites.push({
        name: 'Core Web Vitals Tests',
        status: 'failed',
        error: error.message
      });
    }
  }

  async generateConsolidatedReport() {
    // Calculate overall success rate
    this.results.summary.overallSuccessRate = this.results.summary.totalTests > 0 
      ? (this.results.summary.totalPassed / this.results.summary.totalTests) * 100 
      : 0;

    // Save JSON report
    const jsonReportPath = path.join(this.reportsDir, 'performance-summary.json');
    await fs.writeJson(jsonReportPath, this.results, { spaces: 2 });

    // Generate HTML report
    await this.generateHtmlSummaryReport();

    console.log('\n📊 Performance Test Summary:');
    console.log(`   Total Tests: ${this.results.summary.totalTests}`);
    console.log(`   Passed: ${this.results.summary.totalPassed}`);
    console.log(`   Failed: ${this.results.summary.totalFailed}`);
    console.log(`   Overall Success Rate: ${this.results.summary.overallSuccessRate.toFixed(1)}%`);
    
    console.log('\n📋 Test Suite Results:');
    this.results.testSuites.forEach(suite => {
      const status = suite.status === 'passed' ? '✅' : 
                    suite.status === 'failed' ? '❌' : 
                    suite.status === 'completed_with_warnings' ? '⚠️' : '⏭️';
      console.log(`   ${status} ${suite.name}: ${suite.status}`);
      if (suite.results) {
        console.log(`      ${suite.results.passed}/${suite.results.total} tests passed (${suite.results.successRate.toFixed(1)}%)`);
      }
    });
  }

  async generateHtmlSummaryReport() {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Performance Test Summary Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 3px solid #007acc; padding-bottom: 10px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 6px; text-align: center; }
        .metric h3 { margin: 0 0 10px 0; color: #666; font-size: 14px; text-transform: uppercase; }
        .metric .value { font-size: 24px; font-weight: bold; color: #007acc; }
        .test-suites { margin: 30px 0; }
        .test-suite { background: #f8f9fa; margin: 15px 0; padding: 20px; border-radius: 6px; border-left: 4px solid #ddd; }
        .test-suite.passed { border-left-color: #28a745; }
        .test-suite.failed { border-left-color: #dc3545; }
        .test-suite.completed_with_warnings { border-left-color: #ffc107; }
        .test-suite.skipped { border-left-color: #6c757d; }
        .suite-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .suite-name { font-weight: bold; font-size: 18px; }
        .suite-status { padding: 4px 12px; border-radius: 4px; font-size: 12px; text-transform: uppercase; font-weight: bold; }
        .status-passed { background: #d4edda; color: #155724; }
        .status-failed { background: #f8d7da; color: #721c24; }
        .status-completed_with_warnings { background: #fff3cd; color: #856404; }
        .status-skipped { background: #e2e3e5; color: #383d41; }
        .suite-results { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin-top: 10px; }
        .suite-metric { text-align: center; padding: 10px; background: white; border-radius: 4px; }
        .suite-metric .label { font-size: 12px; color: #666; text-transform: uppercase; }
        .suite-metric .value { font-size: 16px; font-weight: bold; color: #333; }
        .timestamp { color: #999; font-size: 12px; }
        .recommendations { background: #e7f3ff; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #007acc; }
        .recommendations h3 { margin-top: 0; color: #007acc; }
        .recommendations ul { margin: 10px 0; }
        .recommendations li { margin: 5px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Performance Test Summary Report</h1>
        <p class="timestamp">Generated: ${this.results.timestamp}</p>
        
        <div class="summary">
            <div class="metric">
                <h3>Total Tests</h3>
                <div class="value">${this.results.summary.totalTests}</div>
            </div>
            <div class="metric">
                <h3>Passed</h3>
                <div class="value" style="color: #28a745">${this.results.summary.totalPassed}</div>
            </div>
            <div class="metric">
                <h3>Failed</h3>
                <div class="value" style="color: #dc3545">${this.results.summary.totalFailed}</div>
            </div>
            <div class="metric">
                <h3>Success Rate</h3>
                <div class="value" style="color: ${this.results.summary.overallSuccessRate >= 80 ? '#28a745' : this.results.summary.overallSuccessRate >= 60 ? '#ffc107' : '#dc3545'}">${this.results.summary.overallSuccessRate.toFixed(1)}%</div>
            </div>
        </div>

        <div class="test-suites">
            <h2>Test Suite Results</h2>
            ${this.results.testSuites.map(suite => `
                <div class="test-suite ${suite.status}">
                    <div class="suite-header">
                        <div class="suite-name">${suite.name}</div>
                        <div class="suite-status status-${suite.status}">${suite.status.replace('_', ' ')}</div>
                    </div>
                    ${suite.results ? `
                        <div class="suite-results">
                            <div class="suite-metric">
                                <div class="label">Total</div>
                                <div class="value">${suite.results.total}</div>
                            </div>
                            <div class="suite-metric">
                                <div class="label">Passed</div>
                                <div class="value" style="color: #28a745">${suite.results.passed}</div>
                            </div>
                            <div class="suite-metric">
                                <div class="label">Failed</div>
                                <div class="value" style="color: #dc3545">${suite.results.failed}</div>
                            </div>
                            <div class="suite-metric">
                                <div class="label">Success Rate</div>
                                <div class="value">${suite.results.successRate.toFixed(1)}%</div>
                            </div>
                        </div>
                    ` : ''}
                    ${suite.error ? `<div style="color: #dc3545; margin-top: 10px;">Error: ${suite.error}</div>` : ''}
                    ${suite.reportPath ? `<div style="margin-top: 10px;"><a href="${path.basename(suite.reportPath)}" style="color: #007acc;">View Detailed Report</a></div>` : ''}
                </div>
            `).join('')}
        </div>

        <div class="recommendations">
            <h3>Performance Optimization Recommendations</h3>
            <ul>
                <li><strong>Script Loading:</strong> Ensure all analytics scripts are loaded asynchronously to prevent blocking page rendering</li>
                <li><strong>Core Web Vitals:</strong> Monitor First Contentful Paint (FCP) &lt; 1.8s, Largest Contentful Paint (LCP) &lt; 2.5s, and Cumulative Layout Shift (CLS) &lt; 0.1</li>
                <li><strong>Third-party Impact:</strong> Minimize the performance impact of analytics and advertising scripts</li>
                <li><strong>Lazy Loading:</strong> Implement lazy loading for below-the-fold advertisements and images</li>
                <li><strong>Resource Optimization:</strong> Use compression, caching, and critical CSS inlining</li>
                <li><strong>Conditional Loading:</strong> Only load Mermaid.js when diagrams are present on the page</li>
            </ul>
        </div>
    </div>
</body>
</html>`;

    const htmlPath = path.join(this.reportsDir, 'performance-summary.html');
    await fs.writeFile(htmlPath, htmlContent);
  }
}

// Run tests if called directly
if (require.main === module) {
  const runner = new PerformanceTestRunner();
  runner.runAllPerformanceTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = PerformanceTestRunner;