/**
 * Load Performance Tests
 * Tests performance under realistic load conditions with multiple concurrent users
 * Validates system behavior under stress and measures performance degradation
 */

const { spawn } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const puppeteer = require('puppeteer');

class LoadPerformanceTester {
    constructor() {
        this.results = {
            loadTests: [],
            performanceMetrics: [],
            errors: [],
            summary: {}
        };
        this.exampleSitePath = path.join(__dirname, '..', 'exampleSite');
        this.reportsDir = path.join(__dirname, 'reports');
        this.testSiteUrl = 'http://localhost:1313';
        this.hugoServer = null;
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    async startHugoServer() {
        return new Promise((resolve, reject) => {
            this.log('Starting Hugo server for load testing...');
            
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
                        this.log('Hugo server ready for load testing');
                        setTimeout(resolve, 2000);
                    }
                }
            });

            this.hugoServer.on('error', (error) => {
                reject(new Error(`Failed to start Hugo server: ${error.message}`));
            });
        });
    }

    // Test 1: Baseline Performance Measurement
    async measureBaselinePerformance() {
        this.log('Measuring baseline performance...');
        
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        try {
            const testPages = [
                { path: '/', name: 'Homepage' },
                { path: '/blog/', name: 'Blog List' },
                { path: '/blog/complete-integration-demo/', name: 'Integration Demo' },
                { path: '/blog/mermaid-diagrams-demo/', name: 'Mermaid Demo' }
            ];
            
            const baselineMetrics = [];
            
            for (const testPage of testPages) {
                const url = `${this.testSiteUrl}${testPage.path}`;
                
                // Perform multiple measurements for accuracy
                const measurements = [];
                for (let i = 0; i < 5; i++) {
                    const startTime = Date.now();
                    await page.goto(url, { waitUntil: 'networkidle2' });
                    const loadTime = Date.now() - startTime;
                    
                    const metrics = await page.evaluate(() => {
                        const navigation = performance.getEntriesByType('navigation')[0];
                        return {
                            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
                            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
                            resourceCount: performance.getEntriesByType('resource').length
                        };
                    });
                    
                    measurements.push({
                        loadTime,
                        ...metrics
                    });
                    
                    // Clear cache between measurements
                    await page.reload({ waitUntil: 'networkidle2' });
                }
                
                // Calculate averages
                const avgMetrics = {
                    page: testPage.name,
                    path: testPage.path,
                    loadTime: Math.round(measurements.reduce((sum, m) => sum + m.loadTime, 0) / measurements.length),
                    domContentLoaded: Math.round(measurements.reduce((sum, m) => sum + m.domContentLoaded, 0) / measurements.length),
                    loadComplete: Math.round(measurements.reduce((sum, m) => sum + m.loadComplete, 0) / measurements.length),
                    firstPaint: Math.round(measurements.reduce((sum, m) => sum + m.firstPaint, 0) / measurements.length),
                    firstContentfulPaint: Math.round(measurements.reduce((sum, m) => sum + m.firstContentfulPaint, 0) / measurements.length),
                    resourceCount: Math.round(measurements.reduce((sum, m) => sum + m.resourceCount, 0) / measurements.length)
                };
                
                baselineMetrics.push(avgMetrics);
                this.log(`Baseline ${testPage.name}: ${avgMetrics.loadTime}ms load, ${avgMetrics.firstContentfulPaint}ms FCP`);
            }
            
            this.results.performanceMetrics.push({
                type: 'baseline',
                timestamp: new Date().toISOString(),
                metrics: baselineMetrics
            });
            
        } finally {
            await browser.close();
        }
    }

    // Test 2: Concurrent User Load Test
    async runConcurrentUserLoadTest() {
        this.log('Running concurrent user load test...');
        
        const loadScenarios = [
            { users: 5, duration: 30000, name: 'Light Load' },
            { users: 10, duration: 30000, name: 'Medium Load' },
            { users: 20, duration: 30000, name: 'Heavy Load' }
        ];
        
        for (const scenario of loadScenarios) {
            this.log(`Testing ${scenario.name}: ${scenario.users} concurrent users for ${scenario.duration/1000}s`);
            
            const startTime = Date.now();
            const userPromises = [];
            
            // Launch concurrent users
            for (let i = 0; i < scenario.users; i++) {
                const userPromise = this.simulateRealisticUser(i, scenario.duration);
                userPromises.push(userPromise);
            }
            
            const userResults = await Promise.all(userPromises);
            const endTime = Date.now();
            
            // Analyze results
            const totalRequests = userResults.reduce((sum, result) => sum + result.requests, 0);
            const totalErrors = userResults.reduce((sum, result) => sum + result.errors, 0);
            const averageLoadTime = userResults.reduce((sum, result) => sum + result.averageLoadTime, 0) / userResults.length;
            const requestsPerSecond = totalRequests / ((endTime - startTime) / 1000);
            
            const scenarioResult = {
                scenario: scenario.name,
                users: scenario.users,
                duration: scenario.duration,
                totalRequests,
                totalErrors,
                averageLoadTime: Math.round(averageLoadTime),
                requestsPerSecond: Math.round(requestsPerSecond * 100) / 100,
                errorRate: Math.round((totalErrors / totalRequests) * 100 * 100) / 100,
                timestamp: new Date().toISOString()
            };
            
            this.results.loadTests.push(scenarioResult);
            
            this.log(`${scenario.name} completed: ${totalRequests} requests, ${Math.round(averageLoadTime)}ms avg, ${scenarioResult.errorRate}% errors`);
            
            // Wait between scenarios to allow system recovery
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    async simulateRealisticUser(userId, duration) {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        const result = {
            userId,
            requests: 0,
            errors: 0,
            loadTimes: [],
            averageLoadTime: 0
        };
        
        const startTime = Date.now();
        const pages = [
            '/',
            '/blog/',
            '/blog/complete-integration-demo/',
            '/blog/analytics-advertising-showcase/',
            '/blog/mermaid-diagrams-demo/'
        ];
        
        try {
            while (Date.now() - startTime < duration) {
                const randomPage = pages[Math.floor(Math.random() * pages.length)];
                const url = `${this.testSiteUrl}${randomPage}`;
                
                try {
                    const requestStart = Date.now();
                    await page.goto(url, { 
                        waitUntil: 'networkidle2', 
                        timeout: 10000 
                    });
                    const loadTime = Date.now() - requestStart;
                    
                    result.requests++;
                    result.loadTimes.push(loadTime);
                    
                    // Simulate user reading time
                    const readTime = Math.random() * 3000 + 1000; // 1-4 seconds
                    await page.waitForTimeout(readTime);
                    
                    // Simulate some user interactions
                    if (Math.random() > 0.7) {
                        try {
                            await page.evaluate(() => {
                                window.scrollTo(0, Math.random() * document.body.scrollHeight);
                            });
                            await page.waitForTimeout(500);
                        } catch (e) {
                            // Ignore scroll errors
                        }
                    }
                    
                } catch (error) {
                    result.errors++;
                    this.results.errors.push({
                        userId,
                        url,
                        error: error.message,
                        timestamp: new Date().toISOString()
                    });
                }
            }
            
            result.averageLoadTime = result.loadTimes.length > 0 
                ? result.loadTimes.reduce((sum, time) => sum + time, 0) / result.loadTimes.length 
                : 0;
                
        } finally {
            await browser.close();
        }
        
        return result;
    }

    // Test 3: Memory and Resource Usage Under Load
    async testResourceUsageUnderLoad() {
        this.log('Testing resource usage under load...');
        
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        try {
            // Enable performance monitoring
            await page.setCacheEnabled(false);
            
            const resourceMetrics = [];
            const testDuration = 60000; // 1 minute
            const startTime = Date.now();
            
            while (Date.now() - startTime < testDuration) {
                // Navigate to different pages to simulate load
                const pages = ['/', '/blog/', '/blog/complete-integration-demo/'];
                const randomPage = pages[Math.floor(Math.random() * pages.length)];
                const url = `${this.testSiteUrl}${randomPage}`;
                
                await page.goto(url, { waitUntil: 'networkidle2' });
                
                // Collect resource metrics
                const metrics = await page.evaluate(() => {
                    const resources = performance.getEntriesByType('resource');
                    const navigation = performance.getEntriesByType('navigation')[0];
                    
                    return {
                        resourceCount: resources.length,
                        totalTransferSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
                        totalEncodedSize: resources.reduce((sum, r) => sum + (r.encodedBodySize || 0), 0),
                        scriptResources: resources.filter(r => r.initiatorType === 'script').length,
                        imageResources: resources.filter(r => r.initiatorType === 'img').length,
                        cssResources: resources.filter(r => r.initiatorType === 'link').length,
                        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                        memoryUsage: performance.memory ? {
                            usedJSHeapSize: performance.memory.usedJSHeapSize,
                            totalJSHeapSize: performance.memory.totalJSHeapSize,
                            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
                        } : null
                    };
                });
                
                resourceMetrics.push({
                    timestamp: new Date().toISOString(),
                    page: randomPage,
                    ...metrics
                });
                
                await page.waitForTimeout(2000);
            }
            
            // Analyze resource usage trends
            const avgTransferSize = Math.round(resourceMetrics.reduce((sum, m) => sum + m.totalTransferSize, 0) / resourceMetrics.length);
            const avgResourceCount = Math.round(resourceMetrics.reduce((sum, m) => sum + m.resourceCount, 0) / resourceMetrics.length);
            const avgScriptCount = Math.round(resourceMetrics.reduce((sum, m) => sum + m.scriptResources, 0) / resourceMetrics.length);
            
            this.results.performanceMetrics.push({
                type: 'resource_usage',
                timestamp: new Date().toISOString(),
                summary: {
                    averageTransferSize: avgTransferSize,
                    averageResourceCount: avgResourceCount,
                    averageScriptCount: avgScriptCount,
                    testDuration: testDuration
                },
                details: resourceMetrics
            });
            
            this.log(`Resource usage: ${avgTransferSize} bytes avg transfer, ${avgResourceCount} resources avg, ${avgScriptCount} scripts avg`);
            
        } finally {
            await browser.close();
        }
    }

    // Test 4: Performance Degradation Analysis
    async analyzePerformanceDegradation() {
        this.log('Analyzing performance degradation under load...');
        
        const degradationTests = [
            { name: 'Single User', users: 1 },
            { name: 'Light Load', users: 5 },
            { name: 'Medium Load', users: 10 },
            { name: 'Heavy Load', users: 15 }
        ];
        
        const degradationResults = [];
        
        for (const test of degradationTests) {
            this.log(`Testing performance with ${test.users} concurrent users...`);
            
            const browser = await puppeteer.launch({ headless: true });
            const userPromises = [];
            
            // Create concurrent users
            for (let i = 0; i < test.users; i++) {
                const userPromise = this.measureUserPerformance(browser, i);
                userPromises.push(userPromise);
            }
            
            const userResults = await Promise.all(userPromises);
            await browser.close();
            
            // Calculate performance metrics
            const allLoadTimes = userResults.flatMap(result => result.loadTimes);
            const averageLoadTime = allLoadTimes.reduce((sum, time) => sum + time, 0) / allLoadTimes.length;
            const p95LoadTime = this.calculatePercentile(allLoadTimes, 95);
            const p99LoadTime = this.calculatePercentile(allLoadTimes, 99);
            
            degradationResults.push({
                test: test.name,
                users: test.users,
                averageLoadTime: Math.round(averageLoadTime),
                p95LoadTime: Math.round(p95LoadTime),
                p99LoadTime: Math.round(p99LoadTime),
                totalRequests: userResults.reduce((sum, result) => sum + result.requests, 0),
                totalErrors: userResults.reduce((sum, result) => sum + result.errors, 0)
            });
            
            this.log(`${test.name}: ${Math.round(averageLoadTime)}ms avg, ${Math.round(p95LoadTime)}ms p95, ${Math.round(p99LoadTime)}ms p99`);
            
            // Wait between tests
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
        // Calculate degradation percentages
        const baseline = degradationResults[0];
        degradationResults.forEach((result, index) => {
            if (index > 0) {
                result.degradation = {
                    averageLoadTime: Math.round(((result.averageLoadTime - baseline.averageLoadTime) / baseline.averageLoadTime) * 100),
                    p95LoadTime: Math.round(((result.p95LoadTime - baseline.p95LoadTime) / baseline.p95LoadTime) * 100),
                    p99LoadTime: Math.round(((result.p99LoadTime - baseline.p99LoadTime) / baseline.p99LoadTime) * 100)
                };
            }
        });
        
        this.results.performanceMetrics.push({
            type: 'degradation_analysis',
            timestamp: new Date().toISOString(),
            results: degradationResults
        });
    }

    async measureUserPerformance(browser, userId) {
        const page = await browser.newPage();
        const result = { userId, requests: 0, errors: 0, loadTimes: [] };
        
        try {
            const testPages = ['/', '/blog/', '/blog/complete-integration-demo/'];
            
            for (const pagePath of testPages) {
                const url = `${this.testSiteUrl}${pagePath}`;
                
                try {
                    const startTime = Date.now();
                    await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
                    const loadTime = Date.now() - startTime;
                    
                    result.requests++;
                    result.loadTimes.push(loadTime);
                    
                } catch (error) {
                    result.errors++;
                }
            }
        } finally {
            await page.close();
        }
        
        return result;
    }

    calculatePercentile(values, percentile) {
        const sorted = values.slice().sort((a, b) => a - b);
        const index = Math.ceil((percentile / 100) * sorted.length) - 1;
        return sorted[index] || 0;
    }

    async cleanup() {
        if (this.hugoServer) {
            this.hugoServer.kill();
        }
    }

    // Generate comprehensive load test report
    async generateLoadTestReport() {
        this.log('Generating load test report...');
        
        // Calculate summary statistics
        const totalRequests = this.results.loadTests.reduce((sum, test) => sum + test.totalRequests, 0);
        const totalErrors = this.results.loadTests.reduce((sum, test) => sum + test.totalErrors, 0);
        const overallErrorRate = totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;
        
        this.results.summary = {
            timestamp: new Date().toISOString(),
            totalRequests,
            totalErrors,
            overallErrorRate: Math.round(overallErrorRate * 100) / 100,
            testDuration: this.results.loadTests.reduce((sum, test) => sum + test.duration, 0),
            maxConcurrentUsers: Math.max(...this.results.loadTests.map(test => test.users)),
            averageResponseTime: Math.round(this.results.loadTests.reduce((sum, test) => sum + test.averageLoadTime, 0) / this.results.loadTests.length)
        };
        
        // Save detailed report
        await fs.writeJson(
            path.join(this.reportsDir, 'load-performance-test-report.json'),
            this.results,
            { spaces: 2 }
        );
        
        // Generate summary report
        const summaryReport = {
            timestamp: new Date().toISOString(),
            summary: this.results.summary,
            loadTestResults: this.results.loadTests,
            performanceMetrics: this.results.performanceMetrics.map(metric => ({
                type: metric.type,
                timestamp: metric.timestamp,
                summary: metric.summary || 'See detailed report for full metrics'
            })),
            recommendations: this.generateRecommendations()
        };
        
        await fs.writeJson(
            path.join(this.reportsDir, 'load-test-summary.json'),
            summaryReport,
            { spaces: 2 }
        );
        
        this.log(`Load test reports saved to reports/load-performance-test-report.json and reports/load-test-summary.json`);
    }

    generateRecommendations() {
        const recommendations = [];
        
        // Analyze error rates
        const highErrorTests = this.results.loadTests.filter(test => test.errorRate > 5);
        if (highErrorTests.length > 0) {
            recommendations.push({
                type: 'error_rate',
                severity: 'high',
                message: `High error rates detected (${highErrorTests.map(t => t.errorRate + '%').join(', ')}) under load. Consider optimizing error handling and resource limits.`
            });
        }
        
        // Analyze response times
        const slowTests = this.results.loadTests.filter(test => test.averageLoadTime > 3000);
        if (slowTests.length > 0) {
            recommendations.push({
                type: 'response_time',
                severity: 'medium',
                message: `Slow response times detected (${slowTests.map(t => t.averageLoadTime + 'ms').join(', ')}) under load. Consider implementing caching and optimizing resource loading.`
            });
        }
        
        // Analyze throughput
        const lowThroughputTests = this.results.loadTests.filter(test => test.requestsPerSecond < 1);
        if (lowThroughputTests.length > 0) {
            recommendations.push({
                type: 'throughput',
                severity: 'medium',
                message: 'Low throughput detected under concurrent load. Consider optimizing server configuration and resource handling.'
            });
        }
        
        if (recommendations.length === 0) {
            recommendations.push({
                type: 'performance',
                severity: 'info',
                message: 'Performance under load appears acceptable. Continue monitoring in production environment.'
            });
        }
        
        return recommendations;
    }

    // Run all load performance tests
    async runAllTests() {
        this.log('Starting Load Performance Tests');
        this.log('===============================');
        
        try {
            await fs.ensureDir(this.reportsDir);
            await this.startHugoServer();
            
            await this.measureBaselinePerformance();
            await this.runConcurrentUserLoadTest();
            await this.testResourceUsageUnderLoad();
            await this.analyzePerformanceDegradation();
            
            await this.generateLoadTestReport();
            
            this.log('===============================');
            this.log('Load performance tests completed successfully');
            
            // Print summary
            const summary = this.results.summary;
            this.log(`Total requests: ${summary.totalRequests}`);
            this.log(`Total errors: ${summary.totalErrors} (${summary.overallErrorRate}%)`);
            this.log(`Max concurrent users: ${summary.maxConcurrentUsers}`);
            this.log(`Average response time: ${summary.averageResponseTime}ms`);
            
            return summary.overallErrorRate < 10; // Consider test passed if error rate < 10%
            
        } catch (error) {
            this.log(`Load performance tests failed: ${error.message}`, 'error');
            return false;
        } finally {
            await this.cleanup();
        }
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new LoadPerformanceTester();
    tester.runAllTests().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('Load test execution failed:', error);
        process.exit(1);
    });
}

module.exports = LoadPerformanceTester;