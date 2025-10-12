#!/usr/bin/env node

/**
 * Test Setup Validation
 * Validates that the testing environment is properly configured
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

class SetupValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  async validateSetup() {
    console.log('🔍 Validating test setup...\n');
    
    this.checkNodeVersion();
    this.checkHugoInstallation();
    this.checkDependencies();
    await this.checkExampleSite();
    this.checkTestFiles();
    
    this.printResults();
    
    return this.errors.length === 0;
  }

  checkNodeVersion() {
    try {
      const version = process.version;
      const majorVersion = parseInt(version.slice(1).split('.')[0]);
      
      if (majorVersion >= 16) {
        console.log(`✅ Node.js version: ${version}`);
      } else {
        this.errors.push(`Node.js version ${version} is too old. Requires Node.js 16+`);
      }
    } catch (error) {
      this.errors.push('Could not determine Node.js version');
    }
  }

  checkHugoInstallation() {
    try {
      const output = execSync('hugo version', { encoding: 'utf8' });
      console.log(`✅ Hugo installed: ${output.trim()}`);
      
      // Check for extended version
      if (output.includes('extended')) {
        console.log('✅ Hugo extended version detected');
      } else {
        this.warnings.push('Hugo extended version recommended for full functionality');
      }
    } catch (error) {
      this.errors.push('Hugo is not installed or not in PATH');
    }
  }

  checkDependencies() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      console.log('✅ Test package.json found');
      
      const nodeModulesPath = path.join(__dirname, 'node_modules');
      if (fs.existsSync(nodeModulesPath)) {
        console.log('✅ Test dependencies installed');
      } else {
        this.errors.push('Test dependencies not installed. Run: cd tests && npm install');
      }
    } else {
      this.errors.push('Test package.json not found');
    }
  }

  async checkExampleSite() {
    const exampleSitePath = path.join(__dirname, '../exampleSite');
    
    if (await fs.pathExists(exampleSitePath)) {
      console.log('✅ Example site directory found');
      
      const configPath = path.join(exampleSitePath, 'hugo.toml');
      if (await fs.pathExists(configPath)) {
        console.log('✅ Example site configuration found');
      } else {
        this.warnings.push('Example site hugo.toml not found');
      }
      
      // Try to build the site
      try {
        execSync('hugo --minify --destination public-test', { 
          cwd: exampleSitePath,
          stdio: 'pipe'
        });
        console.log('✅ Example site builds successfully');
        
        // Clean up test build
        await fs.remove(path.join(exampleSitePath, 'public-test'));
      } catch (error) {
        this.errors.push('Example site failed to build');
      }
    } else {
      this.errors.push('Example site directory not found');
    }
  }

  checkTestFiles() {
    const requiredFiles = [
      'hugo-template-tests.js',
      'performance-tests.js',
      'accessibility-tests.js',
      'playwright.config.js',
      'backstop.json',
      'lighthouserc.js'
    ];

    requiredFiles.forEach(file => {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} found`);
      } else {
        this.errors.push(`Required test file missing: ${file}`);
      }
    });
  }

  printResults() {
    console.log('\n' + '='.repeat(50));
    console.log('VALIDATION RESULTS');
    console.log('='.repeat(50));
    
    if (this.errors.length === 0) {
      console.log('✅ All validation checks passed!');
      console.log('\nYou can now run the test suite:');
      console.log('  npm run test');
    } else {
      console.log('❌ Validation failed with errors:');
      this.errors.forEach(error => {
        console.log(`  • ${error}`);
      });
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      this.warnings.forEach(warning => {
        console.log(`  • ${warning}`);
      });
    }
    
    console.log('='.repeat(50));
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new SetupValidator();
  validator.validateSetup().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = SetupValidator;