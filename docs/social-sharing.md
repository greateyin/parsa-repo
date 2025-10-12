# Social Sharing and OpenGraph Implementation

This document describes the OpenGraph and social sharing features implemented in the Parsa Redesigned Hugo theme.

## Features

### OpenGraph Meta Tags

The theme automatically generates OpenGraph meta tags for better social media integration:

- **Basic Tags**: title, description, type, URL, site name
- **Article Tags**: published time, modified time, author, section, tags  
- **Image Support**: automatic image URL generation with alt text
- **Locale Support**: internationalization ready

### Twitter Cards

Full Twitter Card implementation with support for:

- Summary cards with large images
- Player cards for video content
- Proper image and alt text handling
- Custom Twitter-specific metadata

### Social Sharing Buttons

Modern, accessible social sharing buttons for:

- **Twitter**: with hashtags and mentions
- **Facebook**: direct sharing integration
- **LinkedIn**: professional sharing with metadata
- **Copy Link**: modern clipboard API with fallback

## Configuration

### Site Configuration

Add to your `hugo.toml`:

```toml
[params]
  enableSocialSharing = true
  enableOpenGraph = true
  enableTwitterCard = true
  
  [params.openGraph]
    siteName = "Your Site Name"
    defaultImage = "/images/og-default.jpg"
    twitterSite = "@yourusername"
    twitterCreator = "@yourusername"
    facebookAppId = "your-app-id"
    locale = "en_US"
```

### Front Matter Options

Customize per article:

```yaml
---
title: "Article Title"
description: "Article description for SEO"
image: "images/article-image.jpg"
imageAlt: "Descriptive alt text"

# OpenGraph overrides
og:
  title: "Custom OG Title"
  description: "Custom OG description"
  image: "images/custom-og-image.jpg"
  type: "article"

# Twitter Card overrides
twitter:
  card: "summary_large_image"
  title: "Custom Twitter Title"
  description: "Custom Twitter description"
  image: "images/custom-twitter-image.jpg"
---
```

## Image Requirements

### OpenGraph Images
- **Size**: 1200x630 pixels (recommended)
- **Format**: JPG, PNG, or WebP
- **File Size**: Under 1MB for best performance
- **Aspect Ratio**: 1.91:1 for optimal display

### Twitter Card Images
- **Size**: 1200x675 pixels (recommended)
- **Format**: JPG, PNG, WebP, or GIF
- **File Size**: Under 5MB
- **Aspect Ratio**: 16:9 for summary_large_image

## Internationalization

The theme includes translations for social sharing text:

### English (en.yaml)
```yaml
- id: shareArticle
  translation: "Share this article:"
- id: shareOnTwitter
  translation: "Share on Twitter"
- id: shareOnFacebook
  translation: "Share on Facebook"
- id: shareOnLinkedIn
  translation: "Share on LinkedIn"
- id: copyLink
  translation: "Copy Link"
- id: linkCopied
  translation: "Copied!"
```

### Chinese (zh.yaml)
```yaml
- id: shareArticle
  translation: "分享文章："
- id: shareOnTwitter
  translation: "在 Twitter 上分享"
- id: shareOnFacebook
  translation: "在 Facebook 上分享"
- id: shareOnLinkedIn
  translation: "在 LinkedIn 上分享"
- id: copyLink
  translation: "复制链接"
- id: linkCopied
  translation: "已复制！"
```

## Accessibility Features

- **ARIA Labels**: All buttons include proper accessibility labels
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Visible focus indicators
- **Screen Reader Support**: Semantic HTML and proper labeling

## Browser Support

- **Modern Browsers**: Full feature support
- **Clipboard API**: Modern browsers with secure context
- **Fallback Support**: Legacy clipboard functionality for older browsers
- **Progressive Enhancement**: Core functionality works without JavaScript

## Testing

### Validation Tools

- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Inspector**: https://www.linkedin.com/post-inspector/
- **OpenGraph Checker**: https://opengraphcheck.com/

### Testing Checklist

- [ ] OpenGraph meta tags are properly generated
- [ ] Twitter Card meta tags are present
- [ ] Images load correctly in social previews
- [ ] Sharing buttons work on all platforms
- [ ] Copy link functionality works
- [ ] Accessibility features are functional
- [ ] Responsive design works on mobile

## Troubleshooting

### Common Issues

1. **Images not showing in previews**
   - Ensure images are publicly accessible
   - Check image URLs are absolute
   - Verify image dimensions meet platform requirements

2. **Meta tags not updating**
   - Clear social platform caches
   - Use debugging tools to refresh
   - Check Hugo build output

3. **Copy link not working**
   - Ensure HTTPS for clipboard API
   - Fallback should work in all browsers
   - Check JavaScript console for errors

### Performance Optimization

- Use optimized images (WebP with fallbacks)
- Implement lazy loading for non-critical images
- Minify and compress assets
- Use CDN for image delivery