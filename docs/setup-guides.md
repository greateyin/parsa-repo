# Setup Guides

This document provides step-by-step setup instructions for each analytics and advertising service supported by the theme.

## Table of Contents

- [Google Analytics 4 Setup](#google-analytics-4-setup)
- [Google AdSense Setup](#google-adsense-setup)
- [Facebook Pixel Setup](#facebook-pixel-setup)
- [Google Custom Search Setup](#google-custom-search-setup)
- [Mermaid Diagrams Setup](#mermaid-diagrams-setup)
- [Privacy and Consent Setup](#privacy-and-consent-setup)

## Google Analytics 4 Setup

### Prerequisites

- Google account
- Access to Google Analytics
- Hugo site with this theme installed

### Step 1: Create Google Analytics 4 Property

1. **Sign in to Google Analytics**
   - Go to [analytics.google.com](https://analytics.google.com)
   - Sign in with your Google account

2. **Create a new property**
   - Click "Admin" in the bottom left
   - Click "Create Property"
   - Enter your website name and URL
   - Select your industry category and business size
   - Choose your reporting time zone

3. **Set up data stream**
   - Select "Web" as your platform
   - Enter your website URL
   - Enter a stream name (e.g., "Main Website")
   - Click "Create stream"

4. **Get your Measurement ID**
   - After creating the stream, you'll see your Measurement ID
   - It will look like `G-XXXXXXXXXX`
   - Copy this ID for use in your Hugo configuration

### Step 2: Configure Hugo Site

1. **Add to hugo.toml**
   ```toml
   # Replace with your actual Measurement ID
   GoogleAnalyticsID = "G-JKSVCT23D1"
   
   # Optional: Configure privacy settings
   [privacy.googleAnalytics]
     respectDoNotTrack = true
     anonymizeIP = true
   ```

2. **Test the configuration**
   ```bash
   hugo server -D
   ```

3. **Verify tracking**
   - Visit your site in a browser
   - Open browser developer tools (F12)
   - Go to Network tab
   - Look for requests to `googletagmanager.com`
   - Check Google Analytics Real-time reports

### Step 3: Configure Enhanced Tracking (Optional)

1. **Enable enhanced measurement**
   - In Google Analytics, go to Admin > Data Streams
   - Click on your web stream
   - Toggle on "Enhanced measurement"
   - Configure which events to track automatically

2. **Set up custom events** (if needed)
   - Create custom events in Google Analytics
   - Add event tracking code to your site

### Troubleshooting

**Issue**: Analytics not showing data
- **Solution**: Check that the Measurement ID is correct and properly formatted
- **Solution**: Ensure ad blockers are disabled when testing
- **Solution**: Wait up to 24 hours for data to appear in reports

**Issue**: Privacy warnings in browser console
- **Solution**: Enable `respectDoNotTrack = true` in your configuration
- **Solution**: Implement cookie consent banner

## Google AdSense Setup

### Prerequisites

- Google account
- Website with original, high-quality content
- Compliance with AdSense policies
- Hugo site with this theme installed

### Step 1: Apply for Google AdSense

1. **Visit Google AdSense**
   - Go to [adsense.google.com](https://adsense.google.com)
   - Sign in with your Google account

2. **Add your website**
   - Click "Get started"
   - Enter your website URL
   - Select your country/territory
   - Choose whether you want to receive performance suggestions

3. **Connect your site to AdSense**
   - Copy the AdSense code provided
   - Note your Publisher ID (format: `ca-pub-XXXXXXXXXXXXXXXX`)

### Step 2: Configure Hugo Site

1. **Basic AdSense configuration**
   ```toml
   [params.adsense]
     enabled = true
     client = "ca-pub-2970874383549118"  # Replace with your Publisher ID
     autoAds = false  # Start with manual ads
     responsive = true
     lazyLoad = true
   ```

2. **Configure ad placements**
   ```toml
   [params.adsense.placements]
     header = false      # Top of page
     sidebar = true      # Sidebar widget area
     footer = true       # Bottom of page
     inContent = true    # Within articles
     beforeContent = false  # Before article content
     afterContent = true    # After article content
   ```

3. **Add ad unit slots** (after approval)
   ```toml
   [params.adsense.slots]
     sidebar = "4383549118"      # Replace with actual slot IDs
     footer = "4383549119"
     inContent = "4383549120"
     afterContent = "4383549121"
   ```

### Step 3: Create Ad Units (After Approval)

1. **Create ad units in AdSense**
   - Go to Ads > By ad unit
   - Click "Create ad unit"
   - Choose ad type (Display, In-feed, In-article, etc.)
   - Configure size and style
   - Copy the ad unit ID (10 digits)

2. **Update Hugo configuration**
   ```toml
   [params.adsense]
     enabled = true
     client = "ca-pub-2970874383549118"
     inArticleSlot = "4383549118"  # For in-article ads
     
   [params.adsense.slots]
     sidebar = "4383549119"
     footer = "4383549120"
   ```

### Step 4: Test Ad Display

1. **Enable test mode during development**
   ```toml
   [params.adsense]
     enabled = true
     testMode = true  # Shows test ads
   ```

2. **Deploy and verify**
   - Deploy your site to production
   - Check that ads display correctly
   - Verify responsive behavior on mobile devices

### Troubleshooting

**Issue**: Ads not displaying
- **Solution**: Ensure your AdSense account is approved
- **Solution**: Check that ad unit IDs are correct
- **Solution**: Verify that ad blockers are not interfering

**Issue**: "Ad serving has been limited" message
- **Solution**: Review AdSense policy compliance
- **Solution**: Check for invalid click activity
- **Solution**: Ensure content quality meets AdSense standards

## Facebook Pixel Setup

### Prerequisites

- Facebook Business account
- Facebook Ads Manager access
- Hugo site with this theme installed

### Step 1: Create Facebook Pixel

1. **Access Facebook Events Manager**
   - Go to [business.facebook.com](https://business.facebook.com)
   - Navigate to Events Manager
   - Click "Connect Data Sources" > "Web"

2. **Create a pixel**
   - Choose "Facebook Pixel"
   - Enter your pixel name
   - Enter your website URL
   - Click "Create Pixel"

3. **Get your Pixel ID**
   - After creation, you'll see your Pixel ID
   - It will be a 15-16 digit number
   - Copy this ID for use in your Hugo configuration

### Step 2: Configure Hugo Site

1. **Basic Facebook Pixel configuration**
   ```toml
   [params.facebookPixel]
     enabled = true
     pixelId = "123456789012345"  # Replace with your Pixel ID
     advancedMatching = false
   ```

2. **Configure event tracking**
   ```toml
   [params.facebookPixel.events]
     pageView = true          # Track page views
     viewContent = false      # Track content views
     search = true           # Track search events
     contact = true          # Track contact form submissions
     lead = false            # Track lead generation
     completeRegistration = false  # Track registrations
   ```

### Step 3: Set Up Custom Events (Optional)

1. **Configure additional events**
   ```toml
   [params.facebookPixel.events]
     purchase = false         # E-commerce purchases
     addToCart = false       # Add to cart events
     initiateCheckout = false # Checkout initiation
   ```

2. **Test pixel firing**
   - Install Facebook Pixel Helper browser extension
   - Visit your site and check that events fire correctly
   - Verify in Facebook Events Manager

### Step 4: Verify Installation

1. **Use Facebook Pixel Helper**
   - Install the Chrome extension
   - Visit your website
   - Check that the pixel fires correctly
   - Verify that events are tracked

2. **Check Events Manager**
   - Go to Facebook Events Manager
   - Select your pixel
   - Check the "Test Events" tab
   - Verify that events appear in real-time

### Troubleshooting

**Issue**: Pixel not firing
- **Solution**: Check that the Pixel ID is correct
- **Solution**: Ensure JavaScript is enabled
- **Solution**: Check browser console for errors

**Issue**: Events not tracking
- **Solution**: Verify event configuration in Hugo config
- **Solution**: Check that events are properly triggered
- **Solution**: Review Facebook's event tracking documentation

## Google Custom Search Setup

### Prerequisites

- Google account
- Website with indexed content
- Hugo site with this theme installed

### Step 1: Create Custom Search Engine

1. **Visit Google Custom Search**
   - Go to [cse.google.com](https://cse.google.com)
   - Sign in with your Google account

2. **Create a new search engine**
   - Click "Add" or "New search engine"
   - Enter your website URL in "Sites to search"
   - Enter a name for your search engine
   - Click "Create"

3. **Get your Search Engine ID**
   - After creation, you'll see your Search Engine ID
   - It will be a 17-character hexadecimal string
   - Copy this ID for use in your Hugo configuration

### Step 2: Configure Search Engine

1. **Customize search appearance**
   - Go to "Look and feel" in the control panel
   - Choose layout and theme options
   - Customize colors to match your site

2. **Configure search features**
   - Go to "Search features"
   - Enable autocomplete
   - Configure result snippets
   - Set up custom refinements if needed

### Step 3: Configure Hugo Site

1. **Basic Google Custom Search configuration**
   ```toml
   [params.gcs_engine_id]
     value = "3164aa570fbbb474a"  # Replace with your Search Engine ID
   ```

2. **Advanced configuration** (optional)
   ```toml
   [params.googleCustomSearch]
     engineId = "3164aa570fbbb474a"
     enabled = true
     autoComplete = true
     enableHistory = true
     maxCompletions = 5
     fallbackToLocal = true
     placeholder = "Search articles..."
     noResultsText = "No results found"
   ```

### Step 4: Test Search Functionality

1. **Test search on your site**
   - Build and serve your Hugo site
   - Use the search functionality
   - Verify that results appear correctly

2. **Verify fallback behavior**
   - Temporarily disable Google Custom Search
   - Ensure local search works as fallback

### Troubleshooting

**Issue**: Search not working
- **Solution**: Check that the Search Engine ID is correct
- **Solution**: Ensure your site is indexed by Google
- **Solution**: Verify that the search engine is set to "Public"

**Issue**: No search results
- **Solution**: Wait for Google to index your content
- **Solution**: Check that your site is accessible to Google crawlers
- **Solution**: Verify search engine configuration

## Mermaid Diagrams Setup

### Prerequisites

- Hugo site with this theme installed
- Basic understanding of Mermaid syntax

### Step 1: Enable Mermaid in Configuration

1. **Basic Mermaid configuration**
   ```toml
   [params.mermaid]
     enabled = true
     theme = "default"
   ```

2. **Advanced configuration** (optional)
   ```toml
   [params.mermaid]
     enabled = true
     theme = "default"  # Options: default, dark, forest, neutral, base
     startOnLoad = true
     securityLevel = "loose"
     version = "10.6.1"
     
   [params.mermaid.flowchart]
     useMaxWidth = true
     htmlLabels = true
     curve = "basis"
   ```

### Step 2: Create Diagrams in Content

1. **Using code blocks**
   ````markdown
   ```mermaid
   graph TD
       A[Start] --> B{Is it working?}
       B -->|Yes| C[Great!]
       B -->|No| D[Debug]
       D --> B
   ```
   ````

2. **Using shortcodes**
   ```markdown
   {{< mermaid >}}
   sequenceDiagram
       participant A as Alice
       participant B as Bob
       A->>B: Hello Bob, how are you?
       B-->>A: Great!
   {{< /mermaid >}}
   ```

### Step 3: Test Diagram Rendering

1. **Build and serve your site**
   ```bash
   hugo server -D
   ```

2. **Verify diagrams render correctly**
   - Check that diagrams appear on pages
   - Verify responsive behavior
   - Test different diagram types

### Step 4: Customize Diagram Appearance

1. **Theme-specific styling**
   ```toml
   [params.mermaid]
     theme = "dark"  # For dark mode sites
   ```

2. **Custom CSS** (optional)
   ```css
   /* In assets/css/custom.css */
   .mermaid {
     background-color: #f8f9fa;
     border-radius: 8px;
     padding: 1rem;
   }
   ```

### Supported Diagram Types

- **Flowcharts**: Process flows and decision trees
- **Sequence Diagrams**: Interaction between entities
- **Class Diagrams**: Object-oriented relationships
- **State Diagrams**: State transitions
- **Entity Relationship**: Database relationships
- **User Journey**: User experience flows
- **Gantt Charts**: Project timelines
- **Pie Charts**: Data visualization
- **Git Graphs**: Version control flows

### Troubleshooting

**Issue**: Diagrams not rendering
- **Solution**: Check that Mermaid is enabled in configuration
- **Solution**: Verify diagram syntax is correct
- **Solution**: Check browser console for JavaScript errors

**Issue**: Diagrams look broken
- **Solution**: Try different Mermaid themes
- **Solution**: Check for CSS conflicts
- **Solution**: Verify Mermaid version compatibility

## Privacy and Consent Setup

### Prerequisites

- Understanding of GDPR and privacy regulations
- Hugo site with analytics/advertising configured

### Step 1: Enable Privacy Settings

1. **Basic privacy configuration**
   ```toml
   [params.privacy]
     respectDoNotTrack = true
     cookieConsent = true
     anonymizeIP = true
   ```

2. **Configure consent banner**
   ```toml
   [params.privacy.consentBanner]
     enabled = true
     message = "We use cookies to improve your experience and analyze site usage."
     acceptText = "Accept All"
     declineText = "Decline"
     learnMoreText = "Privacy Policy"
     learnMoreUrl = "/privacy-policy"
     position = "bottom"
   ```

### Step 2: Create Privacy Policy

1. **Create privacy policy page**
   ```bash
   hugo new privacy-policy.md
   ```

2. **Add privacy policy content**
   ```markdown
   ---
   title: "Privacy Policy"
   date: 2025-10-13
   draft: false
   ---
   
   # Privacy Policy
   
   ## Information We Collect
   
   We collect information you provide directly to us and information we collect automatically when you use our website.
   
   ## How We Use Information
   
   We use the information we collect to provide, maintain, and improve our services.
   
   ## Cookies and Tracking
   
   We use cookies and similar tracking technologies to collect information about your browsing activities.
   
   ## Third-Party Services
   
   Our website uses the following third-party services:
   - Google Analytics for website analytics
   - Google AdSense for advertising
   - Facebook Pixel for marketing analytics
   
   ## Your Rights
   
   You have the right to access, update, or delete your personal information.
   
   ## Contact Us
   
   If you have questions about this privacy policy, please contact us at privacy@yoursite.com.
   ```

### Step 3: Configure Cookie Categories

1. **Set up cookie categories**
   ```toml
   [params.privacy.cookieCategories]
     necessary = true      # Always enabled
     analytics = false     # User choice
     marketing = false     # User choice
     preferences = false   # User choice
   ```

2. **Link categories to services**
   ```toml
   [params.privacy.serviceCategories]
     googleAnalytics = "analytics"
     facebookPixel = "marketing"
     googleAdsense = "marketing"
   ```

### Step 4: Test Privacy Compliance

1. **Test Do Not Track**
   - Enable Do Not Track in your browser
   - Verify that tracking scripts are disabled

2. **Test consent banner**
   - Clear cookies and reload site
   - Verify consent banner appears
   - Test accept/decline functionality

3. **Verify GDPR compliance**
   - Check that users can withdraw consent
   - Ensure privacy policy is accessible
   - Verify data processing transparency

### Troubleshooting

**Issue**: Consent banner not appearing
- **Solution**: Check that `cookieConsent = true` is set
- **Solution**: Clear browser cookies and reload
- **Solution**: Verify JavaScript is enabled

**Issue**: Tracking still active after declining
- **Solution**: Check service configuration
- **Solution**: Verify consent management implementation
- **Solution**: Test in incognito/private browsing mode

## General Setup Tips

### Development vs Production

1. **Development configuration**
   ```toml
   # Disable tracking in development
   [params.adsense]
     enabled = false
   [params.facebookPixel]
     enabled = false
   ```

2. **Production configuration**
   ```toml
   # Enable all services in production
   [params.adsense]
     enabled = true
   [params.facebookPixel]
     enabled = true
   ```

### Testing and Validation

1. **Use browser developer tools**
   - Check Network tab for service requests
   - Monitor Console for errors
   - Verify tracking pixels fire correctly

2. **Use service-specific testing tools**
   - Google Analytics Real-time reports
   - Facebook Pixel Helper extension
   - Google AdSense test ads

3. **Validate configuration**
   ```bash
   hugo --printI18nWarnings --printPathWarnings
   ```

### Performance Optimization

1. **Enable performance features**
   ```toml
   [params.performance]
     lazyLoadAds = true
     asyncScripts = true
     resourceHints = true
   ```

2. **Monitor Core Web Vitals**
   - Use Google PageSpeed Insights
   - Monitor Largest Contentful Paint (LCP)
   - Check Cumulative Layout Shift (CLS)

### Security Considerations

1. **Use HTTPS only**
   ```toml
   [params.security]
     httpsOnly = true
   ```

2. **Implement Content Security Policy**
   ```toml
   [params.security]
     contentSecurityPolicy = true
   ```

3. **Regular updates**
   - Keep theme updated
   - Monitor security advisories
   - Update service configurations as needed