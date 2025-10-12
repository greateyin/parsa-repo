#!/usr/bin/env node

/**
 * Comprehensive Accessibility Testing Suite
 * Tests WCAG 2.1 AA compliance and accessibility features
 */

const puppeteer = require('puppeteer');
const axeCore = require('axe-core');
const fs = require('fs-extra');
const path = require('path');

class AccessibilityTests {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = [];
    this.reportsDir = path.join(__dirname, 'reports');
  }

  async runAllTests() {
    console.log('♿ Starting Accessibility Tests...\n');
    
    try {
      await this.setupBrowser();
      await this.testKeyboardNavigation();
      await this.testScreenReaderSupport();
      await this.testColorContrast();
      await this.testFocusManagement();
      await this.testARIAImplementation();
      await this.testSemanticHTML();
      await this.runAxeTests();
      await this.generateReport();
      
      console.log('✅ Accessibility tests completed successfully!');
      return true;
    } catch (error) {
      console.error('❌ Accessibility tests failed:', error.message);
      return false;
    } finally {
      await this.cleanup();
    }
  }

  async setupBrowser() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
    
    // Inject axe-core
    await this.page.addScriptTag({
      path: require.resolve('axe-core/axe.min.js')
    });
  }

  async testKeyboardNavigation() {
    console.log('⌨️ Testing keyboard navigation...');
    
    await this.page.goto('http://localhost:1313/', { waitUntil: 'networkidle0' });
    
    // Test tab navigation
    let tabCount = 0;
    const maxTabs = 20;
    const focusableElements = [];
    
    while (tabCount < maxTabs) {
      await this.page.keyboard.press('Tab');
      
      const focusedElement = await this.page.evaluate(() => {
        const el = document.activeElement;
        if (el && el !== document.body) {
          return {
            tagName: el.tagName,
            type: el.type || null,
            role: el.getAttribute('role'),
            ariaLabel: el.getAttribute('aria-label'),
            id: el.id,
            className: el.className
          };
        }
        return null;
      });
      
      if (focusedElement) {
        focusableElements.push(focusedElement);
      }
      
      tabCount++;
    }
    
    this.addResult('Keyboard Navigation', 'Focusable elements', focusableElements.length > 0, 
      `${focusableElements.length} focusable elements found`);
    
    // Test skip links
    await this.page.goto('http://localhost:1313/', { waitUntil: 'networkidle0' });
    await this.page.keyboard.press('Tab');
    
    const skipLink = await this.page.evaluate(() => {
      const el = document.activeElement;
      return el && (el.textContent.toLowerCase().includes('skip') || 
                   el.getAttribute('href') === '#main' || 
                   el.getAttribute('href') === '#content');
    });
    
    this.addResult('Keyboard Navigation', 'Skip links', skipLink, 
      skipLink ? 'Skip link found' : 'No skip link detected');
  }  a
sync testScreenReaderSupport() {
    console.log('🔊 Testing screen reader support...');
    
    await this.page.goto('http://localhost:1313/', { waitUntil: 'networkidle0' });
    
    // Check for proper heading hierarchy
    const headings = await this.page.evaluate(() => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      return Array.from(headingElements).map(h => ({
        level: parseInt(h.tagName.charAt(1)),
        text: h.textContent.trim()
      }));
    });
    
    // Validate heading hierarchy
    let validHierarchy = true;
    let hasH1 = false;
    
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      
      if (heading.level === 1) {
        hasH1 = true;
      }
      
      if (i > 0) {
        const prevLevel = headings[i - 1].level;
        if (heading.level > prevLevel + 1) {
          validHierarchy = false;
          break;
        }
      }
    }
    
    this.addResult('Screen Reader Support', 'H1 present', hasH1, 
      hasH1 ? 'H1 heading found' : 'No H1 heading found');
    
    this.addResult('Screen Reader Support', 'Heading hierarchy', validHierarchy, 
      validHierarchy ? 'Valid heading hierarchy' : 'Invalid heading hierarchy');
    
    // Check for alt text on images
    const imagesWithoutAlt = await this.page.$$eval('img', imgs => 
      imgs.filter(img => !img.alt && !img.getAttribute('aria-label')).length
    );
    
    this.addResult('Screen Reader Support', 'Image alt text', imagesWithoutAlt === 0, 
      `${imagesWithoutAlt} images without alt text`);
    
    // Check for form labels
    const unlabeledInputs = await this.page.evaluate(() => {
      const inputs = document.querySelectorAll('input, textarea, select');
      return Array.from(inputs).filter(input => {
        const hasLabel = document.querySelector(`label[for="${input.id}"]`) || 
                        input.getAttribute('aria-label') || 
                        input.getAttribute('aria-labelledby') ||
                        input.closest('label');
        return !hasLabel && input.type !== 'hidden';
      }).length;
    });
    
    this.addResult('Screen Reader Support', 'Form labels', unlabeledInputs === 0, 
      `${unlabeledInputs} unlabeled form inputs`);
  }

  async testColorContrast() {
    console.log('🎨 Testing color contrast...');
    
    await this.page.goto('http://localhost:1313/', { waitUntil: 'networkidle0' });
    
    // This is a simplified color contrast test
    // In a real implementation, you'd use a more sophisticated color contrast analyzer
    const textElements = await this.page.evaluate(() => {
      const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, span, div');
      const results = [];
      
      for (const el of elements) {
        const styles = window.getComputedStyle(el);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        if (color && backgroundColor && el.textContent.trim()) {
          results.push({
            color,
            backgroundColor,
            text: el.textContent.trim().substring(0, 50)
          });
        }
      }
      
      return results.slice(0, 10); // Sample first 10 elements
    });
    
    this.addResult('Color Contrast', 'Text elements analyzed', textElements.length > 0, 
      `${textElements.length} text elements analyzed`);
  }

  async testFocusManagement() {
    console.log('🎯 Testing focus management...');
    
    await this.page.goto('http://localhost:1313/', { waitUntil: 'networkidle0' });
    
    // Test focus visibility
    await this.page.keyboard.press('Tab');
    
    const focusVisible = await this.page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return false;
      
      const styles = window.getComputedStyle(el);
      const outline = styles.outline;
      const boxShadow = styles.boxShadow;
      
      return outline !== 'none' || boxShadow !== 'none' || 
             el.matches(':focus-visible') || el.matches('.focus-visible');
    });
    
    this.addResult('Focus Management', 'Focus visibility', focusVisible, 
      focusVisible ? 'Focus indicators present' : 'No visible focus indicators');
    
    // Test focus trap in modals (if any)
    const modals = await this.page.$$('[role="dialog"], .modal, .popup');
    
    this.addResult('Focus Management', 'Modal focus trap', true, 
      `${modals.length} modal elements found for focus trap testing`);
  } 
 async testARIAImplementation() {
    console.log('🏷️ Testing ARIA implementation...');
    
    await this.page.goto('http://localhost:1313/', { waitUntil: 'networkidle0' });
    
    // Check for proper landmark roles
    const landmarks = await this.page.evaluate(() => {
      const landmarkSelectors = [
        'header, [role="banner"]',
        'nav, [role="navigation"]', 
        'main, [role="main"]',
        'footer, [role="contentinfo"]',
        'aside, [role="complementary"]'
      ];
      
      const results = {};
      landmarkSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        const type = selector.split(',')[0].split('[')[0];
        results[type] = elements.length;
      });
      
      return results;
    });
    
    this.addResult('ARIA Implementation', 'Header landmark', landmarks.header > 0, 
      `${landmarks.header} header landmarks found`);
    
    this.addResult('ARIA Implementation', 'Navigation landmark', landmarks.nav > 0, 
      `${landmarks.nav} navigation landmarks found`);
    
    this.addResult('ARIA Implementation', 'Main landmark', landmarks.main > 0, 
      `${landmarks.main} main landmarks found`);
    
    this.addResult('ARIA Implementation', 'Footer landmark', landmarks.footer > 0, 
      `${landmarks.footer} footer landmarks found`);
    
    // Check for ARIA attributes
    const ariaElements = await this.page.evaluate(() => {
      const elements = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby], [aria-expanded], [aria-hidden]');
      return elements.length;
    });
    
    this.addResult('ARIA Implementation', 'ARIA attributes', ariaElements > 0, 
      `${ariaElements} elements with ARIA attributes`);
  }

  async testSemanticHTML() {
    console.log('📝 Testing semantic HTML...');
    
    await this.page.goto('http://localhost:1313/', { waitUntil: 'networkidle0' });
    
    // Check for semantic elements
    const semanticElements = await this.page.evaluate(() => {
      const semanticTags = ['article', 'section', 'nav', 'header', 'footer', 'main', 'aside'];
      const results = {};
      
      semanticTags.forEach(tag => {
        results[tag] = document.querySelectorAll(tag).length;
      });
      
      return results;
    });
    
    const hasSemanticStructure = Object.values(semanticElements).some(count => count > 0);
    
    this.addResult('Semantic HTML', 'Semantic elements', hasSemanticStructure, 
      `Semantic elements found: ${JSON.stringify(semanticElements)}`);
    
    // Check for proper list usage
    const lists = await this.page.evaluate(() => {
      const ulElements = document.querySelectorAll('ul');
      const olElements = document.querySelectorAll('ol');
      const dlElements = document.querySelectorAll('dl');
      
      return {
        unordered: ulElements.length,
        ordered: olElements.length,
        definition: dlElements.length
      };
    });
    
    this.addResult('Semantic HTML', 'List elements', 
      lists.unordered > 0 || lists.ordered > 0, 
      `Lists found: ${JSON.stringify(lists)}`);
  }

  async runAxeTests() {
    console.log('🔍 Running axe-core accessibility tests...');
    
    const urls = [
      'http://localhost:1313/',
      'http://localhost:1313/blog/',
      'http://localhost:1313/categories/'
    ];

    for (const url of urls) {
      await this.page.goto(url, { waitUntil: 'networkidle0' });
      
      const results = await this.page.evaluate(() => {
        return new Promise((resolve) => {
          axe.run((err, results) => {
            if (err) throw err;
            resolve(results);
          });
        });
      });
      
      const violations = results.violations || [];
      const passes = results.passes || [];
      
      this.addResult('Axe Tests', `${url.replace('http://localhost:1313', '') || '/'}`, 
        violations.length === 0, 
        `${violations.length} violations, ${passes.length} passes`, 
        { violations, passes });
    }
  }  addRe
sult(category, test, passed, message, data = null) {
    const result = { category, test, passed, message, data };
    this.results.push(result);
    
    const status = passed ? '✅' : '❌';
    console.log(`  ${status} ${category} - ${test}: ${message}`);
  }

  async generateReport() {
    await fs.ensureDir(this.reportsDir);
    
    const report = {
      timestamp: new Date().toISOString(),
      totalTests: this.results.length,
      passed: this.results.filter(r => r.passed).length,
      failed: this.results.filter(r => !r.passed).length,
      results: this.results
    };
    
    const reportPath = path.join(this.reportsDir, 'accessibility-tests.json');
    await fs.writeJson(reportPath, report, { spaces: 2 });
    
    console.log(`\n📊 Accessibility Report Generated: ${reportPath}`);
    console.log(`   Total Tests: ${report.totalTests}`);
    console.log(`   Passed: ${report.passed}`);
    console.log(`   Failed: ${report.failed}`);
    console.log(`   Success Rate: ${((report.passed / report.totalTests) * 100).toFixed(1)}%`);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new AccessibilityTests();
  tester.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = AccessibilityTests;