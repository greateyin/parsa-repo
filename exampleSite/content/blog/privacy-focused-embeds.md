---
title: "Privacy-Focused Media Embeds"
date: 2024-01-16T14:30:00Z
draft: false
description: "Demonstrating privacy-enhanced shortcodes and simple mode alternatives"
categories: ["Privacy", "Documentation"]
tags: ["privacy", "embeds", "gdpr", "shortcodes"]
author: "Privacy Advocate"
---

This page demonstrates how the theme's shortcodes prioritize user privacy while maintaining functionality and visual appeal.

## Privacy-Enhanced Video Embeds

### YouTube with Privacy Mode

By default, all YouTube embeds use the privacy-enhanced `youtube-nocookie.com` domain:

{{< youtube id="jNQXAC9IVRw" title="Privacy-Enhanced YouTube Embed" >}}

This approach:
- Reduces tracking cookies
- Minimizes data collection
- Maintains full functionality
- Respects user privacy preferences

### Vimeo with Do Not Track

Vimeo embeds automatically enable Do Not Track (DNT) headers:

{{< vimeo id="76979871" title="Vimeo with DNT Enabled" >}}

## Social Media Privacy Modes

### Twitter Simple Mode

When privacy is a priority, social media shortcodes can display as styled cards instead of full embeds. This is controlled by your Hugo configuration:

```toml
[privacy]
  [privacy.twitter]
    simple = true
    enableDNT = true
```

With simple mode enabled, Twitter shortcodes appear as:

{{< twitter user="hugo_io" id="877500564405444608" >}}

### Instagram Simple Mode

Similarly, Instagram posts can be displayed as privacy-friendly cards:

```toml
[privacy]
  [privacy.instagram]
    simple = true
```

{{< instagram id="BWNjjyYFxVx" >}}

## Privacy Configuration Options

### Complete Privacy Configuration

Here's a comprehensive privacy configuration for your `hugo.toml`:

```toml
[privacy]
  # Disable services entirely if needed
  [privacy.disqus]
    disable = false
    
  [privacy.googleAnalytics]
    disable = false
    respectDoNotTrack = true
    anonymizeIP = true
    
  # YouTube privacy settings
  [privacy.youtube]
    disable = false
    privacyEnhanced = true  # Uses youtube-nocookie.com
    
  # Vimeo privacy settings
  [privacy.vimeo]
    disable = false
    enableDNT = true       # Enables Do Not Track
    simple = false         # Set to true for link-only mode
    
  # Twitter privacy settings
  [privacy.twitter]
    disable = false
    enableDNT = true       # Enables Do Not Track
    simple = false         # Set to true for card mode
    
  # Instagram privacy settings
  [privacy.instagram]
    disable = false
    simple = false         # Set to true for card mode
```

## GDPR Compliance Features

### Consent Management

The theme's shortcodes work seamlessly with consent management systems:

1. **Conditional Loading**: External scripts only load when consent is given
2. **Fallback Content**: Privacy-friendly alternatives when embeds are blocked
3. **User Control**: Easy opt-in/opt-out mechanisms

### Data Minimization

All shortcodes implement data minimization principles:

- **YouTube**: Uses privacy-enhanced domain, disables related videos from other channels
- **Vimeo**: Removes user information, enables DNT
- **Social Media**: Simple mode eliminates tracking entirely
- **Gists**: No user tracking, only content display

## Content Security Policy Support

The shortcodes are designed to work with strict Content Security Policies:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 
    https://www.youtube.com 
    https://player.vimeo.com 
    https://platform.twitter.com 
    https://www.instagram.com 
    https://gist.github.com;
  frame-src 
    https://www.youtube.com 
    https://www.youtube-nocookie.com 
    https://player.vimeo.com;
  img-src 'self' data: 
    https://i.ytimg.com 
    https://i.vimeocdn.com;
">
```

## Accessibility and Privacy

Privacy features don't compromise accessibility:

- **Screen Readers**: All embeds include proper ARIA labels
- **Keyboard Navigation**: Full keyboard support maintained
- **High Contrast**: Privacy modes work with high contrast themes
- **Reduced Motion**: Respects user motion preferences

## Performance Benefits

Privacy-focused configurations often improve performance:

1. **Fewer External Requests**: Simple modes eliminate third-party scripts
2. **Faster Loading**: Reduced JavaScript execution
3. **Lower Bandwidth**: Smaller page sizes
4. **Better Core Web Vitals**: Improved performance metrics

## User Experience

Privacy modes maintain excellent user experience:

- **Visual Consistency**: Styled cards match theme design
- **Clear Actions**: Obvious links to external content
- **Progressive Enhancement**: Works without JavaScript
- **Mobile Friendly**: Responsive design across devices

## Implementation Examples

### Blog Post with Mixed Privacy Levels

You can mix privacy levels within the same content:

```markdown
<!-- High privacy: Simple card -->
{{< twitter user="example" id="123456789" >}}

<!-- Medium privacy: Privacy-enhanced embed -->
{{< youtube id="VIDEO_ID" privacy="true" >}}

<!-- Standard embed for trusted content -->
{{< figure src="/images/local-image.jpg" alt="Local content" >}}
```

### Documentation with Code Examples

For technical documentation, use privacy-friendly code embeds:

{{< gist username="spf13" id="7896402" file="README.md" >}}

GitHub Gists don't track users and provide excellent code display.

## Testing Privacy Settings

### Browser Testing

Test your privacy settings across different browsers:

1. **Chrome**: Check with Enhanced Safe Browsing
2. **Firefox**: Test with Enhanced Tracking Protection
3. **Safari**: Verify with Intelligent Tracking Prevention
4. **Edge**: Test with tracking prevention enabled

### Privacy Tools

Use privacy analysis tools:

- **Ghostery**: Check for tracking scripts
- **Privacy Badger**: Verify tracker blocking
- **uBlock Origin**: Test with ad/tracker blocking
- **DuckDuckGo Privacy Essentials**: Analyze privacy grade

## Conclusion

This theme's approach to privacy demonstrates that you don't have to choose between functionality and user privacy. The shortcodes provide:

- **Flexible Privacy Levels**: From full embeds to simple cards
- **GDPR Compliance**: Built-in privacy protection
- **Performance Benefits**: Faster loading with privacy modes
- **User Control**: Easy configuration options
- **Accessibility**: No compromise on usability

Configure your privacy settings based on your audience's needs and regulatory requirements. The theme adapts to provide the best experience while respecting user privacy.