/**
 * Complete Integration Tests
 * Tests all components working together in the example site
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class IntegrationTester {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            tests: []
        };
        this.exampleSitePath = path.join(__dirname, '..', 'exampleSite');
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    test(name, testFn) {
        try {
            this.log(`Running test: ${name}`);
            testFn();
            this.results.passed++;
            this.results.tests.push({ name, status: 'passed' });
            this.log(`Test passed: ${name}`, 'success');
        } catch (error) {
            this.results.failed++;
            this.results.tests.push({ name, status: 'failed', error: error.message });
            this.log(`Test failed: ${name} - ${error.message}`, 'error');
        }
    }

    // Test 1: Validate Hugo configuration
    testHugoConfiguration() {
        this.test('Hugo Configuration Validation', () => {
            const configPath = path.join(this.exampleSitePath, 'hugo.toml');
            if (!fs.existsSync(configPath)) {
                throw new Error('Hugo configuration file not found');
            }

            const config = fs.readFileSync(configPath, 'utf8');
            
            // Check Google Analytics
            if (!config.includes('GoogleAnalyticsID = "G-JKSVCT23D1"')) {
                throw new Error('Google Analytics ID not configured');
            }

            // Check AdSense configuration
            if (!config.includes('[params.adsense]') || !config.includes('enabled = true')) {
                throw new Error('AdSense not properly configured');
            }

            // Check Facebook Pixel
            if (!config.includes('[params.facebookPixel]') || !config.includes('pixelId = "123456789012345"')) {
                throw new Error('Facebook Pixel not properly configured');
            }

            // Check Google Custom Search
            if (!config.includes('[params.gcs_engine_id]') || !config.includes('value = "3164aa570fbbb474a"')) {
                throw new Error('Google Custom Search not properly configured');
            }

            // Check Mermaid configuration
            if (!config.includes('[params.mermaid]') || !config.includes('enabled = true')) {
                throw new Error('Mermaid not properly configured');
            }

            // Check privacy settings
            if (!config.includes('cookieConsent = true') || !config.includes('respectDoNotTrack = true')) {
                throw new Error('Privacy settings not properly configured');
            }
        });
    }

    // Test 2: Validate template integration
    testTemplateIntegration() {
        this.test('Template Integration Validation', () => {
            const layoutsPath = path.join(__dirname, '..', 'layouts');
            
            // Check analytics partials exist
            const analyticsPath = path.join(layoutsPath, 'partials', 'analytics');
            if (!fs.existsSync(path.join(analyticsPath, 'google-analytics.html'))) {
                throw new Error('Google Analytics partial not found');
            }
            if (!fs.existsSync(path.join(analyticsPath, 'facebook-pixel.html'))) {
                throw new Error('Facebook Pixel partial not found');
            }
            if (!fs.existsSync(path.join(analyticsPath, 'analytics-manager.html'))) {
                throw new Error('Analytics manager partial not found');
            }

            // Check advertising partials exist
            const advertisingPath = path.join(layoutsPath, 'partials', 'advertising');
            if (!fs.existsSync(path.join(advertisingPath, 'adsense-head.html'))) {
                throw new Error('AdSense head partial not found');
            }
            if (!fs.existsSync(path.join(advertisingPath, 'adsense-display.html'))) {
                throw new Error('AdSense display partial not found');
            }

            // Check search partials exist
            const searchPath = path.join(layoutsPath, 'partials', 'search');
            if (!fs.existsSync(path.join(searchPath, 'google-custom-search.html'))) {
                throw new Error('Google Custom Search partial not found');
            }

            // Check diagram support exists
            const diagramsPath = path.join(layoutsPath, 'partials', 'diagrams');
            if (!fs.existsSync(path.join(diagramsPath, 'mermaid-loader.html'))) {
                throw new Error('Mermaid loader partial not found');
            }

            // Check render hooks exist
            const renderHooksPath = path.join(layoutsPath, '_render-hooks');
            if (!fs.existsSync(path.join(renderHooksPath, 'render-codeblock-mermaid.html'))) {
                throw new Error('Mermaid render hook not found');
            }

            // Check shortcodes exist
            const shortcodesPath = path.join(layoutsPath, 'shortcodes');
            if (!fs.existsSync(path.join(shortcodesPath, 'mermaid.html'))) {
                throw new Error('Mermaid shortcode not found');
            }
        });
    }

    // Test 3: Build the example site
    testSiteBuild() {
        this.test('Example Site Build', () => {
            try {
                // Change to example site directory and build
                process.chdir(this.exampleSitePath);
                
                // Clean previous build
                if (fs.existsSync('public')) {
                    fs.rmSync('public', { recursive: true, force: true });
                }

                // Build the site
                const buildOutput = execSync('hugo --minify --gc', { 
                    encoding: 'utf8',
                    timeout: 30000 
                });

                // Check if build was successful
                if (!fs.existsSync('public/index.html')) {
                    throw new Error('Site build failed - no index.html generated');
                }

                // Check if our demo page was built
                if (!fs.existsSync('public/blog/complete-integration-demo/index.html')) {
                    throw new Error('Integration demo page not built');
                }

                this.log('Site built successfully');
                
            } catch (error) {
                throw new Error(`Build failed: ${error.message}`);
            } finally {
                // Return to original directory
                process.chdir(path.join(__dirname, '..'));
            }
        });
    }

    // Test 4: Validate generated HTML content
    testGeneratedContent() {
        this.test('Generated Content Validation', () => {
            const indexPath = path.join(this.exampleSitePath, 'public', 'index.html');
            const demoPagePath = path.join(this.exampleSitePath, 'public', 'blog', 'complete-integration-demo', 'index.html');

            if (!fs.existsSync(indexPath)) {
                throw new Error('Index page not generated');
            }

            if (!fs.existsSync(demoPagePath)) {
                throw new Error('Demo page not generated');
            }

            const indexContent = fs.readFileSync(indexPath, 'utf8');
            const demoContent = fs.readFileSync(demoPagePath, 'utf8');

            // Check Google Analytics integration
            if (!indexContent.includes('gtag') && !indexContent.includes('G-JKSVCT23D1')) {
                throw new Error('Google Analytics not integrated in generated HTML');
            }

            // Check Facebook Pixel integration
            if (!indexContent.includes('fbq') && !indexContent.includes('123456789012345')) {
                throw new Error('Facebook Pixel not integrated in generated HTML');
            }

            // Check AdSense integration
            if (!indexContent.includes('adsbygoogle') && !indexContent.includes('ca-pub-2970874383549118')) {
                throw new Error('AdSense not integrated in generated HTML');
            }

            // Check Mermaid diagrams in demo page
            if (!demoContent.includes('mermaid') || !demoContent.includes('graph TB')) {
                throw new Error('Mermaid diagrams not rendered in demo page');
            }

            // Check search integration
            if (!indexContent.includes('gcse-search') && !indexContent.includes('3164aa570fbbb474a')) {
                throw new Error('Google Custom Search not integrated');
            }
        });
    }

    // Test 5: Performance validation
    testPerformance() {
        this.test('Performance Validation', () => {
            const indexPath = path.join(this.exampleSitePath, 'public', 'index.html');
            const indexContent = fs.readFileSync(indexPath, 'utf8');

            // Check for async script loading
            const scriptTags = indexContent.match(/<script[^>]*>/g) || [];
            const asyncScripts = scriptTags.filter(tag => tag.includes('async'));
            
            if (asyncScripts.length === 0) {
                throw new Error('No async scripts found - performance not optimized');
            }

            // Check for resource hints
            if (!indexContent.includes('preconnect') && !indexContent.includes('dns-prefetch')) {
                this.log('Warning: No resource hints found for performance optimization', 'warning');
            }

            // Check file sizes
            const stats = fs.statSync(indexPath);
            if (stats.size > 100000) { // 100KB
                this.log(`Warning: Index page is large (${stats.size} bytes)`, 'warning');
            }
        });
    }

    // Test 6: Accessibility validation
    testAccessibility() {
        this.test('Accessibility Validation', () => {
            const indexPath = path.join(this.exampleSitePath, 'public', 'index.html');
            const indexContent = fs.readFileSync(indexPath, 'utf8');

            // Check for basic accessibility features
            if (!indexContent.includes('lang=')) {
                throw new Error('No language attribute found');
            }

            if (!indexContent.includes('<title>')) {
                throw new Error('No title tag found');
            }

            if (!indexContent.includes('meta name="description"')) {
                throw new Error('No meta description found');
            }

            // Check for skip links or navigation aids
            if (!indexContent.includes('skip') && !indexContent.includes('navigation')) {
                this.log('Warning: No skip links or navigation aids found', 'warning');
            }
        });
    }

    // Run all tests
    async runAllTests() {
        this.log('Starting Complete Integration Tests');
        this.log('=====================================');

        this.testHugoConfiguration();
        this.testTemplateIntegration();
        this.testSiteBuild();
        this.testGeneratedContent();
        this.testPerformance();
        this.testAccessibility();

        this.log('=====================================');
        this.log(`Tests completed: ${this.results.passed} passed, ${this.results.failed} failed`);

        if (this.results.failed > 0) {
            this.log('Failed tests:', 'error');
            this.results.tests
                .filter(test => test.status === 'failed')
                .forEach(test => this.log(`  - ${test.name}: ${test.error}`, 'error'));
        }

        // Generate test report
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.results.passed + this.results.failed,
                passed: this.results.passed,
                failed: this.results.failed,
                success_rate: `${Math.round((this.results.passed / (this.results.passed + this.results.failed)) * 100)}%`
            },
            tests: this.results.tests
        };

        fs.writeFileSync(
            path.join(__dirname, 'reports', 'complete-integration-test-report.json'),
            JSON.stringify(report, null, 2)
        );

        this.log(`Test report saved to reports/complete-integration-test-report.json`);

        return this.results.failed === 0;
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new IntegrationTester();
    tester.runAllTests().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = IntegrationTester;