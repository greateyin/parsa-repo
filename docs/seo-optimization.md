# SEO Optimization Guide

This document explains the comprehensive SEO features implemented in the Parsa Redesigned theme.

## Features Overview

### 1. Meta Tags
- **Basic SEO meta tags**: title, description, author, keywords
- **Article-specific meta tags**: published time, modified time, author, categories, tags
- **Robots meta tags**: index/noindex control per page
- **Security headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- **Performance hints**: preconnect, dns-prefetch

### 2. Structured Data (JSON-LD)
- **Website schema**: For homepage with search action
- **Article schema**: For blog posts with complete metadata
- **Organization schema**: For about pages
- **Breadcrumb schema**: For section pages
- **FAQ schema**: For pages with FAQ front matter
- **HowTo schema**: For tutorial pages

### 3. OpenGraph Integration
- Complete OpenGraph meta tags for social sharing
- Support for custom OG images per page
- Article-specific OpenGraph data
- Multilingual OpenGraph support

### 4. Twitter Cards
- Summary and large image card support
- Custom Twitter images per page
- Twitter-specific meta tags

### 5. Sitemap Enhancement
- Extended sitemap with multilingual support
- Image sitemap integration
- News sitemap for recent articles
- Custom change frequency and priority

### 6. Robots.txt
- Production vs development configurations
- Specific bot configurations
- Sitemap references
- Security-focused disallow rules

## Configuration

### Basic SEO Setup

```toml
# hugo.toml
[params]
  description = "Your site description"
  keywords = ["keyword1", "keyword2", "keyword3"]

[params.seo]
  enableSEO = true
  enableOpenGraph = true
  enableTwitterCard = true
  enableStructuredData = true
  defaultImage = "/images/og-default.jpg"
```

### Author Configuration

```toml
[params.author]
  name = "Your Name"
  url = "https://yourwebsite.com"
  image = "/images/author.jpg"
  bio = "Your bio description"
```

### Organization Schema

```toml
[params.organization]
  name = "Your Organization"
  logo = "/images/logo.png"
  
  [params.organization.address]
    "@type" = "PostalAddress"
    streetAddress = "123 Main Street"
    addressLocality = "City"
    addressRegion = "State"
    postalCode = "12345"
    addressCountry = "US"
```

### Site Verification

```toml
[params.seo]
  googleSiteVerification = "your-google-verification-code"
  bingSiteVerification = "your-bing-verification-code"
```

## Front Matter Options

### Basic Article SEO

```yaml
---
title: "Article Title"
description: "Custom meta description for this article"
keywords: ["keyword1", "keyword2"]
author: "Author Name"
image: "images/article-image.jpg"
imageAlt: "Descriptive alt text"
---
```

### Custom OpenGraph

```yaml
---
og:
  title: "Custom OG Title"
  description: "Custom OG description"
  image: "images/custom-og-image.jpg"
  type: "article"
---
```

### Custom Twitter Card

```yaml
---
twitter:
  card: "summary_large_image"
  title: "Custom Twitter title"
  description: "Custom Twitter description"
  image: "images/twitter-card.jpg"
---
```

### FAQ Schema

```yaml
---
faq:
  - question: "What is this about?"
    answer: "This is the answer to the question."
  - question: "How does it work?"
    answer: "It works by doing this and that."
---
```

### HowTo Schema

```yaml
---
howto:
  - name: "Step 1"
    text: "Do this first thing"
    image: "images/step1.jpg"
  - name: "Step 2"
    text: "Then do this second thing"
---
```

### SEO Control

```yaml
---
# Prevent indexing of this page
noindex: true

# Custom canonical URL
canonical: "https://example.com/custom-canonical"

# Custom sitemap settings
sitemap:
  changefreq: "daily"
  priority: 0.8
---
```

## Performance Optimization

### Preconnect Domains

```toml
[params.seo]
  preconnect = [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com"
  ]
  
  dnsPrefetch = [
    "https://www.google-analytics.com"
  ]
```

### Content Security Policy

```toml
[params.seo]
  enableCSP = true  # Enable basic CSP headers
```

## PWA Integration

```toml
[params.pwa]
  name = "Your App Name"
  shortName = "YourApp"
  description = "App description"
  themeColor = "#3b82f6"
  backgroundColor = "#ffffff"
```

## Multilingual SEO

The theme automatically handles:
- `hreflang` tags for multilingual sites
- Language-specific structured data
- Multilingual sitemaps
- Proper canonical URLs for translations

## Best Practices

### 1. Images
- Always include `imageAlt` for accessibility
- Use appropriate image sizes (1200x630 for OG images)
- Optimize images for web (WebP format recommended)

### 2. Content
- Keep meta descriptions under 160 characters
- Use descriptive, keyword-rich titles
- Include relevant keywords naturally in content

### 3. Structure
- Use proper heading hierarchy (H1 → H2 → H3)
- Include internal links to related content
- Maintain consistent URL structure

### 4. Performance
- Enable Hugo's minification in production
- Use appropriate caching headers
- Optimize images and assets

## Validation

### Tools for Testing
- **Google Search Console**: Monitor search performance
- **Google Rich Results Test**: Validate structured data
- **Facebook Sharing Debugger**: Test OpenGraph tags
- **Twitter Card Validator**: Test Twitter cards
- **Lighthouse**: Overall SEO and performance audit

### Common Issues
- Missing meta descriptions
- Duplicate title tags
- Invalid structured data
- Missing alt text for images
- Slow loading times

## Monitoring

Set up monitoring for:
- Search console errors
- Core Web Vitals
- Crawl errors
- Structured data issues
- Social sharing performance

This comprehensive SEO implementation ensures your Hugo site follows modern SEO best practices and provides excellent search engine visibility.