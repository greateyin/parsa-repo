# Configuration Examples

This document provides real-world configuration examples for different types of websites and use cases.

## Table of Contents

- [Personal Blog](#personal-blog)
- [Business Website](#business-website)
- [Documentation Site](#documentation-site)
- [News/Magazine Site](#newsmagazine-site)
- [E-commerce Blog](#e-commerce-blog)
- [Privacy-Focused Site](#privacy-focused-site)
- [High-Traffic Site](#high-traffic-site)
- [Development Environment](#development-environment)

## Personal Blog

Configuration for a personal blog with basic analytics and minimal advertising.

```toml
# hugo.toml - Personal Blog Configuration
baseURL = "https://myblog.com"
languageCode = "en-us"
title = "My Personal Blog"
theme = "parsa-redesigned"

# Basic Google Analytics
GoogleAnalyticsID = "G-JKSVCT23D1"

[params]
  # Site information
  description = "Personal thoughts and experiences"
  author = "John Doe"
  
  # Minimal AdSense (optional)
  [params.adsense]
    enabled = false  # Disable for personal blog
    
  # No Facebook Pixel for personal use
  [params.facebookPixel]
    enabled = false
    
  # Enable Mermaid for technical posts
  [params.mermaid]
    enabled = true
    theme = "default"
    
  # Privacy-first approach
  [params.privacy]
    respectDoNotTrack = true
    cookieConsent = false  # Simple setup
    anonymizeIP = true
    
  # Basic performance optimization
  [params.performance]
    lazyLoadAds = false  # No ads to lazy load
    asyncScripts = true
    resourceHints = true

# Privacy settings for GA
[privacy.googleAnalytics]
  respectDoNotTrack = true
  anonymizeIP = true
```

## Business Website

Configuration for a business website with comprehensive tracking and advertising.

```toml
# hugo.toml - Business Website Configuration
baseURL = "https://mybusiness.com"
languageCode = "en-us"
title = "My Business - Professional Services"
theme = "parsa-redesigned"

# Google Analytics for business insights
GoogleAnalyticsID = "G-BUSINESSID123"

[params]
  # Business information
  description = "Professional services and business solutions"
  author = "Business Name"
  
  # Full AdSense integration
  [params.adsense]
    enabled = true
    client = "ca-pub-1234567890123456"
    inArticleSlot = "1234567890"
    autoAds = false
    responsive = true
    lazyLoad = true
    
    [params.adsense.placements]
      sidebar = true
      footer = true
      inContent = true
      afterContent = true
      
    [params.adsense.slots]
      sidebar = "1234567891"
      footer = "1234567892"
      afterContent = "1234567893"
      
  # Facebook Pixel for marketing
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
    value = "1234567890abcdef1"
    
  # Mermaid for business processes
  [params.mermaid]
    enabled = true
    theme = "neutral"
    
  # GDPR compliance
  [params.privacy]
    respectDoNotTrack = true
    cookieConsent = true
    anonymizeIP = true
    
    [params.privacy.consentBanner]
      enabled = true
      message = "We use cookies to improve your experience and analyze site usage."
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
      "https://connect.facebook.net"
    ]

# Privacy settings
[privacy.googleAnalytics]
  respectDoNotTrack = true
  anonymizeIP = true
```

## Documentation Site

Configuration for a technical documentation site with diagrams and search.

```toml
# hugo.toml - Documentation Site Configuration
baseURL = "https://docs.myproject.com"
languageCode = "en-us"
title = "Project Documentation"
theme = "parsa-redesigned"

# Minimal analytics for docs
GoogleAnalyticsID = "G-DOCSANALYTICS"

[params]
  # Documentation information
  description = "Comprehensive project documentation"
  author = "Development Team"
  
  # No advertising on documentation
  [params.adsense]
    enabled = false
    
  # No Facebook Pixel for docs
  [params.facebookPixel]
    enabled = false
    
  # Enhanced search for documentation
  [params.gcs_engine_id]
    value = "docs1234567890abc"
    
  [params.googleCustomSearch]
    engineId = "docs1234567890abc"
    enabled = true
    autoComplete = true
    enableHistory = true
    maxCompletions = 8
    fallbackToLocal = true
    placeholder = "Search documentation..."
    
  # Extensive Mermaid support
  [params.mermaid]
    enabled = true
    theme = "neutral"
    startOnLoad = true
    securityLevel = "loose"
    
    [params.mermaid.flowchart]
      useMaxWidth = true
      htmlLabels = true
      curve = "basis"
      
    [params.mermaid.sequence]
      diagramMarginX = 50
      diagramMarginY = 10
      
  # Minimal privacy requirements
  [params.privacy]
    respectDoNotTrack = true
    cookieConsent = false  # Docs don't need consent
    anonymizeIP = true
    
  # Performance for documentation
  [params.performance]
    lazyLoadAds = false
    asyncScripts = true
    resourceHints = true
    criticalCSS = true  # Faster loading for docs

# Privacy settings
[privacy.googleAnalytics]
  respectDoNotTrack = true
  anonymizeIP = true
  disable = false
```

## News/Magazine Site

Configuration for a news or magazine site with comprehensive tracking.

```toml
# hugo.toml - News/Magazine Site Configuration
baseURL = "https://mynews.com"
languageCode = "en-us"
title = "Daily News Magazine"
theme = "parsa-redesigned"

# Analytics for news site
GoogleAnalyticsID = "G-NEWSSITE12345"

[params]
  # News site information
  description = "Latest news and current events"
  author = "Editorial Team"
  
  # Comprehensive AdSense setup
  [params.adsense]
    enabled = true
    client = "ca-pub-9876543210987654"
    inArticleSlot = "9876543210"
    autoAds = true  # Good for news sites
    responsive = true
    lazyLoad = true
    
    [params.adsense.placements]
      header = true
      sidebar = true
      footer = true
      inContent = true
      beforeContent = true
      afterContent = true
      
  # Facebook Pixel for social media
  [params.facebookPixel]
    enabled = true
    pixelId = "987654321098765"
    advancedMatching = true
    
    [params.facebookPixel.events]
      pageView = true
      viewContent = true
      search = true
      
  # Search for news articles
  [params.gcs_engine_id]
    value = "news567890abcdef1"
    
  # Limited Mermaid (not common in news)
  [params.mermaid]
    enabled = false
    
  # GDPR compliance for news
  [params.privacy]
    respectDoNotTrack = true
    cookieConsent = true
    anonymizeIP = true
    
    [params.privacy.consentBanner]
      enabled = true
      message = "We use cookies for analytics and advertising. By continuing, you agree to our cookie policy."
      acceptText = "Accept"
      declineText = "Manage Preferences"
      learnMoreText = "Cookie Policy"
      learnMoreUrl = "/cookie-policy"
      position = "bottom"
      
  # High-performance settings
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
    
    [params.performance.lazyLoading]
      images = true
      iframes = true
      ads = true
      threshold = "100px"

# Privacy settings
[privacy.googleAnalytics]
  respectDoNotTrack = true
  anonymizeIP = true
```

## E-commerce Blog

Configuration for an e-commerce blog with conversion tracking.

```toml
# hugo.toml - E-commerce Blog Configuration
baseURL = "https://blog.mystore.com"
languageCode = "en-us"
title = "Store Blog - Product Reviews & Tips"
theme = "parsa-redesigned"

# Enhanced analytics for e-commerce
GoogleAnalyticsID = "G-ECOMMERCE123"

[params]
  # E-commerce blog information
  description = "Product reviews, shopping tips, and lifestyle content"
  author = "Store Team"
  
  # Strategic AdSense placement
  [params.adsense]
    enabled = true
    client = "ca-pub-5555666677778888"
    inArticleSlot = "5555666677"
    autoAds = false  # Manual control for e-commerce
    responsive = true
    lazyLoad = true
    
    [params.adsense.placements]
      sidebar = true
      footer = false  # Avoid competing with store CTA
      inContent = true
      afterContent = true
      
  # Comprehensive Facebook Pixel
  [params.facebookPixel]
    enabled = true
    pixelId = "555566667777888"
    advancedMatching = true
    
    [params.facebookPixel.events]
      pageView = true
      viewContent = true
      search = true
      contact = true
      lead = true
      addToCart = true  # E-commerce specific
      initiateCheckout = true
      purchase = true
      
  # Product search capability
  [params.gcs_engine_id]
    value = "shop1234567890abc"
    
  # Mermaid for product comparisons
  [params.mermaid]
    enabled = true
    theme = "default"
    
  # E-commerce privacy compliance
  [params.privacy]
    respectDoNotTrack = true
    cookieConsent = true
    anonymizeIP = false  # Need full data for e-commerce
    
    [params.privacy.consentBanner]
      enabled = true
      message = "We use cookies to personalize content and ads, and analyze traffic for better shopping experiences."
      acceptText = "Accept All Cookies"
      declineText = "Essential Only"
      learnMoreText = "Cookie Settings"
      learnMoreUrl = "/cookie-preferences"
      
    [params.privacy.cookieCategories]
      necessary = true
      analytics = true
      marketing = true
      preferences = true
      
  # E-commerce performance optimization
  [params.performance]
    lazyLoadAds = true
    asyncScripts = true
    resourceHints = true
    
    preconnectDomains = [
      "https://www.googletagmanager.com",
      "https://pagead2.googlesyndication.com",
      "https://connect.facebook.net",
      "https://www.google-analytics.com"
    ]

# Enhanced privacy for e-commerce
[privacy.googleAnalytics]
  respectDoNotTrack = false  # Need data for e-commerce insights
  anonymizeIP = false
```

## Privacy-Focused Site

Configuration for a privacy-focused website with minimal tracking.

```toml
# hugo.toml - Privacy-Focused Site Configuration
baseURL = "https://privacyfirst.com"
languageCode = "en-us"
title = "Privacy First Blog"
theme = "parsa-redesigned"

# No Google Analytics - privacy first
# GoogleAnalyticsID = ""  # Commented out

[params]
  # Privacy-focused information
  description = "Privacy-focused content and digital rights advocacy"
  author = "Privacy Advocate"
  
  # No advertising
  [params.adsense]
    enabled = false
    
  # No Facebook Pixel
  [params.facebookPixel]
    enabled = false
    
  # Local search only
  [params.gcs_engine_id]
    value = ""  # Empty - use local search
    
  [params.googleCustomSearch]
    enabled = false
    fallbackToLocal = true
    
  # Mermaid for privacy diagrams
  [params.mermaid]
    enabled = true
    theme = "neutral"
    
  # Maximum privacy settings
  [params.privacy]
    respectDoNotTrack = true
    cookieConsent = false  # No tracking = no consent needed
    anonymizeIP = true
    disableTracking = true  # Disable all tracking
    
  # Performance without tracking
  [params.performance]
    lazyLoadAds = false  # No ads
    asyncScripts = true
    resourceHints = false  # No external domains
    criticalCSS = true
    serviceWorker = true  # Local caching

# Disable all privacy-invasive features
[privacy]
  [privacy.googleAnalytics]
    disable = true
  [privacy.youtube]
    privacyEnhanced = true
  [privacy.twitter]
    enableDNT = true
  [privacy.instagram]
    simple = true
```

## High-Traffic Site

Configuration optimized for high-traffic websites with performance focus.

```toml
# hugo.toml - High-Traffic Site Configuration
baseURL = "https://hightraffic.com"
languageCode = "en-us"
title = "High Traffic Website"
theme = "parsa-redesigned"

# Analytics for high traffic
GoogleAnalyticsID = "G-HIGHTRAFFIC1"

[params]
  # High-traffic site information
  description = "Popular content site with millions of visitors"
  author = "Content Team"
  
  # Optimized AdSense for high traffic
  [params.adsense]
    enabled = true
    client = "ca-pub-1111222233334444"
    inArticleSlot = "1111222233"
    autoAds = false  # Manual control for optimization
    responsive = true
    lazyLoad = true
    
    [params.adsense.placements]
      sidebar = true
      footer = true
      inContent = true
      afterContent = true
      
  # Facebook Pixel with sampling
  [params.facebookPixel]
    enabled = true
    pixelId = "111122223333444"
    
    [params.facebookPixel.events]
      pageView = true
      viewContent = false  # Reduce load
      search = true
      
  # Custom search for large content base
  [params.gcs_engine_id]
    value = "traffic567890abcd"
    
  # Minimal Mermaid usage
  [params.mermaid]
    enabled = true
    theme = "default"
    
  # Balanced privacy for high traffic
  [params.privacy]
    respectDoNotTrack = true
    cookieConsent = true
    anonymizeIP = true
    
    [params.privacy.consentBanner]
      enabled = true
      message = "We use cookies to optimize your experience."
      acceptText = "OK"
      declineText = "Opt Out"
      
  # Maximum performance optimization
  [params.performance]
    lazyLoadAds = true
    asyncScripts = true
    resourceHints = true
    criticalCSS = true
    serviceWorker = true
    
    preconnectDomains = [
      "https://www.googletagmanager.com",
      "https://pagead2.googlesyndication.com",
      "https://connect.facebook.net"
    ]
    
    [params.performance.lazyLoading]
      images = true
      iframes = true
      ads = true
      threshold = "200px"  # Aggressive lazy loading
      
    [params.performance.caching]
      staticAssets = "1y"
      htmlPages = "1h"
      apiResponses = "5m"
      
  # Security for high-traffic sites
  [params.security]
    contentSecurityPolicy = true
    subresourceIntegrity = true
    httpsOnly = true
    noSniff = true

# Optimized privacy settings
[privacy.googleAnalytics]
  respectDoNotTrack = true
  anonymizeIP = true
```

## Development Environment

Configuration for development and testing environments.

```toml
# hugo.toml - Development Environment Configuration
baseURL = "http://localhost:1313"
languageCode = "en-us"
title = "Development Site"
theme = "parsa-redesigned"

# Test Analytics ID (or disable)
GoogleAnalyticsID = "G-TESTANALYTICS"

[params]
  # Development information
  description = "Development and testing environment"
  author = "Developer"
  
  # Test AdSense configuration
  [params.adsense]
    enabled = true
    client = "ca-pub-0000000000000000"  # Test publisher ID
    inArticleSlot = "0000000000"
    autoAds = false
    testMode = true  # Enable test mode
    responsive = true
    lazyLoad = false  # Easier debugging
    
    [params.adsense.placements]
      sidebar = true
      inContent = true
      
  # Disabled Facebook Pixel in development
  [params.facebookPixel]
    enabled = false  # Avoid test data
    
  # Test search engine
  [params.gcs_engine_id]
    value = ""  # Use local search in development
    
  # Full Mermaid for testing
  [params.mermaid]
    enabled = true
    theme = "default"
    
  # Relaxed privacy for development
  [params.privacy]
    respectDoNotTrack = false  # Easier testing
    cookieConsent = false
    anonymizeIP = false
    
  # Development performance settings
  [params.performance]
    lazyLoadAds = false  # Easier debugging
    asyncScripts = false  # Synchronous for debugging
    resourceHints = false
    criticalCSS = false

# Development privacy settings
[privacy.googleAnalytics]
  respectDoNotTrack = false
  anonymizeIP = false
  disable = false  # Keep enabled for testing
```

## Configuration Tips

### Environment-Specific Configurations

Use Hugo's environment feature to maintain different configurations:

```bash
# Development
hugo server -D --environment development

# Staging
hugo --environment staging

# Production
hugo --environment production
```

Create environment-specific config files:
- `config/_default/hugo.toml` - Base configuration
- `config/development/hugo.toml` - Development overrides
- `config/staging/hugo.toml` - Staging overrides
- `config/production/hugo.toml` - Production overrides

### Testing Your Configuration

1. **Validate syntax**:
   ```bash
   hugo config
   ```

2. **Check specific parameters**:
   ```bash
   hugo config | grep -A 10 "adsense"
   ```

3. **Test in development**:
   ```bash
   hugo server -D --debug
   ```

4. **Verify in browser**:
   - Check Network tab for service requests
   - Use browser extensions (Facebook Pixel Helper, etc.)
   - Monitor console for errors

### Best Practices

1. **Start Simple**: Begin with basic configuration, add features gradually
2. **Test Thoroughly**: Verify each service works before adding the next
3. **Monitor Performance**: Check Core Web Vitals after enabling new features
4. **Respect Privacy**: Always consider user privacy and legal requirements
5. **Document Changes**: Keep track of configuration changes and their impact
6. **Use Version Control**: Track configuration changes in git
7. **Environment Separation**: Use different settings for dev/staging/production
8. **Regular Reviews**: Periodically review and optimize your configuration