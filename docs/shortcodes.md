# Enhanced Shortcodes Documentation

The Parsa Redesigned theme includes several enhanced shortcodes that provide modern, accessible, and responsive content features. All shortcodes follow accessibility best practices and include proper ARIA labels and semantic HTML.

## Figure Shortcode

Enhanced image handling with responsive images, WebP support, and accessibility features.

### Usage
```markdown
{{< figure src="image.jpg" alt="Description" caption="Image caption" class="custom-class" >}}
```

### Parameters
- `src` (required): Image source path
- `alt` (required): Alt text for accessibility
- `caption` (optional): Image caption with markdown support
- `class` (optional): Additional CSS classes
- `width` (optional): Image width attribute
- `height` (optional): Image height attribute
- `loading` (optional): Loading behavior (default: "lazy")
- `sizes` (optional): Responsive image sizes

### Features
- Automatic WebP conversion when using page resources
- Responsive image generation (480px, 768px, 1024px)
- Hover effects with smooth transitions
- Proper semantic HTML with `<figure>` and `<figcaption>`
- Lazy loading support

### Example
```markdown
{{< figure 
  src="architecture-diagram.jpg" 
  alt="System architecture showing microservices communication" 
  caption="Our **microservices architecture** enables scalable deployment"
  class="border shadow-lg" >}}
```

## YouTube Shortcode

Privacy-focused YouTube embeds with enhanced loading and accessibility.

### Usage
```markdown
{{< youtube id="VIDEO_ID" title="Video Title" >}}
```

### Parameters
- `id` (required): YouTube video ID
- `title` (optional): Video title for accessibility (default: "YouTube video")
- `autoplay` (optional): Enable autoplay (default: "false")
- `start` (optional): Start time in seconds
- `class` (optional): Additional CSS classes
- `privacy` (optional): Use youtube-nocookie.com (default: "true")

### Features
- Privacy-focused with youtube-nocookie.com by default
- Loading placeholder with YouTube branding
- Responsive 16:9 aspect ratio
- Structured data (JSON-LD) for SEO
- Lazy loading iframe
- Accessibility-compliant with proper titles

### Example
```markdown
{{< youtube 
  id="dQw4w9WgXcQ" 
  title="Introduction to Hugo Static Site Generator"
  start="30"
  autoplay="false" >}}
```

## Gallery Shortcode

Modern image galleries with lightbox functionality and responsive grid layouts.

### Usage Method 1: Pattern Matching
```markdown
{{< gallery match="images/*" caption="Photo Gallery" columns="3" >}}
```

### Usage Method 2: Individual Images
```markdown
{{< gallery caption="My Gallery" columns="2" >}}
  {{< gallery-image src="image1.jpg" alt="Description 1" caption="Caption 1" >}}
  {{< gallery-image src="image2.jpg" alt="Description 2" caption="Caption 2" >}}
{{< /gallery >}}
```

### Gallery Parameters
- `match` (optional): Pattern to match page resources (e.g., "images/*")
- `caption` (optional): Gallery title/caption
- `columns` (optional): Number of columns (default: "3")
- `class` (optional): Additional CSS classes
- `gap` (optional): Grid gap size (default: "4")

### Gallery-Image Parameters
- `src` (required): Image source path
- `alt` (required): Alt text for accessibility
- `caption` (optional): Individual image caption
- `class` (optional): Additional CSS classes

### Features
- Responsive grid layout (1 column mobile, 2 tablet, 3+ desktop)
- Lightbox with keyboard navigation (arrow keys, escape)
- WebP conversion for page resources
- Hover effects with zoom icons
- Touch-friendly navigation
- Automatic thumbnail generation (400x400)
- Large image generation (1200px) for lightbox

### Example
```markdown
{{< gallery match="gallery/*" caption="Conference Photos 2024" columns="4" >}}

<!-- Or with individual control -->
{{< gallery caption="Product Screenshots" >}}
  {{< gallery-image 
    src="dashboard.jpg" 
    alt="Main dashboard interface" 
    caption="User dashboard with analytics" >}}
  {{< gallery-image 
    src="settings.jpg" 
    alt="Settings panel" 
    caption="Configuration options" >}}
{{< /gallery >}}
```

## Alert Shortcode

Styled callout boxes for highlighting important information.

### Usage
```markdown
{{< alert type="info" title="Important Note" >}}
Content with **markdown** support.
{{< /alert >}}
```

### Parameters
- `type` (optional): Alert type - "info", "warning", "error", "success" (default: "info")
- `title` (optional): Alert title
- `icon` (optional): Custom SVG path for icon
- `class` (optional): Additional CSS classes

### Features
- Four predefined types with appropriate colors and icons
- Dark mode support
- Markdown content support
- Accessible with proper ARIA roles
- Responsive design

### Example
```markdown
{{< alert type="warning" title="Breaking Change" >}}
This feature will be **deprecated** in version 2.0. Please migrate to the new API.
{{< /alert >}}

{{< alert type="success" >}}
✅ All tests passed successfully!
{{< /alert >}}
```

## Button Shortcode

Enhanced buttons with modern styling and accessibility features.

### Usage
```markdown
{{< button href="https://example.com" type="primary" size="lg" target="_blank" >}}
Button Text
{{< /button >}}
```

### Parameters
- `href` (optional): Link URL (creates `<a>` tag, otherwise `<button>`)
- `type` (optional): Button style - "primary", "secondary", "outline", "ghost", "link" (default: "primary")
- `size` (optional): Button size - "sm", "md", "lg", "xl" (default: "md")
- `target` (optional): Link target (e.g., "_blank")
- `rel` (optional): Link relationship (auto-adds "noopener noreferrer" for _blank)
- `class` (optional): Additional CSS classes
- `icon` (optional): SVG path for icon
- `iconPosition` (optional): Icon position - "left", "right" (default: "left")

### Features
- Consistent with modern design systems
- Proper focus states and accessibility
- Icon support with positioning
- Automatic security attributes for external links
- Responsive sizing

### Example
```markdown
{{< button 
  href="/docs/getting-started" 
  type="primary" 
  size="lg"
  icon="M9 5l7 7-7 7" 
  iconPosition="right" >}}
Get Started
{{< /button >}}

{{< button type="outline" >}}
Cancel
{{< /button >}}
```

## Code Shortcode

Enhanced code blocks with syntax highlighting and copy functionality.

### Usage
```markdown
{{< code lang="javascript" title="example.js" copy="true" >}}
const hello = "world";
console.log(hello);
{{< /code >}}
```

### Parameters
- `lang` (optional): Programming language for syntax highlighting (default: "text")
- `title` (optional): Code block title/filename
- `copy` (optional): Enable copy button (default: "true")
- `lineNumbers` (optional): Show line numbers (default: "false")
- `highlight` (optional): Highlight specific lines
- `class` (optional): Additional CSS classes

### Features
- One-click copy to clipboard
- Syntax highlighting support
- File title display
- Copy confirmation feedback
- Responsive design
- Proper semantic HTML

### Example
```markdown
{{< code lang="python" title="main.py" copy="true" >}}
def hello_world():
    print("Hello, World!")
    return True

if __name__ == "__main__":
    hello_world()
{{< /code >}}
```

## Content Bundles and Page Resources

All shortcodes support Hugo's page bundles and page resources for better organization and performance.

### Page Bundle Structure
```
content/
├── posts/
│   ├── my-article/
│   │   ├── index.md          # Article content
│   │   ├── featured.jpg      # Featured image
│   │   ├── gallery/          # Gallery images
│   │   │   ├── photo1.jpg
│   │   │   ├── photo2.jpg
│   │   │   └── photo3.jpg
│   │   └── diagrams/         # Diagrams and charts
│   │       ├── architecture.png
│   │       └── workflow.svg
```

### Using Page Resources
```markdown
<!-- Reference images directly from the bundle -->
{{< figure src="featured.jpg" alt="Article featured image" >}}

<!-- Use pattern matching for galleries -->
{{< gallery match="gallery/*" caption="Event Photos" >}}

<!-- Reference specific resources -->
{{< figure src="diagrams/architecture.png" alt="System architecture" >}}
```

### Benefits
- Automatic image processing and optimization
- WebP conversion for better performance
- Responsive image generation
- Better content organization
- Portable content bundles

## Accessibility Features

All shortcodes include comprehensive accessibility features:

### Required Alt Text
- Figure and gallery-image shortcodes require `alt` parameters
- Warnings are generated for missing alt text during build

### Semantic HTML
- Proper use of `<figure>`, `<figcaption>`, `<button>`, etc.
- ARIA labels and roles where appropriate
- Keyboard navigation support

### Focus Management
- Visible focus indicators
- Logical tab order
- Keyboard shortcuts (gallery lightbox)

### Screen Reader Support
- Descriptive labels and titles
- Proper heading hierarchy
- Alternative text for all images

## Performance Optimizations

### Image Processing
- Automatic WebP conversion
- Multiple size generation for responsive images
- Lazy loading by default
- Proper aspect ratio maintenance

### JavaScript
- Minimal JavaScript footprint
- Progressive enhancement
- No external dependencies
- Efficient event handling

### CSS
- Tailwind CSS utility classes
- Minimal custom CSS
- Responsive design patterns
- Dark mode support

## Best Practices

### Image Optimization
1. Use page bundles for better organization
2. Provide descriptive alt text for all images
3. Use appropriate image formats (WebP when possible)
4. Include captions for context

### Content Structure
1. Use semantic shortcodes appropriately
2. Maintain consistent styling with theme classes
3. Test accessibility with screen readers
4. Optimize for mobile devices

### Performance
1. Use lazy loading for images
2. Minimize JavaScript usage
3. Leverage Hugo's image processing
4. Test on various devices and connections

This documentation covers all the enhanced shortcodes available in the Parsa Redesigned theme. Each shortcode is designed to provide modern functionality while maintaining excellent performance and accessibility standards.