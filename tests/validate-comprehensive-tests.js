/**
 * Validation Script for Comprehensive Integration Tests
 * Tests the test framework itself without requiring full Hugo server setup
 */

const fs = require('fs-extra');
const path = require('path');

class TestValidator {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            tests: []
        };
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    test(name, testFn) {
        try {
            this.log(`Running validation: ${name}`);
            testFn();
            this.results.passed++;
            this.results.tests.push({ name, status: 'passed' });
            this.log(`Validation passed: ${name}`, 'success');
        } catch (error) {
            this.results.failed++;
            this.results.tests.push({ name, status: 'failed', error: error.message });
            this.log(`Validation failed: ${name} - ${error.message}`, 'error');
        }
    }

    // Validate test file structure
    validateTestFiles() {
        this.test('Test Files Exist', () => {
            const requiredFiles = [
                'comprehensive-integration-tests.js',
                'load-performance-tests.js',
                'run-comprehensive-integration-tests.js',
                'COMPREHENSIVE_INTEGRATION_TESTS.md'
            ];

            for (const file of requiredFiles) {
                const filePath = path.join(__dirname, file);
                if (!fs.existsSync(filePath)) {
                    throw new Error(`Required test file not found: ${file}`);
                }
            }
        });
    }

    // Validate test class structure
    validateTestClasses() {
        this.test('Test Classes Structure', () => {
            const ComprehensiveIntegrationTester = require('./comprehensive-integration-tests');
            const LoadPerformanceTester = require('./load-performance-tests');
            const ComprehensiveTestRunner = require('./run-comprehensive-integration-tests');

            // Check if classes can be instantiated
            const integrationTester = new ComprehensiveIntegrationTester();
            const loadTester = new LoadPerformanceTester();
            const testRunner = new ComprehensiveTestRunner();

            // Check if required methods exist
            if (typeof integrationTester.runAllTests !== 'function') {
                throw new Error('ComprehensiveIntegrationTester missing runAllTests method');
            }

            if (typeof loadTester.runAllTests !== 'function') {
                throw new Error('LoadPerformanceTester missing runAllTests method');
            }

            if (typeof testRunner.runAllComprehensiveTests !== 'function') {
                throw new Error('ComprehensiveTestRunner missing runAllComprehensiveTests method');
            }
        });
    }

    // Validate package.json scripts
    validatePackageScripts() {
        this.test('Package.json Scripts', () => {
            const packagePath = path.join(__dirname, 'package.json');
            if (!fs.existsSync(packagePath)) {
                throw new Error('package.json not found in tests directory');
            }

            const packageJson = fs.readJsonSync(packagePath);
            const requiredScripts = [
                'test:comprehensive',
                'test:comprehensive-integration',
                'test:load-performance'
            ];

            for (const script of requiredScripts) {
                if (!packageJson.scripts[script]) {
                    throw new Error(`Required script not found: ${script}`);
                }
            }
        });
    }

    // Validate reports directory setup
    validateReportsSetup() {
        this.test('Reports Directory Setup', () => {
            const reportsDir = path.join(__dirname, 'reports');
            
            // Create reports directory if it doesn't exist
            fs.ensureDirSync(reportsDir);
            
            // Test write permissions
            const testFile = path.join(reportsDir, 'test-write-permissions.json');
            fs.writeJsonSync(testFile, { test: true });
            
            // Clean up test file
            fs.removeSync(testFile);
        });
    }

    // Validate Hugo configuration
    validateHugoConfiguration() {
        this.test('Hugo Configuration', () => {
            const exampleSitePath = path.join(__dirname, '..', 'exampleSite');
            const configPath = path.join(exampleSitePath, 'hugo.toml');
            
            if (!fs.existsSync(configPath)) {
                throw new Error('Hugo configuration file not found at exampleSite/hugo.toml');
            }

            const config = fs.readFileSync(configPath, 'utf8');
            
            // Check for required configuration sections
            const requiredConfigs = [
                'GoogleAnalyticsID',
                '[params.adsense]',
                '[params.facebookPixel]',
                '[params.gcs_engine_id]',
                '[params.mermaid]'
            ];

            for (const configSection of requiredConfigs) {
                if (!config.includes(configSection)) {
                    throw new Error(`Required configuration section not found: ${configSection}`);
                }
            }
        });
    }

    // Validate test content exists
    validateTestContent() {
        this.test('Test Content Exists', () => {
            const exampleSitePath = path.join(__dirname, '..', 'exampleSite');
            const contentPath = path.join(exampleSitePath, 'content', 'blog');
            
            if (!fs.existsSync(contentPath)) {
                throw new Error('Blog content directory not found');
            }

            // Check for demo content files
            const requiredContent = [
                'complete-integration-demo.md',
                'mermaid-diagrams-demo.md'
            ];

            for (const contentFile of requiredContent) {
                const filePath = path.join(contentPath, contentFile);
                if (!fs.existsSync(filePath)) {
                    throw new Error(`Required demo content not found: ${contentFile}`);
                }
            }
        });
    }

    // Validate theme templates
    validateThemeTemplates() {
        this.test('Theme Templates Exist', () => {
            const layoutsPath = path.join(__dirname, '..', 'layouts');
            
            if (!fs.existsSync(layoutsPath)) {
                throw new Error('Layouts directory not found');
            }

            // Check for required partials
            const requiredPartials = [
                'partials/analytics/google-analytics.html',
                'partials/analytics/facebook-pixel.html',
                'partials/advertising/adsense-head.html',
                'partials/search/google-custom-search.html',
                'partials/diagrams/mermaid-loader.html'
            ];

            for (const partial of requiredPartials) {
                const partialPath = path.join(layoutsPath, partial);
                if (!fs.existsSync(partialPath)) {
                    throw new Error(`Required partial template not found: ${partial}`);
                }
            }

            // Check for render hooks and shortcodes
            const renderHookPath = path.join(layoutsPath, '_render-hooks', 'render-codeblock-mermaid.html');
            if (!fs.existsSync(renderHookPath)) {
                throw new Error('Mermaid render hook not found');
            }

            const shortcodePath = path.join(layoutsPath, 'shortcodes', 'mermaid.html');
            if (!fs.existsSync(shortcodePath)) {
                throw new Error('Mermaid shortcode not found');
            }
        });
    }

    // Run all validations
    async runAllValidations() {
        this.log('Starting Comprehensive Integration Test Validation');
        this.log('==================================================');

        this.validateTestFiles();
        this.validateTestClasses();
        this.validatePackageScripts();
        this.validateReportsSetup();
        this.validateHugoConfiguration();
        this.validateTestContent();
        this.validateThemeTemplates();

        this.log('==================================================');
        this.log(`Validations completed: ${this.results.passed} passed, ${this.results.failed} failed`);

        if (this.results.failed > 0) {
            this.log('Failed validations:', 'error');
            this.results.tests
                .filter(test => test.status === 'failed')
                .forEach(test => this.log(`  - ${test.name}: ${test.error}`, 'error'));
        } else {
            this.log('✅ All validations passed! Comprehensive integration tests are ready to run.', 'success');
            this.log('');
            this.log('To run the comprehensive integration tests:');
            this.log('  npm run test:comprehensive');
            this.log('  npm run test:comprehensive-integration');
            this.log('  npm run test:load-performance');
        }

        return this.results.failed === 0;
    }
}

// Run validations if called directly
if (require.main === module) {
    const validator = new TestValidator();
    validator.runAllValidations().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = TestValidator;