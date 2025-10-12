# Configuration Guide

This guide covers all configuration options available in the Parsa Redesigned Hugo theme.

## Table of Contents

- [Basic Configuration](#basic-configuration)
- [Design Settings](#design-settings)
- [Feature Toggles](#feature-toggles)
- [SEO Configuration](#seo-configuration)
- [Social Media](#social-media)
- [Performance Settings](#performance-settings)
- [Multilingual Configuration](#multilingual-configuration)
- [Menu Configuration](#menu-configuration)
- [Content Configuration](#content-configuration)
- [Advanced Settings](#advanced-settings)

## Basic Configuration

### Site Information

```toml
# hugo.toml
baseURL = "https://yoursite.com"
languageCode = "en-us"
title = "Your Site Title"
theme = "parsa-redesigned"

[params]
  # Site description for SEO and social sharing
  description = "Your site description for meta tags and social sharing"
  
  # Default author information
  author = "Your Name"
  authorImage = "/images/author.jpg"
  authorBio = "Brief author biography"
  
  # Site logo
  logo = "/images/logo.svg"
  logoAlt = "Site logo description"
  
  # Favicon
  favicon = "/favicon.ico"
```

### Hugo Module Configuration

```toml
[module]
  [module.hugoVersion]
    extended = true
    min = "0.147.2"
    max = ""
  
  # Theme as Hugo module
  [[module.imports]]
    path = "github.com/yourusername/parsa-redesigned"
```

## Design Settings

### Color Scheme

```toml
[params.design]
  # Primary brand colors
  primaryColor = "#3b82f6"        # Blue-500
  accentColor = "#8b5cf6"         # Violet-500
  
  # Background colors
  backgroundColor = "#ffffff"      # White
  cardBackground = "#f9fafb"      # Gray-50
  
  # Text colors
  textColor = "#1f2937"           # Gray-800
  mutedTextColor = "#6b7280"      # Gray-500
  linkColor = "#3b82f6"           # Blue-500
  
  # Border and shadow colors
  borderColor = "#e5e7eb"         # Gray-200
  shadowColor = "rgba(0, 0, 0, 0.1)"
```

### Typography

```toml
[params.typography]
  # Font families
  headingFont = "Inter, system-ui, sans-serif"
  bodyFont = "Inter, system-ui, sans-serif"
  codeFont = "JetBrains Mono, Consolas, monospace"
  
  # Font sizes (Tailwind CSS classes)
  headingSize = "text-4xl"        # Main headings
  subheadingSize = "text-2xl"     # Subheadings
  bodySize = "text-base"          # Body text
  smallSize = "text-sm"           # Small text
  
  # Line heights
  headingLineHeight = "leading-tight"
  bodyLineHeight = "leading-relaxed"
```

### Layout Settings

```toml
[params.layout]
  # Container settings
  maxWidth = "max-w-7xl"          # Maximum container width
  contentWidth = "max-w-4xl"      # Content area width
  
  # Grid settings
  articlesPerRow = 3              # Articles per row on desktop
  articlesPerRowTablet = 2        # Articles per row on tablet
  articlesPerRowMobile = 1        # Articles per row on mobile
  
  # Spacing
  sectionSpacing = "py-16"        # Section vertical spacing
  cardSpacing = "gap-8"           # Card grid spacing
```

## Feature Toggles

### Core Features

```toml
[params.features]
  # Search functionality
  enableSearch = true
  searchPlaceholder = "Search articles..."
  searchMinLength = 2
  
  # Social sharing
  enableSocialSharing = true
  
  # Animations and transitions
  enableAnimations = true
  respectReducedMotion = true
  
  # Dark mode (future feature)
  enableDarkMode = false
  
  # Comments (if using external service)
  enableComments = false
  commentsProvider = "disqus"     # disqus, utterances, etc.
```

### Content Features

```toml
[params.content]
  # Article features
  showReadTime = true
  showWordCount = false
  showAuthor = true
  showDate = true
  showCategories = true
  showTags = true
  
  # Excerpt settings
  excerptLength = 160             # Characters
  showExcerpt = true
  
  # Featured articles
  enableFeatured = true
  featuredCount = 2               # Number of featured articles on homepage
  
  # Related articles
  enableRelated = true
  relatedCount = 3                # Number of related articles to show
```

## SEO Configuration

### Basic SEO

```toml
[params.seo]
  # Meta tags
  enableOpenGraph = true
  enableTwitterCard = true
  enableJsonLd = true             # Structured data
  
  # Default images
  defaultImage = "/images/og-default.jpg"
  defaultImageAlt = "Default social sharing image"
  
  # Site verification
  googleSiteVerification = ""     # Google Search Console
  bingSiteVerification = ""       # Bing Webmaster Tools
  
  # Analytics
  googleAnalytics = ""            # GA4 measurement ID
  enableGoogleAnalytics = false
```

### OpenGraph Settings

```toml
[params.openGraph]
  siteName = "Your Site Name"
  locale = "en_US"
  type = "website"
  
  # Facebook
  facebookAppId = ""              # Facebook App ID
  facebookAdmins = ""             # Facebook Admin IDs
  
  # Default values
  defaultTitle = "Your Site Title"
  defaultDescription = "Your site description"
  defaultImage = "/images/og-default.jpg"
```

### Twitter Card Settings

```toml
[params.twitterCard]
  site = "@yourusername"          # Site Twitter handle
  creator = "@yourusername"       # Default creator handle
  
  # Default card type
  cardType = "summary_large_image"
```

## Social Media

### Social Links

```toml
[params.social]
  # Social media profiles
  twitter = "https://twitter.com/yourusername"
  facebook = "https://facebook.com/yourpage"
  instagram = "https://instagram.com/yourusername"
  linkedin = "https://linkedin.com/in/yourprofile"
  github = "https://github.com/yourusername"
  youtube = "https://youtube.com/c/yourchannel"
  
  # Display settings
  showInHeader = true             # Show social links in header
  showInFooter = true             # Show social links in footer
  openInNewTab = true             # Open links in new tab
```

### Social Sharing

```toml
[params.sharing]
  # Enabled platforms
  twitter = true
  facebook = true
  linkedin = true
  reddit = false
  pinterest = false
  
  # Sharing options
  enableCopyLink = true           # Copy link button
  showShareCount = false          # Show share counts (requires API)
  
  # Custom sharing text
  twitterText = "Check out this article:"
  facebookText = "Interesting read:"
```

## Performance Settings

### Asset Optimization

```toml
[params.performance]
  # CSS optimization
  enableCriticalCSS = true        # Inline critical CSS
  enableCSSMinification = true    # Minify CSS
  enableCSSPurging = true         # Remove unused CSS
  
  # JavaScript optimization
  enableJSMinification = true     # Minify JavaScript
  enableJSBundling = true         # Bundle JavaScript files
  
  # Image optimization
  enableImageOptimization = true  # Optimize images
  enableLazyLoading = true        # Lazy load images
  enableWebP = true               # Use WebP format when supported
  
  # Caching
  enableAssetFingerprinting = true # Add fingerprints to assets
  cacheMaxAge = "1y"              # Cache duration
```

### Loading Optimization

```toml
[params.loading]
  # Preloading
  preloadFonts = true             # Preload web fonts
  preloadCriticalImages = true    # Preload above-fold images
  
  # Service Worker (experimental)
  enableServiceWorker = false     # Enable PWA features
  
  # Resource hints
  enableDNSPrefetch = true        # DNS prefetch for external domains
  enablePreconnect = true         # Preconnect to external domains
```

## Multilingual Configuration

### Language Settings

```toml
defaultContentLanguage = "en"
defaultContentLanguageInSubdir = false

[languages]
  [languages.en]
    languageName = "English"
    languageCode = "en-US"
    weight = 1
    title = "Your Site Title"
    
    [languages.en.params]
      description = "English site description"
      
  [languages.zh]
    languageName = "中文"
    languageCode = "zh-CN"
    weight = 2
    title = "您的网站标题"
    
    [languages.zh.params]
      description = "中文网站描述"
```

### Translation Files

Create translation files in `i18n/`:

```yaml
# i18n/en.yaml
- id: readMore
  translation: "Read More"
- id: categories
  translation: "Categories"
- id: tags
  translation: "Tags"
- id: search
  translation: "Search"
- id: noResults
  translation: "No results found"
- id: shareArticle
  translation: "Share this article"

# i18n/zh.yaml
- id: readMore
  translation: "閱讀更多"
- id: categories
  translation: "分類"
- id: tags
  translation: "標籤"
- id: search
  translation: "搜索"
- id: noResults
  translation: "未找到結果"
- id: shareArticle
  translation: "分享這篇文章"
```

## Menu Configuration

### Main Navigation

```toml
[menu]
  [[menu.main]]
    name = "Home"
    url = "/"
    weight = 1
    
  [[menu.main]]
    name = "Categories"
    url = "/categories/"
    weight = 2
    
  [[menu.main]]
    name = "Tags"
    url = "/tags/"
    weight = 3
    
  [[menu.main]]
    name = "About"
    url = "/about/"
    weight = 4
    
  [[menu.main]]
    name = "Contact"
    url = "/contact/"
    weight = 5
```

### Footer Menu

```toml
  [[menu.footer]]
    name = "Privacy Policy"
    url = "/privacy/"
    weight = 1
    
  [[menu.footer]]
    name = "Terms of Service"
    url = "/terms/"
    weight = 2
    
  [[menu.footer]]
    name = "Contact"
    url = "/contact/"
    weight = 3
```

### Language-Specific Menus

```toml
[languages.en.menu]
  [[languages.en.menu.main]]
    name = "Home"
    url = "/"
    weight = 1

[languages.zh.menu]
  [[languages.zh.menu.main]]
    name = "首页"
    url = "/"
    weight = 1
```

## Content Configuration

### Pagination

```toml
paginate = 9                      # Articles per page
paginatePath = "page"             # URL path for pagination

[params.pagination]
  showPageNumbers = true          # Show page numbers
  showPrevNext = true             # Show previous/next links
  maxPages = 5                    # Maximum page numbers to show
```

### Taxonomies

```toml
[taxonomies]
  category = "categories"
  tag = "tags"
  author = "authors"
  series = "series"

[params.taxonomies]
  # Category settings
  showCategoryCount = true        # Show article count in categories
  categoryDescription = true      # Show category descriptions
  
  # Tag settings
  showTagCount = true             # Show article count in tags
  tagCloudMinSize = "text-sm"     # Minimum tag size
  tagCloudMaxSize = "text-2xl"    # Maximum tag size
```

### Archives

```toml
[params.archives]
  enableMonthlyArchives = true    # Enable monthly archive pages
  enableYearlyArchives = true     # Enable yearly archive pages
  archiveDateFormat = "January 2006" # Archive date format
```

## Advanced Settings

### Custom CSS and JavaScript

```toml
[params.custom]
  # Custom CSS files (relative to assets/css/)
  customCSS = ["custom.css", "overrides.css"]
  
  # Custom JavaScript files (relative to assets/js/)
  customJS = ["custom.js", "analytics.js"]
  
  # External stylesheets
  externalCSS = [
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  ]
  
  # External scripts
  externalJS = [
    "https://cdn.example.com/script.js"
  ]
```

### Build Configuration

```toml
[build]
  writeStats = true               # Generate build statistics
  
[caches]
  [caches.getjson]
    maxAge = "10m"
  [caches.getcsv]
    maxAge = "10m"
  [caches.images]
    maxAge = "1h"
  [caches.assets]
    maxAge = "1h"
```

### Output Formats

```toml
[outputs]
  home = ["HTML", "RSS", "JSON"]  # Homepage outputs
  section = ["HTML", "RSS"]       # Section page outputs
  page = ["HTML"]                 # Single page outputs

[outputFormats]
  [outputFormats.RSS]
    mediatype = "application/rss"
    baseName = "feed"             # Creates feed.xml instead of index.xml
```

### Security

```toml
[security]
  [security.funcs]
    getenv = ["^HUGO_", "^CI$"]   # Allowed environment variables
  
  [security.http]
    methods = ["(?i)GET|POST"]    # Allowed HTTP methods
    urls = [".*"]                 # Allowed URLs for remote resources
```

## Environment-Specific Configuration

### Development

```toml
# config/development/hugo.toml
[params.development]
  enableLiveReload = true
  showDrafts = true
  enableDebugMode = true
  disableMinification = true
```

### Production

```toml
# config/production/hugo.toml
[params.production]
  enableMinification = true
  enableFingerprinting = true
  enableGoogleAnalytics = true
  disableDebugMode = true
```

This configuration guide covers all available options in the Parsa Redesigned theme. Customize these settings according to your needs and site requirements.