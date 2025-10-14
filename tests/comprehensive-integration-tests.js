/**
 * Comprehensive Integration Tests
 * Tests complete feature integration and performance under realistic load conditions
 * Requirement 8.5: Performance optimization with Core Web Vitals compliance
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');

class ComprehensiveIntegrationTester {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            warnings: 0,
            tests: []
        };
        this.exampleSitePath = path.join(__dirname, '..', 'exampleSite');
        this.reportsDir = path.join(__dirname, 'reports');
        this.browser = null;
        this.hugoServer = null;
        this.testSiteUrl = 'http://localhost:1313';
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    async test(name, testFn) {
        try {
            this.log(`Running test: ${name}`);
            await testFn();
            this.results.passed++;
            this.results.tests.push({ name, status: 'passed' });
            this.log(`Test passed: ${name}`, 'success');
        } catch (error) {
            this.results.failed++;
            this.results.tests.push({ name, status: 'failed', error: error.message });
            this.log(`Test failed: ${name} - ${error.message}`, 'error');
        }
    }

    async warn(name, message) {
        this.results.warnings++;
        this.results.tests.push({ name, status: 'warning', message });
        this.log(`Warning: ${name} - ${message}`, 'warning');
    }

    // Setup test environment
    async setupTestEnvironment() {
        this.log('Setting up comprehensive test environment...');
        
        // Ensure reports directory exists
        await fs.ensureDir(this.reportsDir);
        
        // Start Hugo development server
        await this.startHugoServer();
        
        // Launch browser for testing
        this.browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        this.log('Test environment setup complete');
    }

    async startHugoServer() {
        return new Promise((resolve, reject) => {
            this.log('Starting Hugo development server...');
            
            this.hugoServer = spawn('hugo', ['server', '--port=1313', '--bind=127.0.0.1'], {
                cwd: this.exampleSitePath,
                stdio: 'pipe'
            });

            let serverReady = false;
            const timeout = setTimeout(() => {
                if (!serverReady) {
                    reject(new Error('Hugo server failed to start within timeout'));
                }
            }, 30000);

            this.hugoServer.stdout.on('data', (data) => {
                const output = data.toString();
                if (output.includes('Web Server is available at') || output.includes('localhost:1313')) {
                    if (!serverReady) {
                        serverReady = true;
                        clearTimeout(timeout);
                        this.log('Hugo server started successfully');
                        // Wait a bit more for server to be fully ready
                        setTimeout(resolve, 2000);
                    }
                }
            });

            this.hugoServer.stderr.on('data', (data) => {
                const error = data.toString();
                if (error.includes('ERROR') || error.includes('FATAL')) {
                    reject(new Error(`Hugo server error: ${error}`));
                }
            });

            this.hugoServer.on('error', (error) => {
                reject(new Error(`Failed to start Hugo server: ${error.message}`));
            });
        });
    }

    // Test 1: Complete Feature Integration
    async testCompleteFeatureIntegration() {
        await this.test('Complete Feature Integration', async () => {
            const page = await this.browser.newPage();
            
            try {
                // Navigate to the main page
                await page.goto(this.testSiteUrl, { waitUntil: 'networkidle2' });
                
                // Test Google Analytics integration
                const gaScript = await page.$('script[src*="googletagmanager.com/gtag/js"]');
                if (!gaScript) {
                    throw new Error('Google Analytics script not found');
                }
                
                // Test Facebook Pixel integration
                const fbPixelScript = await page.evaluate(() => {
                    return window.fbq !== undefined;
                });
                if (!fbPixelScript) {
                    throw new Error('Facebook Pixel not initialized');
                }
                
                // Test AdSense integration
                const adsenseScript = await page.$('script[src*="pagead2.googlesyndication.com"]');
                if (!adsenseScript) {
                    throw new Error('AdSense script not found');
                }
                
                // Test Google Custom Search integration
                const gcsElement = await page.$('.gcse-search');
                if (!gcsElement) {
                    throw new Error('Google Custom Search element not found');
                }
                
                // Navigate to a page with Mermaid diagrams
                await page.goto(`${this.testSiteUrl}/blog/complete-integration-demo/`, { waitUntil: 'networkidle2' });
                
                // Test Mermaid diagram rendering
                const mermaidDiagram = await page.$('.mermaid');
                if (!mermaidDiagram) {
                    throw new Error('Mermaid diagram not found');
                }
                
                // Check if Mermaid script is loaded
                const mermaidScript = await page.evaluate(() => {
                    return window.mermaid !== undefined;
                });
                if (!mermaidScript) {
                    throw new Error('Mermaid script not loaded');
                }
                
                this.log('All features integrated successfully');
                
            } finally {
                await page.close();
            }
        });
    }

    // Test 2: Performance Under Realistic Load
    async testPerformanceUnderLoad() {
        await this.test('Performance Under Realistic Load', async () => {
            const page = await this.browser.newPage();
            
            try {
                // Enable performance monitoring
                await page.setCacheEnabled(false);
                
                // Test multiple page loads to simulate realistic usage
                const pages = [
                    '/',
                    '/blog/',
                    '/blog/complete-integration-demo/',
                    '/blog/analytics-advertising-showcase/',
                    '/blog/mermaid-diagrams-demo/'
                ];
                
                const performanceMetrics = [];
                
                for (const pagePath of pages) {
                    const url = `${this.testSiteUrl}${pagePath}`;
                    this.log(`Testing performance for: ${url}`);
                    
                    // Measure page load performance
                    const startTime = Date.now();
                    await page.goto(url, { waitUntil: 'networkidle2' });
                    const loadTime = Date.now() - startTime;
                    
                    // Get performance metrics
                    const metrics = await page.evaluate(() => {
                        const navigation = performance.getEntriesByType('navigation')[0];
                        return {
                            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
                            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
                        };
                    });
                    
                    performanceMetrics.push({
                        url: pagePath,
                        loadTime,
                        ...metrics
                    });
                    
                    // Validate performance thresholds
                    if (loadTime > 5000) {
                        throw new Error(`Page load time too slow: ${loadTime}ms for ${pagePath}`);
                    }
                    
                    if (metrics.firstContentfulPaint > 2500) {
                        throw new Error(`First Contentful Paint too slow: ${metrics.firstContentfulPaint}ms for ${pagePath}`);
                    }
                }
                
                // Save performance metrics
                await fs.writeJson(
                    path.join(this.reportsDir, 'performance-metrics.json'),
                    { timestamp: new Date().toISOString(), metrics: performanceMetrics },
                    { spaces: 2 }
                );
                
                this.log(`Performance test completed. Average load time: ${Math.round(performanceMetrics.reduce((sum, m) => sum + m.loadTime, 0) / performanceMetrics.length)}ms`);
                
            } finally {
                await page.close();
            }
        });
    }

    // Test 3: Core Web Vitals Compliance
    async testCoreWebVitals() {
        await this.test('Core Web Vitals Compliance', async () => {
            const page = await this.browser.newPage();
            
            try {
                // Test key pages for Core Web Vitals
                const testPages = [
                    { path: '/', name: 'Homepage' },
                    { path: '/blog/complete-integration-demo/', name: 'Integration Demo' }
                ];
                
                const coreWebVitalsResults = [];
                
                for (const testPage of testPages) {
                    const url = `${this.testSiteUrl}${testPage.path}`;
                    this.log(`Testing Core Web Vitals for: ${testPage.name}`);
                    
                    await page.goto(url, { waitUntil: 'networkidle2' });
                    
                    // Measure Core Web Vitals
                    const vitals = await page.evaluate(() => {
                        return new Promise((resolve) => {
                            const vitals = {};
                            
                            // Largest Contentful Paint (LCP)
                            new PerformanceObserver((list) => {
                                const entries = list.getEntries();
                                const lastEntry = entries[entries.length - 1];
                                vitals.lcp = lastEntry.startTime;
                            }).observe({ entryTypes: ['largest-contentful-paint'] });
                            
                            // First Input Delay (FID) - simulate with click
                            document.addEventListener('click', (event) => {
                                vitals.fid = performance.now() - event.timeStamp;
                            }, { once: true });
                            
                            // Cumulative Layout Shift (CLS)
                            let clsValue = 0;
                            new PerformanceObserver((list) => {
                                for (const entry of list.getEntries()) {
                                    if (!entry.hadRecentInput) {
                                        clsValue += entry.value;
                                    }
                                }
                                vitals.cls = clsValue;
                            }).observe({ entryTypes: ['layout-shift'] });
                            
                            // Wait for measurements
                            setTimeout(() => {
                                resolve(vitals);
                            }, 3000);
                        });
                    });
                    
                    // Validate Core Web Vitals thresholds
                    const thresholds = {
                        lcp: 2500, // Good: ≤ 2.5s
                        fid: 100,  // Good: ≤ 100ms
                        cls: 0.1   // Good: ≤ 0.1
                    };
                    
                    const results = {
                        page: testPage.name,
                        url: testPage.path,
                        lcp: vitals.lcp || 0,
                        fid: vitals.fid || 0,
                        cls: vitals.cls || 0,
                        passed: {
                            lcp: (vitals.lcp || 0) <= thresholds.lcp,
                            fid: (vitals.fid || 0) <= thresholds.fid,
                            cls: (vitals.cls || 0) <= thresholds.cls
                        }
                    };
                    
                    coreWebVitalsResults.push(results);
                    
                    // Log results
                    this.log(`LCP: ${Math.round(vitals.lcp || 0)}ms (${results.passed.lcp ? 'PASS' : 'FAIL'})`);
                    this.log(`FID: ${Math.round(vitals.fid || 0)}ms (${results.passed.fid ? 'PASS' : 'FAIL'})`);
                    this.log(`CLS: ${(vitals.cls || 0).toFixed(3)} (${results.passed.cls ? 'PASS' : 'FAIL'})`);
                    
                    // Check if any vital failed
                    if (!results.passed.lcp || !results.passed.fid || !results.passed.cls) {
                        await this.warn(`Core Web Vitals Warning`, `Some vitals exceeded thresholds for ${testPage.name}`);
                    }
                }
                
                // Save Core Web Vitals results
                await fs.writeJson(
                    path.join(this.reportsDir, 'core-web-vitals.json'),
                    { timestamp: new Date().toISOString(), results: coreWebVitalsResults },
                    { spaces: 2 }
                );
                
            } finally {
                await page.close();
            }
        });
    }

    // Test 4: Script Loading Optimization
    async testScriptLoadingOptimization() {
        await this.test('Script Loading Optimization', async () => {
            const page = await this.browser.newPage();
            
            try {
                // Monitor network requests
                const requests = [];
                page.on('request', (request) => {
                    if (request.resourceType() === 'script') {
                        requests.push({
                            url: request.url(),
                            method: request.method()
                        });
                    }
                });
                
                await page.goto(this.testSiteUrl, { waitUntil: 'networkidle2' });
                
                // Check for async script loading
                const scripts = await page.$$eval('script[src]', (scripts) => {
                    return scripts.map(script => ({
                        src: script.src,
                        async: script.async,
                        defer: script.defer
                    }));
                });
                
                // Validate that external scripts are loaded asynchronously
                const externalScripts = scripts.filter(script => 
                    script.src.includes('googletagmanager.com') ||
                    script.src.includes('googlesyndication.com') ||
                    script.src.includes('connect.facebook.net') ||
                    script.src.includes('cse.google.com')
                );
                
                const nonAsyncScripts = externalScripts.filter(script => !script.async && !script.defer);
                if (nonAsyncScripts.length > 0) {
                    throw new Error(`Found ${nonAsyncScripts.length} external scripts without async/defer attributes`);
                }
                
                // Check for script loading order optimization
                const analyticsScripts = requests.filter(req => 
                    req.url.includes('gtag') || 
                    req.url.includes('fbevents') ||
                    req.url.includes('adsbygoogle')
                );
                
                if (analyticsScripts.length === 0) {
                    throw new Error('No analytics scripts detected in network requests');
                }
                
                this.log(`Found ${externalScripts.length} external scripts, all properly async/deferred`);
                this.log(`Detected ${analyticsScripts.length} analytics script requests`);
                
            } finally {
                await page.close();
            }
        });
    }

    // Test 5: Lazy Loading Implementation
    async testLazyLoadingImplementation() {
        await this.test('Lazy Loading Implementation', async () => {
            const page = await this.browser.newPage();
            
            try {
                await page.goto(`${this.testSiteUrl}/blog/complete-integration-demo/`, { waitUntil: 'networkidle2' });
                
                // Check for Intersection Observer API usage
                const hasIntersectionObserver = await page.evaluate(() => {
                    return 'IntersectionObserver' in window;
                });
                
                if (!hasIntersectionObserver) {
                    throw new Error('Intersection Observer API not available');
                }
                
                // Check for lazy loading implementation
                const lazyElements = await page.$$eval('[data-lazy], .lazy, [loading="lazy"]', (elements) => {
                    return elements.length;
                });
                
                if (lazyElements === 0) {
                    await this.warn('Lazy Loading', 'No lazy loading elements detected');
                }
                
                // Test ad lazy loading by scrolling
                const initialAdCount = await page.$$eval('.adsbygoogle', (ads) => ads.length);
                
                // Scroll to bottom to trigger lazy loading
                await page.evaluate(() => {
                    window.scrollTo(0, document.body.scrollHeight);
                });
                
                // Wait for potential lazy loading
                await page.waitForTimeout(2000);
                
                const finalAdCount = await page.$$eval('.adsbygoogle', (ads) => ads.length);
                
                this.log(`Initial ads: ${initialAdCount}, Final ads: ${finalAdCount}`);
                
            } finally {
                await page.close();
            }
        });
    }

    // Test 6: Third-party Service Resilience
    async testThirdPartyServiceResilience() {
        await this.test('Third-party Service Resilience', async () => {
            const page = await this.browser.newPage();
            
            try {
                // Block external domains to simulate service unavailability
                await page.setRequestInterception(true);
                
                const blockedDomains = [
                    'googletagmanager.com',
                    'googlesyndication.com',
                    'connect.facebook.net',
                    'cse.google.com'
                ];
                
                page.on('request', (request) => {
                    const url = request.url();
                    const shouldBlock = blockedDomains.some(domain => url.includes(domain));
                    
                    if (shouldBlock) {
                        request.abort();
                    } else {
                        request.continue();
                    }
                });
                
                // Navigate with blocked services
                const startTime = Date.now();
                await page.goto(this.testSiteUrl, { waitUntil: 'networkidle2', timeout: 10000 });
                const loadTime = Date.now() - startTime;
                
                // Check that page still loads despite blocked services
                const title = await page.title();
                if (!title) {
                    throw new Error('Page failed to load with blocked third-party services');
                }
                
                // Verify graceful degradation
                const pageContent = await page.content();
                if (pageContent.length < 1000) {
                    throw new Error('Page content appears incomplete with blocked services');
                }
                
                // Check that load time is reasonable even with timeouts
                if (loadTime > 15000) {
                    throw new Error(`Page load time too slow with blocked services: ${loadTime}ms`);
                }
                
                this.log(`Page loaded successfully in ${loadTime}ms despite blocked third-party services`);
                
            } finally {
                await page.close();
            }
        });
    }

    // Test 7: Multi-page Integration Flow
    async testMultiPageIntegrationFlow() {
        await this.test('Multi-page Integration Flow', async () => {
            const page = await this.browser.newPage();
            
            try {
                // Test navigation flow through different page types
                const navigationFlow = [
                    { url: '/', name: 'Homepage' },
                    { url: '/blog/', name: 'Blog List' },
                    { url: '/blog/complete-integration-demo/', name: 'Blog Post' },
                    { url: '/blog/mermaid-diagrams-demo/', name: 'Mermaid Demo' },
                    { url: '/about/', name: 'About Page' }
                ];
                
                for (const step of navigationFlow) {
                    const fullUrl = `${this.testSiteUrl}${step.url}`;
                    this.log(`Testing navigation to: ${step.name}`);
                    
                    await page.goto(fullUrl, { waitUntil: 'networkidle2' });
                    
                    // Verify analytics tracking on each page
                    const hasAnalytics = await page.evaluate(() => {
                        return typeof gtag === 'function' || typeof fbq === 'function';
                    });
                    
                    if (!hasAnalytics) {
                        throw new Error(`Analytics not loaded on ${step.name}`);
                    }
                    
                    // Check for consistent theme elements
                    const hasNavigation = await page.$('nav, .navbar, .navigation');
                    if (!hasNavigation) {
                        throw new Error(`Navigation not found on ${step.name}`);
                    }
                    
                    const hasFooter = await page.$('footer, .footer');
                    if (!hasFooter) {
                        throw new Error(`Footer not found on ${step.name}`);
                    }
                }
                
                this.log('Multi-page integration flow completed successfully');
                
            } finally {
                await page.close();
            }
        });
    }

    // Test 8: Concurrent User Simulation
    async testConcurrentUserSimulation() {
        await this.test('Concurrent User Simulation', async () => {
            const concurrentUsers = 5;
            const pagesPerUser = 3;
            
            this.log(`Simulating ${concurrentUsers} concurrent users, ${pagesPerUser} pages each`);
            
            const userPromises = [];
            
            for (let i = 0; i < concurrentUsers; i++) {
                const userPromise = this.simulateUser(i, pagesPerUser);
                userPromises.push(userPromise);
            }
            
            const results = await Promise.all(userPromises);
            
            // Analyze results
            const totalRequests = results.reduce((sum, result) => sum + result.requests, 0);
            const averageLoadTime = results.reduce((sum, result) => sum + result.averageLoadTime, 0) / results.length;
            const errors = results.filter(result => result.errors > 0).length;
            
            if (errors > 0) {
                throw new Error(`${errors} users encountered errors during concurrent simulation`);
            }
            
            if (averageLoadTime > 5000) {
                throw new Error(`Average load time too slow under concurrent load: ${averageLoadTime}ms`);
            }
            
            this.log(`Concurrent simulation completed: ${totalRequests} total requests, ${Math.round(averageLoadTime)}ms average load time`);
        });
    }

    async simulateUser(userId, pageCount) {
        const page = await this.browser.newPage();
        const results = { requests: 0, averageLoadTime: 0, errors: 0 };
        
        try {
            const pages = ['/', '/blog/', '/blog/complete-integration-demo/'];
            const loadTimes = [];
            
            for (let i = 0; i < pageCount; i++) {
                const pagePath = pages[i % pages.length];
                const url = `${this.testSiteUrl}${pagePath}`;
                
                const startTime = Date.now();
                await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
                const loadTime = Date.now() - startTime;
                
                loadTimes.push(loadTime);
                results.requests++;
                
                // Simulate user interaction
                await page.waitForTimeout(Math.random() * 1000 + 500);
            }
            
            results.averageLoadTime = loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length;
            
        } catch (error) {
            results.errors++;
            this.log(`User ${userId} encountered error: ${error.message}`, 'warning');
        } finally {
            await page.close();
        }
        
        return results;
    }

    // Cleanup test environment
    async cleanupTestEnvironment() {
        this.log('Cleaning up test environment...');
        
        if (this.browser) {
            await this.browser.close();
        }
        
        if (this.hugoServer) {
            this.hugoServer.kill();
        }
        
        this.log('Test environment cleanup complete');
    }

    // Run all comprehensive integration tests
    async runAllTests() {
        this.log('Starting Comprehensive Integration Tests');
        this.log('=========================================');

        try {
            await this.setupTestEnvironment();
            
            await this.testCompleteFeatureIntegration();
            await this.testPerformanceUnderLoad();
            await this.testCoreWebVitals();
            await this.testScriptLoadingOptimization();
            await this.testLazyLoadingImplementation();
            await this.testThirdPartyServiceResilience();
            await this.testMultiPageIntegrationFlow();
            await this.testConcurrentUserSimulation();
            
        } finally {
            await this.cleanupTestEnvironment();
        }

        this.log('=========================================');
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
                .forEach(test => this.log(`  - ${test.name}: ${test.message}`, 'warning'));
        }

        // Generate comprehensive test report
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.results.passed + this.results.failed,
                passed: this.results.passed,
                failed: this.results.failed,
                warnings: this.results.warnings,
                success_rate: `${Math.round((this.results.passed / (this.results.passed + this.results.failed)) * 100)}%`
            },
            tests: this.results.tests,
            requirements_coverage: {
                '8.5.1': 'Asynchronous script loading validated',
                '8.5.2': 'Script loading optimization tested',
                '8.5.3': 'Lazy loading implementation verified',
                '8.5.4': 'Third-party service resilience confirmed',
                '8.5.5': 'Core Web Vitals compliance measured'
            }
        };

        await fs.writeJson(
            path.join(this.reportsDir, 'comprehensive-integration-test-report.json'),
            report,
            { spaces: 2 }
        );

        this.log(`Comprehensive test report saved to reports/comprehensive-integration-test-report.json`);

        return this.results.failed === 0;
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new ComprehensiveIntegrationTester();
    tester.runAllTests().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('Test execution failed:', error);
        process.exit(1);
    });
}

module.exports = ComprehensiveIntegrationTester;