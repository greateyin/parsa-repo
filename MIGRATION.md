# Migration Guide: Original Parsa to Parsa Redesigned

This guide helps you migrate from the original Parsa Hugo theme to the redesigned version with modern UI and Tailwind CSS.

## Table of Contents

- [Overview](#overview)
- [Pre-Migration Checklist](#pre-migration-checklist)
- [Configuration Migration](#configuration-migration)
- [Content Migration](#content-migration)
- [Template Customizations](#template-customizations)
- [Asset Migration](#asset-migration)
- [Testing After Migration](#testing-after-migration)
- [Troubleshooting](#troubleshooting)
- [Rollback Plan](#rollback-plan)

## Overview

### What's Changed

**Design & Styling:**
- ❌ Bootstrap 4/5 → ✅ Tailwind CSS 3.x
- ❌ Traditional layouts → ✅ Modern card-based design
- ❌ Basic responsive → ✅ Mobile-first responsive design
- ❌ Limited animations → ✅ Smooth transitions and animations
- ❌ Standard typography → ✅ Modern typography with gradient effects

**Technical Improvements:**
- ✅ Hugo Pipes integration for asset processing
- ✅ Critical CSS inlining for performance
- ✅ Enhanced SEO with OpenGraph and Twitter Cards
- ✅ Improved accessibility (WCAG 2.1 AA)
- ✅ Better multilingual support
- ✅ Modern JavaScript (ES6+)

**New Features:**
- ✅ Enhanced search functionality
- ✅ Social sharing integration
- ✅ Performance optimizations
- ✅ Comprehensive testing suite
- ✅ Better shortcodes

### What's Preserved

- ✅ All Hugo functionality and features
- ✅ Content structure and front matter
- ✅ URL structure and permalinks
- ✅ Taxonomy system (categories, tags)
- ✅ Menu configuration
- ✅ Multilingual support
- ✅ Basic shortcodes compatibility

## Pre-Migration Checklist

### 1. Backup Your Site

```bash
# Create a full backup
cp -r /path/to/your-hugo-site /path/to/backup-$(date +%Y%m%d)

# Backup your git repository
git tag pre-migration-backup
git push origin pre-migration-backup
```

### 2. Document Current Customizations

Create a list of your current customizations:

```bash
# List custom templates
find layouts/ -name "*.html" 2>/dev/null || echo "No custom layouts"

# List custom assets
find assets/ static/ -type f 2>/dev/null || echo "No custom assets"

# Check configuration
cat hugo.toml config.toml config.yaml 2>/dev/null | head -50
```

### 3. Test Current Site

```bash
# Build current site
hugo --minify

# Test locally
hugo server -D
```

### 4. Check Hugo Version

```bash
hugo version
# Ensure you have Hugo Extended v0.147.2 or higher
```

## Configuration Migration

### 1. Basic Configuration

**Original Parsa (`config.toml`):**
```toml
baseURL = "https://example.com"
languageCode = "en-us"
title = "Parsa"
theme = "parsa"

# Site parameters
[params]
  description = "Site description"
  author = "Author Name"
  logo = "images/logo.png"
  
  # Contact info
  email = "email@example.com"
  phone = "+1234567890"
  address = "123 Street, City"
  
  # Social media
  facebook = "https://facebook.com/username"
  twitter = "https://twitter.com/username"
  instagram = "https://instagram.com/username"
```

**Parsa Redesigned (`hugo.toml`):**
```toml
baseURL = "https://example.com"
languageCode = "en-us"
title = "Parsa Redesigned"
theme = "parsa-redesigned"

# Hugo module configuration
[module]
  [module.hugoVersion]
    extended = true
    min = "0.147.2"

# Site parameters
[params]
  description = "Site description"
  author = "Author Name"
  logo = "/images/logo.svg"  # Consider SVG for better quality
  
  # Design settings (new)
  [params.design]
    primaryColor = "#3b82f6"
    accentColor = "#8b5cf6"
  
  # Contact info (restructured)
  [params.contact]
    email = "email@example.com"
    phone = "+1234567890"
    address = "123 Street, City"
  
  # Social media (restructured)
  [params.social]
    facebook = "https://facebook.com/username"
    twitter = "https://twitter.com/username"
    instagram = "https://instagram.com/username"
  
  # New features
  [params.features]
    enableSearch = true
    enableSocialSharing = true
    enableAnimations = true
  
  # SEO settings (new)
  [params.seo]
    enableOpenGraph = true
    enableTwitterCard = true
    defaultImage = "/images/og-default.jpg"

# Output formats for search (new)
[outputs]
  home = ["HTML", "RSS", "JSON"]
```

### 2. Menu Migration

**Original:**
```toml
[[menu.main]]
  name = "Home"
  URL = "/"
  weight = 1

[[menu.main]]
  name = "About"
  URL = "about"
  weight = 2
```

**Redesigned:**
```toml
[[menu.main]]
  name = "Home"
  url = "/"  # Note: lowercase 'url'
  weight = 1

[[menu.main]]
  name = "About"
  url = "/about/"  # Note: leading and trailing slashes
  weight = 2
```

### 3. Multilingual Migration

**Original:**
```toml
[Languages]
  [Languages.en]
    weight = 1
    languageName = "En"
    
  [Languages.fr]
    weight = 2
    languageName = "Fr"
```

**Redesigned:**
```toml
[languages]  # Note: lowercase
  [languages.en]
    weight = 1
    languageName = "English"  # Full language names
    languageCode = "en-US"    # Added language codes
    
  [languages.fr]
    weight = 2
    languageName = "Français"
    languageCode = "fr-FR"
```

## Content Migration

### 1. Front Matter Updates

**Original front matter:**
```yaml
---
title: "Post Title"
date: 2023-01-01T00:00:00Z
image: "images/post.jpg"
author: "Author Name"
categories: ["category"]
tags: ["tag1", "tag2"]
type: "post"
---
```

**Enhanced front matter (optional additions):**
```yaml
---
title: "Post Title"
date: 2023-01-01T00:00:00Z
lastmod: 2023-01-01T00:00:00Z  # Added for SEO
image: "images/post.jpg"
imageAlt: "Descriptive alt text"  # Added for accessibility
author: "Author Name"
categories: ["category"]
tags: ["tag1", "tag2"]
featured: false  # New: mark as featured article
draft: false     # Explicit draft status

# Enhanced SEO (optional)
description: "Article description for SEO"
excerpt: "Brief excerpt for article cards"

# Social sharing (optional)
og:
  title: "Custom OpenGraph title"
  description: "Custom OG description"
  image: "images/og-specific.jpg"

twitter:
  card: "summary_large_image"
  image: "images/twitter-card.jpg"
---
```

### 2. Image Path Updates

**Check and update image paths:**
```bash
# Find all content files with images
grep -r "images/" content/ --include="*.md"

# Update paths if needed (example)
# Old: images/post.jpg
# New: /images/post.jpg (absolute path recommended)
```

### 3. Shortcode Migration

**Original shortcodes work, but enhanced versions available:**

```markdown
<!-- Original (still works) -->
{{< figure src="image.jpg" title="Title" >}}

<!-- Enhanced (recommended) -->
{{< figure src="image.jpg" alt="Descriptive alt text" caption="Image caption" >}}
```

## Template Customizations

### 1. Layout Override Migration

**If you have custom layouts, update them for Tailwind CSS:**

**Original Bootstrap layout:**
```html
<!-- layouts/_default/single.html -->
<div class="container">
  <div class="row">
    <div class="col-lg-8">
      <article class="card">
        <div class="card-body">
          <h1 class="card-title">{{ .Title }}</h1>
          <div class="card-text">{{ .Content }}</div>
        </div>
      </article>
    </div>
  </div>
</div>
```

**Redesigned Tailwind layout:**
```html
<!-- layouts/_default/single.html -->
<div class="container mx-auto px-4">
  <div class="max-w-4xl mx-auto">
    <article class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="p-8">
        <h1 class="text-4xl font-bold mb-6 text-gray-900">{{ .Title }}</h1>
        <div class="prose prose-lg max-w-none">{{ .Content }}</div>
      </div>
    </article>
  </div>
</div>
```

### 2. Partial Template Updates

**Update custom partials to use new structure:**

**Original header partial:**
```html
<!-- layouts/partials/header.html -->
<nav class="navbar navbar-expand-lg">
  <a class="navbar-brand" href="{{ .Site.BaseURL }}">
    <img src="{{ .Site.Params.logo }}" alt="logo">
  </a>
</nav>
```

**Redesigned header partial:**
```html
<!-- layouts/partials/header/navbar.html -->
<nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <a href="{{ .Site.BaseURL }}" class="flex items-center">
        <img src="{{ .Site.Params.logo }}" alt="{{ .Site.Title }}" class="h-8 w-auto">
      </a>
    </div>
  </div>
</nav>
```

## Asset Migration

### 1. CSS Migration

**Remove Bootstrap dependencies:**
```bash
# Remove old CSS files
rm -f static/css/bootstrap.min.css
rm -f static/css/style.css  # If it contains Bootstrap overrides
```

**Add Tailwind CSS setup:**
```bash
# Install Node.js dependencies
npm init -y
npm install -D tailwindcss @tailwindcss/typography postcss autoprefixer

# Create Tailwind config
npx tailwindcss init -p
```

**Create `assets/css/tailwind.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors;
  }
}
```

### 2. JavaScript Migration

**Update jQuery dependencies:**
```javascript
// Old jQuery code
$(document).ready(function() {
  $('.navbar-toggler').click(function() {
    $('.navbar-collapse').toggleClass('show');
  });
});

// New vanilla JavaScript
document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.querySelector('[data-toggle="mobile-menu"]');
  const mobileMenu = document.querySelector('#mobile-menu');
  
  if (toggleButton && mobileMenu) {
    toggleButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }
});
```

### 3. Image Optimization

**Convert images to modern formats:**
```bash
# Install image optimization tools
npm install -g @squoosh/cli

# Convert images to WebP
for img in static/images/*.{jpg,png}; do
  squoosh-cli --webp '{"quality":80}' "$img"
done
```

## Testing After Migration

### 1. Build Test

```bash
# Clean build
rm -rf public/
hugo --minify

# Check for errors
echo $?  # Should return 0
```

### 2. Local Testing

```bash
# Start development server
hugo server -D

# Test in browser
open http://localhost:1313
```

### 3. Content Verification

**Check key pages:**
- [ ] Homepage loads correctly
- [ ] Article pages display properly
- [ ] Category pages work
- [ ] Tag pages work
- [ ] Search functionality works
- [ ] Navigation menus work
- [ ] Mobile responsive design
- [ ] Social sharing buttons

### 4. Performance Testing

```bash
# Install testing tools
npm install -g lighthouse

# Run Lighthouse audit
lighthouse http://localhost:1313 --output html --output-path ./lighthouse-report.html
```

### 5. Accessibility Testing

```bash
# Install accessibility testing
npm install -g @axe-core/cli

# Run accessibility audit
axe http://localhost:1313
```

## Troubleshooting

### Common Issues

#### 1. Build Errors

**Error: "template not found"**
```bash
# Check template paths
find layouts/ -name "*.html" | head -10

# Ensure baseof.html exists
ls layouts/_default/baseof.html
```

**Error: "asset not found"**
```bash
# Check asset paths
ls assets/css/tailwind.css
ls assets/js/main.js

# Verify Hugo Pipes configuration
hugo config | grep -A 5 "build"
```

#### 2. Styling Issues

**Tailwind CSS not loading:**
```bash
# Check PostCSS configuration
cat postcss.config.js

# Verify Tailwind config
cat tailwind.config.js

# Check Hugo Pipes processing
hugo --debug 2>&1 | grep -i "css\|tailwind"
```

**Missing styles:**
```bash
# Check if Tailwind is purging needed classes
# Add classes to safelist in tailwind.config.js
module.exports = {
  content: ['./layouts/**/*.html', './content/**/*.md'],
  safelist: [
    'bg-blue-500',
    'text-white',
    // Add other classes that might be purged
  ]
}
```

#### 3. JavaScript Issues

**Scripts not loading:**
```html
<!-- Check script loading in baseof.html -->
{{ $js := resources.Get "js/main.js" | js.Build | minify | fingerprint }}
<script src="{{ $js.RelPermalink }}" defer></script>
```

#### 4. Image Issues

**Images not displaying:**
```bash
# Check image paths
ls static/images/
ls assets/images/

# Verify image processing
hugo --debug 2>&1 | grep -i "image"
```

### Performance Issues

**Slow build times:**
```toml
# Optimize Hugo configuration
[caches]
  [caches.images]
    maxAge = "1h"
  [caches.assets]
    maxAge = "1h"

[build]
  writeStats = true
```

**Large bundle sizes:**
```bash
# Analyze bundle size
hugo --minify --templateMetrics

# Check asset sizes
ls -lh public/css/
ls -lh public/js/
```

## Rollback Plan

### 1. Quick Rollback

```bash
# Restore from backup
cp -r /path/to/backup-$(date +%Y%m%d)/* /path/to/your-hugo-site/

# Or use git
git checkout pre-migration-backup
```

### 2. Partial Rollback

**Keep content, restore theme:**
```bash
# Keep content and config, restore old theme
git checkout HEAD~1 -- themes/
git checkout HEAD~1 -- hugo.toml

# Rebuild
hugo server -D
```

### 3. Gradual Migration

**Migrate in stages:**
1. First: Update configuration only
2. Second: Migrate templates
3. Third: Update assets
4. Fourth: Add new features

## Post-Migration Checklist

- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] Search functionality works
- [ ] Social sharing works
- [ ] Mobile responsive design
- [ ] Performance meets targets (Lighthouse > 90)
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] SEO meta tags present
- [ ] Analytics tracking works
- [ ] Contact forms work (if applicable)
- [ ] Comments work (if applicable)
- [ ] Multilingual switching works (if applicable)

## Getting Help

If you encounter issues during migration:

1. **Check the documentation**: [README.md](README.md), [CONFIGURATION.md](CONFIGURATION.md)
2. **Review troubleshooting**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. **Search existing issues**: [GitHub Issues](https://github.com/yourusername/parsa-redesigned/issues)
4. **Create a new issue**: Include your configuration, error messages, and steps to reproduce

## Migration Success Tips

1. **Take it slow**: Migrate one section at a time
2. **Test frequently**: Build and test after each major change
3. **Keep backups**: Multiple backup points during migration
4. **Document changes**: Keep notes of what you modify
5. **Use version control**: Commit changes in logical chunks

This migration guide should help you successfully transition from the original Parsa theme to the redesigned version while preserving your content and customizations.