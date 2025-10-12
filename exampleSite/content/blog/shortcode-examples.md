---
title: "Hugo Shortcode Examples"
date: 2024-01-15T10:00:00Z
draft: false
description: "Demonstration of all supported Hugo shortcodes with enhanced styling and privacy features"
categories: ["Documentation", "Examples"]
tags: ["shortcodes", "hugo", "examples", "media"]
author: "Theme Developer"
---

This page demonstrates all the enhanced Hugo shortcodes available in this theme, showcasing their privacy-focused features and consistent styling.

## Video Shortcodes

### YouTube Videos

The YouTube shortcode supports privacy-enhanced mode and various customization options:

{{< youtube id="dQw4w9WgXcQ" title="Rick Astley - Never Gonna Give You Up" >}}

You can also customize autoplay and start time:

{{< youtube id="dQw4w9WgXcQ" title="Rick Astley - Never Gonna Give You Up" autoplay="false" start="30" >}}

### Vimeo Videos

Vimeo embeds with Do Not Track enabled by default:

{{< vimeo id="147365861" title="Vimeo Demo Video" >}}

## Social Media Shortcodes

### Twitter Posts

Twitter embeds respect privacy settings and can fall back to simple mode:

{{< twitter user="hugo_io" id="877500564405444608" >}}

### Instagram Posts

Instagram posts with privacy-conscious embedding:

{{< instagram id="BWNjjyYFxVx" >}}

You can hide captions if needed:

{{< instagram id="BWNjjyYFxVx" hidecaption="true" >}}

## Code and Development

### GitHub Gists

Enhanced gist embedding with better error handling:

{{< gist username="spf13" id="7896402" >}}

You can also specify a particular file from a multi-file gist:

{{< gist username="spf13" id="7896402" file="README.md" >}}

## Enhanced Features

### Figure with Advanced Image Processing

The enhanced figure shortcode supports responsive images and WebP conversion:

{{< figure src="/images/example.jpg" alt="Example image" caption="This is an example image with responsive sizing" >}}

### Alert Boxes

Create attention-grabbing alerts with different types:

{{< alert type="info" title="Information" >}}
This is an informational alert with useful tips and information.
{{< /alert >}}

{{< alert type="warning" title="Warning" >}}
This is a warning alert to draw attention to important information.
{{< /alert >}}

{{< alert type="error" title="Error" >}}
This is an error alert for critical information that needs immediate attention.
{{< /alert >}}

{{< alert type="success" title="Success" >}}
This is a success alert to confirm that an action was completed successfully.
{{< /alert >}}

### Mermaid Diagrams

Create beautiful diagrams using Mermaid syntax:

{{< mermaid >}}
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
{{< /mermaid >}}

You can also use code blocks with the `mermaid` language:

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Server
    
    User->>Browser: Enter URL
    Browser->>Server: HTTP Request
    Server->>Browser: HTML Response
    Browser->>User: Render Page
```

## Privacy and Performance Features

All shortcodes in this theme include:

- **Privacy Protection**: Respect Do Not Track settings and GDPR compliance
- **Performance Optimization**: Lazy loading and async script loading
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Responsive Design**: Mobile-friendly layouts and touch interactions
- **Error Handling**: Graceful fallbacks when external services are unavailable
- **Dark Mode Support**: Consistent styling across light and dark themes

## Configuration

You can control the behavior of these shortcodes through your Hugo configuration:

```toml
[privacy]
  [privacy.youtube]
    disable = false
    privacyEnhanced = true
  [privacy.twitter]
    disable = false
    enableDNT = true
    simple = false
  [privacy.instagram]
    disable = false
    simple = false
  [privacy.vimeo]
    disable = false
    enableDNT = true
```

When `simple = true` is set for social media shortcodes, they will display as simple links instead of full embeds, providing maximum privacy protection.