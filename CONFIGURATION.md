# Theme Configuration Guide

This document provides comprehensive configuration instructions for the Parsa Redesigned Hugo theme with analytics and advertising enhancements.

## Quick Start

### Minimal Configuration

```toml
# hugo.toml
baseURL = "https://yoursite.com"
languageCode = "en-us"
title = "Your Site Title"

# Optional: Add Google Analytics
GoogleAnalyticsID = "G-XXXXXXXXXX"

[params]
  # Basic site information
  description = "Your site description"
  author = "Your Name"
  
  # Enable Mermaid diagrams (enabled by default)
  [params.mermaid]
    enabled = true
```

### Complete Configuration Template

```toml
# hugo.toml - Complete configuration example
baseURL = "https://yoursite.com"
languageCode = "en-us"
title = "Your Site Title"

# Google Analytics 4 (optional)
GoogleAnalyticsID = "G-XXXXXXXXXX"

[params]
  # Site Information
  description = "Your site description"
  author = "Your Name"
  logo = "/images/logo.png"
  favicon = "/favicon.ico"
  
  # Google AdSense Configuration
  [params.adsense]
    enabled = true
    client = "ca-pub-XXXXXXXXXXXXXXXX"
    inArticleSlot = "XXXXXXXXXX"
    autoAds = false
    
    [params.adsense.placements]
      sidebar = true
      footer = true
      inContent = true
      
  # Facebook Pixel Configuration
  [params.facebookPixel]
    enabled = true
    pixelId = "XXXXXXXXXXXXXXX"
    
    [params.facebookPixel.events]
      pageView = true
      search = true
      contact = true
      
  # Google Custom Search
  [params.gcs_engine_id]
    value = "XXXXXXXXXXXXXXXXX"
    
  # Mermaid Diagrams
  [params.mermaid]
    enabled = true
    theme = "default"
    
  # Privacy Settings
  [params.privacy]
    respectDoNotTrack = true
    cookieConsent = true
    
    [params.privacy.consentBanner]
      enabled = true
      message = "We use cookies to improve your experience."
      
  # Performance Settings
  [params.performance]
    lazyLoadAds = true
    asyncScripts = true
    resourceHints = true
```

## Configuration Sections

### 1. Analytics Configuration

#### Google Analytics 4

```toml
# Basic GA4 setup
GoogleAnalyticsID = "G-XXXXXXXXXX"

# Privacy settings for GA4
[privacy.googleAnalytics]
  respectDoNotTrack = true
  anonymizeIP = true
```

**Required:**
- `GoogleAnalyticsID`: Your GA4 measurement ID (format: G-XXXXXXXXXX)

**Optional Privacy Settings:**
- `privacy.googleAnalytics.respectDoNotTrack`: Respect browser Do Not Track (default: true)
- `privacy.googleAnalytics.anonymizeIP`: Anonymize visitor IP addresses (default: true)

### 2. Advertising Configuration

#### Google AdSense

```toml
[params.adsense]
  enabled = true
  client = "ca-pub-XXXXXXXXXXXXXXXX"
  inArticleSlot = "XXXXXXXXXX"
  autoAds = false
  responsive = true
  lazyLoad = true
  
  [params.adsense.placements]
    header = false
    sidebar = true
    footer = true
    inContent = true
    beforeContent = false
    afterContent = true
```

**Configuration Options:**
- `enabled`: Enable/disable AdSense (boolean)
- `client`: Your AdSense client ID (format: ca-pub-XXXXXXXXXXXXXXXX)
- `inArticleSlot`: Slot ID for in-article ads (10 digits)
- `autoAds`: Enable Google Auto Ads (boolean)
- `responsive`: Use responsive ad units (boolean, default: true)
- `lazyLoad`: Enable lazy loading for ads (boolean, default: true)
- `placements.*`: Enable ads in specific locations (boolean)

#### Facebook Pixel

```toml
[params.facebookPixel]
  enabled = true
  pixelId = "XXXXXXXXXXXXXXX"
  advancedMatching = false
  
  [params.facebookPixel.events]
    pageView = true
    viewContent = false
    search = true
    contact = true
    lead = false
    completeRegistration = false
```

**Configuration Options:**
- `enabled`: Enable/disable Facebook Pixel (boolean)
- `pixelId`: Your Facebook Pixel ID (15-16 digits)
- `advancedMatching`: Enable advanced matching (boolean)
- `events.*`: Enable specific event tracking (boolean)

### 3. Search Configuration

#### Google Custom Search Engine

```toml
[params.gcs_engine_id]
  value = "XXXXXXXXXXXXXXXXX"

# Alternative configuration
[params.googleCustomSearch]
  engineId = "XXXXXXXXXXXXXXXXX"
  enabled = true
  autoComplete = true
  enableHistory = true
  maxCompletions = 5
  fallbackToLocal = true
```

**Configuration Options:**
- `gcs_engine_id.value`: Your Google Custom Search Engine ID (17 hex characters)
- `googleCustomSearch.engineId`: Alternative configuration path
- `googleCustomSearch.enabled`: Enable/disable custom search (boolean)
- `googleCustomSearch.autoComplete`: Enable search autocomplete (boolean)
- `googleCustomSearch.enableHistory`: Enable search history (boolean)
- `googleCustomSearch.maxCompletions`: Maximum autocomplete suggestions (number)
- `googleCustomSearch.fallbackToLocal`: Fallback to local search (boolean)

### 4. Diagram Configuration

#### Mermaid.js Diagrams

```toml
[params.mermaid]
  enabled = true
  theme = "default"
  startOnLoad = true
  securityLevel = "loose"
  
  [params.mermaid.flowchart]
    useMaxWidth = true
    htmlLabels = true
```

**Configuration Options:**
- `enabled`: Enable/disable Mermaid diagrams (boolean, default: true)
- `theme`: Mermaid theme (options: default, dark, forest, neutral, base)
- `startOnLoad`: Initialize diagrams on page load (boolean)
- `securityLevel`: Security level for diagram rendering (string)
- `flowchart.useMaxWidth`: Use maximum available width (boolean)
- `flowchart.htmlLabels`: Enable HTML labels in flowcharts (boolean)

### 5. Privacy Configuration

#### Privacy and Consent Management

```toml
[params.privacy]
  respectDoNotTrack = true
  cookieConsent = false
  anonymizeIP = true
  disableTracking = false
  
  [params.privacy.consentBanner]
    enabled = false
    message = "This website uses cookies to ensure you get the best experience."
    acceptText = "Accept"
    declineText = "Decline"
    learnMoreText = "Learn More"
    learnMoreUrl = "/privacy-policy"
```

**Configuration Options:**
- `respectDoNotTrack`: Respect browser Do Not Track settings (boolean)
- `cookieConsent`: Enable cookie consent banner (boolean)
- `anonymizeIP`: Anonymize IP addresses (boolean)
- `disableTracking`: Completely disable all tracking (boolean)
- `consentBanner.*`: Cookie consent banner configuration

### 6. Performance Configuration

#### Performance Optimization

```toml
[params.performance]
  lazyLoadAds = true
  asyncScripts = true
  resourceHints = true
  criticalCSS = false
  
  preconnectDomains = [
    "https://www.googletagmanager.com",
    "https://pagead2.googlesyndication.com",
    "https://connect.facebook.net",
    "https://cse.google.com",
    "https://cdn.jsdelivr.net"
  ]
```

**Configuration Options:**
- `lazyLoadAds`: Enable lazy loading for advertisements (boolean)
- `asyncScripts`: Load external scripts asynchronously (boolean)
- `resourceHints`: Add resource hints for external domains (boolean)
- `criticalCSS`: Inline critical CSS (boolean)
- `preconnectDomains`: Domains to preconnect (array)

### 7. Security Configuration

#### Security Settings

```toml
[params.security]
  contentSecurityPolicy = false
  subresourceIntegrity = false
  httpsOnly = true
  noSniff = true
```

**Configuration Options:**
- `contentSecurityPolicy`: Enable CSP headers (boolean)
- `subresourceIntegrity`: Enable SRI for external resources (boolean)
- `httpsOnly`: Enforce HTTPS for external resources (boolean)
- `noSniff`: Add X-Content-Type-Options header (boolean)

## Configuration Validation

The theme includes automatic configuration validation that will:

1. **Validate ID Formats**: Check that all tracking IDs follow the correct format
2. **Check Required Fields**: Warn if enabled services are missing required configuration
3. **Privacy Compliance**: Suggest privacy settings based on enabled tracking
4. **Performance Optimization**: Recommend performance improvements
5. **Security Best Practices**: Highlight security considerations

### Validation Messages

The theme will display helpful messages during build:

```
Theme Analytics Enhancement: Enabled services: Google Analytics, AdSense, Mermaid Diagrams
WARNING: Analytics tracking is enabled but cookie consent is disabled. Consider enabling params.privacy.cookieConsent for GDPR compliance.
ERROR: AdSense is enabled but no client ID is configured. Please set params.adsense.client in your configuration.
```

## Environment-Specific Configuration

### Development Environment

```toml
# Disable tracking in development
[params.adsense]
  enabled = false

[params.facebookPixel]
  enabled = false

[params.privacy]
  respectDoNotTrack = false
  cookieConsent = false

[params.performance]
  asyncScripts = false  # Easier debugging
```

### Production Environment

```toml
# Enable all features in production
[params.adsense]
  enabled = true
  client = "ca-pub-XXXXXXXXXXXXXXXX"

[params.facebookPixel]
  enabled = true
  pixelId = "XXXXXXXXXXXXXXX"

[params.privacy]
  respectDoNotTrack = true
  cookieConsent = true

[params.performance]
  lazyLoadAds = true
  asyncScripts = true
  resourceHints = true
```

## Migration Guide

### From Basic Theme

If you're upgrading from a basic theme configuration:

1. **Add Analytics**: Configure `GoogleAnalyticsID` if not already set
2. **Add New Sections**: Copy the new parameter sections from the examples
3. **Test Gradually**: Enable features one at a time
4. **Update Privacy Policy**: Ensure your privacy policy reflects new tracking

### From Legacy Configuration

If you have existing analytics configuration:

1. **Google Analytics**: Move from `params.analytics.googleAnalytics` to `GoogleAnalyticsID`
2. **Cookie Consent**: Migrate from `params.cookies` to `params.privacy.consentBanner`
3. **Performance**: Update performance settings to new structure

## Troubleshooting

### Common Issues

1. **Invalid ID Format Errors**
   - Check that IDs follow the correct format (see validation rules)
   - Remove any extra spaces or characters

2. **Services Not Loading**
   - Verify that `enabled = true` is set
   - Check that required IDs are provided
   - Ensure no ad blockers are interfering

3. **Privacy Compliance Warnings**
   - Enable `params.privacy.cookieConsent` for GDPR compliance
   - Set `params.privacy.respectDoNotTrack = true`

4. **Performance Issues**
   - Enable `params.performance.lazyLoadAds`
   - Enable `params.performance.asyncScripts`
   - Consider disabling unused services

### Getting Help

- Check the [Configuration Reference](docs/configuration-reference.md) for detailed parameter documentation
- Review [Configuration Examples](docs/configuration-examples.md) for use case-specific setups
- Examine the validation messages in your Hugo build output
- Test your configuration in a development environment first

## Best Practices

1. **Start Simple**: Begin with basic analytics, add features gradually
2. **Test Thoroughly**: Verify each service works before adding the next
3. **Respect Privacy**: Enable cookie consent for GDPR compliance
4. **Optimize Performance**: Use lazy loading and async scripts
5. **Monitor Impact**: Check Core Web Vitals after enabling new features
6. **Keep Updated**: Regularly review and update your configuration
7. **Document Changes**: Keep track of configuration changes for your team