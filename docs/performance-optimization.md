# Performance Optimization Guide

This document outlines the performance optimization features implemented in the Parsa Redesigned Hugo theme.

## Overview

The theme includes comprehensive performance optimizations to achieve excellent Core Web Vitals scores and fast loading times across all devices.

## Implemented Optimizations

### 1. Tailwind CSS Purging

- **Configuration**: Enhanced `tailwind.config.js` with comprehensive content paths
- **Safelist**: Critical classes that should never be purged
- **Production**: Automatic purging removes unused CSS in production builds
- **Result**: Significantly reduced CSS bundle size

### 2. Critical CSS Inlining

- **File**: `assets/css/critical.css` contains above-the-fold styles
- **Partial**: `layouts/partials/head/critical-css.html` handles inlining
- **Strategy**: Critical CSS is inlined in `<head>`, non-critical CSS is loaded asynchronously
- **Fallback**: Graceful degradation for browsers without preload support

### 3. JavaScript Bundling and Minification

- **Modules**: Modular JavaScript architecture with ES6 imports
- **Bundling**: Hugo Pipes concatenates and processes JavaScript
- **Minification**: Production builds are minified and fingerprinted
- **Code Splitting**: Dynamic imports for non-critical functionality

### 4. Lazy Loading Implementation

#### Images
- **Partial**: `layouts/partials/content/lazy-image.html`
- **Features**: 
  - Intersection Observer API for efficient loading
  - WebP format support with fallbacks
  - Responsive images with srcset
  - Aspect ratio preservation
  - Smooth opacity transitions

#### Iframes and Videos
- **Partial**: `layouts/partials/content/lazy-iframe.html`
- **Features**:
  - Click-to-load for better performance
  - Loading placeholders with preview
  - Error handling and retry mechanisms

### 5. Asset Fingerprinting and Cache Busting

- **Hugo Pipes**: Automatic fingerprinting in production
- **Service Worker**: Advanced caching strategies
- **Cache Headers**: Optimized cache control
- **Versioning**: Asset version meta tag for cache busting

## Performance Monitoring

### Core Web Vitals Tracking

The theme includes automatic monitoring of:

- **Largest Contentful Paint (LCP)**: Target < 2.5s
- **First Input Delay (FID)**: Target < 100ms
- **Cumulative Layout Shift (CLS)**: Target < 0.1
- **First Contentful Paint (FCP)**: Target < 1.8s
- **Time to First Byte (TTFB)**: Network performance

### Analytics Integration

- Google Analytics 4 integration for Web Vitals
- Custom analytics endpoint support
- Error tracking and monitoring
- Resource timing analysis

## Build Scripts

### Development
```bash
npm run dev                 # Development server with live reload
```

### Production
```bash
npm run build:production    # Optimized production build
npm run build:analyze      # Build with performance metrics
```

### Optimization Tools
```bash
npm run optimize:images    # Convert images to WebP format
npm run lint:css          # CSS linting with Stylelint
npm run test:lighthouse   # Lighthouse performance audit
```

## Service Worker

The theme includes a service worker (`static/sw.js`) that provides:

- **Static Asset Caching**: Critical resources cached immediately
- **Dynamic Caching**: Runtime caching of visited pages
- **Cache Strategies**: Different strategies for different resource types
- **Offline Support**: Basic offline functionality

## Image Optimization

### Responsive Images
- Multiple size variants generated automatically
- WebP format with JPEG/PNG fallbacks
- Proper `srcset` and `sizes` attributes
- Lazy loading with Intersection Observer

### Usage Example
```html
{{ partial "content/lazy-image.html" (dict 
  "src" "images/article.jpg" 
  "alt" "Article image" 
  "critical" false 
  "aspectRatio" "16/9"
) }}
```

## Network Optimization

### Resource Hints
- DNS prefetch for external domains
- Preconnect for critical external resources
- Preload for critical assets
- Prefetch for likely next pages

### Connection Awareness
- Network condition detection
- Data saver mode support
- Adaptive loading strategies
- Bandwidth-aware optimizations

## Performance Targets

The theme is optimized to achieve:

- **Lighthouse Performance Score**: > 90
- **Lighthouse Accessibility Score**: > 95
- **Lighthouse Best Practices Score**: > 90
- **Lighthouse SEO Score**: > 95

### Core Web Vitals Targets
- **LCP**: < 2.5 seconds
- **FID**: < 100 milliseconds
- **CLS**: < 0.1

## Monitoring and Debugging

### Development Tools
- Performance metrics logged in development
- Asset manager statistics available
- Cache hit/miss monitoring
- Error tracking and reporting

### Production Monitoring
- Real User Monitoring (RUM) data
- Performance metrics sent to analytics
- Error reporting and tracking
- Resource timing analysis

## Best Practices

### Content Authors
1. Use the lazy image partial for all images
2. Optimize images before uploading
3. Use appropriate aspect ratios
4. Include meaningful alt text

### Developers
1. Use the asset manager for dynamic loading
2. Implement proper error handling
3. Test on slow networks
4. Monitor performance metrics

### Site Administrators
1. Enable production optimizations
2. Configure CDN for static assets
3. Monitor Core Web Vitals
4. Regular performance audits

## Troubleshooting

### Common Issues

1. **Slow Image Loading**
   - Check image sizes and formats
   - Verify lazy loading implementation
   - Test network conditions

2. **JavaScript Errors**
   - Check browser console
   - Verify module imports
   - Test fallback functionality

3. **CSS Not Loading**
   - Verify critical CSS inlining
   - Check preload implementation
   - Test fallback mechanisms

### Performance Debugging

1. Use browser DevTools Performance tab
2. Run Lighthouse audits regularly
3. Monitor Network tab for slow resources
4. Check console for performance warnings

## Future Enhancements

Planned performance improvements:

1. **HTTP/3 Support**: When widely available
2. **AVIF Image Format**: Next-generation image format
3. **Streaming SSR**: For dynamic content
4. **Edge Computing**: CDN-based optimizations
5. **AI-Powered Optimization**: Intelligent resource loading