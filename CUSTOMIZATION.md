# Theme Customization Guide

This guide provides examples and code snippets for customizing the Parsa Redesigned Hugo theme.

## Table of Contents

- [Color Customization](#color-customization)
- [Typography Customization](#typography-customization)
- [Layout Modifications](#layout-modifications)
- [Custom Components](#custom-components)
- [Advanced Styling](#advanced-styling)
- [JavaScript Customization](#javascript-customization)
- [Template Overrides](#template-overrides)
- [Shortcode Customization](#shortcode-customization)
- [Performance Customization](#performance-customization)
- [SEO Customization](#seo-customization)

## Color Customization

### Basic Color Scheme

Customize theme colors in your `hugo.toml`:

```toml
[params.design]
  # Primary brand colors
  primaryColor = "#3b82f6"        # Blue-500
  accentColor = "#8b5cf6"         # Violet-500
  
  # Background colors
  backgroundColor = "#ffffff"      # White
  cardBackground = "#f9fafb"      # Gray-50
  
  # Text colors
  textColor = "#1f2937"           # Gray-800
  mutedTextColor = "#6b7280"      # Gray-500
  linkColor = "#3b82f6"           # Blue-500
```

### Advanced Color Customization

Create `assets/css/colors.css`:

```css
@layer base {
  :root {
    /* Custom color palette */
    --color-brand-50: #eff6ff;
    --color-brand-100: #dbeafe;
    --color-brand-500: #3b82f6;
    --color-brand-600: #2563eb;
    --color-brand-900: #1e3a8a;
    
    /* Semantic colors */
    --color-success: #10b981;
    --color-warning: #f59e0b;
    --color-error: #ef4444;
    --color-info: #06b6d4;
  }
}

@layer components {
  .btn-brand {
    @apply bg-[var(--color-brand-500)] hover:bg-[var(--color-brand-600)] text-white;
  }
  
  .text-brand {
    color: var(--color-brand-500);
  }
  
  .bg-brand-gradient {
    background: linear-gradient(135deg, var(--color-brand-500), var(--color-brand-600));
  }
}
```### Dar
k Mode Implementation

Add dark mode support:

```css
/* assets/css/dark-mode.css */
@layer base {
  .dark {
    --color-background: #0f172a;
    --color-card: #1e293b;
    --color-text: #f1f5f9;
    --color-muted: #94a3b8;
  }
}

@layer components {
  .theme-toggle {
    @apply p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors;
  }
}
```

```javascript
// assets/js/dark-mode.js
export function initDarkMode() {
  const toggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  function setTheme(isDark) {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
  
  // Initialize theme
  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme ? savedTheme === 'dark' : prefersDark.matches;
  setTheme(isDark);
  
  // Toggle handler
  toggle?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(!isDark);
  });
}
```

## Typography Customization

### Custom Fonts

```toml
# hugo.toml
[params.typography]
  headingFont = "Playfair Display, serif"
  bodyFont = "Inter, system-ui, sans-serif"
  codeFont = "JetBrains Mono, monospace"
```

```css
/* assets/css/typography.css */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Playfair Display', serif;
    font-weight: 600;
  }
  
  code, pre {
    font-family: 'JetBrains Mono', monospace;
  }
}

@layer components {
  .heading-gradient {
    @apply bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent;
  }
  
  .text-balance {
    text-wrap: balance;
  }
}
```

### Typography Scale

```css
/* Custom typography scale */
@layer utilities {
  .text-xs { font-size: 0.75rem; line-height: 1rem; }
  .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
  .text-base { font-size: 1rem; line-height: 1.5rem; }
  .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
  .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
  .text-2xl { font-size: 1.5rem; line-height: 2rem; }
  .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
  .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
  .text-5xl { font-size: 3rem; line-height: 1; }
}
```

## Layout Modifications

### Custom Grid Layouts

```html
<!-- layouts/partials/content/custom-grid.html -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {{ range .Pages }}
    <article class="group">
      {{ partial "content/article-card.html" . }}
    </article>
  {{ end }}
</div>
```

### Masonry Layout

```css
/* assets/css/masonry.css */
@layer components {
  .masonry-grid {
    column-count: 1;
    column-gap: 1.5rem;
    
    @screen md {
      column-count: 2;
    }
    
    @screen lg {
      column-count: 3;
    }
    
    @screen xl {
      column-count: 4;
    }
  }
  
  .masonry-item {
    @apply break-inside-avoid mb-6;
  }
}
```

### Sidebar Layout

```html
<!-- layouts/_default/single-with-sidebar.html -->
{{ define "main" }}
<div class="container mx-auto px-4 py-8">
  <div class="flex flex-col lg:flex-row gap-8">
    <!-- Main content -->
    <main class="lg:w-2/3">
      <article class="prose prose-lg max-w-none">
        <h1>{{ .Title }}</h1>
        {{ .Content }}
      </article>
    </main>
    
    <!-- Sidebar -->
    <aside class="lg:w-1/3">
      {{ partial "widgets/sidebar.html" . }}
    </aside>
  </div>
</div>
{{ end }}
```

## Custom Components

### Enhanced Article Card

```html
<!-- layouts/partials/content/enhanced-card.html -->
<article class="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
  {{ if .Params.image }}
    <div class="relative aspect-video overflow-hidden">
      {{ $image := resources.Get .Params.image }}
      {{ if $image }}
        {{ $resized := $image.Resize "600x400" }}
        <img 
          src="{{ $resized.RelPermalink }}" 
          alt="{{ .Params.imageAlt | default .Title }}"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy">
      {{ end }}
      
      <!-- Category badge -->
      {{ with .Params.categories }}
        <span class="absolute top-3 left-3 px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
          {{ index . 0 }}
        </span>
      {{ end }}
      
      <!-- Reading time -->
      <span class="absolute top-3 right-3 px-2 py-1 bg-black/50 text-white text-xs rounded">
        {{ .ReadingTime }} min read
      </span>
    </div>
  {{ end }}
  
  <div class="p-6">
    <h3 class="font-bold text-xl mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
      <a href="{{ .RelPermalink }}" class="stretched-link">{{ .Title }}</a>
    </h3>
    
    {{ with .Params.excerpt }}
      <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ . }}</p>
    {{ end }}
    
    <div class="flex items-center justify-between text-xs text-gray-500">
      <div class="flex items-center space-x-3">
        <span>{{ .Params.author | default .Site.Params.author }}</span>
        <span>{{ .Date.Format "Jan 2, 2006" }}</span>
      </div>
      
      <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </div>
  </div>
</article>
```

### Custom Hero Section

```html
<!-- layouts/partials/content/custom-hero.html -->
<section class="relative min-h-screen flex items-center justify-center overflow-hidden">
  <!-- Background -->
  <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
  
  <!-- Animated background elements -->
  <div class="absolute inset-0">
    <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
    <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
    <div class="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
  </div>
  
  <!-- Content -->
  <div class="relative z-10 text-center px-4">
    <h1 class="text-5xl md:text-7xl font-bold mb-6">
      <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {{ .Site.Title }}
      </span>
    </h1>
    
    <p class="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
      {{ .Site.Params.description }}
    </p>
    
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="/posts/" class="btn-primary">
        Explore Articles
      </a>
      <a href="/about/" class="btn-secondary">
        Learn More
      </a>
    </div>
  </div>
</section>

<style>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
```

### Interactive Elements

```html
<!-- layouts/partials/content/interactive-card.html -->
<div class="interactive-card group cursor-pointer" data-tilt>
  <div class="card-content">
    <h3>{{ .Title }}</h3>
    <p>{{ .Summary }}</p>
  </div>
  
  <div class="card-overlay">
    <span class="overlay-text">Read More</span>
  </div>
</div>
```

```css
/* Interactive card styles */
@layer components {
  .interactive-card {
    @apply relative overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300;
    transform-style: preserve-3d;
    perspective: 1000px;
  }
  
  .interactive-card:hover {
    @apply shadow-2xl;
    transform: translateY(-5px) rotateX(5deg);
  }
  
  .card-overlay {
    @apply absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 flex items-end justify-center pb-6;
  }
  
  .interactive-card:hover .card-overlay {
    @apply opacity-100;
  }
  
  .overlay-text {
    @apply text-white font-semibold px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm;
  }
}
```

## Advanced Styling

### CSS Grid Layouts

```css
/* assets/css/grid-layouts.css */
@layer components {
  .featured-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-template-rows: repeat(3, 200px);
    gap: 1rem;
  }
  
  .featured-grid .featured-item:first-child {
    grid-column: span 2;
    grid-row: span 2;
  }
  
  .magazine-layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: repeat(4, 1fr);
    gap: 1rem;
    height: 80vh;
  }
  
  .magazine-layout .main-article {
    grid-column: 1;
    grid-row: 1 / 3;
  }
  
  .magazine-layout .side-article {
    grid-column: 2;
    grid-row: span 1;
  }
}
```

### Animation Library

```css
/* assets/css/animations.css */
@layer utilities {
  .fade-in {
    animation: fadeIn 0.6s ease-out;
  }
  
  .slide-up {
    animation: slideUp 0.6s ease-out;
  }
  
  .scale-in {
    animation: scaleIn 0.4s ease-out;
  }
  
  .stagger-1 { animation-delay: 0.1s; }
  .stagger-2 { animation-delay: 0.2s; }
  .stagger-3 { animation-delay: 0.3s; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes scaleIn {
  from { 
    opacity: 0; 
    transform: scale(0.9); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .fade-in,
  .slide-up,
  .scale-in {
    animation: none;
  }
}
```

### Custom Scrollbar

```css
/* Custom scrollbar styling */
@layer base {
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    @apply bg-gray-100;
  }
  
  ::-webkit-scrollbar-thumb {
    @apply bg-gray-400 rounded-full;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-500;
  }
}
```

## JavaScript Customization

### Enhanced Search

```javascript
// assets/js/enhanced-search.js
export class EnhancedSearch {
  constructor(options = {}) {
    this.options = {
      minQueryLength: 2,
      maxResults: 10,
      highlightClass: 'search-highlight',
      ...options
    };
    
    this.searchIndex = [];
    this.init();
  }
  
  async init() {
    await this.loadSearchIndex();
    this.bindEvents();
  }
  
  async loadSearchIndex() {
    try {
      const response = await fetch('/index.json');
      this.searchIndex = await response.json();
    } catch (error) {
      console.error('Failed to load search index:', error);
    }
  }
  
  search(query) {
    if (query.length < this.options.minQueryLength) {
      return [];
    }
    
    const results = this.searchIndex
      .filter(item => this.matchesQuery(item, query))
      .slice(0, this.options.maxResults)
      .map(item => this.highlightMatches(item, query));
    
    return results;
  }
  
  matchesQuery(item, query) {
    const searchText = `${item.title} ${item.content}`.toLowerCase();
    return searchText.includes(query.toLowerCase());
  }
  
  highlightMatches(item, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return {
      ...item,
      title: item.title.replace(regex, `<mark class="${this.options.highlightClass}">$1</mark>`),
      content: this.truncateContent(item.content, query)
    };
  }
  
  truncateContent(content, query, contextLength = 150) {
    const index = content.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return content.substring(0, contextLength) + '...';
    
    const start = Math.max(0, index - contextLength / 2);
    const end = Math.min(content.length, start + contextLength);
    
    return (start > 0 ? '...' : '') + 
           content.substring(start, end) + 
           (end < content.length ? '...' : '');
  }
}
```

### Intersection Observer Animations

```javascript
// assets/js/scroll-animations.js
export function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements with animation classes
  document.querySelectorAll('.fade-in, .slide-up, .scale-in').forEach(el => {
    observer.observe(el);
  });
}
```

### Lazy Loading Images

```javascript
// assets/js/lazy-loading.js
export function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}
```

## Template Overrides

### Custom Homepage

```html
<!-- layouts/index.html -->
{{ define "main" }}
  <!-- Custom hero section -->
  {{ partial "content/custom-hero.html" . }}
  
  <!-- Featured articles -->
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12">Featured Articles</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {{ range first 6 (where .Site.RegularPages "Params.featured" true) }}
          {{ partial "content/enhanced-card.html" . }}
        {{ end }}
      </div>
    </div>
  </section>
  
  <!-- Recent articles -->
  <section class="py-16">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12">Recent Articles</h2>
      
      <div class="masonry-grid">
        {{ range first 12 .Site.RegularPages }}
          <div class="masonry-item">
            {{ partial "content/article-card.html" . }}
          </div>
        {{ end }}
      </div>
    </div>
  </section>
{{ end }}
```

### Custom Single Page

```html
<!-- layouts/_default/single.html -->
{{ define "main" }}
<article class="container mx-auto px-4 py-8">
  <!-- Article header -->
  <header class="max-w-4xl mx-auto text-center mb-12">
    {{ if .Params.image }}
      <div class="mb-8">
        {{ $image := resources.Get .Params.image }}
        {{ if $image }}
          {{ $resized := $image.Resize "1200x600" }}
          <img 
            src="{{ $resized.RelPermalink }}" 
            alt="{{ .Params.imageAlt | default .Title }}"
            class="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg">
        {{ end }}
      </div>
    {{ end }}
    
    <h1 class="text-4xl md:text-5xl font-bold mb-6 heading-gradient">
      {{ .Title }}
    </h1>
    
    <div class="flex items-center justify-center space-x-6 text-gray-600 mb-8">
      <span>{{ .Params.author | default .Site.Params.author }}</span>
      <span>•</span>
      <time datetime="{{ .Date.Format "2006-01-02" }}">
        {{ .Date.Format "January 2, 2006" }}
      </time>
      <span>•</span>
      <span>{{ .ReadingTime }} min read</span>
    </div>
    
    {{ with .Params.categories }}
      <div class="flex justify-center space-x-2 mb-8">
        {{ range . }}
          <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {{ . }}
          </span>
        {{ end }}
      </div>
    {{ end }}
  </header>
  
  <!-- Article content -->
  <div class="max-w-4xl mx-auto">
    <div class="prose prose-lg prose-blue max-w-none">
      {{ .Content }}
    </div>
    
    <!-- Tags -->
    {{ with .Params.tags }}
      <div class="mt-12 pt-8 border-t">
        <h3 class="text-lg font-semibold mb-4">Tags</h3>
        <div class="flex flex-wrap gap-2">
          {{ range . }}
            <a href="{{ "/tags/" | relLangURL }}{{ . | urlize }}" 
               class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors">
              #{{ . }}
            </a>
          {{ end }}
        </div>
      </div>
    {{ end }}
    
    <!-- Social sharing -->
    {{ partial "footer/social-share.html" . }}
    
    <!-- Related articles -->
    {{ partial "widgets/related.html" . }}
  </div>
</article>
{{ end }}
```

This customization guide provides extensive examples for modifying the Parsa Redesigned theme. Use these snippets as starting points for your own customizations, and feel free to combine and modify them to suit your specific needs.