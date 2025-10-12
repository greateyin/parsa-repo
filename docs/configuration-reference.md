# Configuration Reference

This document provides a comprehensive reference for all configuration options available in the Hugo theme analytics enhancements.

## Table of Contents

- [Google Analytics Configuration](#google-analytics-configuration)
- [Google AdSense Configuration](#google-adsense-configuration)
- [Facebook Pixel Configuration](#facebook-pixel-configuration)
- [Google Custom Search Configuration](#google-custom-search-configuration)
- [Mermaid Diagrams Configuration](#mermaid-diagrams-configuration)
- [Privacy Settings](#privacy-settings)
- [Performance Settings](#performance-settings)
- [Security Settings](#security-settings)
- [Configuration Examples](#configuration-examples)
- [Troubleshooting](#troubleshooting)

## Google Analytics Configuration

Configure Google Analytics 4 tracking for your site.

### Basic Configuration

```toml
# Hugo configuration file (hugo.toml)
GoogleAnalyticsID = "G-JKSVCT23D1"
```

### Advanced Privacy Settings

```toml
[privacy]
  [privacy.googleAnalytics]
    anonymizeIP = true
    respectDoNotTrack = true
    useSessionStorage = false
```

### Configuration Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `GoogleAnalyticsID` | string | "" | Your Google Analytics 4 measurement ID (format: G-XXXXXXXXXX) |
| `privacy.googleAnalytics.anonymizeIP` | boolean | true | Anonymize visitor IP addresses |
| `privacy.googleAnalytics.respectDoNotTrack` | boolean | true | Respect browser Do Not Track settings |
| `privacy.googleAnalytics.useSessionStorage` | boolean | false | Use session storage instead of cookies |

### Validation Rules

- **Google Analytics ID**: Must follow the format `G-XXXXXXXXXX` where X is alphanumeric
- **Example**: `G-JKSVCT23D1`

## Google AdSense Configuration

Configure Google AdSense advertising integration.

### Basic Configuration

```toml
[params.adsense]
  enabled = true
  client = "ca-pub-2970874383549118"
  autoAds = true
```

### Ad Placement Configuration

```toml
[params.adsense]
  enabled = true
  client = "ca-pub-2970874383549118"
  inArticleSlot = "4383549118"
  
  [params.adsense.placements]
    header = false
    sidebar = true
    footer = true
    inContent = true
    beforeContent = false
    afterContent = true
```

### Configuration Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `params.adsense.enabled` | boolean | false | Enable/disable AdSense integration |
| `params.adsense.client` | string | "" | Your AdSense client ID (format: ca-pub-XXXXXXXXXXXXXXXX) |
| `params.adsense.inArticleSlot` | string | "" | Slot ID for in-article ads (10 digits) |
| `params.adsense.autoAds` | boolean | false | Enable Google Auto Ads |
| `params.adsense.responsive` | boolean | true | Use responsive ad units |
| `params.adsense.lazyLoad` | boolean | true | Enable lazy loading for ads |
| `params.adsense.placements.*` | boolean | false | Enable ads in specific locations |

### Validation Rules

- **Client ID**: Must follow the format `ca-pub-XXXXXXXXXXXXXXXX` (16 digits)
- **Slot ID**: Must be exactly 10 digits
- **Example Client**: `ca-pub-2970874383549118`
- **Example Slot**: `4383549118`

## Facebook Pixel Configuration

Configure Facebook Pixel tracking for advertising and analytics.

### Basic Configuration

```toml
[params.facebookPixel]
  enabled = true
  pixelId = "123456789012345"
```

### Event Tracking Configuration

```toml
[params.facebookPixel]
  enabled = true
  pixelId = "123456789012345"
  advancedMatching = false
  
  [params.facebookPixel.events]
    pageView = true
    viewContent = false
    search = true
    contact = true
    lead = false
    completeRegistration = false
```

### Configuration Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `params.facebookPixel.enabled` | boolean | false | Enable/disable Facebook Pixel |
| `params.facebookPixel.pixelId` | string | "" | Your Facebook Pixel ID (15-16 digits) |
| `params.facebookPixel.advancedMatching` | boolean | false | Enable advanced matching |
| `params.facebookPixel.events.*` | boolean | varies | Enable specific event tracking |

### Validation Rules

- **Pixel ID**: Must be 15-16 digits
- **Example**: `123456789012345`

## Google Custom Search Configuration

Configure Google Custom Search Engine integration.

### Basic Configuration

```toml
[params.gcs_engine_id]
  value = "3164aa570fbbb474a"
```

### Advanced Configuration

```toml
[params.googleCustomSearch]
  engineId = "3164aa570fbbb474a"
  enabled = true
  autoComplete = true
  enableHistory = true
  maxCompletions = 5
  fallbackToLocal = true
```

### Configuration Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `params.gcs_engine_id.value` | string | "" | Google Custom Search Engine ID |
| `params.googleCustomSearch.engineId` | string | "" | Alternative configuration path |
| `params.googleCustomSearch.enabled` | boolean | false | Enable/disable custom search |
| `params.googleCustomSearch.autoComplete` | boolean | true | Enable search autocomplete |
| `params.googleCustomSearch.enableHistory` | boolean | true | Enable search history |
| `params.googleCustomSearch.maxCompletions` | number | 5 | Maximum autocomplete suggestions |
| `params.googleCustomSearch.fallbackToLocal` | boolean | true | Fallback to local search if unavailable |

### Validation Rules

- **Engine ID**: Must be 17 character hexadecimal string
- **Example**: `3164aa570fbbb474a`

## Mermaid Diagrams Configuration

Configure Mermaid.js diagram rendering.

### Basic Configuration

```toml
[params.mermaid]
  enabled = true
  theme = "default"
```

### Advanced Configuration

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

### Configuration Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `params.mermaid.enabled` | boolean | true | Enable/disable Mermaid diagrams |
| `params.mermaid.theme` | string | "default" | Mermaid theme (default, dark, forest, neutral, base) |
| `params.mermaid.startOnLoad` | boolean | true | Initialize diagrams on page load |
| `params.mermaid.securityLevel` | string | "loose" | Security level for diagram rendering |
| `params.mermaid.flowchart.useMaxWidth` | boolean | true | Use maximum available width |
| `params.mermaid.flowchart.htmlLabels` | boolean | true | Enable HTML labels in flowcharts |

### Validation Rules

- **Theme**: Must be one of: default, dark, forest, neutral, base

## Privacy Settings

Configure privacy compliance and user consent management.

### Basic Configuration

```toml
[params.privacy]
  respectDoNotTrack = true
  cookieConsent = false
  anonymizeIP = true
```

### Cookie Consent Configuration

```toml
[params.privacy]
  respectDoNotTrack = true
  cookieConsent = true
  anonymizeIP = true
  disableTracking = false
  
  [params.privacy.consentBanner]
    enabled = true
    message = "This website uses cookies to ensure you get the best experience."
    acceptText = "Accept"
    declineText = "Decline"
    learnMoreText = "Learn More"
    learnMoreUrl = "/privacy-policy"
```

### Configuration Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `params.privacy.respectDoNotTrack` | boolean | true | Respect browser Do Not Track settings |
| `params.privacy.cookieConsent` | boolean | false | Enable cookie consent banner |
| `params.privacy.anonymizeIP` | boolean | true | Anonymize IP addresses |
| `params.privacy.disableTracking` | boolean | false | Completely disable all tracking |
| `params.privacy.consentBanner.*` | various | varies | Cookie consent banner configuration |

## Performance Settings

Configure performance optimization features.

### Basic Configuration

```toml
[params.performance]
  lazyLoadAds = true
  asyncScripts = true
  resourceHints = true
```

### Advanced Configuration

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

### Configuration Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `params.performance.lazyLoadAds` | boolean | true | Enable lazy loading for advertisements |
| `params.performance.asyncScripts` | boolean | true | Load external scripts asynchronously |
| `params.performance.resourceHints` | boolean | true | Add resource hints for external domains |
| `params.performance.criticalCSS` | boolean | false | Inline critical CSS |
| `params.performance.preconnectDomains` | array | predefined | Domains to preconnect |

## Security Settings

Configure security features and Content Security Policy.

### Basic Configuration

```toml
[params.security]
  contentSecurityPolicy = false
  subresourceIntegrity = false
  httpsOnly = true
```

### Configuration Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `params.security.contentSecurityPolicy` | boolean | false | Enable CSP headers |
| `params.security.subresourceIntegrity` | boolean | false | Enable SRI for external resources |
| `params.security.httpsOnly` | boolean | true | Enforce HTTPS for external resources |
| `params.security.noSniff` | boolean | true | Add X-Content-Type-Options header |

## Configuration Examples

### Minimal Configuration

```toml
# hugo.toml
GoogleAnalyticsID = "G-JKSVCT23D1"

[params.adsense]
  enabled = true
  client = "ca-pub-2970874383549118"
```

### Complete Configuration

```toml
# hugo.toml
GoogleAnalyticsID = "G-JKSVCT23D1"

[params.adsense]
  enabled = true
  client = "ca-pub-2970874383549118"
  inArticleSlot = "4383549118"
  autoAds = true
  
  [params.adsense.placements]
    sidebar = true
    footer = true
    inContent = true

[params.facebookPixel]
  enabled = true
  pixelId = "123456789012345"
  
  [params.facebookPixel.events]
    pageView = true
    search = true
    contact = true

[params.gcs_engine_id]
  value = "3164aa570fbbb474a"

[params.mermaid]
  enabled = true
  theme = "default"

[params.privacy]
  respectDoNotTrack = true
  cookieConsent = true
  
  [params.privacy.consentBanner]
    enabled = true
    message = "We use cookies to improve your experience."

[params.performance]
  lazyLoadAds = true
  asyncScripts = true
  resourceHints = true
```

### Privacy-Focused Configuration

```toml
# hugo.toml
GoogleAnalyticsID = "G-JKSVCT23D1"

[params.privacy]
  respectDoNotTrack = true
  cookieConsent = true
  anonymizeIP = true
  
  [params.privacy.consentBanner]
    enabled = true
    message = "This site uses cookies only with your consent."
    learnMoreUrl = "/privacy-policy"

[params.performance]
  lazyLoadAds = true
  asyncScripts = true

# Disable advertising for privacy
[params.adsense]
  enabled = false

[params.facebookPixel]
  enabled = false
```

## Troubleshooting

### Common Configuration Errors

1. **Invalid Google Analytics ID**
   - Error: `Invalid Google Analytics ID format`
   - Solution: Use format `G-XXXXXXXXXX` (e.g., `G-JKSVCT23D1`)

2. **Invalid AdSense Client ID**
   - Error: `Invalid AdSense client ID format`
   - Solution: Use format `ca-pub-XXXXXXXXXXXXXXXX` (16 digits)

3. **Invalid Facebook Pixel ID**
   - Error: `Invalid Facebook Pixel ID format`
   - Solution: Use 15-16 digit number (e.g., `123456789012345`)

4. **Missing Required Configuration**
   - Error: Service enabled but no ID configured
   - Solution: Provide the required ID or disable the service

### Performance Issues

1. **Slow Page Loading**
   - Enable `params.performance.lazyLoadAds = true`
   - Enable `params.performance.asyncScripts = true`
   - Consider disabling unused services

2. **High Resource Usage**
   - Disable auto ads: `params.adsense.autoAds = false`
   - Reduce ad placements
   - Enable lazy loading

### Privacy Compliance

1. **GDPR Compliance**
   - Enable `params.privacy.cookieConsent = true`
   - Set `params.privacy.respectDoNotTrack = true`
   - Configure consent banner messages

2. **Do Not Track**
   - Ensure `params.privacy.respectDoNotTrack = true`
   - Test with browser DNT enabled

### Validation Warnings

The theme includes comprehensive validation that will show warnings for:
- Invalid ID formats
- Missing required configuration
- Privacy compliance recommendations
- Performance optimization suggestions

Check your Hugo build output for validation messages and follow the provided guidance.