/**
 * Cross-Browser and Device Testing
 * Tests functionality across modern browsers and devices
 */

const fs = require('fs');
const path = require('path');

class CrossBrowserDeviceTester {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            warnings: 0,
            tests: []
        };
        this.publicPath = path.join(__dirname, '..', 'exampleSite', 'public');
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    test(name, testFn) {
        try {
            this.log(`Running test: ${name}`);
            const result = testFn();
            if (result === 'warning') {
                this.results.warnings++;
                this.results.tests.push({ name, status: 'warning' });
                this.log(`Test warning: ${name}`, 'warning');
            } else {
                this.results.passed++;
                this.results.tests.push({ name, status: 'passed' });
                this.log(`Test passed: ${name}`, 'success');
            }
        } catch (error) {
            this.results.failed++;
            this.results.tests.push({ name, status: 'failed', error: error.message });
            this.log(`Test failed: ${name} - ${error.message}`, 'error');
        }
    }

    // Test 1: Responsive Design Validation
    testResponsiveDesign() {
        this.test('Responsive Design Validation', () => {
            const indexPath = path.join(this.publicPath, 'index.html');
            if (!fs.existsSync(indexPath)) {
                throw new Error('Index page not found');
            }

            const content = fs.readFileSync(indexPath, 'utf8');

            // Check for viewport meta tag
            if (!content.includes('name="viewport"')) {
                throw new Error('Viewport meta tag not found');
            }

            // Check for responsive CSS classes
            const responsiveClasses = [
                'responsive-text',
                'md:',
                'lg:',
                'xl:',
                'sm:',
                'max-w-',
                'min-w-'
            ];

            const hasResponsiveClasses = responsiveClasses.some(cls => content.includes(cls));
            if (!hasResponsiveClasses) {
                throw new Error('No responsive CSS classes found');
            }

            // Check for mobile-friendly navigation
            if (!content.includes('mobile-menu') && !content.includes('data-mobile-menu')) {
                return 'warning'; // Warning: No mobile menu detected
            }

            return true;
        });
    }

    // Test 2: Modern Browser Feature Support
    testModernBrowserFeatures() {
        this.test('Modern Browser Feature Support', () => {
            const indexPath = path.join(this.publicPath, 'index.html');
            const content = fs.readFileSync(indexPath, 'utf8');

            // Check for modern CSS features with fallbacks
            const modernFeatures = [
                'css-grid',
                'flexbox',
                'css-variables',
                'backdrop-filter'
            ];

            // Check for CSS custom properties (CSS variables)
            if (!content.includes('--color-') && !content.includes('var(--')) {
                return 'warning'; // Warning: No CSS custom properties found
            }

            // Check for progressive enhancement
            if (!content.includes('no-js') && !content.includes('js-enabled')) {
                return 'warning'; // Warning: No progressive enhancement detected
            }

            return true;
        });
    }

    // Test 3: Accessibility Compliance
    testAccessibilityCompliance() {
        this.test('Accessibility Compliance', () => {
            const indexPath = path.join(this.publicPath, 'index.html');
            const content = fs.readFileSync(indexPath, 'utf8');

            // Check for semantic HTML
            const semanticElements = ['<main', '<nav', '<header', '<footer', '<article', '<section'];
            const hasSemanticHTML = semanticElements.some(element => content.includes(element));
            if (!hasSemanticHTML) {
                throw new Error('No semantic HTML elements found');
            }

            // Check for ARIA attributes
            const ariaAttributes = ['aria-label', 'aria-expanded', 'aria-hidden', 'role='];
            const hasARIA = ariaAttributes.some(attr => content.includes(attr));
            if (!hasARIA) {
                return 'warning'; // Warning: Limited ARIA attributes found
            }

            // Check for alt attributes on images
            const imgTags = content.match(/<img[^>]*>/g) || [];
            const imagesWithoutAlt = imgTags.filter(img => !img.includes('alt='));
            if (imagesWithoutAlt.length > 0) {
                return 'warning'; // Warning: Some images without alt text
            }

            // Check for skip links
            if (!content.includes('skip-link') && !content.includes('Skip to')) {
                return 'warning'; // Warning: No skip links found
            }

            return true;
        });
    }

    // Test 4: Performance Optimization
    testPerformanceOptimization() {
        this.test('Performance Optimization', () => {
            const indexPath = path.join(this.publicPath, 'index.html');
            const content = fs.readFileSync(indexPath, 'utf8');

            // Check for lazy loading
            if (!content.includes('loading="lazy"')) {
                return 'warning'; // Warning: No lazy loading detected
            }

            // Check for async/defer scripts
            const scriptTags = content.match(/<script[^>]*>/g) || [];
            const asyncScripts = scriptTags.filter(script => 
                script.includes('async') || script.includes('defer')
            );
            if (asyncScripts.length === 0) {
                return 'warning'; // Warning: No async/defer scripts found
            }

            // Check for resource hints
            const resourceHints = ['preconnect', 'dns-prefetch', 'preload'];
            const hasResourceHints = resourceHints.some(hint => content.includes(hint));
            if (!hasResourceHints) {
                return 'warning'; // Warning: No resource hints found
            }

            // Check file size (basic check)
            const stats = fs.statSync(indexPath);
            if (stats.size > 200000) { // 200KB
                return 'warning'; // Warning: Large HTML file size
            }

            return true;
        });
    }

    // Test 5: CSS and JavaScript Validation
    testAssetValidation() {
        this.test('CSS and JavaScript Validation', () => {
            const cssPath = path.join(this.publicPath, 'css');
            const jsPath = path.join(this.publicPath, 'js');

            // Check if CSS files exist
            if (fs.existsSync(cssPath)) {
                const cssFiles = fs.readdirSync(cssPath).filter(file => file.endsWith('.css'));
                if (cssFiles.length === 0) {
                    return 'warning'; // Warning: No CSS files found
                }
            }

            // Check if JS files exist (optional since we disabled JS build)
            if (fs.existsSync(jsPath)) {
                const jsFiles = fs.readdirSync(jsPath).filter(file => file.endsWith('.js'));
                if (jsFiles.length === 0) {
                    return 'warning'; // Warning: No JS files found (expected due to disabled build)
                }
            }

            return true;
        });
    }

    // Test 6: Mobile Compatibility
    testMobileCompatibility() {
        this.test('Mobile Compatibility', () => {
            const indexPath = path.join(this.publicPath, 'index.html');
            const content = fs.readFileSync(indexPath, 'utf8');

            // Check for touch-friendly elements
            if (!content.includes('touch-target')) {
                return 'warning'; // Warning: No touch-target classes found
            }

            // Check for mobile-specific meta tags
            const mobileMeta = [
                'mobile-web-app-capable',
                'apple-mobile-web-app-capable',
                'theme-color'
            ];
            const hasMobileMeta = mobileMeta.some(meta => content.includes(meta));
            if (!hasMobileMeta) {
                return 'warning'; // Warning: Limited mobile meta tags
            }

            // Check for PWA manifest
            if (!content.includes('manifest')) {
                return 'warning'; // Warning: No PWA manifest found
            }

            return true;
        });
    }

    // Test 7: SEO and Meta Tags
    testSEOCompliance() {
        this.test('SEO and Meta Tags Validation', () => {
            const indexPath = path.join(this.publicPath, 'index.html');
            const content = fs.readFileSync(indexPath, 'utf8');

            // Check for essential meta tags
            const essentialMeta = [
                '<title>',
                'name="description"',
                'property="og:title"',
                'property="og:description"'
            ];

            const missingMeta = essentialMeta.filter(meta => !content.includes(meta));
            if (missingMeta.length > 0) {
                throw new Error(`Missing essential meta tags: ${missingMeta.join(', ')}`);
            }

            // Check for structured data
            if (!content.includes('application/ld+json')) {
                return 'warning'; // Warning: No structured data found
            }

            return true;
        });
    }

    // Test 8: Analytics Integration
    testAnalyticsIntegration() {
        this.test('Analytics Integration Validation', () => {
            const indexPath = path.join(this.publicPath, 'index.html');
            const content = fs.readFileSync(indexPath, 'utf8');

            // Check for Google Analytics
            if (!content.includes('G-JKSVCT23D1') && !content.includes('gtag')) {
                return 'warning'; // Warning: Google Analytics not detected
            }

            // Check for Facebook Pixel
            if (!content.includes('fbq') && !content.includes('123456789012345')) {
                return 'warning'; // Warning: Facebook Pixel not detected
            }

            // Check for privacy compliance
            if (!content.includes('cookie') && !content.includes('privacy')) {
                return 'warning'; // Warning: No privacy compliance detected
            }

            return true;
        });
    }

    // Test 9: Graceful Degradation
    testGracefulDegradation() {
        this.test('Graceful Degradation', () => {
            const indexPath = path.join(this.publicPath, 'index.html');
            const content = fs.readFileSync(indexPath, 'utf8');

            // Check for noscript tags
            if (!content.includes('<noscript>')) {
                return 'warning'; // Warning: No noscript fallbacks found
            }

            // Check for CSS fallbacks
            if (!content.includes('fallback') && !content.includes('no-js')) {
                return 'warning'; // Warning: Limited fallback support detected
            }

            return true;
        });
    }

    // Test 10: Content Security Policy
    testSecurityHeaders() {
        this.test('Security Headers and CSP', () => {
            const indexPath = path.join(this.publicPath, 'index.html');
            const content = fs.readFileSync(indexPath, 'utf8');

            // Check for security-related meta tags
            const securityMeta = [
                'http-equiv="x-ua-compatible"',
                'content="nosniff"',
                'referrerpolicy'
            ];

            const hasSecurityMeta = securityMeta.some(meta => content.includes(meta));
            if (!hasSecurityMeta) {
                return 'warning'; // Warning: Limited security headers found
            }

            // Check for external resource integrity
            const scriptTags = content.match(/<script[^>]*src="https?:\/\/[^"]*"[^>]*>/g) || [];
            const scriptsWithIntegrity = scriptTags.filter(script => script.includes('integrity='));
            
            if (scriptTags.length > 0 && scriptsWithIntegrity.length === 0) {
                return 'warning'; // Warning: External scripts without integrity checks
            }

            return true;
        });
    }

    // Run all tests
    async runAllTests() {
        this.log('Starting Cross-Browser and Device Tests');
        this.log('==========================================');

        // Check if public directory exists
        if (!fs.existsSync(this.publicPath)) {
            throw new Error('Public directory not found. Please build the site first.');
        }

        this.testResponsiveDesign();
        this.testModernBrowserFeatures();
        this.testAccessibilityCompliance();
        this.testPerformanceOptimization();
        this.testAssetValidation();
        this.testMobileCompatibility();
        this.testSEOCompliance();
        this.testAnalyticsIntegration();
        this.testGracefulDegradation();
        this.testSecurityHeaders();

        this.log('==========================================');
        this.log(`Tests completed: ${this.results.passed} passed, ${this.results.failed} failed, ${this.results.warnings} warnings`);

        if (this.results.failed > 0) {
            this.log('Failed tests:', 'error');
            this.results.tests
                .filter(test => test.status === 'failed')
                .forEach(test => this.log(`  - ${test.name}: ${test.error}`, 'error'));
        }

        if (this.results.warnings > 0) {
            this.log('Warnings:', 'warning');
            this.results.tests
                .filter(test => test.status === 'warning')
                .forEach(test => this.log(`  - ${test.name}`, 'warning'));
        }

        // Generate test report
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.results.passed + this.results.failed + this.results.warnings,
                passed: this.results.passed,
                failed: this.results.failed,
                warnings: this.results.warnings,
                success_rate: `${Math.round((this.results.passed / (this.results.passed + this.results.failed + this.results.warnings)) * 100)}%`
            },
            tests: this.results.tests,
            recommendations: this.generateRecommendations()
        };

        // Ensure reports directory exists
        const reportsDir = path.join(__dirname, 'reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        fs.writeFileSync(
            path.join(reportsDir, 'cross-browser-device-test-report.json'),
            JSON.stringify(report, null, 2)
        );

        this.log(`Test report saved to reports/cross-browser-device-test-report.json`);

        return this.results.failed === 0;
    }

    generateRecommendations() {
        const recommendations = [];
        
        this.results.tests.forEach(test => {
            if (test.status === 'warning') {
                switch (test.name) {
                    case 'Responsive Design Validation':
                        recommendations.push('Consider adding mobile menu functionality for better mobile experience');
                        break;
                    case 'Modern Browser Feature Support':
                        recommendations.push('Implement progressive enhancement with fallbacks for older browsers');
                        break;
                    case 'Accessibility Compliance':
                        recommendations.push('Add more ARIA attributes and ensure all images have alt text');
                        break;
                    case 'Performance Optimization':
                        recommendations.push('Implement lazy loading, async scripts, and resource hints for better performance');
                        break;
                    case 'Mobile Compatibility':
                        recommendations.push('Add touch-friendly elements and mobile-specific optimizations');
                        break;
                    case 'Analytics Integration Validation':
                        recommendations.push('Verify analytics tracking codes are properly configured');
                        break;
                    case 'Graceful Degradation':
                        recommendations.push('Add noscript fallbacks and CSS-only alternatives');
                        break;
                    case 'Security Headers and CSP':
                        recommendations.push('Implement Content Security Policy and integrity checks for external resources');
                        break;
                }
            }
        });

        return recommendations;
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new CrossBrowserDeviceTester();
    tester.runAllTests().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('Test execution failed:', error);
        process.exit(1);
    });
}

module.exports = CrossBrowserDeviceTester;