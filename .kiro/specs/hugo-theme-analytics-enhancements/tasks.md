# Implementation Plan

- [x] 1. Set up analytics and tracking infrastructure
  - Create directory structure for analytics, advertising, search, and diagram partials
  - Define configuration schema and validation helpers
  - Implement privacy and consent management foundation
  - _Requirements: 1.1, 6.1, 7.1, 8.1_

- [x] 2. Implement Google Analytics 4 integration
  - [x] 2.1 Create Google Analytics partial template
    - Write `layouts/partials/analytics/google-analytics.html` with GA4 tracking code
    - Implement Do Not Track respect and privacy settings
    - Add configuration validation and error handling
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 2.2 Create analytics manager partial
    - Write `layouts/partials/analytics/analytics-manager.html` to coordinate all tracking services
    - Implement conditional loading based on configuration
    - Add performance optimization for script loading
    - _Requirements: 1.1, 8.2, 8.5_

  - [x] 2.3 Write unit tests for analytics configuration
    - Create tests for configuration parsing and validation
    - Test privacy settings and Do Not Track functionality
    - _Requirements: 1.1, 1.2_

- [x] 3. Implement Facebook Pixel integration
  - [x] 3.1 Create Facebook Pixel partial template
    - Write `layouts/partials/analytics/facebook-pixel.html` with pixel tracking code
    - Implement standard and custom event tracking
    - Add privacy compliance and consent management
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 3.2 Integrate Facebook Pixel with analytics manager
    - Add Facebook Pixel to the analytics coordination system
    - Implement event tracking for page views and interactions
    - Add configuration options for custom events
    - _Requirements: 7.2, 7.3_

  - [x] 3.3 Write unit tests for Facebook Pixel functionality
    - Test pixel initialization and event tracking
    - Validate privacy settings and GDPR compliance
    - _Requirements: 7.1, 7.5_

- [x] 4. Implement Google AdSense integration
  - [x] 4.1 Create AdSense head partial
    - Write `layouts/partials/advertising/adsense-head.html` for script loading
    - Implement auto ads and manual ad configuration
    - Add async loading and performance optimization
    - _Requirements: 2.1, 2.4, 8.1_

  - [x] 4.2 Create dynamic ad placement system
    - Write `layouts/partials/advertising/adsense-display.html` for ad rendering
    - Implement responsive ad units and placement options
    - Add lazy loading for below-the-fold advertisements
    - _Requirements: 2.2, 2.3, 2.5, 8.3_

  - [x] 4.3 Create ad manager partial
    - Write `layouts/partials/advertising/ad-manager.html` to coordinate ad placements
    - Implement configuration-driven ad positioning
    - Add fallback handling for disabled ads
    - _Requirements: 2.1, 2.4, 6.2_

  - [x] 4.4 Write unit tests for AdSense integration
    - Test ad placement and responsive behavior
    - Validate configuration options and fallbacks
    - _Requirements: 2.1, 2.5_

- [x] 5. Implement Google Custom Search Engine integration
  - [x] 5.1 Create Google Custom Search partial
    - Write `layouts/partials/search/google-custom-search.html` for search widget
    - Implement search engine configuration and customization
    - Add fallback to local search when GCS is unavailable
    - _Requirements: 3.1, 3.2, 3.4_

  - [x] 5.2 Create search widget component
    - Write `layouts/partials/search/search-widget.html` for unified search interface
    - Implement responsive design and accessibility features
    - Add search result styling and layout consistency
    - _Requirements: 3.3, 3.5_

  - [x] 5.3 Write unit tests for search functionality
    - Test Google Custom Search integration
    - Validate fallback to local search
    - _Requirements: 3.1, 3.4_

- [x] 6. Implement Mermaid.js diagram support
  - [x] 6.1 Create Mermaid render hook
    - Write `layouts/_render-hooks/render-codeblock-mermaid.html` for code block rendering
    - Implement automatic diagram detection and rendering
    - Add page store integration for conditional script loading
    - _Requirements: 4.1, 4.4_

  - [x] 6.2 Create Mermaid shortcode
    - Write `layouts/_shortcodes/mermaid.html` for explicit diagram embedding
    - Implement shortcode parameter handling and validation
    - Add consistent styling with render hook output
    - _Requirements: 5.2, 5.3_

  - [x] 6.3 Create Mermaid loader partial
    - Write `layouts/partials/diagrams/mermaid-loader.html` for conditional script loading
    - Implement theme configuration and initialization
    - Add support for all standard Mermaid diagram types
    - _Requirements: 4.2, 4.3, 4.4_

  - [x] 6.4 Write unit tests for Mermaid integration
    - Test diagram rendering and script loading
    - Validate shortcode and render hook functionality
    - _Requirements: 4.1, 4.3_

- [x] 7. Implement enhanced shortcode system
  - [x] 7.1 Verify Hugo built-in shortcode compatibility    
    - Test youtube, vimeo, twitter, instagram, and gist shortcodes
    - Ensure consistent styling with theme design
    - Add privacy settings integration for social media shortcodes
    - _Requirements: 5.1, 5.3, 5.4_

  - [x] 7.2 Create shortcode documentation and examples
    - Write documentation for all supported shortcodes
    - Create example usage in content files
    - Add troubleshooting guide for shortcode issues
    - _Requirements: 5.5_

  - [x] 7.3 Write unit tests for shortcode system
    - Test built-in shortcode rendering and styling
    - Validate privacy settings integration
    - _Requirements: 5.1, 5.4_

- [x] 8. Implement configuration management system
  - [x] 8.1 Create configuration validation helpers
    - Write helper functions for validating analytics and advertising configuration
    - Implement default value handling and error messaging
    - Add configuration documentation and examples
    - _Requirements: 6.1, 6.4, 6.5_

  - [x] 8.2 Update theme configuration files
    - Update `hugo.toml` with new parameter sections
    - Add example configurations for all new features
    - Document configuration options and their effects
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 8.3 Create privacy and consent management
    - Implement GDPR compliance helpers and cookie consent integration
    - Add privacy policy template and documentation
    - Create user consent management for tracking services
    - _Requirements: 6.3, 7.5, 8.1_

  - [x] 8.4 Write unit tests for configuration management
    - Test configuration parsing and validation
    - Validate privacy settings and consent management
    - _Requirements: 6.1, 6.4_

- [x] 9. Implement performance optimization features
  - [x] 9.1 Create async script loading system
    - Implement asynchronous loading for all external scripts
    - Add resource hints and preconnect directives
    - Optimize script loading order and dependencies
    - _Requirements: 8.1, 8.2_

  - [x] 9.2 Implement lazy loading for advertisements
    - Add Intersection Observer API for below-the-fold ad loading
    - Implement progressive enhancement for ad display
    - Add fallback for browsers without Intersection Observer support
    - _Requirements: 8.3, 8.4_

  - [x] 9.3 Create performance monitoring helpers
    - Add Core Web Vitals measurement and reporting
    - Implement performance budget validation
    - Create performance optimization documentation
    - _Requirements: 8.5_

  - [x] 9.4 Write performance tests
    - Test script loading performance and optimization
    - Validate Core Web Vitals compliance
    - _Requirements: 8.1, 8.5_

- [x] 10. Update theme templates and layouts
  - [x] 10.1 Update base template with new partials
    - Modify `layouts/_default/baseof.html` to include analytics and advertising partials
    - Add conditional loading based on configuration
    - Ensure proper placement of head and body scripts
    - _Requirements: 1.1, 2.1, 7.1_

  - [x] 10.2 Update content templates for ad placement
    - Modify `layouts/_default/single.html` for in-article ad placement
    - Update `layouts/_default/list.html` for category and tag page ads
    - Add sidebar and footer ad placement options
    - _Requirements: 2.2, 2.3_

  - [x] 10.3 Update search templates
    - Modify search page templates to use Google Custom Search
    - Add search widget to header and sidebar templates
    - Ensure responsive design and accessibility compliance
    - _Requirements: 3.1, 3.3, 3.5_

  - [x] 10.4 Write integration tests for template updates
    - Test template rendering with new partials
    - Validate ad placement and search integration
    - _Requirements: 1.1, 2.2, 3.1_

- [x] 11. Create documentation and examples
  - [x] 11.1 Write comprehensive configuration documentation
    - Document all new configuration parameters and options
    - Create step-by-step setup guides for each service
    - Add troubleshooting section for common issues
    - _Requirements: 6.1, 6.4, 6.5_

  - [x] 11.2 Create example content and demonstrations
    - Add example blog posts with Mermaid diagrams
    - Create sample configurations for different use cases
    - Add privacy policy and cookie consent examples
    - _Requirements: 4.1, 5.1, 6.3_

  - [x] 11.3 Update theme README and documentation
    - Update main README with new features and capabilities
    - Add migration guide for existing theme users
    - Create feature comparison and compatibility matrix
    - _Requirements: 5.5, 6.5_

- [x] 12. Final integration and testing
  - [x] 12.1 Integrate all components in example site
    - Configure example site with all new features enabled
    - Test complete functionality in realistic environment
    - Validate performance and accessibility compliance
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 7.1_

  - [x] 12.2 Perform cross-browser and device testing
    - Test functionality across modern browsers and devices
    - Validate responsive behavior and mobile compatibility
    - Ensure graceful degradation for older browsers
    - _Requirements: 2.5, 3.5, 4.5, 8.4_

  - [x] 12.3 Validate privacy compliance and security
    - Test GDPR compliance and cookie consent functionality
    - Validate Content Security Policy compatibility
    - Ensure secure handling of all external resources
    - _Requirements: 6.3, 7.5, 8.1_

  - [x] 12.4 Write comprehensive integration tests
    - Test complete feature integration and interaction
    - Validate performance under realistic load conditions
    - _Requirements: 8.5_