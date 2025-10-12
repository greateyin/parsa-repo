# Shortcode Troubleshooting Guide

This guide helps you resolve common issues with Hugo shortcodes in this theme.

## Quick Diagnostics

### 1. Shortcode Syntax Check

Ensure your shortcode syntax is correct:

```markdown
✅ Correct:
{{< youtube id="dQw4w9WgXcQ" >}}

❌ Incorrect:
{{ youtube id="dQw4w9WgXcQ" }}  // Missing angle brackets
{{< youtube "dQw4w9WgXcQ" >}}   // Missing parameter name
{{< youtube id=dQw4w9WgXcQ >}}   // Missing quotes
```

### 2. Parameter Validation

Check that all required parameters are provided:

```markdown
✅ Required parameters present:
{{< gist username="spf13" id="7896402" >}}

❌ Missing required parameter:
{{< gist id="7896402" >}}  // Missing username
```

### 3. File Existence Check

Verify shortcode files exist in your theme:

```
layouts/
└── shortcodes/
    ├── youtube.html
    ├── vimeo.html
    ├── twitter.html
    ├── instagram.html
    ├── gist.html
    ├── figure.html
    ├── alert.html
    └── mermaid.html
```

## Common Issues and Solutions

### Issue: Shortcode Renders as Plain Text

**Symptoms:**
- Shortcode appears as `{{< youtube id="..." >}}` in the output
- No video or content is displayed

**Causes and Solutions:**

1. **Incorrect Syntax**
   ```markdown
   ❌ Wrong: {{ youtube id="VIDEO_ID" }}
   ✅ Correct: {{< youtube id="VIDEO_ID" >}}
   ```

2. **Missing Shortcode File**
   - Check if `layouts/shortcodes/youtube.html` exists
   - Ensure the file has the correct name and extension

3. **Hugo Version Compatibility**
   - Ensure you're using Hugo 0.55.0 or later
   - Update Hugo if necessary: `hugo version`

4. **Markdown Processing**
   - Check your content file's front matter
   - Ensure the file has `.md` extension

### Issue: Video Embeds Not Loading

**Symptoms:**
- Loading spinner appears indefinitely
- Blank space where video should be
- Error message in embed area

**Causes and Solutions:**

1. **Invalid Video ID**
   ```markdown
   ❌ Wrong: {{< youtube id="invalid-id" >}}
   ✅ Correct: {{< youtube id="dQw4w9WgXcQ" >}}
   ```
   
   **How to find correct IDs:**
   - YouTube: URL `https://www.youtube.com/watch?v=dQw4w9WgXcQ` → ID is `dQw4w9WgXcQ`
   - Vimeo: URL `https://vimeo.com/147365861` → ID is `147365861`

2. **Content Security Policy (CSP) Blocking**
   
   Add these domains to your CSP:
   ```html
   <meta http-equiv="Content-Security-Policy" content="
     frame-src https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com;
     script-src https://www.youtube.com https://player.vimeo.com;
   ">
   ```

3. **Network or Firewall Issues**
   - Check if the video loads directly in browser
   - Verify corporate firewall isn't blocking embeds
   - Test on different network connection

4. **Privacy Settings Blocking**
   
   Check your Hugo privacy configuration:
   ```toml
   [privacy]
     [privacy.youtube]
       disable = false  # Should be false to allow embeds
   ```

### Issue: Social Media Embeds Not Appearing

**Symptoms:**
- Twitter/Instagram embeds show as simple links
- No embedded content visible
- "Simple mode" styling appears

**Causes and Solutions:**

1. **Privacy Simple Mode Enabled**
   
   Check your configuration:
   ```toml
   [privacy]
     [privacy.twitter]
       simple = true  # Change to false for full embeds
     [privacy.instagram]
       simple = true  # Change to false for full embeds
   ```

2. **Ad Blockers or Privacy Extensions**
   - Disable ad blockers temporarily to test
   - Whitelist your site in privacy extensions
   - Check browser's tracking protection settings

3. **Third-Party Cookies Disabled**
   - Enable third-party cookies for social media domains
   - Add exceptions for twitter.com and instagram.com

4. **Invalid Post IDs**
   
   **Twitter ID extraction:**
   ```
   URL: https://twitter.com/user/status/1234567890123456789
   ID: 1234567890123456789
   ```
   
   **Instagram ID extraction:**
   ```
   URL: https://www.instagram.com/p/BWNjjyYFxVx/
   ID: BWNjjyYFxVx
   ```

### Issue: GitHub Gist Not Loading

**Symptoms:**
- "Failed to load gist" error message
- Infinite loading spinner
- Blank gist container

**Causes and Solutions:**

1. **Incorrect Username or Gist ID**
   ```markdown
   ❌ Wrong: {{< gist username="wrong-user" id="invalid-id" >}}
   ✅ Correct: {{< gist username="spf13" id="7896402" >}}
   ```

2. **Private Gist**
   - Ensure the gist is public
   - Check gist URL accessibility in browser

3. **JavaScript Disabled**
   - Enable JavaScript in browser
   - Check for JavaScript errors in console

4. **Network Issues**
   - Verify api.github.com is accessible
   - Check corporate firewall settings

### Issue: Mermaid Diagrams Not Rendering

**Symptoms:**
- Raw Mermaid syntax visible instead of diagram
- JavaScript errors in console
- Blank diagram area

**Causes and Solutions:**

1. **Mermaid Not Enabled**
   
   Enable in configuration:
   ```toml
   [params.mermaid]
     enabled = true
   ```

2. **Invalid Mermaid Syntax**
   
   Validate your diagram syntax:
   ```markdown
   ✅ Correct:
   {{< mermaid >}}
   graph TD
       A[Start] --> B[End]
   {{< /mermaid >}}
   
   ❌ Wrong syntax:
   {{< mermaid >}}
   graph TD
       A[Start] -> B[End]  // Wrong arrow syntax
   {{< /mermaid >}}
   ```

3. **Script Loading Issues**
   - Check browser console for 404 errors
   - Verify CDN accessibility
   - Check Content Security Policy settings

### Issue: Figure Images Not Displaying

**Symptoms:**
- Broken image icons
- Alt text showing instead of image
- 404 errors for image resources

**Causes and Solutions:**

1. **Incorrect Image Path**
   ```markdown
   ❌ Wrong: {{< figure src="image.jpg" >}}
   ✅ Correct: {{< figure src="/images/image.jpg" >}}
   ```

2. **Missing Alt Text Warning**
   
   Always include alt text:
   ```markdown
   {{< figure src="/images/image.jpg" alt="Descriptive text" >}}
   ```

3. **Image Processing Errors**
   - Check Hugo console for image processing errors
   - Verify image file exists and is readable
   - Ensure image format is supported (JPEG, PNG, WebP, GIF)

## Performance Issues

### Slow Loading Embeds

**Solutions:**

1. **Enable Lazy Loading**
   ```markdown
   {{< youtube id="VIDEO_ID" loading="lazy" >}}
   ```

2. **Preconnect to External Domains**
   
   Add to your site's `<head>`:
   ```html
   <link rel="preconnect" href="https://www.youtube.com">
   <link rel="preconnect" href="https://player.vimeo.com">
   <link rel="preconnect" href="https://platform.twitter.com">
   ```

3. **Optimize Images**
   - Use appropriate image sizes
   - Enable WebP conversion
   - Implement responsive images

### Multiple Embeds Causing Slowdown

**Solutions:**

1. **Limit Embeds Per Page**
   - Consider pagination for content with many embeds
   - Use simple mode for less critical embeds

2. **Async Loading**
   - All scripts load asynchronously by default
   - Avoid blocking render with embeds

## Browser-Specific Issues

### Safari Issues

**Common Problems:**
- Autoplay restrictions
- Third-party cookie limitations

**Solutions:**
- Set `autoplay="false"` explicitly
- Use privacy-enhanced modes
- Test with Safari's privacy settings

### Firefox Issues

**Common Problems:**
- Enhanced tracking protection blocking embeds
- Strict privacy settings

**Solutions:**
- Whitelist your site in Firefox
- Use simple modes for social media
- Check tracking protection settings

### Mobile Browser Issues

**Common Problems:**
- Touch interaction problems
- Viewport sizing issues
- Performance on slower connections

**Solutions:**
- Test responsive behavior
- Use lazy loading
- Optimize for mobile networks

## Debugging Steps

### 1. Browser Developer Tools

1. Open Developer Tools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab for failed requests
4. Inspect Elements to verify HTML structure

### 2. Hugo Build Diagnostics

1. Run Hugo with verbose output:
   ```bash
   hugo server --verbose --debug
   ```

2. Check for shortcode processing errors
3. Verify template compilation

### 3. Content Validation

1. Test shortcodes in isolation
2. Create minimal test content
3. Verify parameter values

### 4. Configuration Check

1. Review Hugo configuration file
2. Check privacy settings
3. Verify theme parameters

## Getting Help

If you're still experiencing issues:

1. **Check Hugo Documentation**: [gohugo.io/content-management/shortcodes/](https://gohugo.io/content-management/shortcodes/)

2. **Theme Issues**: Create an issue on the theme's GitHub repository with:
   - Hugo version (`hugo version`)
   - Shortcode code that's not working
   - Expected vs actual behavior
   - Browser and OS information

3. **Configuration Example**: Include relevant parts of your `hugo.toml`

4. **Minimal Reproduction**: Provide a minimal example that reproduces the issue

## Prevention Tips

1. **Always Test Locally**: Test shortcodes in development before deploying

2. **Validate Parameters**: Double-check all required parameters are provided

3. **Keep Backups**: Maintain working versions of content files

4. **Monitor External Services**: Be aware that third-party services may change their embed requirements

5. **Regular Updates**: Keep Hugo and the theme updated to the latest versions

6. **Documentation**: Document any custom configurations or modifications