# Configuration Schema Documentation

This document outlines the configuration schema for the Hugo theme analytics and tracking enhancements.

## Google Analytics 4

```toml
# Google Analytics Configuration
GoogleAnalyticsID = "G-JKSVCT23D1"
```

## Google AdSense

```toml
[params.adsense]
  enabled = true
  client = "ca-pub-2970874383549118"
  inArticleSlot = "4383549118"
  autoAds = true
  
  # Ad placement configuration
  [params.adsense.placements]
    header = true
    sidebar = true
    footer = true
    inContent = true
```

## Facebook Pixel

```toml
[params.facebookPixel]
  enabled = true
  pixelId = "YOUR_PIXEL_ID"
  
  # Event tracking configuration
  [params.facebookPixel.events]
    pageView = true
    viewContent = true
    search = true
    contact = true
```

## Google Custom Search

```toml
[params.gcs_engine_id]
  value = "3164aa570fbbb474a"
```

## Mermaid Diagrams

```toml
[params.mermaid]
  enabled = true
  theme = "default"
```

## Privacy Settings

```toml
[params.privacy]
  respectDoNotTrack = true
  cookieConsent = true
```

## Performance Settings

```toml
[params.performance]
  lazyLoadAds = true
  asyncScripts = true
```

## Configuration Validation

The theme includes automatic configuration validation that:

- Provides default values for missing parameters
- Warns about invalid or missing required values
- Ensures graceful degradation when services are misconfigured

## Privacy Compliance

The theme respects:

- Do Not Track browser settings
- GDPR cookie consent requirements
- User privacy preferences

All tracking and advertising services are conditionally loaded based on these privacy settings.