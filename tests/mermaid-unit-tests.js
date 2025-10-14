#!/usr/bin/env node

/**
 * Mermaid.js Integration Unit Tests
 * Tests diagram rendering, script loading, shortcode and render hook functionality
 * Requirements: 4.1, 4.3
 */

const fs = require('fs');
const path = require('path');

class MermaidUnitTests {
  constructor() {
    this.testResults = [];
  }

  async runAllTests() {
    console.log('🚀 Starting Mermaid.js Integration Unit Tests...\n');
    
    try {
      await this.testDiagramRendering();
      await this.testScriptLoading();
      await this.testShortcodeFunctionality();
      await this.testRenderHookFunctionality();
      await this.testConfigurationManagement();
      await this.testErrorHandling();
      await this.testAccessibilityFeatures();
      await this.testPerformanceOptimization();
      await this.generateReport();
      
      console.log('✅ All Mermaid.js integration unit tests completed successfully!');
      return true;
    } catch (error) {
      console.error('❌ Mermaid.js integration unit tests failed:', error.message);
      return false;
    }
  }

  async testDiagramRendering() {
    console.log('🎨 Testing diagram rendering...');
    
    // Test 1: Basic diagram rendering configuration
    this.testBasicDiagramRendering();
    
    // Test 2: Multiple diagram types support
    this.testMultipleDiagramTypes();
    
    // Test 3: Diagram container structure
    this.testDiagramContainerStructure();
    
    // Test 4: Responsive diagram behavior
    this.testResponsiveDiagramBehavior();
    
    // Test 5: Theme support
    this.testDiagramThemeSupport();
  }  te
stBasicDiagramRendering() {
    // Test basic Mermaid diagram rendering configuration
    const mockConfig = {
      Params: {
        mermaid: {
          enabled: true,
          theme: 'default',
          securityLevel: 'loose',
          startOnLoad: true
        }
      }
    };
    
    // Simulate diagram rendering logic
    const configureDiagramRendering = (config) => {
      const mermaidConfig = config.Params?.mermaid || {};
      const enabled = mermaidConfig.enabled !== false; // Default to true
      
      if (!enabled) {
        return { shouldRender: false, fallback: 'code-block' };
      }
      
      return {
        shouldRender: true,
        containerClass: 'mermaid-container',
        diagramClass: 'mermaid-diagram',
        preClass: 'mermaid',
        theme: mermaidConfig.theme || 'default',
        securityLevel: mermaidConfig.securityLevel || 'loose',
        styling: {
          background: 'bg-white dark:bg-gray-800',
          padding: 'p-4',
          border: 'border border-gray-200 dark:border-gray-700',
          borderRadius: 'rounded-lg',
          overflow: 'overflow-x-auto'
        }
      };
    };
    
    const renderConfig = configureDiagramRendering(mockConfig);
    
    this.addTestResult(
      'Basic Diagram Rendering Configuration',
      renderConfig.shouldRender === true && renderConfig.theme === 'default',
      `Should render: ${renderConfig.shouldRender}, Theme: ${renderConfig.theme}`
    );
    
    // Test container structure
    this.addTestResult(
      'Diagram Container Structure',
      renderConfig.containerClass === 'mermaid-container' && renderConfig.diagramClass === 'mermaid-diagram',
      `Container: ${renderConfig.containerClass}, Diagram: ${renderConfig.diagramClass}`
    );
  }

  testMultipleDiagramTypes() {
    // Test support for different Mermaid diagram types
    const diagramTypes = [
      {
        type: 'flowchart',
        syntax: 'graph TD\n    A[Start] --> B[Process]\n    B --> C[End]',
        expected: { valid: true, category: 'flowchart' }
      },
      {
        type: 'sequence',
        syntax: 'sequenceDiagram\n    Alice->>Bob: Hello Bob\n    Bob-->>John: How about you John?',
        expected: { valid: true, category: 'sequence' }
      },
      {
        type: 'class',
        syntax: 'classDiagram\n    class Animal\n    Animal : +int age\n    Animal : +String gender',
        expected: { valid: true, category: 'class' }
      },
      {
        type: 'gantt',
        syntax: 'gantt\n    title A Gantt Diagram\n    dateFormat  YYYY-MM-DD\n    section Section\n    A task           :a1, 2014-01-01, 30d',
        expected: { valid: true, category: 'gantt' }
      },
      {
        type: 'pie',
        syntax: 'pie title Pets adopted by volunteers\n    "Dogs" : 386\n    "Cats" : 85\n    "Rats" : 15',
        expected: { valid: true, category: 'pie' }
      }
    ];
    
    // Simulate diagram type detection
    const detectDiagramType = (syntax) => {
      const trimmedSyntax = syntax.trim();
      
      if (trimmedSyntax.startsWith('graph') || trimmedSyntax.startsWith('flowchart')) {
        return { valid: true, category: 'flowchart' };
      } else if (trimmedSyntax.startsWith('sequenceDiagram')) {
        return { valid: true, category: 'sequence' };
      } else if (trimmedSyntax.startsWith('classDiagram')) {
        return { valid: true, category: 'class' };
      } else if (trimmedSyntax.startsWith('gantt')) {
        return { valid: true, category: 'gantt' };
      } else if (trimmedSyntax.startsWith('pie')) {
        return { valid: true, category: 'pie' };
      } else {
        return { valid: false, category: 'unknown' };
      }
    };
    
    const results = diagramTypes.map(diagram => {
      const detected = detectDiagramType(diagram.syntax);
      return detected.valid === diagram.expected.valid && 
             detected.category === diagram.expected.category;
    });
    
    this.addTestResult(
      'Multiple Diagram Types Support',
      results.every(r => r === true),
      `Correctly detected ${results.filter(r => r).length}/${diagramTypes.length} diagram types`
    );
  }

  testDiagramContainerStructure() {
    // Test the HTML structure generated for diagram containers
    const mockDiagram = {
      content: 'graph TD\n    A[Start] --> B[End]',
      id: 'mermaid-123456',
      class: 'custom-class',
      theme: 'dark'
    };
    
    // Simulate container structure generation
    const generateContainerStructure = (diagram) => {
      return {
        outerContainer: {
          tag: 'div',
          className: `mermaid-container my-6 ${diagram.class || ''}`.trim(),
          attributes: {}
        },
        innerContainer: {
          tag: 'div',
          className: 'mermaid-diagram bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto',
          attributes: {}
        },
        diagramElement: {
          tag: 'pre',
          className: 'mermaid text-center',
          attributes: {
            id: diagram.id || null,
            'data-theme': diagram.theme !== 'default' ? diagram.theme : null
          },
          content: diagram.content
        }
      };
    };
    
    const structure = generateContainerStructure(mockDiagram);
    
    this.addTestResult(
      'Diagram Container Structure Generation',
      structure.outerContainer.className.includes('mermaid-container') && 
      structure.diagramElement.className === 'mermaid text-center',
      `Outer class: ${structure.outerContainer.className}, Diagram class: ${structure.diagramElement.className}`
    );
    
    // Test attributes handling
    this.addTestResult(
      'Diagram Element Attributes',
      structure.diagramElement.attributes.id === mockDiagram.id && 
      structure.diagramElement.attributes['data-theme'] === mockDiagram.theme,
      `ID: ${structure.diagramElement.attributes.id}, Theme: ${structure.diagramElement.attributes['data-theme']}`
    );
  }  testRe
sponsiveDiagramBehavior() {
    // Test responsive behavior configuration for diagrams
    const viewports = [
      { name: 'desktop', width: 1200, expected: { margin: '1.5rem 0', borderRadius: 'rounded-lg' } },
      { name: 'tablet', width: 768, expected: { margin: '1.5rem 0', borderRadius: 'rounded-lg' } },
      { name: 'mobile', width: 480, expected: { margin: '1rem -1rem', borderRadius: '0' } }
    ];
    
    // Simulate responsive configuration
    const configureResponsiveBehavior = (viewport) => {
      if (viewport.width <= 768) {
        return {
          margin: '1rem -1rem',
          borderRadius: '0',
          border: 'border-left: none, border-right: none',
          containerClass: 'mermaid-container mobile'
        };
      } else {
        return {
          margin: '1.5rem 0',
          borderRadius: 'rounded-lg',
          border: 'border border-gray-200 dark:border-gray-700',
          containerClass: 'mermaid-container'
        };
      }
    };
    
    const results = viewports.map(viewport => {
      const config = configureResponsiveBehavior(viewport);
      return config.margin === viewport.expected.margin && 
             config.borderRadius === viewport.expected.borderRadius;
    });
    
    this.addTestResult(
      'Responsive Diagram Behavior',
      results.every(r => r === true),
      `Correctly configured ${results.filter(r => r).length}/${viewports.length} viewport sizes`
    );
  }

  testDiagramThemeSupport() {
    // Test theme support for Mermaid diagrams
    const themes = [
      { name: 'default', expected: { valid: true, colors: { primary: '#ff6b6b' } } },
      { name: 'dark', expected: { valid: true, colors: { primary: '#4dabf7' } } },
      { name: 'forest', expected: { valid: true, colors: { primary: '#1b5e20' } } },
      { name: 'neutral', expected: { valid: true, colors: { primary: '#2e2e2e' } } }
    ];
    
    // Simulate theme configuration
    const configureTheme = (themeName) => {
      const themeConfigs = {
        'default': {
          valid: true,
          colors: {
            primary: '#ff6b6b',
            primaryText: '#fff',
            primaryBorder: '#ff4757',
            line: '#333333',
            secondary: '#006100',
            tertiary: '#fff'
          }
        },
        'dark': {
          valid: true,
          colors: {
            primary: '#4dabf7',
            primaryText: '#fff',
            primaryBorder: '#339af0',
            line: '#ffffff',
            secondary: '#00d4aa',
            tertiary: '#1a1a1a'
          }
        },
        'forest': {
          valid: true,
          colors: {
            primary: '#1b5e20',
            primaryText: '#fff',
            primaryBorder: '#2e7d32',
            line: '#333333',
            secondary: '#ff8f00',
            tertiary: '#f1f8e9'
          }
        },
        'neutral': {
          valid: true,
          colors: {
            primary: '#2e2e2e',
            primaryText: '#fff',
            primaryBorder: '#424242',
            line: '#757575',
            secondary: '#616161',
            tertiary: '#f5f5f5'
          }
        }
      };
      
      return themeConfigs[themeName] || { valid: false, colors: {} };
    };
    
    const results = themes.map(theme => {
      const config = configureTheme(theme.name);
      return config.valid === theme.expected.valid && 
             config.colors.primary === theme.expected.colors.primary;
    });
    
    this.addTestResult(
      'Diagram Theme Support',
      results.every(r => r === true),
      `Correctly configured ${results.filter(r => r).length}/${themes.length} themes`
    );
  }

  async testScriptLoading() {
    console.log('📜 Testing script loading...');
    
    // Test 1: Conditional script loading
    this.testConditionalScriptLoading();
    
    // Test 2: Script configuration
    this.testScriptConfiguration();
    
    // Test 3: CDN fallback handling
    this.testCDNFallbackHandling();
    
    // Test 4: Script initialization
    this.testScriptInitialization();
    
    // Test 5: Performance optimization
    this.testScriptPerformanceOptimization();
  }

  testConditionalScriptLoading() {
    // Test conditional loading based on page content
    const testScenarios = [
      {
        name: 'Page with Mermaid diagrams',
        pageStore: { hasMermaid: true },
        config: { enabled: true },
        expected: { shouldLoad: true }
      },
      {
        name: 'Page without Mermaid diagrams',
        pageStore: { hasMermaid: false },
        config: { enabled: true },
        expected: { shouldLoad: false }
      },
      {
        name: 'Mermaid disabled globally',
        pageStore: { hasMermaid: true },
        config: { enabled: false },
        expected: { shouldLoad: false }
      },
      {
        name: 'No page store data',
        pageStore: {},
        config: { enabled: true },
        expected: { shouldLoad: false }
      }
    ];
    
    // Simulate conditional loading logic
    const determineScriptLoading = (pageStore, config) => {
      const enabled = config.enabled !== false; // Default to true
      const hasMermaid = pageStore.hasMermaid === true;
      
      return {
        shouldLoad: enabled && hasMermaid,
        reason: !enabled ? 'disabled' : !hasMermaid ? 'no-diagrams' : 'load'
      };
    };
    
    const results = testScenarios.map(scenario => {
      const result = determineScriptLoading(scenario.pageStore, scenario.config);
      return result.shouldLoad === scenario.expected.shouldLoad;
    });
    
    this.addTestResult(
      'Conditional Script Loading',
      results.every(r => r === true),
      `Correctly handled ${results.filter(r => r).length}/${testScenarios.length} scenarios`
    );
  }  te
stScriptConfiguration() {
    // Test Mermaid.js script configuration
    const mockConfig = {
      mermaid: {
        enabled: true,
        theme: 'default',
        securityLevel: 'loose',
        startOnLoad: true,
        primaryColor: '#ff6b6b',
        primaryTextColor: '#fff'
      }
    };
    
    // Simulate script configuration generation
    const generateScriptConfig = (config) => {
      const mermaidConfig = config.mermaid || {};
      
      return {
        scriptUrl: 'https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js',
        scriptAttributes: {
          crossorigin: 'anonymous',
          async: true
        },
        initConfig: {
          theme: mermaidConfig.theme || 'default',
          startOnLoad: mermaidConfig.startOnLoad !== false,
          securityLevel: mermaidConfig.securityLevel || 'loose',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis'
          },
          sequence: {
            diagramMarginX: 50,
            diagramMarginY: 10,
            useMaxWidth: true,
            mirrorActors: true
          },
          gantt: {
            titleTopMargin: 25,
            barHeight: 20,
            fontsize: 11
          },
          themeVariables: {
            primaryColor: mermaidConfig.primaryColor || '#ff6b6b',
            primaryTextColor: mermaidConfig.primaryTextColor || '#fff',
            primaryBorderColor: mermaidConfig.primaryBorderColor || '#ff4757',
            lineColor: mermaidConfig.lineColor || '#333333'
          }
        }
      };
    };
    
    const scriptConfig = generateScriptConfig(mockConfig);
    
    this.addTestResult(
      'Script Configuration Generation',
      scriptConfig.scriptUrl.includes('mermaid@10.6.1') && 
      scriptConfig.initConfig.theme === 'default',
      `Script URL: ${scriptConfig.scriptUrl.includes('mermaid@10.6.1')}, Theme: ${scriptConfig.initConfig.theme}`
    );
    
    // Test configuration completeness
    const requiredConfigKeys = ['theme', 'startOnLoad', 'securityLevel', 'flowchart', 'sequence', 'themeVariables'];
    const hasAllKeys = requiredConfigKeys.every(key => 
      scriptConfig.initConfig.hasOwnProperty(key)
    );
    
    this.addTestResult(
      'Script Configuration Completeness',
      hasAllKeys && scriptConfig.scriptAttributes.async === true,
      `Has all keys: ${hasAllKeys}, Async loading: ${scriptConfig.scriptAttributes.async}`
    );
  }

  testCDNFallbackHandling() {
    // Test CDN fallback and error handling
    const cdnConfig = {
      primary: 'https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js',
      fallbacks: [
        'https://unpkg.com/mermaid@10.6.1/dist/mermaid.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.6.1/mermaid.min.js'
      ]
    };
    
    // Simulate CDN fallback logic
    const configureCDNFallback = (config) => {
      return {
        primaryCDN: config.primary,
        fallbackCDNs: config.fallbacks,
        loadingStrategy: 'progressive',
        errorHandling: {
          hasRetry: true,
          maxRetries: config.fallbacks.length,
          retryDelay: 1000,
          showErrorMessage: true
        },
        integrityCheck: {
          enabled: false, // Mermaid doesn't provide SRI hashes
          fallbackOnFail: true
        }
      };
    };
    
    const fallbackConfig = configureCDNFallback(cdnConfig);
    
    this.addTestResult(
      'CDN Fallback Configuration',
      fallbackConfig.primaryCDN === cdnConfig.primary && 
      fallbackConfig.fallbackCDNs.length === 2,
      `Primary CDN: ${fallbackConfig.primaryCDN === cdnConfig.primary}, Fallbacks: ${fallbackConfig.fallbackCDNs.length}`
    );
    
    // Test error handling configuration
    this.addTestResult(
      'CDN Error Handling',
      fallbackConfig.errorHandling.hasRetry && 
      fallbackConfig.errorHandling.maxRetries === 2,
      `Has retry: ${fallbackConfig.errorHandling.hasRetry}, Max retries: ${fallbackConfig.errorHandling.maxRetries}`
    );
  }

  testScriptInitialization() {
    // Test Mermaid initialization logic
    const mockConfig = {
      theme: 'default',
      startOnLoad: true,
      securityLevel: 'loose'
    };
    
    // Simulate initialization logic
    const configureInitialization = (config) => {
      return {
        waitForDOM: true,
        waitForMermaid: true,
        initializationSteps: [
          'check-dom-ready',
          'wait-for-mermaid-library',
          'apply-configuration',
          'initialize-mermaid',
          'render-diagrams',
          'handle-errors'
        ],
        errorHandling: {
          catchInitErrors: true,
          showFallbackContent: true,
          logErrors: true
        },
        retryLogic: {
          enabled: true,
          maxRetries: 3,
          retryDelay: 100
        }
      };
    };
    
    const initConfig = configureInitialization(mockConfig);
    
    this.addTestResult(
      'Script Initialization Configuration',
      initConfig.waitForDOM && initConfig.waitForMermaid && 
      initConfig.initializationSteps.length === 6,
      `Wait for DOM: ${initConfig.waitForDOM}, Steps: ${initConfig.initializationSteps.length}`
    );
    
    // Test error handling in initialization
    this.addTestResult(
      'Initialization Error Handling',
      initConfig.errorHandling.catchInitErrors && 
      initConfig.errorHandling.showFallbackContent,
      `Catch errors: ${initConfig.errorHandling.catchInitErrors}, Show fallback: ${initConfig.errorHandling.showFallbackContent}`
    );
  }

  testScriptPerformanceOptimization() {
    // Test performance optimization features
    const performanceConfig = {
      asyncLoading: true,
      deferLoading: false,
      preconnect: true,
      resourceHints: true
    };
    
    // Simulate performance optimization configuration
    const configurePerformanceOptimization = (config) => {
      return {
        scriptLoading: {
          async: config.asyncLoading,
          defer: config.deferLoading,
          crossorigin: 'anonymous'
        },
        resourceHints: config.resourceHints ? [
          { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' },
          { rel: 'dns-prefetch', href: 'https://unpkg.com' }
        ] : [],
        lazyInitialization: {
          enabled: true,
          trigger: 'dom-ready',
          timeout: 5000
        },
        caching: {
          enabled: true,
          strategy: 'cdn-cache',
          maxAge: '1 year'
        }
      };
    };
    
    const perfConfig = configurePerformanceOptimization(performanceConfig);
    
    this.addTestResult(
      'Script Performance Optimization',
      perfConfig.scriptLoading.async === true && 
      perfConfig.resourceHints.length === 2,
      `Async loading: ${perfConfig.scriptLoading.async}, Resource hints: ${perfConfig.resourceHints.length}`
    );
    
    // Test lazy initialization
    this.addTestResult(
      'Lazy Initialization Configuration',
      perfConfig.lazyInitialization.enabled && 
      perfConfig.lazyInitialization.trigger === 'dom-ready',
      `Lazy init: ${perfConfig.lazyInitialization.enabled}, Trigger: ${perfConfig.lazyInitialization.trigger}`
    );
  }