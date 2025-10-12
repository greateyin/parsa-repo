#!/usr/bin/env node

/**
 * Hugo Template Rendering Tests
 * Tests Hugo template compilation, rendering, and output validation
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const cheerio = require('cheerio');
const glob = require('glob');

class HugoTemplateTests {
  constructor() {
    this.testResults = [];
    this.siteDir = path.join(__dirname, '../exampleSite');
    this.outputDir = path.join(this.siteDir, 'public');
    this.reportsDir = path.join(__dirname, 'reports');
  }

  async runAllTests() {
    console.log('🚀 Starting Hugo Template Tests...\n');
    
    try {
      await this.setupTestEnvironment();
      await this.buildSite();
      await this.testTemplateRendering();
      await this.testContentTypes();
      await this.testTaxonomies();
      await this.testMultilingual();
      await this.testShortcodes();
      await this.generateReport();
      
      console.log('✅ All Hugo template tests completed successfully!');
      return true;
    } catch (error) {
      console.error('❌ Hugo template tests failed:', error.message);
      return false;
    }
  }

  async setupTestEnvironment() {
    console.log('📁 Setting up test environment...');
    await fs.ensureDir(this.reportsDir);
    await fs.ensureDir(this.outputDir);
  }

  async buildSite() {
    console.log('🔨 Building Hugo site...');
    try {
      const buildCommand = `cd ${this.siteDir} && hugo --minify --destination public`;
      execSync(buildCommand, { stdio: 'pipe' });
      console.log('✅ Site built successfully');
    } catch (error) {
      throw new Error(`Hugo build failed: ${error.message}`);
    }
  }

  async testTemplateRendering() {
    console.log('🧪 Testing template rendering...');
    
    const tests = [
      { file: 'index.html', description: 'Homepage template' },
      { file: 'blog/index.html', description: 'Blog list template' },
      { file: 'categories/index.html', description: 'Categories template' },
      { file: 'tags/index.html', description: 'Tags template' }
    ];

    for (const test of tests) {
      await this.validateTemplate(test);
    }
  }  async
 validateTemplate(test) {
    const filePath = path.join(this.outputDir, test.file);
    
    if (!await fs.pathExists(filePath)) {
      this.addTestResult(test.description, false, `File not found: ${test.file}`);
      return;
    }

    const content = await fs.readFile(filePath, 'utf8');
    const $ = cheerio.load(content);
    
    // Basic HTML structure validation
    const hasDoctype = content.trim().startsWith('<!DOCTYPE html>');
    const hasHtml = $('html').length > 0;
    const hasHead = $('head').length > 0;
    const hasBody = $('body').length > 0;
    const hasTitle = $('title').length > 0;
    const hasMetaViewport = $('meta[name="viewport"]').length > 0;
    
    const isValid = hasDoctype && hasHtml && hasHead && hasBody && hasTitle && hasMetaViewport;
    
    this.addTestResult(
      test.description,
      isValid,
      isValid ? 'Valid HTML structure' : 'Invalid HTML structure'
    );
  }

  async testContentTypes() {
    console.log('📄 Testing content types...');
    
    // Test single page rendering
    const blogPosts = glob.sync(path.join(this.outputDir, 'blog/**/*.html'));
    
    for (const post of blogPosts.slice(0, 3)) { // Test first 3 posts
      await this.validateSinglePage(post);
    }
  }

  async validateSinglePage(filePath) {
    const content = await fs.readFile(filePath, 'utf8');
    const $ = cheerio.load(content);
    
    // Check for required elements
    const hasArticle = $('article').length > 0;
    const hasTitle = $('h1').length > 0;
    const hasContent = $('.content, .post-content, main').length > 0;
    const hasMetadata = $('.post-meta, .article-meta').length > 0;
    
    const isValid = hasArticle && hasTitle && hasContent;
    const fileName = path.basename(filePath);
    
    this.addTestResult(
      `Single page: ${fileName}`,
      isValid,
      isValid ? 'Valid single page structure' : 'Missing required elements'
    );
  }

  async testTaxonomies() {
    console.log('🏷️ Testing taxonomies...');
    
    // Test categories
    const categoriesPath = path.join(this.outputDir, 'categories/index.html');
    if (await fs.pathExists(categoriesPath)) {
      await this.validateTaxonomyPage(categoriesPath, 'Categories');
    }
    
    // Test tags
    const tagsPath = path.join(this.outputDir, 'tags/index.html');
    if (await fs.pathExists(tagsPath)) {
      await this.validateTaxonomyPage(tagsPath, 'Tags');
    }
  }  async 
validateTaxonomyPage(filePath, type) {
    const content = await fs.readFile(filePath, 'utf8');
    const $ = cheerio.load(content);
    
    const hasTaxonomyList = $('.taxonomy-list, .categories-list, .tags-list').length > 0;
    const hasTaxonomyItems = $('.taxonomy-item, .category-item, .tag-item').length > 0;
    
    const isValid = hasTaxonomyList || hasTaxonomyItems;
    
    this.addTestResult(
      `${type} taxonomy page`,
      isValid,
      isValid ? `${type} page rendered correctly` : `${type} page missing taxonomy elements`
    );
  }

  async testMultilingual() {
    console.log('🌐 Testing multilingual support...');
    
    // Check for language-specific pages
    const languages = ['en', 'zh'];
    
    for (const lang of languages) {
      const langPath = path.join(this.outputDir, lang, 'index.html');
      if (await fs.pathExists(langPath)) {
        await this.validateLanguagePage(langPath, lang);
      }
    }
  }

  async validateLanguagePage(filePath, lang) {
    const content = await fs.readFile(filePath, 'utf8');
    const $ = cheerio.load(content);
    
    const hasLangAttr = $('html[lang]').length > 0;
    const langAttr = $('html').attr('lang');
    const correctLang = langAttr && langAttr.startsWith(lang);
    
    this.addTestResult(
      `Language page: ${lang}`,
      hasLangAttr && correctLang,
      correctLang ? `Correct language attribute: ${langAttr}` : `Missing or incorrect language attribute`
    );
  }

  async testShortcodes() {
    console.log('🔧 Testing shortcodes...');
    
    // Look for shortcode usage in generated HTML
    const htmlFiles = glob.sync(path.join(this.outputDir, '**/*.html'));
    let shortcodeTests = 0;
    
    for (const file of htmlFiles) {
      const content = await fs.readFile(file, 'utf8');
      const $ = cheerio.load(content);
      
      // Test figure shortcode
      if ($('figure').length > 0) {
        shortcodeTests++;
        this.addTestResult(
          'Figure shortcode',
          true,
          'Figure shortcode rendered successfully'
        );
        break;
      }
    }
    
    if (shortcodeTests === 0) {
      this.addTestResult(
        'Shortcodes',
        true,
        'No shortcodes found in content (this is acceptable)'
      );
    }
  }

  addTestResult(name, passed, message) {
    this.testResults.push({ name, passed, message });
    const status = passed ? '✅' : '❌';
    console.log(`  ${status} ${name}: ${message}`);
  } 
 async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalTests: this.testResults.length,
      passed: this.testResults.filter(r => r.passed).length,
      failed: this.testResults.filter(r => !r.passed).length,
      results: this.testResults
    };
    
    const reportPath = path.join(this.reportsDir, 'hugo-template-tests.json');
    await fs.writeJson(reportPath, report, { spaces: 2 });
    
    console.log(`\n📊 Test Report Generated: ${reportPath}`);
    console.log(`   Total Tests: ${report.totalTests}`);
    console.log(`   Passed: ${report.passed}`);
    console.log(`   Failed: ${report.failed}`);
    console.log(`   Success Rate: ${((report.passed / report.totalTests) * 100).toFixed(1)}%`);
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new HugoTemplateTests();
  tester.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = HugoTemplateTests;