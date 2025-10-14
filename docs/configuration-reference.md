# Configuration Reference

This document provides a complete reference for all configuration parameters available in the Parsa Redesigned Hugo theme with analytics and advertising enhancements.

## Table of Contents

- [Analytics Configuration](#analytics-configuration)
- [Advertising Configuration](#advertising-configuration)
- [Search Configuration](#search-configuration)
- [Diagram Configuration](#diagram-configuration)
- [Privacy Configuration](#privacy-configuration)
- [Performance Configuration](#performance-configuration)
- [Security Configuration](#security-configuration)
- [Configuration Validation](#configuration-validation)

## Analytics Configuration

### Google Analytics 4

Configure Google Analytics 4 tracking for your site.

```toml
# Basic GA4 configuration
GoogleAnalyticsID = "G-XXXXXXXXXX"

# Privacy settings for GA4
[privacy.googleAnalytics]
  respectDoNotTrack = true
  anonymizeIP = true
  disable = false
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `GoogleAnalyticsID` | string | "" | Your GA4 measurement ID (format: G-XXXXXXXXXX) |
| `privacy.googleAnalytics.respectDoNotTrack` | boolean | true | Respect browser Do Not Track settings |
| `privacy.googleAnalytics.anonymizeIP` | boolean | true | Anonymize visitor IP addresses |
| `privacy.googleAnalytics.disable` | boolean | false | Completely disable Google Analytics |

#### Validation Rules

- **GoogleAnalyticsID**: Must match pattern `G-[A-Z0-9]{10}`
- **Required**: GoogleAnalyticsID must be provided if analytics is enabled

#### Example

```toml
GoogleAnalyticsID = "G-JKSVCT23D1"

[privacy.googleAnalytics]
  respectDoNotTrack = true
  anonymizeIP = true
```

### Facebook Pixel

Configure Facebook Pixel for conversion tracking and audience building.

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
    purchase = false
    addToCart = false
    initiateCheckout = false
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | boolean | false | Enable/disable Facebook Pixel |
| `pixelId` | string | "" | Your Facebook Pixel ID (15-16 digits) |
| `advancedMatching` | boolean | false | Enable advanced matching for better attribution |
| `events.pageView` | boolean | true | Track page views |
| `events.viewContent` | boolean | false | Track content views |
| `events.search` | boolean | false | Track search events |
| `events.contact` | boolean | false | Track contact form submissions |
| `events.lead` | boolean | false | Track lead generation events |
| `events.completeRegistration` | boolean | false | Track registration completions |
| `events.purchase` | boolean | false | Track purchase events |
| `events.addToCart` | boolean | false | Track add to cart events |
| `events.initiateCheckout` | boolean | false | Track checkout initiations |

#### Validation Rules

- **pixelId**: Must be 15-16 digits
- **Required**: pixelId must be provided if Facebook Pixel is enabled

## Advertising Configuration

### Google AdSense

Configure Google AdSense for displaying advertisements on your site.

```toml
[params.adsense]
  enabled = true
  client = "ca-pub-XXXXXXXXXXXXXXXX"
  inArticleSlot = "XXXXXXXXXX"
  autoAds = false
  responsive = true
  lazyLoad = true
  testMode = false
  
  [params.adsense.placements]
    header = false
    sidebar = true
    footer = true
    inContent = true
    beforeContent = false
    afterContent = true
    
  [params.adsense.slots]
    sidebar = "XXXXXXXXXX"
    footer = "XXXXXXXXXX"
    beforeContent = "XXXXXXXXXX"
    afterContent = "XXXXXXXXXX"
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | boolean | false | Enable/disable AdSense |
| `client` | string | "" | Your AdSense client ID (format: ca-pub-XXXXXXXXXXXXXXXX) |
| `inArticleSlot` | string | "" | Slot ID for in-article ads (10 digits) |
| `autoAds` | boolean | false | Enable Google Auto Ads |
| `responsive` | boolean | true | Use responsive ad units |
| `lazyLoad` | boolean | true | Enable lazy loading for ads |
| `testMode` | boolean | false | Enable test mode for development |
| `placements.*` | boolean | varies | Enable ads in specific locations |
| `slots.*` | string | "" | Slot IDs for specific ad placements |

#### Validation Rules

- **client**: Must match pattern `ca-pub-[0-9]{16}`
- **slots**: Must be 10 digits when provided
- **Required**: client must be provided if AdSense is enabled

#### Ad Placement Options

| Placement | Description | Default |
|-----------|-------------|---------|
| `header` | Top of page header | false |
| `sidebar` | Sidebar widget area | true |
| `footer` | Bottom of page footer | true |
| `inContent` | Within article content | true |
| `beforeContent` | Before article content | false |
| `afterContent` | After article content | true |

## Search Configuration

### Google Custom Search Engine

Configure Google Custom Search for site search functionality.

```toml
[params.gcs_engine_id]
  value = "XXXXXXXXXXXXXXXXX"

# Alternative configuration format
[params.googleCustomSearch]
  engineId = "XXXXXXXXXXXXXXXXX"
  enabled = true
  autoComplete = true
  enableHistory = true
  maxCompletions = 5
  fallbackToLocal = true
  placeholder = "Search..."
  noResultsText = "No results found"
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `gcs_engine_id.value` | string | "" | Google Custom Search Engine ID |
| `googleCustomSearch.engineId` | string | "" | Alternative configuration path |
| `googleCustomSearch.enabled` | boolean | true | Enable/disable custom search |
| `googleCustomSearch.autoComplete` | boolean | true | Enable search autocomplete |
| `googleCustomSearch.enableHistory` | boolean | true | Enable search history |
| `googleCustomSearch.maxCompletions` | number | 5 | Maximum autocomplete suggestions |
| `googleCustomSearch.fallbackToLocal` | boolean | true | Fallback to local search if GCS fails |
| `googleCustomSearch.placeholder` | string | "Search..." | Search input placeholder text |
| `googleCustomSearch.noResultsText` | string | "No results found" | No results message |

#### Validation Rules

- **engineId**: Must be 17 hexadecimal characters
- **maxCompletions**: Must be between 1 and 10

## Diagram Configuration

### Mermaid.js Diagrams

Configure Mermaid.js for rendering diagrams in your content.

```toml
[params.mermaid]
  enabled = true
  theme = "default"
  startOnLoad = true
  securityLevel = "loose"
  version = "10.6.1"
  
  [params.mermaid.flowchart]
    useMaxWidth = true
    htmlLabels = true
    curve = "basis"
    
  [params.mermaid.sequence]
    diagramMarginX = 50
    diagramMarginY = 10
    actorMargin = 50
    
  [params.mermaid.gantt]
    numberSectionStyles = 4
    axisFormat = "%m/%d/%Y"
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | boolean | true | Enable/disable Mermaid diagrams |
| `theme` | string | "default" | Mermaid theme (default, dark, forest, neutral, base) |
| `startOnLoad` | boolean | true | Initialize diagrams on page load |
| `securityLevel` | string | "loose" | Security level for diagram rendering |
| `version` | string | "10.6.1" | Mermaid.js version to load |
| `flowchart.useMaxWidth` | boolean | true | Use maximum available width |
| `flowchart.htmlLabels` | boolean | true | Enable HTML labels in flowcharts |
| `flowchart.curve` | string | "basis" | Curve type for flowchart lines |
| `sequence.diagramMarginX` | number | 50 | Horizontal margin for sequence diagrams |
| `sequence.diagramMarginY` | number | 10 | Vertical margin for sequence diagrams |
| `sequence.actorMargin` | number | 50 | Margin between actors |
| `gantt.numberSectionStyles` | number | 4 | Number of section styles for Gantt charts |
| `gantt.axisFormat` | string | "%m/%d/%Y" | Date format for Gantt chart axis |

#### Supported Diagram Types

- Flowcharts
- Sequence diagrams
- Class diagrams
- State diagrams
- Entity relationship diagrams
- User journey diagrams
- Gantt charts
- Pie charts
- Git graphs

## Privacy Configuration

### Privacy and Consent Management

Configure privacy settings and consent management for GDPR compliance.

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
    position = "bottom"
    backgroundColor = "#1f2937"
    textColor = "#ffffff"
    
  [params.privacy.cookieCategories]
    necessary = true
    analytics = false
    marketing = false
    preferences = false
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `respectDoNotTrack` | boolean | true | Respect browser Do Not Track settings |
| `cookieConsent` | boolean | false | Enable cookie consent banner |
| `anonymizeIP` | boolean | true | Anonymize IP addresses |
| `disableTracking` | boolean | false | Completely disable all tracking |
| `consentBanner.enabled` | boolean | false | Enable consent banner |
| `consentBanner.message` | string | "This website uses cookies..." | Consent banner message |
| `consentBanner.acceptText` | string | "Accept" | Accept button text |
| `consentBanner.declineText` | string | "Decline" | Decline button text |
| `consentBanner.learnMoreText` | string | "Learn More" | Learn more link text |
| `consentBanner.learnMoreUrl` | string | "/privacy-policy" | Learn more link URL |
| `consentBanner.position` | string | "bottom" | Banner position (top, bottom) |
| `consentBanner.backgroundColor` | string | "#1f2937" | Banner background color |
| `consentBanner.textColor` | string | "#ffffff" | Banner text color |
| `cookieCategories.*` | boolean | varies | Enable specific cookie categories |

## Performance Configuration

### Performance Optimization

Configure performance optimization settings.

```toml
[params.performance]
  lazyLoadAds = true
  asyncScripts = true
  resourceHints = true
  criticalCSS = false
  serviceWorker = false
  
  preconnectDomains = [
    "https://www.googletagmanager.com",
    "https://pagead2.googlesyndication.com",
    "https://connect.facebook.net",
    "https://cse.google.com",
    "https://cdn.jsdelivr.net"
  ]
  
  [params.performance.lazyLoading]
    images = true
    iframes = true
    ads = true
    threshold = "0px"
    
  [params.performance.caching]
    staticAssets = "1y"
    htmlPages = "1h"
    apiResponses = "5m"
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `lazyLoadAds` | boolean | true | Enable lazy loading for advertisements |
| `asyncScripts` | boolean | true | Load external scripts asynchronously |
| `resourceHints` | boolean | true | Add resource hints for external domains |
| `criticalCSS` | boolean | false | Inline critical CSS |
| `serviceWorker` | boolean | false | Enable service worker for caching |
| `preconnectDomains` | array | [] | Domains to preconnect |
| `lazyLoading.images` | boolean | true | Lazy load images |
| `lazyLoading.iframes` | boolean | true | Lazy load iframes |
| `lazyLoading.ads` | boolean | true | Lazy load advertisements |
| `lazyLoading.threshold` | string | "0px" | Intersection observer threshold |
| `caching.staticAssets` | string | "1y" | Cache duration for static assets |
| `caching.htmlPages` | string | "1h" | Cache duration for HTML pages |
| `caching.apiResponses` | string | "5m" | Cache duration for API responses |

## Security Configuration

### Security Settings

Configure security-related settings.

```toml
[params.security]
  contentSecurityPolicy = false
  subresourceIntegrity = false
  httpsOnly = true
  noSniff = true
  frameOptions = "SAMEORIGIN"
  
  [params.security.csp]
    defaultSrc = ["'self'"]
    scriptSrc = ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com"]
    styleSrc = ["'self'", "'unsafe-inline'"]
    imgSrc = ["'self'", "data:", "https:"]
    connectSrc = ["'self'", "https://www.google-analytics.com"]
    fontSrc = ["'self'", "https://fonts.gstatic.com"]
    objectSrc = ["'none'"]
    mediaSrc = ["'self'"]
    frameSrc = ["'self'", "https://www.youtube.com"]
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `contentSecurityPolicy` | boolean | false | Enable CSP headers |
| `subresourceIntegrity` | boolean | false | Enable SRI for external resources |
| `httpsOnly` | boolean | true | Enforce HTTPS for external resources |
| `noSniff` | boolean | true | Add X-Content-Type-Options header |
| `frameOptions` | string | "SAMEORIGIN" | X-Frame-Options header value |
| `csp.*` | array | varies | Content Security Policy directives |

## Configuration Validation

The theme includes automatic configuration validation that checks:

### Validation Rules

1. **ID Format Validation**
   - Google Analytics ID: `G-[A-Z0-9]{10}`
   - AdSense Client ID: `ca-pub-[0-9]{16}`
   - AdSense Slot ID: `[0-9]{10}`
   - Facebook Pixel ID: `[0-9]{15,16}`
   - Google Custom Search Engine ID: `[a-f0-9]{17}`

2. **Required Field Validation**
   - Services enabled without required IDs
   - Missing configuration for enabled features

3. **Privacy Compliance Validation**
   - Tracking enabled without consent management
   - Missing privacy policy links
   - Do Not Track settings

4. **Performance Validation**
   - Multiple tracking services without optimization
   - Missing lazy loading configuration
   - Excessive external resource loading

### Validation Messages

The theme displays validation messages during build:

```
INFO: Theme Analytics Enhancement initialized
INFO: Enabled services: Google Analytics, AdSense, Mermaid Diagrams
WARNING: Analytics tracking is enabled but cookie consent is disabled. Consider enabling params.privacy.cookieConsent for GDPR compliance.
ERROR: AdSense is enabled but no client ID is configured. Please set params.adsense.client in your configuration.
WARNING: Multiple tracking services enabled. Consider enabling params.performance.lazyLoadAds for better performance.
```

### Configuration Testing

Test your configuration with the built-in validation:

```bash
# Run configuration validation
hugo --printI18nWarnings --printPathWarnings

# Check for configuration errors
hugo --debug | grep -i "analytics\|adsense\|pixel\|mermaid"
```

## Environment-Specific Configuration

### Development Environment

```toml
# Disable tracking in development
[params.adsense]
  enabled = false
  testMode = true

[params.facebookPixel]
  enabled = false

[params.privacy]
  respectDoNotTrack = false
  cookieConsent = false

[params.performance]
  asyncScripts = false  # Easier debugging
  lazyLoadAds = false
```

### Staging Environment

```toml
# Limited tracking in staging
[params.adsense]
  enabled = true
  testMode = true
  client = "ca-pub-XXXXXXXXXXXXXXXX"

[params.facebookPixel]
  enabled = false  # Avoid test data

[params.privacy]
  respectDoNotTrack = true
  cookieConsent = true
```

### Production Environment

```toml
# Full tracking in production
[params.adsense]
  enabled = true
  testMode = false
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

## Best Practices

1. **Start Simple**: Begin with basic analytics, add features gradually
2. **Test Thoroughly**: Verify each service works before adding the next
3. **Respect Privacy**: Enable cookie consent for GDPR compliance
4. **Optimize Performance**: Use lazy loading and async scripts
5. **Monitor Impact**: Check Core Web Vitals after enabling new features
6. **Keep Updated**: Regularly review and update your configuration
7. **Document Changes**: Keep track of configuration changes for your team
8. **Use Environment-Specific Configs**: Different settings for dev/staging/production
9. **Validate Regularly**: Run configuration validation during builds
10. **Monitor Errors**: Check Hugo build output for validation warnings