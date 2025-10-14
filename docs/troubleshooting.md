# Troubleshooting Guide

This guide helps you diagnose and resolve common issues with the analytics and advertising enhancements in the Parsa Redesigned Hugo theme.

## Table of Contents

- [General Troubleshooting](#general-troubleshooting)
- [Google Analytics Issues](#google-analytics-issues)
- [Google AdSense Issues](#google-adsense-issues)
- [Facebook Pixel Issues](#facebook-pixel-issues)
- [Google Custom Search Issues](#google-custom-search-issues)
- [Mermaid Diagram Issues](#mermaid-diagram-issues)
- [Privacy and Consent Issues](#privacy-and-consent-issues)
- [Performance Issues](#performance-issues)
- [Configuration Issues](#configuration-issues)

## General Troubleshooting

### Diagnostic Steps

1. **Check Hugo build output**
   ```bash
   hugo --printI18nWarnings --printPathWarnings --debug
   ```

2. **Verify theme configuration**
   ```bash
   hugo config | grep -i "analytics\|adsense\|pixel\|mermaid"
   ```

3. **Test in development mode**
   ```bash
   hugo server -D --debug
   ```

4. **Check browser developer tools**
   - Open Developer Tools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests
   - Check Application tab for cookies and storage

### Common Issues

#### Issue: Services not loading at all

**Symptoms:**
- No tracking scripts in page source
- No network requests to service domains
- No console errors

**Diagnosis:**
```bash
# Check if services are enabled
hugo config | grep -A 10 "params"
```

**Solutions:**
1. Verify service is enabled in configuration:
   ```toml
   [params.adsense]
     enabled = true  # Must be true
   ```

2. Check required IDs are provided:
   ```toml
   [params.adsense]
     enabled = true
     client = "ca-pub-XXXXXXXXXXXXXXXX"  # Must be provided
   ```

3. Verify Hugo configuration syntax:
   ```bash
   hugo config
   ```

#### Issue: Configuration validation errors

**Symptoms:**
- Warning messages during Hugo build
- Services enabled but not working

**Diagnosis:**
Look for validation messages in Hugo build output:
```
WARNING: Analytics tracking is enabled but cookie consent is disabled
ERROR: AdSense is enabled but no client ID is configured
```

**Solutions:**
1. Fix missing required configuration
2. Enable privacy settings if needed
3. Verify ID formats match requirements

## Google Analytics Issues

### Issue: Analytics not tracking

**Symptoms:**
- No data in Google Analytics reports
- No gtag requests in Network tab
- Real-time reports show no activity

**Diagnosis:**
1. Check Measurement ID format:
   ```toml
   GoogleAnalyticsID = "G-XXXXXXXXXX"  # Must start with G-
   ```

2. Verify script loading:
   ```javascript
   // Check in browser console
   console.log(window.gtag);  // Should be a function
   console.log(window.dataLayer);  // Should be an array
   ```

**Solutions:**

1. **Verify Measurement ID**
   - Check Google Analytics property settings
   - Ensure ID matches exactly (case-sensitive)
   - Format must be `G-` followed by 10 alphanumeric characters

2. **Check privacy settings**
   ```toml
   [privacy.googleAnalytics]
     respectDoNotTrack = true
     disable = false  # Should be false
   ```

3. **Test without Do Not Track**
   - Disable Do Not Track in browser settings
   - Clear cookies and reload page
   - Check if tracking starts working

4. **Verify domain configuration**
   - Ensure your domain is added to Google Analytics property
   - Check referrer exclusions in Google Analytics

### Issue: Analytics blocked by ad blockers

**Symptoms:**
- Works in incognito mode but not regular browsing
- Console shows blocked requests to googletagmanager.com

**Solutions:**
1. **Test without ad blockers**
   - Disable ad blocker temporarily
   - Use incognito mode for testing

2. **Implement server-side tracking** (advanced)
   - Use Google Analytics Measurement Protocol
   - Proxy requests through your domain

3. **Use alternative analytics** (if needed)
   - Consider privacy-focused alternatives
   - Implement first-party analytics

### Issue: Privacy compliance warnings

**Symptoms:**
- Browser console warnings about tracking
- GDPR compliance concerns

**Solutions:**
1. **Enable privacy settings**
   ```toml
   [params.privacy]
     respectDoNotTrack = true
     cookieConsent = true
     anonymizeIP = true
   ```

2. **Implement consent management**
   ```toml
   [params.privacy.consentBanner]
     enabled = true
     message = "We use cookies to improve your experience."
   ```

## Google AdSense Issues

### Issue: Ads not displaying

**Symptoms:**
- Empty ad spaces on pages
- No requests to googlesyndication.com
- Console errors about ad loading

**Diagnosis:**
1. Check AdSense account status
2. Verify ad unit configuration
3. Check for policy violations

**Solutions:**

1. **Verify AdSense approval**
   - Check AdSense account status
   - Ensure site is approved for ads
   - Review any policy violations

2. **Check Publisher ID format**
   ```toml
   [params.adsense]
     client = "ca-pub-1234567890123456"  # Must be 16 digits after ca-pub-
   ```

3. **Verify ad unit IDs**
   ```toml
   [params.adsense]
     inArticleSlot = "1234567890"  # Must be exactly 10 digits
   ```

4. **Test with Auto Ads first**
   ```toml
   [params.adsense]
     enabled = true
     client = "ca-pub-XXXXXXXXXXXXXXXX"
     autoAds = true  # Easier to test
   ```

### Issue: Ads showing but not earning

**Symptoms:**
- Ads display correctly
- No earnings in AdSense reports
- Invalid traffic warnings

**Solutions:**
1. **Check traffic quality**
   - Avoid clicking your own ads
   - Ensure organic traffic sources
   - Review traffic patterns

2. **Verify ad placement**
   - Follow AdSense placement policies
   - Avoid excessive ad density
   - Ensure ads don't interfere with content

3. **Monitor AdSense policies**
   - Review content quality guidelines
   - Check for policy violations
   - Ensure site navigation is clear

### Issue: Ads causing layout shift

**Symptoms:**
- Page content jumps when ads load
- Poor Core Web Vitals scores
- User experience issues

**Solutions:**
1. **Enable lazy loading**
   ```toml
   [params.adsense]
     lazyLoad = true
   ```

2. **Reserve ad space**
   ```css
   /* In custom CSS */
   .ad-container {
     min-height: 250px; /* Reserve space for ads */
   }
   ```

3. **Use responsive ad units**
   ```toml
   [params.adsense]
     responsive = true
   ```

## Facebook Pixel Issues

### Issue: Pixel not firing

**Symptoms:**
- No pixel events in Facebook Events Manager
- Facebook Pixel Helper shows no pixel
- No requests to connect.facebook.net

**Diagnosis:**
1. Check Pixel ID format (15-16 digits)
2. Verify Facebook Pixel Helper extension
3. Check browser console for errors

**Solutions:**

1. **Verify Pixel ID**
   ```toml
   [params.facebookPixel]
     pixelId = "123456789012345"  # Must be 15-16 digits
   ```

2. **Check pixel initialization**
   ```javascript
   // Check in browser console
   console.log(window.fbq);  // Should be a function
   ```

3. **Test with Facebook Pixel Helper**
   - Install Facebook Pixel Helper Chrome extension
   - Visit your site and check for pixel detection
   - Verify events are firing correctly

### Issue: Events not tracking

**Symptoms:**
- Pixel fires but specific events don't track
- Missing events in Facebook Events Manager

**Solutions:**
1. **Enable specific events**
   ```toml
   [params.facebookPixel.events]
     pageView = true
     search = true
     contact = true
   ```

2. **Test events manually**
   ```javascript
   // Test in browser console
   fbq('track', 'PageView');
   ```

3. **Check event configuration**
   - Verify events are enabled in Facebook Events Manager
   - Check event parameters and values

## Google Custom Search Issues

### Issue: Search not working

**Symptoms:**
- Search box appears but no results
- Error messages in search results
- Fallback to local search not working

**Diagnosis:**
1. Check Search Engine ID format (17 hex characters)
2. Verify search engine is public
3. Check site indexing status

**Solutions:**

1. **Verify Search Engine ID**
   ```toml
   [params.gcs_engine_id]
     value = "1234567890abcdef1"  # Must be 17 hex characters
   ```

2. **Check search engine settings**
   - Ensure search engine is set to "Public"
   - Verify your site is added to search sources
   - Check that search engine is active

3. **Test search engine directly**
   - Visit your Google Custom Search control panel
   - Test search functionality there
   - Verify results appear correctly

### Issue: No search results

**Symptoms:**
- Search works but returns no results
- "No results found" message appears

**Solutions:**
1. **Wait for indexing**
   - Google needs time to index your content
   - Can take several days for new sites

2. **Check site accessibility**
   - Ensure your site is accessible to Google crawlers
   - Check robots.txt file
   - Verify sitemap is submitted to Google Search Console

3. **Test with known content**
   - Search for exact titles of your posts
   - Try searching for unique phrases from your content

## Mermaid Diagram Issues

### Issue: Diagrams not rendering

**Symptoms:**
- Code blocks show raw Mermaid syntax
- No diagrams appear on pages
- JavaScript errors in console

**Diagnosis:**
1. Check if Mermaid is enabled
2. Verify diagram syntax
3. Check for JavaScript conflicts

**Solutions:**

1. **Enable Mermaid in configuration**
   ```toml
   [params.mermaid]
     enabled = true
   ```

2. **Check diagram syntax**
   ```markdown
   ```mermaid
   graph TD
       A[Start] --> B[End]
   ```
   ```

3. **Verify Mermaid loading**
   ```javascript
   // Check in browser console
   console.log(window.mermaid);  // Should be an object
   ```

### Issue: Diagrams look broken

**Symptoms:**
- Diagrams render but appear malformed
- Text overlaps or is cut off
- Styling issues

**Solutions:**
1. **Try different themes**
   ```toml
   [params.mermaid]
     theme = "neutral"  # Try: default, dark, forest, neutral, base
   ```

2. **Check for CSS conflicts**
   ```css
   /* Add to custom CSS if needed */
   .mermaid {
     background: white;
     font-family: inherit;
   }
   ```

3. **Adjust diagram configuration**
   ```toml
   [params.mermaid.flowchart]
     useMaxWidth = true
     htmlLabels = false
   ```

## Privacy and Consent Issues

### Issue: Consent banner not appearing

**Symptoms:**
- No cookie consent banner shows
- Privacy settings not working
- Tracking continues without consent

**Solutions:**
1. **Enable consent banner**
   ```toml
   [params.privacy.consentBanner]
     enabled = true
   ```

2. **Clear cookies and test**
   - Clear all cookies for your site
   - Reload page in incognito mode
   - Check if banner appears

3. **Check JavaScript errors**
   - Look for console errors
   - Verify consent management scripts load

### Issue: Do Not Track not respected

**Symptoms:**
- Tracking continues with Do Not Track enabled
- Privacy settings ignored

**Solutions:**
1. **Enable Do Not Track respect**
   ```toml
   [params.privacy]
     respectDoNotTrack = true
   ```

2. **Test Do Not Track**
   - Enable Do Not Track in browser
   - Clear cookies and reload
   - Verify tracking scripts don't load

## Performance Issues

### Issue: Slow page loading

**Symptoms:**
- High page load times
- Poor Core Web Vitals scores
- Users complaining about speed

**Diagnosis:**
1. Use Google PageSpeed Insights
2. Check Core Web Vitals
3. Analyze network requests

**Solutions:**

1. **Enable performance optimizations**
   ```toml
   [params.performance]
     lazyLoadAds = true
     asyncScripts = true
     resourceHints = true
   ```

2. **Optimize script loading**
   ```toml
   [params.performance]
     preconnectDomains = [
       "https://www.googletagmanager.com",
       "https://pagead2.googlesyndication.com"
     ]
   ```

3. **Reduce tracking services**
   - Disable unused services
   - Prioritize essential tracking only

### Issue: Layout shift from ads

**Symptoms:**
- Content jumps when ads load
- Poor Cumulative Layout Shift (CLS) score

**Solutions:**
1. **Reserve space for ads**
   ```css
   .ad-container {
     min-height: 250px;
     display: block;
   }
   ```

2. **Use lazy loading**
   ```toml
   [params.performance]
     lazyLoadAds = true
   ```

## Configuration Issues

### Issue: Hugo build errors

**Symptoms:**
- Hugo build fails
- Template errors
- Configuration parsing errors

**Diagnosis:**
```bash
hugo --debug --verbose
```

**Solutions:**

1. **Check TOML syntax**
   ```bash
   # Validate TOML syntax
   hugo config
   ```

2. **Verify parameter structure**
   ```toml
   # Correct structure
   [params.adsense]
     enabled = true
   
   # Not this
   params.adsense.enabled = true
   ```

3. **Check for typos**
   - Verify parameter names match documentation
   - Check for extra spaces or characters

### Issue: Services enabled but not working

**Symptoms:**
- Configuration looks correct
- No errors in build
- Services still don't work

**Solutions:**
1. **Check Hugo version**
   ```bash
   hugo version  # Should be 0.147.2 or higher
   ```

2. **Verify theme version**
   - Ensure you have the latest theme version
   - Check for theme updates

3. **Test with minimal configuration**
   ```toml
   # Start with minimal config
   [params.adsense]
     enabled = true
     client = "ca-pub-XXXXXXXXXXXXXXXX"
   ```

## Getting Help

### Before Asking for Help

1. **Check this troubleshooting guide**
2. **Review configuration documentation**
3. **Test with minimal configuration**
4. **Check Hugo and theme versions**

### Information to Include

When asking for help, include:

1. **Hugo version**: `hugo version`
2. **Theme version**: Check git commit or release
3. **Configuration**: Relevant parts of hugo.toml (remove sensitive IDs)
4. **Error messages**: Full error messages from console/build
5. **Browser information**: Browser version and extensions
6. **Steps to reproduce**: What you did before the issue occurred

### Where to Get Help

1. **Theme Documentation**: Check all documentation files
2. **Hugo Community**: Hugo Discourse forum
3. **GitHub Issues**: Theme repository issues
4. **Service Documentation**: Official docs for Google Analytics, AdSense, etc.

### Debugging Tools

1. **Browser Developer Tools**
   - Console: JavaScript errors
   - Network: Failed requests
   - Application: Cookies and storage

2. **Service-Specific Tools**
   - Google Analytics Real-time reports
   - Facebook Pixel Helper extension
   - Google PageSpeed Insights

3. **Hugo Tools**
   ```bash
   hugo --debug --verbose
   hugo config
   hugo --printI18nWarnings
   ```

### Common Debugging Commands

```bash
# Check Hugo configuration
hugo config | grep -i analytics

# Build with debug info
hugo --debug --verbose

# Check for warnings
hugo --printI18nWarnings --printPathWarnings

# Test locally
hugo server -D --debug

# Check theme version
git log --oneline -n 5  # In theme directory
```