#!/usr/bin/env node

/**
 * Comprehensive Integration Test Runner
 * Orchestrates all integration tests including feature integration and load performance
 * Implements task 12.4: Write comprehensive integration tests
 */

const fs = require('fs-extra');
const path = require('path');
const ComprehensiveIntegrationTester = require('./comprehensive-integration-tests');
const LoadPerformanceTester = require('./load-performance-tests');

class ComprehensiveTestRunner {
    constructor() {
        this.results = {
            integrationTests: null,
            loadTests: null,
            overallSuccess: false,
            timestamp: new Date().toISOString()
        };
        this.reportsDir = path.join(__dirname, 'reports');
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    async runAllComprehensiveTests() {
        this.log('🚀 Starting Comprehensive Integration Test Suite');
        this.log('================================================');
        this.log('This test suite validates:');
        this.log('- Complete feature integration and interaction');
        this.log('- Performance under realistic load conditions');
        this.log('- Core Web Vitals compliance (Requirement 8.5)');
        this.log('- System resilience and error handling');
        this.log('================================================\n');

        try {
            await fs.ensureDir(this.reportsDir);
            
            // Phase 1: Run comprehensive integration tests
            this.log('📋 Phase 1: Running Comprehensive Integration Tests');
            this.log('-'.repeat(50));
            
            const integrationTester = new ComprehensiveIntegrationTester();
            this.results.integrationTests = await integrationTester.runAllTests();
            
            if (this.results.integrationTests) {
                this.log('✅ Comprehensive integration tests PASSED', 'success');
            } else {
                this.log('❌ Comprehensive integration tests FAILED', 'error');
            }
            
            // Phase 2: Run load performance tests
            this.log('\n⚡ Phase 2: Running Load Performance Tests');
            this.log('-'.repeat(50));
            
            const loadTester = new LoadPerformanceTester();
            this.results.loadTests = await loadTester.runAllTests();
            
            if (this.results.loadTests) {
                this.log('✅ Load performance tests PASSED', 'success');
            } else {
                this.log('❌ Load performance tests FAILED', 'error');
            }
            
            // Determine overall success
            this.results.overallSuccess = this.results.integrationTests && this.results.loadTests;
            
            // Generate final comprehensive report
            await this.generateFinalReport();
            
            // Print final summary
            this.printFinalSummary();
            
            return this.results.overallSuccess;
            
        } catch (error) {
            this.log(`Comprehensive test suite failed: ${error.message}`, 'error');
            this.results.overallSuccess = false;
            return false;
        }
    }

    async generateFinalReport() {
        this.log('\n📊 Generating Final Comprehensive Report...');
        
        // Load individual test reports
        const integrationReportPath = path.join(this.reportsDir, 'comprehensive-integration-test-report.json');
        const loadReportPath = path.join(this.reportsDir, 'load-performance-test-report.json');
        
        let integrationReport = null;
        let loadReport = null;
        
        try {
            if (await fs.pathExists(integrationReportPath)) {
                integrationReport = await fs.readJson(integrationReportPath);
            }
            if (await fs.pathExists(loadReportPath)) {
                loadReport = await fs.readJson(loadReportPath);
            }
        } catch (error) {
            this.log(`Warning: Could not load individual reports: ${error.message}`, 'warning');
        }
        
        // Create comprehensive final report
        const finalReport = {
            metadata: {
                testSuite: 'Comprehensive Integration Tests',
                task: '12.4 Write comprehensive integration tests',
                requirement: '8.5 Performance optimization',
                timestamp: this.results.timestamp,
                completedAt: new Date().toISOString()
            },
            summary: {
                overallSuccess: this.results.overallSuccess,
                integrationTestsPassed: this.results.integrationTests,
                loadTestsPassed: this.results.loadTests,
                testPhases: [
                    {
                        phase: 'Integration Tests',
                        description: 'Complete feature integration and interaction validation',
                        passed: this.results.integrationTests,
                        coverage: [
                            'Google Analytics 4 integration',
                            'Facebook Pixel integration', 
                            'Google AdSense integration',
                            'Google Custom Search integration',
                            'Mermaid.js diagram rendering',
                            'Multi-page navigation flow',
                            'Third-party service resilience',
                            'Core Web Vitals compliance'
                        ]
                    },
                    {
                        phase: 'Load Performance Tests',
                        description: 'Performance validation under realistic load conditions',
                        passed: this.results.loadTests,
                        coverage: [
                            'Baseline performance measurement',
                            'Concurrent user load testing',
                            'Resource usage monitoring',
                            'Performance degradation analysis',
                            'Error rate validation',
                            'Response time analysis'
                        ]
                    }
                ]
            },
            requirementsCoverage: {
                '8.5.1': {
                    requirement: 'Asynchronous loading prevents blocking page rendering',
                    tested: true,
                    status: this.results.integrationTests ? 'PASS' : 'FAIL',
                    evidence: 'Script loading optimization tests validate async/defer attributes'
                },
                '8.5.2': {
                    requirement: 'Optimized script loading order minimizes redundant requests',
                    tested: true,
                    status: this.results.integrationTests ? 'PASS' : 'FAIL',
                    evidence: 'Network request monitoring validates script loading optimization'
                },
                '8.5.3': {
                    requirement: 'Lazy loading implemented for below-the-fold advertisements',
                    tested: true,
                    status: this.results.integrationTests ? 'PASS' : 'FAIL',
                    evidence: 'Intersection Observer API usage validated for ad lazy loading'
                },
                '8.5.4': {
                    requirement: 'Graceful degradation when third-party services unavailable',
                    tested: true,
                    status: this.results.integrationTests ? 'PASS' : 'FAIL',
                    evidence: 'Service blocking tests validate resilience and fallback behavior'
                },
                '8.5.5': {
                    requirement: 'Core Web Vitals scores within acceptable ranges',
                    tested: true,
                    status: this.results.integrationTests && this.results.loadTests ? 'PASS' : 'FAIL',
                    evidence: 'LCP, FID, and CLS measurements validate performance compliance'
                }
            },
            detailedResults: {
                integrationTests: integrationReport?.summary || 'Report not available',
                loadTests: loadReport?.summary || 'Report not available'
            },
            recommendations: this.generateRecommendations(integrationReport, loadReport)
        };
        
        // Save final report
        const finalReportPath = path.join(this.reportsDir, 'final-comprehensive-test-report.json');
        await fs.writeJson(finalReportPath, finalReport, { spaces: 2 });
        
        // Generate HTML report
        const htmlReport = this.generateHTMLReport(finalReport);
        const htmlReportPath = path.join(this.reportsDir, 'final-comprehensive-test-report.html');
        await fs.writeFile(htmlReportPath, htmlReport);
        
        this.log(`📄 Final report saved: ${finalReportPath}`);
        this.log(`🌐 HTML report saved: ${htmlReportPath}`);
    }

    generateRecommendations(integrationReport, loadReport) {
        const recommendations = [];
        
        // Integration test recommendations
        if (!this.results.integrationTests) {
            recommendations.push({
                category: 'Integration',
                priority: 'HIGH',
                issue: 'Integration tests failed',
                recommendation: 'Review integration test failures and fix underlying issues before deployment',
                impact: 'Critical functionality may not work correctly in production'
            });
        }
        
        // Load test recommendations
        if (!this.results.loadTests) {
            recommendations.push({
                category: 'Performance',
                priority: 'HIGH',
                issue: 'Load performance tests failed',
                recommendation: 'Optimize performance bottlenecks identified in load testing',
                impact: 'Poor user experience under realistic load conditions'
            });
        }
        
        // Analyze load test results for specific recommendations
        if (loadReport && loadReport.summary) {
            if (loadReport.summary.overallErrorRate > 5) {
                recommendations.push({
                    category: 'Reliability',
                    priority: 'MEDIUM',
                    issue: `High error rate: ${loadReport.summary.overallErrorRate}%`,
                    recommendation: 'Implement better error handling and increase server capacity',
                    impact: 'Users may experience errors during peak traffic'
                });
            }
            
            if (loadReport.summary.averageResponseTime > 3000) {
                recommendations.push({
                    category: 'Performance',
                    priority: 'MEDIUM',
                    issue: `Slow response times: ${loadReport.summary.averageResponseTime}ms average`,
                    recommendation: 'Optimize resource loading, implement caching, and consider CDN usage',
                    impact: 'Poor user experience due to slow page loads'
                });
            }
        }
        
        // Success recommendations
        if (this.results.overallSuccess) {
            recommendations.push({
                category: 'Success',
                priority: 'INFO',
                issue: 'All comprehensive tests passed',
                recommendation: 'Continue monitoring performance in production and maintain current optimization levels',
                impact: 'System is ready for production deployment'
            });
        }
        
        return recommendations;
    }

    generateHTMLReport(finalReport) {
        const statusColor = finalReport.summary.overallSuccess ? '#28a745' : '#dc3545';
        const statusText = finalReport.summary.overallSuccess ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED';
        
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprehensive Integration Test Report</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f8f9fa; 
        }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { color: #333; margin-bottom: 10px; }
        .status-badge { 
            display: inline-block; 
            padding: 10px 20px; 
            border-radius: 25px; 
            color: white; 
            font-weight: bold; 
            font-size: 18px;
            background-color: ${statusColor};
        }
        .metadata { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .metadata h3 { margin-top: 0; color: #495057; }
        .phase { margin: 20px 0; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px; }
        .phase h3 { margin: 0 0 15px 0; color: #495057; }
        .phase-status { font-weight: bold; }
        .phase-status.pass { color: #28a745; }
        .phase-status.fail { color: #dc3545; }
        .coverage-list { list-style-type: none; padding: 0; }
        .coverage-list li { padding: 5px 0; }
        .coverage-list li:before { content: "✓ "; color: #28a745; font-weight: bold; }
        .requirements { margin: 30px 0; }
        .requirement { margin: 15px 0; padding: 15px; border-left: 4px solid #007bff; background: #f8f9fa; }
        .requirement h4 { margin: 0 0 10px 0; color: #495057; }
        .req-status { font-weight: bold; }
        .req-status.pass { color: #28a745; }
        .req-status.fail { color: #dc3545; }
        .recommendations { margin: 30px 0; }
        .recommendation { margin: 15px 0; padding: 15px; border-radius: 8px; }
        .recommendation.high { background: #f8d7da; border-left: 4px solid #dc3545; }
        .recommendation.medium { background: #fff3cd; border-left: 4px solid #ffc107; }
        .recommendation.info { background: #d4edda; border-left: 4px solid #28a745; }
        .recommendation h4 { margin: 0 0 10px 0; }
        .timestamp { color: #6c757d; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Comprehensive Integration Test Report</h1>
            <div class="status-badge">${statusText}</div>
            <p class="timestamp">Generated: ${new Date(finalReport.metadata.completedAt).toLocaleString()}</p>
        </div>
        
        <div class="metadata">
            <h3>Test Metadata</h3>
            <p><strong>Task:</strong> ${finalReport.metadata.task}</p>
            <p><strong>Requirement:</strong> ${finalReport.metadata.requirement}</p>
            <p><strong>Test Suite:</strong> ${finalReport.metadata.testSuite}</p>
            <p><strong>Started:</strong> ${new Date(finalReport.metadata.timestamp).toLocaleString()}</p>
            <p><strong>Completed:</strong> ${new Date(finalReport.metadata.completedAt).toLocaleString()}</p>
        </div>
        
        <h2>Test Phases</h2>
        ${finalReport.summary.testPhases.map(phase => `
            <div class="phase">
                <h3>${phase.phase} <span class="phase-status ${phase.passed ? 'pass' : 'fail'}">${phase.passed ? 'PASSED' : 'FAILED'}</span></h3>
                <p>${phase.description}</p>
                <h4>Coverage:</h4>
                <ul class="coverage-list">
                    ${phase.coverage.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `).join('')}
        
        <div class="requirements">
            <h2>Requirements Coverage</h2>
            ${Object.entries(finalReport.requirementsCoverage).map(([reqId, req]) => `
                <div class="requirement">
                    <h4>${reqId}: ${req.requirement} <span class="req-status ${req.status.toLowerCase()}">${req.status}</span></h4>
                    <p><strong>Evidence:</strong> ${req.evidence}</p>
                </div>
            `).join('')}
        </div>
        
        <div class="recommendations">
            <h2>Recommendations</h2>
            ${finalReport.recommendations.map(rec => `
                <div class="recommendation ${rec.priority.toLowerCase()}">
                    <h4>${rec.category} - ${rec.priority} Priority</h4>
                    <p><strong>Issue:</strong> ${rec.issue}</p>
                    <p><strong>Recommendation:</strong> ${rec.recommendation}</p>
                    <p><strong>Impact:</strong> ${rec.impact}</p>
                </div>
            `).join('')}
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center;">
            <p class="timestamp">
                For detailed test results, see: 
                <a href="comprehensive-integration-test-report.json">Integration Test Report</a> | 
                <a href="load-performance-test-report.json">Load Performance Report</a>
            </p>
        </div>
    </div>
</body>
</html>`;
    }

    printFinalSummary() {
        this.log('\n' + '='.repeat(60));
        this.log('COMPREHENSIVE INTEGRATION TEST SUMMARY');
        this.log('='.repeat(60));
        
        this.log(`Integration Tests: ${this.results.integrationTests ? '✅ PASSED' : '❌ FAILED'}`);
        this.log(`Load Performance Tests: ${this.results.loadTests ? '✅ PASSED' : '❌ FAILED'}`);
        
        this.log('='.repeat(60));
        const overallStatus = this.results.overallSuccess ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED';
        this.log(`OVERALL RESULT: ${overallStatus}`);
        this.log('='.repeat(60));
        
        if (this.results.overallSuccess) {
            this.log('\n🎉 Comprehensive integration tests completed successfully!');
            this.log('✅ Complete feature integration validated');
            this.log('✅ Performance under realistic load confirmed');
            this.log('✅ Core Web Vitals compliance verified');
            this.log('✅ System resilience and error handling tested');
            this.log('\n📋 Task 12.4 "Write comprehensive integration tests" - COMPLETED');
        } else {
            this.log('\n⚠️  Some comprehensive tests failed. Review the detailed reports for specific issues.');
            this.log('📋 Task 12.4 "Write comprehensive integration tests" - NEEDS ATTENTION');
        }
        
        this.log(`\n📊 Detailed reports available in: ${this.reportsDir}/`);
    }
}

// Run tests if called directly
if (require.main === module) {
    const runner = new ComprehensiveTestRunner();
    runner.runAllComprehensiveTests().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('Comprehensive test execution failed:', error);
        process.exit(1);
    });
}

module.exports = ComprehensiveTestRunner;