# Configuration Examples

This document provides practical configuration examples for different use cases and scenarios.

## Table of Contents

- [Basic Blog Setup](#basic-blog-setup)
- [Commercial Website](#commercial-website)
- [Privacy-Focused Site](#privacy-focused-site)
- [High-Performance Setup](#high-performance-setup)
- [Development Environment](#development-environment)
- [Multi-language Site](#multi-language-site)
- [Documentation Site](#documentation-site)
- [E-commerce Integration](#e-commerce-integration)

## Basic Blog Setup

Perfect for personal blogs with basic analytics and minimal advertising.

```toml
# hugo.toml
baseURL = "https://myblog.com"
languageCode = "en-us"
title = "My Personal Blog"

# Basic Google Analytics
GoogleAnalyticsID = "G-JKSVCT23D1"

[params]
  # Enable Mermaid for technical diagrams
  [params.mermaid]
    enabled = true
    theme = "default"
  
  # Basic privacy settings
  [params.privacy]
    respectDoNotTrack = true
    cookieConsent = false
    anonymizeIP = true
  
  # Performance optimization
  [params.performance]
    lazyLoadAds = true
    asyncScripts = true
```

## Commercial Website

Full-featured setup for business websites with comprehensive tracking and advertising.

```toml
# hugo.toml
baseURL = "https://mycompany.com"
languageCode = "en-us"
title = "My Company"

# Google Analytics for business insights
GoogleAnalyticsID = "G-BUSINESS123"

[params]
  # Google AdSense for monetization
  [params.adsense]
    enabled = true
    client = "ca-pub-1234567890123456"
    inArticleSlot = "1234567890"
    autoAds = true
    
    [params.adsense.placements]
      header = false
      sidebar = true
      footer = true
      inContent = true
      beforeContent = false
      afterContent = true
  
  # Facebook Pixel for advertising
  [params.facebookPixel]
    enabled = true
    pixelId = "123456789012345"
    advancedMatching = true
    
    [params.facebookPixel.events]
      pageView = true
      viewContent = true
      search = true
      contact = true
      lead = true
  
  # Google Custom Search
  [params.gcs_engine_id]
    value = "3164aa570fbbb474a"
  
  # Mermaid for business diagrams
  [params.mermaid]
    enabled = true
    theme = "neutral"
  
  # Privacy compliance
  [params.privacy]
    respectDoNotTrack = true
    cookieConsent = true
    anonymizeIP = true
    
    [params.privacy.consentBanner]
      enabled = true
      message = "We use cookies to improve your experience and for marketing purposes."
      acceptText = "Accept All"
      declineText = "Decline"
      learnMoreText = "Privacy Policy"
      learnMoreUrl = "/privacy-policy"
  
  # Performance optimization
  [params.performance]
    lazyLoadAds = true
    asyncScripts = true
    resourceHints = true
    
    preconnectDomains = [
      "https://www.googletagmanager.com",
      "https://pagead2.googlesyndication.com",
      "https://connect.facebook.net",
      "https://cse.google.com"
    ]
  
  # Security settings
  [params.security]
    httpsOnly = true
    noSniff = true
```

## Privacy-Focused Site

Minimal tracking with strong privacy protections, ideal for privacy-conscious organizations.

```toml
# hugo.toml
baseURL = "https://privacyfirst.org"
languageCode = "en-us"
title = "Privacy First Organization"

# No Google Analytics - privacy first!
# GoogleAnalyticsID = ""

[params]
  # No advertising
  [params.adsense]
    enabled = false
  
  # No Facebook tracking
  [params.facebookPixel]
    enabled = false
  
  # Local search only
  [params.gcs_engine_id]
    value = ""
  
  # Mermaid for diagrams (privacy-friendly)
  [params.mermaid]
    enabled = true
    theme = "default"
  
  # Strong privacy settings
  [params.privacy]
    respectDoNotTrack = true
    cookieConsent = true
    anonymizeIP = true
    disableTracking = false  # Allow minimal tracking if consented
    
    [params.privacy.consentBanner]
      enabled = true
      message = "This site respects your privacy. We only use essential cookies."
      acceptText = "Accept Essential"
      declineText = "Decline All"
      learnMoreText = "Privacy Policy"
      learnMoreUrl = "/privacy-policy"
  
  # Performance without tracking
  [params.performance]
    lazyLoadAds = false  # No ads to lazy load
    asyncScripts = true
    resourceHints = false  # No external tracking domains
    criticalCSS = true
  
  # Enhanced security
  [params.security]
    contentSecurityPolicy = true
    subresourceIntegrity = true
    httpsOnly = true
    noSniff = true

# Privacy-focused Hugo settings
[privacy]
  [privacy.googleAnalytics]
    respectDoNotTrack = true
    anonymizeIP = true
  [privacy.youtube]
    privacyEnhanced = true
```

## High-Performance Setup

Optimized for speed and Core Web Vitals compliance.

```toml
# hugo.toml
baseURL = "https://fastsite.com"
languageCode = "en-us"
title = "Lightning Fast Site"

# Minimal analytics
GoogleAnalyticsID = "G-PERFORMANCE1"

[params]
  # Selective advertising with performance focus
  [params.adsense]
    enabled = true
    client = "ca-pub-9876543210987654"
    autoAds = false  # Manual control for better performance
    
    [params.adsense.placements]
      header = false
      sidebar = false
      footer = true  # Only footer ads
      inContent = false
      beforeContent = false
      afterContent = false
  
  # No Facebook Pixel for better performance
  [params.facebookPixel]
    enabled = false
  
  # Local search for speed
  [params.gcs_engine_id]
    value = ""
  
  # Mermaid with performance settings
  [params.mermaid]
    enabled = true
    theme = "default"
    startOnLoad = false  # Manual initialization
  
  # Basic privacy
  [params.privacy]
    respectDoNotTrack = true
    cookieConsent = false  # Reduce banner impact
    anonymizeIP = true
  
  # Maximum performance optimization
  [params.performance]
    lazyLoadAds = true
    asyncScripts = true
    resourceHints = true
    criticalCSS = true
    
    preconnectDomains = [
      "https://www.googletagmanager.com",
      "https://pagead2.googlesyndication.com"
    ]
  
  # Security without performance impact
  [params.security]
    httpsOnly = true
    noSniff = true
    contentSecurityPolicy = false  # Can impact performance
    subresourceIntegrity = false   # Can impact performance

# Hugo performance settings
[caches]
  [caches.getjson]
    maxAge = "10m"
  [caches.getcsv]
    maxAge = "10m"
  [caches.images]
    maxAge = "1h"
```

## Development Environment

Configuration for local development and testing.

```toml
# hugo.toml
baseURL = "http://localhost:1313"
languageCode = "en-us"
title = "Development Site"

# No analytics in development
# GoogleAnalyticsID = ""

[params]
  # Disabled advertising in development
  [params.adsense]
    enabled = false
  
  # Disabled tracking in development
  [params.facebookPixel]
    enabled = false
  
  # Local search only
  [params.gcs_engine_id]
    value = ""
  
  # Mermaid for testing diagrams
  [params.mermaid]
    enabled = true
    theme = "default"
  
  # Development-friendly privacy
  [params.privacy]
    respectDoNotTrack = false
    cookieConsent = false
    anonymizeIP = false
  
  # Development performance settings
  [params.performance]
    lazyLoadAds = false
    asyncScripts = false  # Easier debugging
    resourceHints = false
    criticalCSS = false
  
  # Relaxed security for development
  [params.security]
    contentSecurityPolicy = false
    subresourceIntegrity = false
    httpsOnly = false
    noSniff = false

# Development Hugo settings
[server]
  [[server.headers]]
    for = "/**"
    [server.headers.values]
      X-Frame-Options = "DENY"
      X-XSS-Protection = "1; mode=block"
```

## Multi-language Site

Configuration for international websites with multiple languages.

```toml
# hugo.toml
baseURL = "https://global-site.com"
defaultContentLanguage = "en"
defaultContentLanguageInSubdir = true

# Global Google Analytics
GoogleAnalyticsID = "G-GLOBAL12345"

[languages]
  [languages.en]
    languageName = "English"
    weight = 1
    title = "Global Company"
  
  [languages.es]
    languageName = "Español"
    weight = 2
    title = "Empresa Global"
  
  [languages.fr]
    languageName = "Français"
    weight = 3
    title = "Entreprise Mondiale"

[params]
  # Global AdSense configuration
  [params.adsense]
    enabled = true
    client = "ca-pub-5555555555555555"
    autoAds = true
  
  # Facebook Pixel for global campaigns
  [params.facebookPixel]
    enabled = true
    pixelId = "555555555555555"
    
    [params.facebookPixel.events]
      pageView = true
      viewContent = true
      search = true
  
  # Language-specific search engines
  [params.gcs_engine_id]
    value = "global1234567890abc"
  
  # Mermaid with international support
  [params.mermaid]
    enabled = true
    theme = "neutral"
  
  # GDPR-compliant privacy settings
  [params.privacy]
    respectDoNotTrack = true
    cookieConsent = true
    anonymizeIP = true
    
    [params.privacy.consentBanner]
      enabled = true
      # Messages will be localized in i18n files
      message = "cookie_consent_message"
      acceptText = "accept"
      declineText = "decline"
      learnMoreText = "learn_more"
      learnMoreUrl = "/privacy-policy"
  
  # Performance optimization
  [params.performance]
    lazyLoadAds = true
    asyncScripts = true
    resourceHints = true
```

## Documentation Site

Optimized for technical documentation with diagrams and search.

```toml
# hugo.toml
baseURL = "https://docs.company.com"
languageCode = "en-us"
title = "Company Documentation"

# Analytics for documentation insights
GoogleAnalyticsID = "G-DOCS1234567"

[params]
  # No advertising on documentation
  [params.adsense]
    enabled = false
  
  # No Facebook tracking for docs
  [params.facebookPixel]
    enabled = false
  
  # Enhanced search for documentation
  [params.gcs_engine_id]
    value = "docs1234567890abcdef"
  
  [params.googleCustomSearch]
    engineId = "docs1234567890abcdef"
    enabled = true
    autoComplete = true
    enableHistory = true
    maxCompletions = 10
    fallbackToLocal = true
  
  # Mermaid for technical diagrams
  [params.mermaid]
    enabled = true
    theme = "neutral"
    
    [params.mermaid.flowchart]
      useMaxWidth = true
      htmlLabels = true
  
  # Privacy for enterprise
  [params.privacy]
    respectDoNotTrack = true
    cookieConsent = false  # Internal docs
    anonymizeIP = true
  
  # Performance for documentation
  [params.performance]
    lazyLoadAds = false  # No ads
    asyncScripts = true
    resourceHints = true
    criticalCSS = true
  
  # Security for enterprise
  [params.security]
    contentSecurityPolicy = true
    subresourceIntegrity = true
    httpsOnly = true
    noSniff = true
```

## E-commerce Integration

Configuration for online stores with comprehensive tracking.

```toml
# hugo.toml
baseURL = "https://mystore.com"
languageCode = "en-us"
title = "My Online Store"

# Enhanced ecommerce tracking
GoogleAnalyticsID = "G-ECOM1234567"

[params]
  # Strategic ad placement for e-commerce
  [params.adsense]
    enabled = true
    client = "ca-pub-7777777777777777"
    autoAds = false  # Manual control for e-commerce
    
    [params.adsense.placements]
      header = false
      sidebar = true
      footer = false
      inContent = false
      beforeContent = false
      afterContent = true
  
  # Facebook Pixel for e-commerce tracking
  [params.facebookPixel]
    enabled = true
    pixelId = "777777777777777"
    advancedMatching = true
    
    [params.facebookPixel.events]
      pageView = true
      viewContent = true
      search = true
      contact = true
      lead = true
      completeRegistration = true
  
  # Product search integration
  [params.gcs_engine_id]
    value = "store1234567890abcdef"
  
  # Mermaid for process diagrams
  [params.mermaid]
    enabled = true
    theme = "base"
  
  # E-commerce privacy compliance
  [params.privacy]
    respectDoNotTrack = true
    cookieConsent = true
    anonymizeIP = false  # Need accurate location for shipping
    
    [params.privacy.consentBanner]
      enabled = true
      message = "We use cookies to enhance your shopping experience and for marketing."
      acceptText = "Accept All"
      declineText = "Essential Only"
      learnMoreText = "Cookie Policy"
      learnMoreUrl = "/cookie-policy"
  
  # E-commerce performance optimization
  [params.performance]
    lazyLoadAds = true
    asyncScripts = true
    resourceHints = true
    
    preconnectDomains = [
      "https://www.googletagmanager.com",
      "https://pagead2.googlesyndication.com",
      "https://connect.facebook.net",
      "https://cse.google.com",
      "https://checkout.stripe.com",
      "https://js.stripe.com"
    ]
  
  # E-commerce security
  [params.security]
    contentSecurityPolicy = true
    subresourceIntegrity = true
    httpsOnly = true
    noSniff = true

# E-commerce specific privacy settings
[privacy]
  [privacy.googleAnalytics]
    respectDoNotTrack = true
    anonymizeIP = false  # Need location data for e-commerce
  [privacy.youtube]
    privacyEnhanced = true
```

## Configuration Validation

All configurations above will be automatically validated by the theme's configuration validation system. The system will:

1. **Validate ID Formats**: Ensure all tracking IDs follow the correct format
2. **Check Required Fields**: Warn if enabled services are missing required configuration
3. **Privacy Compliance**: Suggest privacy settings based on enabled tracking
4. **Performance Optimization**: Recommend performance improvements
5. **Security Best Practices**: Highlight security considerations

### Example Validation Output

```
Theme Analytics Enhancement: Enabled services: Google Analytics, AdSense, Facebook Pixel, Google Custom Search, Mermaid Diagrams
WARNING: Analytics tracking is enabled but cookie consent is disabled. Consider enabling params.privacy.cookieConsent for GDPR compliance.
INFO: AdSense lazy loading is enabled for better performance.
```

## Testing Your Configuration

1. **Development Testing**: Use the development environment configuration for local testing
2. **Staging Validation**: Test with real IDs in a staging environment
3. **Privacy Testing**: Verify Do Not Track and cookie consent functionality
4. **Performance Testing**: Check Core Web Vitals with your configuration
5. **Cross-browser Testing**: Ensure compatibility across different browsers

## Migration from Existing Configurations

If you're migrating from an existing setup:

1. **Backup Current Configuration**: Save your current `hugo.toml`
2. **Gradual Migration**: Enable features one at a time
3. **Test Each Feature**: Verify functionality after each addition
4. **Monitor Performance**: Check that performance remains acceptable
5. **Update Privacy Policy**: Ensure your privacy policy reflects new tracking