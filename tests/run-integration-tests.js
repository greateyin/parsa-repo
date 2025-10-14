#!/usr/bin/env node

/**
 * Integration Test Runner
 * Runs template integration tests for analytics, advertising, and search partials
 */

const fs = require('fs-extra');
const path = require('path');

class IntegrationTestRunner {
  constructor() {
    this.reportsDir = path.join(__dirname, 'reports');
    this.results = {
      templateIntegration: null,
      partialIntegration: null
    };
  }

  async runAllIntegrationTests() {
    console.log('🔧 Starting Template Integration Test Suite\n');
    console.log('=' .repeat(60));
    
    try {
      await this.setupReports();
      
      // Run template integration tests
      await this.runTemplateIntegrationTests();
      
      // Run partial integration tests
      await this.runPartialIntegrationTests();
      
      await this.generateSummaryReport();
      
      const allPassed = Object.values(this.results).every(result => result === true);
      
      if (allPassed) {
        console.log('\n✅ All integration tests passed!');
        console.log('📊 Check the reports directory for detailed results.');
        return true;
      } else {
        console.log('\n❌ Some integration tests failed.');
        return false;
      }
    } catch (error) {
      console.error('\n❌ Integration test suite failed:', error.message);
      return false;
    }
  }

  async setupReports() {
    console.log('📁 Setting up reports directory...');
    await fs.ensureDir(this.reportsDir);
  }

  async runTemplateIntegrationTests() {
    console.log('\n🧩 Running Template Integration Tests...');
    console.log('-'.repeat(40));
    
    try {
      const TemplateIntegrationTests = require('./template-integration-tests');
      const tester = new TemplateIntegrationTests();
      this.results.templateIntegration = await tester.runAllTests();
      console.log('  ✅ Template integration tests completed');
    } catch (error) {
      console.error('  ❌ Template integration tests failed:', error.message);
      this.results.templateIntegration = false;
    }
  }

  async runPartialIntegrationTests() {
    console.log('\n🤝 Running Partial Integration Tests...');
    console.log('-'.repeat(40));
    
    try {
      const PartialIntegrationTests = require('./partial-integration-tests');
      const tester = new PartialIntegrationTests();
      this.results.partialIntegration = await tester.runAllTests();
      console.log('  ✅ Partial integration tests completed');
    } catch (error) {
      console.error('  ❌ Partial integration tests failed:', error.message);
      this.results.partialIntegration = false;
    }
  }

  async generateSummaryReport() {
    console.log('\n📊 Generating Integration Test Summary...');
    
    const summary = {
      timestamp: new Date().toISOString(),
      testType: 'Integration Tests',
      requirements: ['1.1', '2.2', '3.1'],
      testSuites: {
        templateIntegration: {
          name: 'Template Integration Tests',
          passed: this.results.templateIntegration,
          description: 'Tests template rendering with analytics, advertising, and search partials'
        },
        partialIntegration: {
          name: 'Partial Integration Tests',
          passed: this.results.partialIntegration,
          description: 'Tests interaction and coexistence between all template partials'
        }
      },
      overallResult: Object.values(this.results).every(result => result === true)
    };
    
    const reportPath = path.join(this.reportsDir, 'integration-test-summary.json');
    await fs.writeJson(reportPath, summary, { spaces: 2 });
    
    console.log(`\n📋 Integration Test Summary: ${reportPath}`);
    
    // Print summary to console
    console.log('\n' + '='.repeat(60));
    console.log('INTEGRATION TEST SUMMARY');
    console.log('='.repeat(60));
    
    Object.entries(summary.testSuites).forEach(([key, suite]) => {
      const status = suite.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${suite.name}`);
    });
    
    console.log('='.repeat(60));
    const overallStatus = summary.overallResult ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED';
    console.log(`OVERALL RESULT: ${overallStatus}`);
    console.log(`REQUIREMENTS TESTED: ${summary.requirements.join(', ')}`);
    console.log('='.repeat(60));
  }
}

// Run tests if called directly
if (require.main === module) {
  const runner = new IntegrationTestRunner();
  runner.runAllIntegrationTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = IntegrationTestRunner;