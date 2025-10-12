# Troubleshooting Guide

This guide helps you resolve common issues with the Parsa Redesigned Hugo theme.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Build Errors](#build-errors)
- [Styling Problems](#styling-problems)
- [JavaScript Issues](#javascript-issues)
- [Performance Problems](#performance-problems)
- [Content Display Issues](#content-display-issues)
- [SEO and Social Sharing](#seo-and-social-sharing)
- [Multilingual Issues](#multilingual-issues)
- [Search Functionality](#search-functionality)
- [Mobile and Responsive Issues](#mobile-and-responsive-issues)
- [Deployment Problems](#deployment-problems)
- [Getting Help](#getting-help)

## Installation Issues

### Hugo Version Compatibility

**Problem**: Theme doesn't work with your Hugo version
```
Error: theme requires Hugo Extended version 0.147.2 or higher
```

**Solution**:
```bash
# Check your Hugo version
hugo version

# Install Hugo Extended (macOS with Homebrew)
brew install hugo

# Install Hugo Extended (Linux)
wget https://github.com/gohugoio/hugo/releases/download/v0.147.2/hugo_extended_0.147.2_Linux-64bit.tar.gz
tar -xzf hugo_extended_0.147.2_Linux-64bit.tar.gz
sudo mv hugo /usr/local/bin/

# Verify installation
hugo version
# Should show: hugo v0.147.2+extended
```

### Node.js Dependencies

**Problem**: Tailwind CSS not processing
```
Error: failed to load config from postcss.config.js
```

**Solution**:
```bash
# Install Node.js (if not installed)
# Visit https://nodejs.org/ or use package manager

# Install dependencies
npm install

# If package.json doesn't exist, create it
npm init -y
npm install -D tailwindcss @tailwindcss/typography postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p
```

### Theme Installation

**Problem**: Theme not found
```
Error: theme "parsa-redesigned" not found
```

**Solutions**:

**Method 1: Check theme directory**
```bash
# Verify theme exists
ls themes/parsa-redesigned/

# If missing, clone the theme
git submodule add https://github.com/yourusername/parsa-redesigned.git themes/parsa-redesigned
```

**Method 2: Hugo Modules**
```bash
# Initialize as Hugo module
hugo mod init github.com/yourusername/yoursite

# Add theme to hugo.toml
[module]
  [[module.imports]]
    path = "github.com/yourusername/parsa-redesigned"

# Download theme
hugo mod get
```

## Build Errors

### Template Errors

**Problem**: Template execution errors
```
Error: template: _default/single.html:10:15: executing "_default/single.html"
```

**Solution**:
```bash
# Check template syntax
hugo --debug --verbose

# Common fixes:
# 1. Check for missing closing tags
# 2. Verify variable names
# 3. Check partial template paths

# Example fix for missing partial
{{ partial "header/navbar.html" . }}
# Should be:
{{ partial "header/navbar.html" . }}
```

### Asset Processing Errors

**Problem**: CSS/JS processing fails
```
Error: failed to process assets
```

**Solution**:
```bash
# Check asset paths
ls assets/css/tailwind.css
ls assets/js/main.js

# Verify PostCSS config
cat postcss.config.js
# Should contain:
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

# Check Tailwind config
cat tailwind.config.js
# Should contain:
module.exports = {
  content: ['./layouts/**/*.html', './content/**/*.md'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Hugo Pipes Issues

**Problem**: Hugo Pipes not working
```
Error: resource not found
```

**Solution**:
```html
<!-- Check resource paths in templates -->
{{ $css := resources.Get "css/tailwind.css" }}
{{ if $css }}
  {{ $css = $css | postCSS | minify | fingerprint }}
  <link rel="stylesheet" href="{{ $css.RelPermalink }}">
{{ else }}
  <!-- Fallback or error message -->
  <p>CSS resource not found</p>
{{ end }}
```

## Styling Problems

### Tailwind CSS Not Loading

**Problem**: Styles not applying
```
# Page loads but no Tailwind styles
```

**Diagnosis**:
```bash
# Check if CSS is generated
ls public/css/

# Check CSS content
head -20 public/css/style.*.css

# Should see Tailwind CSS classes
```

**Solutions**:

**1. Check content paths in Tailwind config**
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.{md,html}',
    './assets/js/**/*.js',
  ],
  // ...
}
```

**2. Add safelist for dynamic classes**
```javascript
// tailwind.config.js
module.exports = {
  content: ['./layouts/**/*.html'],
  safelist: [
    'bg-blue-500',
    'text-white',
    'hover:bg-blue-600',
    // Add classes that might be purged
  ],
}
```

**3. Check Hugo Pipes processing**
```html
<!-- layouts/_default/baseof.html -->
{{ $css := resources.Get "css/tailwind.css" }}
{{ if $css }}
  {{ $css = $css | postCSS }}
  {{ if hugo.IsProduction }}
    {{ $css = $css | minify | fingerprint }}
  {{ end }}
  <link rel="stylesheet" href="{{ $css.RelPermalink }}">
{{ end }}
```

### Custom CSS Not Working

**Problem**: Custom styles not applying

**Solution**:
```css
/* assets/css/custom.css */
/* Use @layer to ensure proper cascade */
@layer components {
  .my-custom-button {
    @apply bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded;
  }
}

@layer utilities {
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
}
```

```html
<!-- Include custom CSS in baseof.html -->
{{ $customCSS := resources.Get "css/custom.css" }}
{{ if $customCSS }}
  {{ $customCSS = $customCSS | postCSS }}
  <link rel="stylesheet" href="{{ $customCSS.RelPermalink }}">
{{ end }}
```

### Font Loading Issues

**Problem**: Fonts not loading properly

**Solution**:
```html
<!-- Preload fonts in head -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>

<!-- Or use Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

```css
/* Define font families in CSS */
@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
  }
}
```

## JavaScript Issues

### Scripts Not Loading

**Problem**: JavaScript functionality not working

**Diagnosis**:
```bash
# Check browser console for errors
# Open Developer Tools > Console

# Check if scripts are loaded
curl -I http://localhost:1313/js/main.js
```

**Solution**:
```html
<!-- Check script loading in baseof.html -->
{{ $js := resources.Get "js/main.js" }}
{{ if $js }}
  {{ $js = $js | js.Build }}
  {{ if hugo.IsProduction }}
    {{ $js = $js | minify | fingerprint }}
  {{ end }}
  <script src="{{ $js.RelPermalink }}" defer></script>
{{ end }}
```

### Module Import Errors

**Problem**: ES6 modules not working
```
Error: Cannot use import statement outside a module
```

**Solution**:
```javascript
// assets/js/main.js - Use Hugo's js.Build
import { searchInit } from './modules/search.js';
import { navigationInit } from './modules/navigation.js';

document.addEventListener('DOMContentLoaded', function() {
  searchInit();
  navigationInit();
});
```

```html
<!-- Use js.Build in template -->
{{ $js := resources.Get "js/main.js" | js.Build }}
<script src="{{ $js.RelPermalink }}" type="module"></script>
```

### Search Not Working

**Problem**: Search functionality broken

**Solution**:
```bash
# Check if JSON index is generated
ls public/index.json

# Verify output format in hugo.toml
[outputs]
  home = ["HTML", "RSS", "JSON"]
```

```javascript
// Check search implementation
// assets/js/modules/search.js
export function searchInit() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  
  if (!searchInput || !searchResults) {
    console.error('Search elements not found');
    return;
  }
  
  // Fetch search index
  fetch('/index.json')
    .then(response => response.json())
    .then(data => {
      console.log('Search index loaded:', data.length, 'items');
      // Initialize search
    })
    .catch(error => {
      console.error('Failed to load search index:', error);
    });
}
```

## Performance Problems

### Slow Build Times

**Problem**: Hugo build takes too long

**Diagnosis**:
```bash
# Enable build timing
hugo --templateMetrics --templateMetricsHints

# Check cache usage
hugo --debug | grep -i cache
```

**Solutions**:

**1. Optimize caching**
```toml
# hugo.toml
[caches]
  [caches.images]
    maxAge = "1h"
  [caches.assets]
    maxAge = "1h"
  [caches.getjson]
    maxAge = "10m"
```

**2. Reduce image processing**
```html
<!-- Use image processing conditionally -->
{{ if .Params.image }}
  {{ $image := resources.Get .Params.image }}
  {{ if $image }}
    {{ $resized := $image.Resize "800x" }}
    <img src="{{ $resized.RelPermalink }}" alt="{{ .Params.imageAlt }}">
  {{ end }}
{{ end }}
```

### Large Bundle Sizes

**Problem**: CSS/JS bundles too large

**Solution**:
```javascript
// Optimize Tailwind config
module.exports = {
  content: ['./layouts/**/*.html'],
  theme: {
    extend: {
      // Only extend what you need
    },
  },
  plugins: [
    // Only include needed plugins
    require('@tailwindcss/typography'),
  ],
}
```

```toml
# Enable minification in production
[minify]
  disableCSS = false
  disableJS = false
  disableHTML = false
```

### Poor Lighthouse Scores

**Problem**: Low performance scores

**Solutions**:

**1. Optimize images**
```html
<!-- Use responsive images -->
{{ $image := resources.Get .Params.image }}
{{ if $image }}
  {{ $small := $image.Resize "400x" }}
  {{ $medium := $image.Resize "800x" }}
  {{ $large := $image.Resize "1200x" }}
  <img 
    src="{{ $medium.RelPermalink }}"
    srcset="{{ $small.RelPermalink }} 400w, {{ $medium.RelPermalink }} 800w, {{ $large.RelPermalink }} 1200w"
    sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px"
    alt="{{ .Params.imageAlt }}"
    loading="lazy">
{{ end }}
```

**2. Inline critical CSS**
```html
<!-- layouts/_default/baseof.html -->
{{ $criticalCSS := resources.Get "css/critical.css" | postCSS | minify }}
<style>{{ $criticalCSS.Content | safeCSS }}</style>
```

**3. Preload important resources**
```html
<!-- Preload critical resources -->
{{ $css := resources.Get "css/tailwind.css" | postCSS | minify | fingerprint }}
<link rel="preload" href="{{ $css.RelPermalink }}" as="style">
<link rel="stylesheet" href="{{ $css.RelPermalink }}">
```

## Content Display Issues

### Images Not Showing

**Problem**: Images not displaying

**Diagnosis**:
```bash
# Check image paths
ls static/images/
ls assets/images/

# Check image URLs in browser network tab
```

**Solutions**:

**1. Use correct paths**
```markdown
<!-- In content files -->
![Alt text](/images/photo.jpg)  <!-- Absolute path -->
![Alt text](images/photo.jpg)   <!-- Relative path -->
```

**2. Use Hugo image processing**
```html
<!-- In templates -->
{{ $image := resources.Get "images/photo.jpg" }}
{{ if $image }}
  <img src="{{ $image.RelPermalink }}" alt="Description">
{{ else }}
  <img src="/images/placeholder.jpg" alt="Placeholder">
{{ end }}
```

### Broken Layouts

**Problem**: Layout elements misaligned

**Solution**:
```html
<!-- Check for proper container structure -->
<div class="container mx-auto px-4">
  <div class="max-w-7xl mx-auto">
    <!-- Content -->
  </div>
</div>

<!-- Ensure proper grid structure -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Grid items -->
</div>
```

### Missing Content

**Problem**: Content not showing up

**Diagnosis**:
```bash
# Check content files
ls content/
ls content/posts/

# Check front matter
head -20 content/posts/example.md
```

**Solution**:
```yaml
# Ensure proper front matter
---
title: "Post Title"
date: 2023-01-01T00:00:00Z
draft: false  # Make sure this is false
---
```

## SEO and Social Sharing

### OpenGraph Not Working

**Problem**: Social sharing previews not showing

**Diagnosis**:
```bash
# Test with Facebook Debugger
# https://developers.facebook.com/tools/debug/

# Check meta tags in browser
curl -s http://localhost:1313/posts/example/ | grep -i "og:"
```

**Solution**:
```html
<!-- Ensure OpenGraph partial is included -->
{{ partial "head/opengraph.html" . }}

<!-- Check OpenGraph implementation -->
<meta property="og:title" content="{{ .Title }}">
<meta property="og:description" content="{{ .Description | default .Site.Params.description }}">
<meta property="og:image" content="{{ .Params.image | absURL }}">
<meta property="og:url" content="{{ .Permalink }}">
```

### Twitter Cards Not Working

**Problem**: Twitter previews not showing

**Solution**:
```html
<!-- Include Twitter Card meta tags -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@yourusername">
<meta name="twitter:title" content="{{ .Title }}">
<meta name="twitter:description" content="{{ .Description }}">
<meta name="twitter:image" content="{{ .Params.image | absURL }}">
```

### Missing Structured Data

**Problem**: Rich snippets not appearing

**Solution**:
```html
<!-- Add JSON-LD structured data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{ .Title }}",
  "author": {
    "@type": "Person",
    "name": "{{ .Params.author | default .Site.Params.author }}"
  },
  "datePublished": "{{ .Date.Format "2006-01-02T15:04:05Z07:00" }}",
  "image": "{{ .Params.image | absURL }}"
}
</script>
```

## Multilingual Issues

### Language Switching Not Working

**Problem**: Language switcher broken

**Solution**:
```html
<!-- Check language switcher implementation -->
{{ if .Site.IsMultiLingual }}
  <div class="language-switcher">
    {{ range .Site.Languages }}
      {{ if ne .Lang $.Site.Language.Lang }}
        <a href="{{ $.Permalink | relLangURL .Lang }}">{{ .LanguageName }}</a>
      {{ end }}
    {{ end }}
  </div>
{{ end }}
```

### Missing Translations

**Problem**: Text not translated

**Solution**:
```yaml
# Check i18n files
# i18n/en.yaml
- id: readMore
  translation: "Read More"

# i18n/zh.yaml
- id: readMore
  translation: "閱讀更多"
```

```html
<!-- Use translations in templates -->
{{ i18n "readMore" }}
```

## Search Functionality

### Search Index Not Generated

**Problem**: Search not working

**Solution**:
```toml
# Ensure JSON output is enabled
[outputs]
  home = ["HTML", "RSS", "JSON"]
```

```html
<!-- Check search index template -->
<!-- layouts/_default/index.json -->
{{- $.Scratch.Add "index" slice -}}
{{- range .Site.RegularPages -}}
  {{- $.Scratch.Add "index" (dict "title" .Title "content" .Plain "permalink" .Permalink "date" .Date) -}}
{{- end -}}
{{- $.Scratch.Get "index" | jsonify -}}
```

### Search Results Not Displaying

**Problem**: Search returns no results

**Solution**:
```javascript
// Check search implementation
function performSearch(query) {
  if (!searchIndex) {
    console.error('Search index not loaded');
    return [];
  }
  
  const results = searchIndex.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.content.toLowerCase().includes(query.toLowerCase())
  );
  
  console.log('Search results:', results.length);
  return results;
}
```

## Mobile and Responsive Issues

### Mobile Menu Not Working

**Problem**: Hamburger menu not functioning

**Solution**:
```javascript
// Check mobile menu implementation
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('[data-toggle="mobile-menu"]');
  const mobileMenu = document.querySelector('#mobile-menu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
      
      // Update ARIA attributes
      const isOpen = !mobileMenu.classList.contains('hidden');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
  }
});
```

### Responsive Images Issues

**Problem**: Images not responsive

**Solution**:
```html
<!-- Use responsive image classes -->
<img src="image.jpg" alt="Description" class="w-full h-auto">

<!-- Or use Hugo image processing -->
{{ $image := resources.Get .Params.image }}
{{ if $image }}
  {{ $mobile := $image.Resize "400x" }}
  {{ $tablet := $image.Resize "800x" }}
  {{ $desktop := $image.Resize "1200x" }}
  <picture>
    <source media="(max-width: 640px)" srcset="{{ $mobile.RelPermalink }}">
    <source media="(max-width: 1024px)" srcset="{{ $tablet.RelPermalink }}">
    <img src="{{ $desktop.RelPermalink }}" alt="{{ .Params.imageAlt }}" class="w-full h-auto">
  </picture>
{{ end }}
```

## Deployment Problems

### Netlify Build Failures

**Problem**: Build fails on Netlify

**Solution**:
```toml
# netlify.toml
[build]
  command = "hugo --minify"
  publish = "public"

[build.environment]
  HUGO_VERSION = "0.147.2"
  HUGO_EXTENDED = "true"
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

### Vercel Deployment Issues

**Problem**: Build fails on Vercel

**Solution**:
```json
// vercel.json
{
  "build": {
    "env": {
      "HUGO_VERSION": "0.147.2"
    }
  },
  "functions": {
    "app/api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### GitHub Pages Issues

**Problem**: Theme not working on GitHub Pages

**Solution**:
```yaml
# .github/workflows/hugo.yml
name: Deploy Hugo site to Pages

on:
  push:
    branches: ["main"]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.147.2'
          extended: true

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: hugo --minify

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

## Getting Help

### Debug Information to Collect

When reporting issues, include:

```bash
# Hugo version and environment
hugo version
hugo env

# Build output with debug info
hugo --debug --verbose 2>&1 | tee build-debug.log

# Configuration check
hugo config

# Site structure
tree -L 3 -I 'node_modules|public'
```

### Where to Get Help

1. **Documentation**: Check [README.md](README.md) and [CONFIGURATION.md](CONFIGURATION.md)
2. **GitHub Issues**: [Create an issue](https://github.com/yourusername/parsa-redesigned/issues)
3. **Hugo Community**: [Hugo Discourse](https://discourse.gohugo.io/)
4. **Tailwind CSS**: [Tailwind Documentation](https://tailwindcss.com/docs)

### Creating a Good Bug Report

Include:
- Hugo version and operating system
- Complete error messages
- Steps to reproduce the issue
- Relevant configuration files
- Browser and version (for frontend issues)

### Quick Fixes Checklist

Before reporting an issue, try:

- [ ] Clear Hugo cache: `hugo mod clean`
- [ ] Rebuild from scratch: `rm -rf public/ && hugo`
- [ ] Check Hugo version: `hugo version`
- [ ] Verify Node.js dependencies: `npm install`
- [ ] Test with example site: `cd exampleSite && hugo server`
- [ ] Check browser console for JavaScript errors
- [ ] Validate HTML: Use W3C Markup Validator
- [ ] Test in incognito/private browsing mode

This troubleshooting guide should help you resolve most common issues with the Parsa Redesigned theme. If you continue to experience problems, don't hesitate to seek help from the community or create an issue on GitHub.