#!/usr/bin/env node

/**
 * Analytics Test Runner
 * Runs all analytics-related tests for the Hugo theme
 */

const { execSync } = require('child_process');
const path = require('path');

async function runAnalyticsTests() {
  console.log('🚀 Running Analytics Configuration Tests...\n');
  
  const testFiles = [
    'analytics-config-unit-tests.js',
    'facebook-pixel-unit-tests.js'
  ];
  
  let totalPassed = 0;
  let totalFailed = 0;
  let allTestsSucceeded = true;
  
  for (const testFile of testFiles) {
    console.log(`\n📋 Running ${testFile}...`);
    console.log('='.repeat(60));
    
    try {
      const output = execSync(`node ${testFile}`, { 
        cwd: __dirname,
        encoding: 'utf8',
        stdio: 'inherit'
      });
      
      console.log(`✅ ${testFile} completed successfully`);
      
    } catch (error) {
      console.error(`❌ ${testFile} failed with exit code ${error.status}`);
      allTestsSucceeded = false;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Analytics Test Suite Summary');
  console.log('='.repeat(60));
  
  if (allTestsSucceeded) {
    console.log('✅ All analytics tests passed successfully!');
    console.log('\n📋 Test Coverage:');
    console.log('   • Configuration parsing and validation');
    console.log('   • Privacy settings and Do Not Track functionality');
    console.log('   • Google Analytics 4 integration');
    console.log('   • Facebook Pixel configuration and event tracking');
    console.log('   • GDPR compliance and cookie consent');
    console.log('   • Type validation and default values');
    console.log('   • Analytics manager coordination');
    
    console.log('\n🎯 Requirements Verified:');
    console.log('   ✅ Requirement 1.1: Google Analytics 4 Integration');
    console.log('   ✅ Requirement 1.2: Privacy settings and Do Not Track functionality');
    console.log('   ✅ Requirement 7.1: Facebook Pixel Integration');
    console.log('   ✅ Requirement 7.5: Privacy compliance and GDPR requirements');
    
  } else {
    console.log('❌ Some analytics tests failed. Check the output above for details.');
  }
  
  return allTestsSucceeded;
}

// Run tests if called directly
if (require.main === module) {
  runAnalyticsTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = { runAnalyticsTests };