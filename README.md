# Parsa Redesigned - Modern Hugo Theme

A completely redesigned version of the popular Parsa Hugo theme, featuring modern design elements, Tailwind CSS integration, and enhanced user experience. This theme transforms the traditional Bootstrap-based layout into a contemporary, visually appealing design with gradient backgrounds, card-based layouts, smooth animations, and improved typography.

## ✨ Features

- **Modern Design**: Contemporary UI with gradient backgrounds and card-based layouts
- **Tailwind CSS**: Utility-first CSS framework with JIT compilation
- **Responsive Design**: Mobile-first approach with optimized layouts for all devices
- **Performance Optimized**: Critical CSS inlining, lazy loading, and asset optimization
- **SEO Ready**: OpenGraph, Twitter Cards, structured data, and comprehensive meta tags
- **Multilingual Support**: Built-in i18n support for English and Chinese
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **Social Sharing**: Integrated social sharing buttons for major platforms
- **Search Functionality**: Fast client-side search with modern interface
- **Hugo Standards**: Follows official Hugo theme development standards

## 🚀 Quick Start

### Prerequisites

- Hugo Extended v0.147.2 or higher
- Node.js 16+ (for Tailwind CSS processing)
- Git

### Installation

#### Method 1: Hugo Modules (Recommended)

1. Initialize your Hugo site as a module:
```bash
hugo mod init github.com/yourusername/yoursite
```

2. Add the theme to your `hugo.toml`:
```toml
[module]
  [[module.imports]]
    path = "github.com/yourusername/parsa-redesigned"
```

3. Download the theme:
```bash
hugo mod get
```

#### Method 2: Git Submodule

1. Add the theme as a submodule:
```bash
git submodule add https://github.com/yourusername/parsa-redesigned.git themes/parsa-redesigned
```

2. Update your `hugo.toml`:
```toml
theme = "parsa-redesigned"
```

#### Method 3: Download ZIP

1. Download the latest release from GitHub
2. Extract to `themes/parsa-redesigned`
3. Update your `hugo.toml`:
```toml
theme = "parsa-redesigned"
```

### Basic Configuration

Copy the example configuration from `exampleSite/hugo.toml` to your site's root directory and customize:

```toml
baseURL = "https://yoursite.com"
languageCode = "en-us"
title = "Your Site Title"
theme = "parsa-redesigned"

# Hugo configuration
[module]
  [module.hugoVersion]
    extended = true
    min = "0.147.2"

# Theme parameters
[params]
  # Design settings
  primaryColor = "#3b82f6"
  accentColor = "#8b5cf6"
  
  # Site information
  description = "Your site description"
  author = "Your Name"
  
  # Feature toggles
  enableSearch = true
  enableSocialSharing = true
  enableAnimations = true
  
  # SEO settings
  [params.seo]
    enableOpenGraph = true
    enableTwitterCard = true
    defaultImage = "/images/og-default.jpg"

# Menu configuration
[menu]
  [[menu.main]]
    name = "Home"
    url = "/"
    weight = 1
  [[menu.main]]
    name = "Categories"
    url = "/categories/"
    weight = 2
  [[menu.main]]
    name = "About"
    url = "/about/"
    weight = 3

# Output formats for search
[outputs]
  home = ["HTML", "RSS", "JSON"]
```

### Content Structure

Create your content following Hugo's standard structure:

```
content/
├── _index.md          # Homepage content
├── about.md           # About page
├── posts/             # Blog posts
│   ├── _index.md
│   └── my-first-post.md
└── categories/        # Category pages
    └── _index.md
```

### Running the Site

1. Install Node.js dependencies (for Tailwind CSS):
```bash
npm install
```

2. Start the Hugo development server:
```bash
hugo server -D
```

3. Visit `http://localhost:1313` to see your site

## 📝 Content Creation

### Front Matter

Use the following front matter structure for optimal theme integration:

```yaml
---
title: "Your Post Title"
date: 2025-10-12T10:00:00Z
author: "Author Name"
categories: ["category-name"]
tags: ["tag1", "tag2"]
featured: true
draft: false

# SEO and Social
description: "Post description for SEO"
image: "images/post-image.jpg"
imageAlt: "Descriptive alt text"

# OpenGraph (optional)
og:
  title: "Custom OG title"
  description: "Custom OG description"
  image: "images/og-image.jpg"

# Twitter Card (optional)
twitter:
  card: "summary_large_image"
  image: "images/twitter-image.jpg"
---

Your content here...
```

### Shortcodes

The theme includes enhanced versions of Hugo's built-in shortcodes plus custom shortcodes, all designed with privacy, performance, and accessibility in mind:

#### Video Embeds
```markdown
{{< youtube id="dQw4w9WgXcQ" title="Video Title" >}}
{{< vimeo id="147365861" title="Vimeo Video" >}}
```

#### Social Media (Privacy-Focused)
```markdown
{{< twitter user="username" id="1234567890" >}}
{{< instagram id="BWNjjyYFxVx" >}}
```

#### Code and Development
```markdown
{{< gist username="spf13" id="7896402" >}}
```

#### Enhanced Content
```markdown
{{< figure src="image.jpg" alt="Description" caption="Image caption" >}}
{{< alert type="info" title="Note" >}}Important information{{< /alert >}}
```

#### Diagrams
```markdown
{{< mermaid >}}
graph TD
    A[Start] --> B[End]
{{< /mermaid >}}
```

**Privacy Features:**
- YouTube uses privacy-enhanced domain (`youtube-nocookie.com`)
- Social media shortcodes support "simple mode" for maximum privacy
- All embeds respect Hugo's privacy configuration
- GDPR-compliant with consent management support

For complete documentation, see the [Shortcodes Guide](docs/shortcodes.md).

## 🎨 Customization

### Colors and Styling

Customize the theme colors in your `hugo.toml`:

```toml
[params.design]
  primaryColor = "#3b82f6"      # Primary brand color
  accentColor = "#8b5cf6"       # Accent color for highlights
  backgroundColor = "#ffffff"    # Background color
  textColor = "#1f2937"         # Primary text color
  mutedColor = "#6b7280"        # Muted text color
```

### Custom CSS

Add custom styles by creating `assets/css/custom.css`:

```css
/* Custom styles */
.my-custom-class {
  @apply bg-primary text-white rounded-lg p-4;
}

/* Override theme styles */
.article-card {
  @apply shadow-xl;
}
```

### Custom JavaScript

Add custom JavaScript by creating `assets/js/custom.js`:

```javascript
// Custom JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
  // Your custom code here
});
```

### Layout Overrides

Override any theme template by creating the same file structure in your site's `layouts/` directory:

```
layouts/
├── _default/
│   └── single.html    # Override single post layout
├── partials/
│   └── header/
│       └── navbar.html # Override navigation
└── index.html         # Override homepage
```

## 🌐 Multilingual Setup

Enable multilingual support in your `hugo.toml`:

```toml
defaultContentLanguage = "en"
defaultContentLanguageInSubdir = false

[languages]
  [languages.en]
    languageName = "English"
    weight = 1
    [languages.en.params]
      description = "English site description"
  
  [languages.zh]
    languageName = "中文"
    weight = 2
    [languages.zh.params]
      description = "中文网站描述"

# Menu per language
[languages.en.menu]
  [[languages.en.menu.main]]
    name = "Home"
    url = "/"
    weight = 1

[languages.zh.menu]
  [[languages.zh.menu.main]]
    name = "首页"
    url = "/"
    weight = 1
```

Create language-specific content:

```
content/
├── _index.md          # English homepage
├── _index.zh.md       # Chinese homepage
├── posts/
│   ├── post-1.md      # English post
│   └── post-1.zh.md   # Chinese post
```

## 🔍 Search Configuration

The theme includes built-in search functionality. Configure it in your `hugo.toml`:

```toml
# Enable JSON output for search
[outputs]
  home = ["HTML", "RSS", "JSON"]
  section = ["HTML", "RSS"]

[params.search]
  enabled = true
  placeholder = "Search articles..."
  noResultsText = "No results found"
  minQueryLength = 2
```

## 📱 Social Media Integration

Configure social media links and sharing:

```toml
[params.social]
  twitter = "https://twitter.com/yourusername"
  facebook = "https://facebook.com/yourpage"
  github = "https://github.com/yourusername"
  linkedin = "https://linkedin.com/in/yourprofile"

[params.sharing]
  enabled = true
  twitter = true
  facebook = true
  linkedin = true
  copyLink = true
```

## ⚡ Performance Optimization

The theme includes several performance optimizations:

- **Critical CSS**: Above-the-fold styles are inlined
- **Lazy Loading**: Images and iframes load on demand
- **Asset Optimization**: CSS and JS are minified and fingerprinted
- **Image Processing**: Responsive images with WebP support

Configure performance settings:

```toml
[params.performance]
  enableCriticalCSS = true
  enableLazyLoading = true
  enableImageOptimization = true
  enableServiceWorker = false
```

## 🧪 Testing

Run the included test suite:

```bash
# Install test dependencies
cd tests
npm install

# Run all tests
npm run test

# Run specific tests
npm run test:accessibility
npm run test:performance
npm run test:cross-browser
```

## 📚 Documentation

- [Configuration Guide](CONFIGURATION.md) - Detailed configuration options
- [Migration Guide](MIGRATION.md) - Migrating from original Parsa theme
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues and solutions
- [Performance Guide](docs/performance-optimization.md) - Performance optimization tips
- [Shortcodes Guide](docs/shortcodes.md) - Available shortcodes and usage

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This theme is released under the MIT License. See [LICENSE](LICENSE) for details.

## 🙏 Credits

- Original Parsa theme by [Themefisher](https://themefisher.com/)
- Built with [Hugo](https://gohugo.io/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)

## 📞 Support

- 📖 [Documentation](https://github.com/yourusername/parsa-redesigned/wiki)
- 🐛 [Issue Tracker](https://github.com/yourusername/parsa-redesigned/issues)
- 💬 [Discussions](https://github.com/yourusername/parsa-redesigned/discussions)

---

Made with ❤️ for the Hugo community# parsa-repo
