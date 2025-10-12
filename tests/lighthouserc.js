/**
 * Lighthouse CI Configuration
 * Performance testing with Core Web Vitals
 */

module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:1313/',
        'http://localhost:1313/blog/',
        'http://localhost:1313/categories/',
        'http://localhost:1313/tags/',
        'http://localhost:1313/about/'
      ],
      startServerCommand: 'cd ../exampleSite && hugo server --port 1313 --disableFastRender',
      startServerReadyPattern: 'Web Server is available',
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless',
        preset: 'desktop',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.90 }],
        'categories:best-practices': ['error', { minScore: 0.85 }],
        'categories:seo': ['error', { minScore: 0.90 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        
        // Additional performance metrics
        'speed-index': ['error', { maxNumericValue: 3000 }],
        'interactive': ['error', { maxNumericValue: 3500 }],
        
        // Accessibility checks
        'color-contrast': 'error',
        'heading-order': 'error',
        'html-has-lang': 'error',
        'image-alt': 'error',
        'link-name': 'error',
        
        // SEO checks
        'document-title': 'error',
        'meta-description': 'error',
        'robots-txt': 'warn',
        'canonical': 'warn'
      }
    },
    upload: {
      target: 'filesystem',
      outputDir: './reports/lighthouse'
    },
    server: {
      port: 9001,
      storage: './reports/lighthouse'
    }
  }
};