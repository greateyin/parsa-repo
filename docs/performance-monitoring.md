# Performance Monitoring Guide

This guide explains how to use the theme's built-in performance monitoring features to track Core Web Vitals, monitor performance budgets, and optimize your site's performance.

## Overview

The theme includes comprehensive performance monitoring that tracks:

- **Core Web Vitals**: LCP, FID, CLS, FCP, TTFB
- **Performance Budgets**: Resource size limits and violations
- **Resource Performance**: Script, CSS, image, and font loading metrics
- **Custom Reporting**: Integration with analytics and custom endpoints

## Configuration

Add performance monitoring configuration to your `hugo.toml`:

```toml
[params.performance]
  # Enable performance monitoring
  [params.performance.monitoring]
    enabled = true
    
    # Core Web Vitals thresholds (milliseconds)
    lcpThreshold = 2500    # Largest Contentful Paint
    fidThreshold = 100     # First Input Delay
    clsThreshold = 0.1     # Cumulative Layout Shift
    fcpThreshold = 1800    # First Contentful Paint
    ttfbThreshold = 800    # Time to First Byte
    
    # Performance budget limits (bytes)
    budgetTotalSize = 2000000   # 2MB total
    budgetScriptSize = 500000   # 500KB scripts
    budgetImageSize = 1000000   # 1MB images
    budgetCssSize = 200000      # 200KB CSS
    budgetFontSize = 300000     # 300KB fonts
    
    # Monitoring settings
    sampleRate = 1.0              # 100% sampling
    enableReporting = true        # Enable custom reporting
    enableConsoleLogging = true   # Log to console
    reportingEndpoint = "https://your-analytics-endpoint.com/performance"
```

## Core Web Vitals

### Largest Contentful Paint (LCP)
Measures loading performance. Good LCP scores are 2.5 seconds or less.

**Optimization tips:**
- Optimize images with WebP format and proper sizing
- Use CDN for faster content delivery
- Minimize render-blocking resources
- Implement lazy loading for below-the-fold content

### First Input Delay (FID)
Measures interactivity. Good FID scores are 100 milliseconds or less.

**Optimization tips:**
- Minimize JavaScript execution time
- Use async/defer for non-critical scripts
- Break up long tasks into smaller chunks
- Optimize third-party scripts

### Cumulative Layout Shift (CLS)
Measures visual stability. Good CLS scores are 0.1 or less.

**Optimization tips:**
- Include size attributes on images and videos
- Reserve space for ads and embeds
- Avoid inserting content above existing content
- Use CSS aspect-ratio for responsive media

### First Contentful Paint (FCP)
Measures perceived loading speed. Good FCP scores are 1.8 seconds or less.

**Optimization tips:**
- Optimize critical rendering path
- Inline critical CSS
- Preload important resources
- Minimize server response times

### Time to First Byte (TTFB)
Measures server responsiveness. Good TTFB scores are 800 milliseconds or less.

**Optimization tips:**
- Use a fast hosting provider
- Implement server-side caching
- Optimize database queries
- Use a Content Delivery Network (CDN)

## Performance Budgets

Performance budgets help prevent performance regressions by setting limits on resource sizes.

### Default Budget Limits

| Resource Type | Default Limit | Description |
|---------------|---------------|-------------|
| Total Size | 2MB | All resources combined |
| Scripts | 500KB | JavaScript files |
| Images | 1MB | Image files |
| CSS | 200KB | Stylesheets |
| Fonts | 300KB | Web fonts |

### Budget Violations

When budget limits are exceeded, the monitoring system will:

1. Log warnings to the console
2. Send events to Google Analytics
3. Report to custom endpoints (if configured)

### Customizing Budgets

Adjust budget limits based on your site's needs:

```toml
[params.performance.monitoring]
  # Stricter budgets for better performance
  budgetTotalSize = 1500000   # 1.5MB total
  budgetScriptSize = 300000   # 300KB scripts
  budgetImageSize = 800000    # 800KB images
  
  # Or more relaxed budgets for content-heavy sites
  budgetTotalSize = 3000000   # 3MB total
  budgetImageSize = 1500000   # 1.5MB images
```

## Monitoring Integration

### Google Analytics Integration

Performance metrics are automatically sent to Google Analytics when available:

```javascript
// Example events sent to GA
gtag('event', 'performance_metric', {
  'metric_name': 'lcp',
  'metric_value': 2100,
  'metric_rating': 'good'
});

gtag('event', 'budget_violation', {
  'violation_type': 'script_size',
  'actual_size': 600000,
  'limit_size': 500000,
  'overage': 100000
});
```

### Custom Reporting Endpoint

Send performance data to your own analytics service:

```toml
[params.performance.monitoring]
  enableReporting = true
  reportingEndpoint = "https://analytics.yoursite.com/performance"
```

The endpoint will receive POST requests with this structure:

```json
{
  "event": "performance_metric",
  "data": {
    "value": 2100,
    "rating": "good"
  },
  "timestamp": 1640995200000,
  "url": "https://yoursite.com/page",
  "userAgent": "Mozilla/5.0..."
}
```

### Real-Time Monitoring

Access performance data in real-time using the browser console:

```javascript
// Get current performance status
const status = window.getPerformanceStatus();
console.log(status);

// Check specific metrics
console.log('LCP:', status.metrics.lcp);
console.log('CLS:', status.metrics.cls);

// Check budget violations
console.log('Budget status:', status.budgetStatus);
```

## Performance Optimization Strategies

### 1. Async Script Loading

The theme automatically loads external scripts asynchronously:

```toml
[params.performance]
  asyncScripts = true
  scriptTimeout = 10000
  retryAttempts = 2
  loadingStrategy = "priority"  # priority, parallel, sequential
```

### 2. Lazy Loading

Enable lazy loading for advertisements and images:

```toml
[params.performance]
  lazyLoadAds = true
  adLoadMargin = "100px 0px"
  adLoadThreshold = 0.1
```

### 3. Resource Hints

Optimize resource loading with preconnect and DNS prefetch:

```toml
[params.performance]
  preconnect = true
  resourceHints = true
```

### 4. Performance Sampling

Reduce monitoring overhead with sampling:

```toml
[params.performance.monitoring]
  sampleRate = 0.1  # Monitor 10% of visitors
```

## Troubleshooting

### Common Performance Issues

1. **High LCP**: Large images or slow server response
   - Solution: Optimize images, use CDN, improve hosting

2. **High FID**: Heavy JavaScript execution
   - Solution: Defer non-critical scripts, optimize code

3. **High CLS**: Layout shifts from ads or images
   - Solution: Reserve space, use aspect-ratio CSS

4. **Budget Violations**: Too many or large resources
   - Solution: Optimize assets, remove unused code

### Debug Mode

Enable detailed logging for troubleshooting:

```toml
[params.performance.monitoring]
  enableConsoleLogging = true
```

### Performance Testing

Test performance improvements:

1. Use browser DevTools Performance tab
2. Run Lighthouse audits
3. Monitor real user metrics (RUM)
4. Check Core Web Vitals in Search Console

## Best Practices

1. **Set Realistic Budgets**: Based on your content and audience
2. **Monitor Regularly**: Check performance metrics weekly
3. **Test on Real Devices**: Use actual mobile devices for testing
4. **Optimize Images**: Use modern formats and proper sizing
5. **Minimize Third-Party Scripts**: Only include necessary external resources
6. **Use Performance-First Hosting**: Choose fast, reliable hosting providers

## Advanced Configuration

### Custom Thresholds

Set custom performance thresholds for your specific needs:

```toml
[params.performance.monitoring]
  # Stricter thresholds for e-commerce sites
  lcpThreshold = 2000
  fidThreshold = 50
  clsThreshold = 0.05
  
  # More relaxed for content sites
  lcpThreshold = 3000
  fidThreshold = 200
  clsThreshold = 0.15
```

### Conditional Monitoring

Enable monitoring only in production:

```toml
[params.performance.monitoring]
  enabled = false  # Disable in development

# In production config
[params.performance.monitoring]
  enabled = true
```

### A/B Testing Integration

Track performance across different variants:

```javascript
// Custom implementation example
if (window.PerformanceMonitor) {
  window.PerformanceMonitor.config.customData = {
    variant: 'A',  // or 'B'
    experiment: 'homepage-redesign'
  };
}
```

This comprehensive performance monitoring system helps ensure your Hugo site maintains excellent performance while providing detailed insights for optimization.