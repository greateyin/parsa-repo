/**
 * Privacy Compliance and Security Validation Tests
 * Tests GDPR compliance, cookie consent, and security measures
 */

const fs = require('fs');
const path = require('path');

class PrivacySecurityValidator {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            warnings: 0,
            tests: []
        };
        this.publicPath = path.join(__dirname, '..', 'exampleSite', 'public');
        this.configPath = path.join(__dirname, '..', 'exampleSite', 'hugo.toml');
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

    // Test 1: GDPR Compliance
    testGDPRCompliance() {
        this.test('GDPR Compliance Validation', () => {
            const indexPath = path.join(this.publicPath, 'index.html');
            if (!fs.existsSync(indexPath)) {
                throw new Error('Index page not found');
            }

            const content = fs.readFileSync(indexPath, 'utf8');

            // Check for cookie consent banner
            const cookieConsentElements = [
                'cookie',
                'consent',
                'privacy',
                'Accept',
                'Decline'
            ];

            const hasCookieConsent = cookieConsentElements.some(element => 
                content.toLowerCase().includes(element.toLowerCase())
            );

            if (!hasCookieConsent) {
                return 'warning'; // Warning: No cookie consent mechanism detected
            }

            // Check for privacy policy link
            if (!content.includes('privacy-policy') && !content.includes('Privacy Policy')) {
                return 'warning'; // Warning: No privacy policy link found
            }

            // Check for Do Not Track respect
            if (!content.includes('doNotTrack') && !content.includes('Do Not Track')) {
                return 'warning'; // Warning: No Do Not Track handling detected
            }

            return true;
        });
    }

    // Test 2: Cookie Consent Functionality
    testCookieConsentFunctionality() {
        this.test('Cookie Consent Functionality', () => {
            const indexPath = path.join(this.publicPath, 'index.html');
            const content = fs.readFileSync(indexPath, 'utf8');

            // Check for cookie consent JavaScript
            const consentFunctions = [
                'cookieConsent',
                'acceptCookies',
                'declineCookies',
                'cookieConsentGiven',
                'cookieConsentRevoked'
            ];

            const hasConsentFunctions = consentFunctions.some(func => content.includes(func));
            if (!hasConsentFunctions) {
                return 'warning'; // Warning: No cookie consent JavaScript functions found
            }

            // Check for consent event handling
            if (!content.includes('addEventListener') || !content.includes('consent')) {
                return 'warning'; // Warning: Limited consent event handling
            }

            return true;
        });
    }

    // Test 3: Analytics Privacy Settings
    testAnalyticsPrivacySettings() {
        this.test('Analytics Privacy Settings', () => {
            const indexPath = path.join(this.publicPath, 'index.html');
            const content = fs.readFileSync(indexPath, 'utf8');

            // Check for IP anonymization
            if (!content.includes('anonymizeIP') && !content.includes('anonymize_ip')) {
                return 'warning'; // Warning: IP anonymization not detected
            }

            // Check for Do Not Track respect in analytics
            if (!content.includes('doNotTrack') && !content.includes('dnt')) {
                return 'warning'; // Warning: Do Not Track handling not found
            }

            // Check for consent-based analytics loading
            if (content.includes('gtag') || content.includes('fbq')) {
                if (!content.includes('consent') && !content.includes('cookieConsent')) {
                    return 'warning'; // Warning: Analytics loaded without consent check
                }
            }

            return true;
        });
    }

    // Test 4: Data Protection Measures
    testDataProtectionMeasures() {
        this.test('Data Protection Measures', () => {
            const indexPath = path.join(this.publicPath, 'index.html');
            const content = fs.readFileSync(indexPath, 'utf8');

            // Check for secure external connections
            const externalScripts = content.match(/src="https?:\/\/[^"]+"/g) || [];
            const insecureScripts = externalScripts.filter(script => script.includes('http://'));
            
            if (insecureScripts.length > 0) {
                throw new Error(`Insecure HTTP connections found: ${insecureScripts.length}`);
            }

            // Check for referrer policy
            if (!content.includes('referrerpolicy')) {
                return 'warning'; // Warning: No referrer policy found
            }

            // Check for secure cookie settings (if any cookies are set)
            if (content.includes('document.cookie') && !content.includes('secure')) {
                return 'warning'; // Warning: Cookies without secure flag
            }

            return true;
        });
    }

    // Test 5: Content Security Policy
    testContentSecurityPolicy() {
        this.test('Content Security Policy Validation', () => {
            const indexPath = path.join(this.publicPath, 'index.html');
            const content = fs.readFileSync(indexPath, 'utf8');

            // Check for CSP meta tag
            if (!content.includes('Content-Security-Policy')) {
                return 'warning'; // Warning: No Content Security Policy found
            }

            // Check for inline script restrictions
            const inlineScripts = content.match(/<script(?![^>]*src=)[^>]*>/g) || [];
            if (inlineScripts.length > 5) {
                return 'warning'; // Warning: Many inline scripts found (potential CSP issue)
            }

            // Check for external resource integrity
            const externalScripts = content.match(/<script[^>]*src="https?:\/\/[^"]*"[^>]*>/g) || [];
            const scriptsWithIntegrity = externalScripts.filter(script => script.includes('integrity='));
            
            if (externalScripts.length > 0 && scriptsWithIntegrity.length === 0) {
                return 'warning'; // Warning: External scripts without integrity checks
            }

            return true;
        });
    }

    // Test 6: Privacy Policy Compliance
    testPrivacyPolicyCompliance() {
        this.test('Privacy Policy Compliance', () => {
            const privacyPolicyPath = path.join(this.publicPath, 'privacy-policy', 'index.html');
            
            if (!fs.existsSync(privacyPolicyPath)) {
                return 'warning'; // Warning: Privacy policy page not found
            }

            const content = fs.readFileSync(privacyPolicyPath, 'utf8');

            // Check for essential privacy policy sections
            const essentialSections = [
                'data collection',
                'cookies',
                'analytics',
                'third party',
                'contact',
                'rights'
            ];

            const missingSections = essentialSections.filter(section => 
                !content.toLowerCase().includes(section)
            );

            if (missingSections.length > 2) {
                return 'warning'; // Warning: Privacy policy missing essential sections
            }

            return true;
        });
    }

    // Test 7: Third-Party Service Compliance
    testThirdPartyServiceCompliance() {
        this.test('Third-Party Service Compliance', () => {
            const indexPath = path.join(this.publicPath, 'index.html');
            const content = fs.readFileSync(indexPath, 'utf8');

            // Identify third-party services
            const thirdPartyServices = [];
            
            if (content.includes('googletagmanager.com') || content.includes('google-analytics.com')) {
                thirdPartyServices.push('Google Analytics');
            }
            
            if (content.includes('connect.facebook.net') || content.includes('fbq')) {
                thirdPartyServices.push('Facebook Pixel');
            }
            
            if (content.includes('googlesyndication.com') || content.includes('adsbygoogle')) {
                thirdPartyServices.push('Google AdSense');
            }

            // Check if services are loaded conditionally
            if (thirdPartyServices.length > 0) {
                if (!content.includes('consent') && !content.includes('cookieConsent')) {
                    return 'warning'; // Warning: Third-party services loaded without consent
                }
            }

            // Check for service-specific privacy measures
            if (content.includes('fbq') && !content.includes('fbq(\'consent\'')) {
                return 'warning'; // Warning: Facebook Pixel without consent API
            }

            return true;
        });
    }

    // Test 8: User Rights Implementation
    testUserRightsImplementation() {
        this.test('User Rights Implementation', () => {
            const indexPath = path.join(this.publicPath, 'index.html');
            const content = fs.readFileSync(indexPath, 'utf8');

            // Check for user control mechanisms
            const userControls = [
                'opt-out',
                'withdraw consent',
                'delete data',
                'data portability',
                'access data'
            ];

            const hasUserControls = userControls.some(control => 
                content.toLowerCase().includes(control)
            );

            if (!hasUserControls) {
                return 'warning'; // Warning: Limited user control mechanisms
            }

            // Check for contact information for privacy requests
            if (!content.includes('contact') && !content.includes('email')) {
                return 'warning'; // Warning: No contact information for privacy requests
            }

            return true;
        });
    }

    // Test 9: Security Headers Validation
    testSecurityHeaders() {
        this.test('Security Headers Validation', () => {
            const indexPath = path.join(this.publicPath, 'index.html');
            const content = fs.readFileSync(indexPath, 'utf8');

            // Check for security-related meta tags
            const securityHeaders = [
                'X-Content-Type-Options',
                'X-Frame-Options',
                'X-XSS-Protection',
                'Strict-Transport-Security'
            ];

            const hasSecurityHeaders = securityHeaders.some(header => 
                content.includes(header)
            );

            if (!hasSecurityHeaders) {
                return 'warning'; // Warning: No security headers found in HTML
            }

            // Check for HTTPS enforcement
            if (!content.includes('https://') && content.includes('http://')) {
                return 'warning'; // Warning: Mixed content detected
            }

            return true;
        });
    }

    // Test 10: Configuration Privacy Settings
    testConfigurationPrivacySettings() {
        this.test('Configuration Privacy Settings', () => {
            if (!fs.existsSync(this.configPath)) {
                throw new Error('Hugo configuration file not found');
            }

            const config = fs.readFileSync(this.configPath, 'utf8');

            // Check for privacy configuration
            const privacySettings = [
                'respectDoNotTrack',
                'cookieConsent',
                'anonymizeIP',
                'privacy'
            ];

            const hasPrivacySettings = privacySettings.some(setting => 
                config.includes(setting)
            );

            if (!hasPrivacySettings) {
                return 'warning'; // Warning: Limited privacy settings in configuration
            }

            // Check if privacy features are enabled
            if (config.includes('respectDoNotTrack = false')) {
                return 'warning'; // Warning: Do Not Track respect is disabled
            }

            if (config.includes('cookieConsent = false')) {
                return 'warning'; // Warning: Cookie consent is disabled
            }

            return true;
        });
    }

    // Run all tests
    async runAllTests() {
        this.log('Starting Privacy Compliance and Security Validation');
        this.log('==================================================');

        // Check if public directory exists
        if (!fs.existsSync(this.publicPath)) {
            throw new Error('Public directory not found. Please build the site first.');
        }

        this.testGDPRCompliance();
        this.testCookieConsentFunctionality();
        this.testAnalyticsPrivacySettings();
        this.testDataProtectionMeasures();
        this.testContentSecurityPolicy();
        this.testPrivacyPolicyCompliance();
        this.testThirdPartyServiceCompliance();
        this.testUserRightsImplementation();
        this.testSecurityHeaders();
        this.testConfigurationPrivacySettings();

        this.log('==================================================');
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

        // Generate compliance report
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.results.passed + this.results.failed + this.results.warnings,
                passed: this.results.passed,
                failed: this.results.failed,
                warnings: this.results.warnings,
                compliance_score: `${Math.round((this.results.passed / (this.results.passed + this.results.failed + this.results.warnings)) * 100)}%`
            },
            tests: this.results.tests,
            compliance_status: this.results.failed === 0 ? 'COMPLIANT' : 'NON_COMPLIANT',
            recommendations: this.generateComplianceRecommendations()
        };

        // Ensure reports directory exists
        const reportsDir = path.join(__dirname, 'reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        fs.writeFileSync(
            path.join(reportsDir, 'privacy-security-validation-report.json'),
            JSON.stringify(report, null, 2)
        );

        this.log(`Compliance report saved to reports/privacy-security-validation-report.json`);

        return this.results.failed === 0;
    }

    generateComplianceRecommendations() {
        const recommendations = [];
        
        this.results.tests.forEach(test => {
            if (test.status === 'warning') {
                switch (test.name) {
                    case 'GDPR Compliance Validation':
                        recommendations.push('Implement comprehensive cookie consent banner and privacy policy links');
                        break;
                    case 'Cookie Consent Functionality':
                        recommendations.push('Add JavaScript functions for cookie consent management');
                        break;
                    case 'Analytics Privacy Settings':
                        recommendations.push('Enable IP anonymization and Do Not Track respect for analytics');
                        break;
                    case 'Data Protection Measures':
                        recommendations.push('Implement referrer policy and secure cookie settings');
                        break;
                    case 'Content Security Policy Validation':
                        recommendations.push('Add Content Security Policy headers and integrity checks for external scripts');
                        break;
                    case 'Privacy Policy Compliance':
                        recommendations.push('Create comprehensive privacy policy covering all data collection practices');
                        break;
                    case 'Third-Party Service Compliance':
                        recommendations.push('Ensure all third-party services respect user consent preferences');
                        break;
                    case 'User Rights Implementation':
                        recommendations.push('Provide mechanisms for users to exercise their privacy rights');
                        break;
                    case 'Security Headers Validation':
                        recommendations.push('Implement security headers and enforce HTTPS connections');
                        break;
                    case 'Configuration Privacy Settings':
                        recommendations.push('Enable privacy settings in Hugo configuration');
                        break;
                }
            }
        });

        // Add general GDPR compliance recommendations
        recommendations.push('Regular privacy compliance audits are recommended');
        recommendations.push('Consider implementing a privacy management platform for complex sites');
        recommendations.push('Ensure all team members are trained on privacy compliance requirements');

        return recommendations;
    }
}

// Run tests if called directly
if (require.main === module) {
    const validator = new PrivacySecurityValidator();
    validator.runAllTests().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('Validation execution failed:', error);
        process.exit(1);
    });
}

module.exports = PrivacySecurityValidator;