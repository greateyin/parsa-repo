---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
lastmod: {{ .Date }}
author: "{{ .Site.Params.author.name | default "Author Name" }}"
categories: []
tags: []
featured: false
draft: true

# Content settings
description: ""
excerpt: ""
image: ""
imageAlt: ""
readTime: 0
wordCount: 0

# SEO and Social Media
og:
  title: ""
  description: ""
  image: ""
  type: "article"

twitter:
  card: "summary_large_image"
  title: ""
  description: ""
  image: ""

# Article specific settings
toc: true
math: false
mermaid: false
comments: true

# Custom front matter (optional)
# Add any custom fields your theme supports
---

Write your content here. This archetype provides a comprehensive front matter template for the Parsa Redesigned theme.

## Enhanced Shortcodes Available

The theme includes several enhanced shortcodes for rich content:

### Figure Shortcode
```markdown
{{< figure src="image.jpg" alt="Description" caption="Image caption" >}}
```

### YouTube Video Embed
```markdown
{{< youtube id="VIDEO_ID" title="Video Title" >}}
```

### Image Gallery
```markdown
{{< gallery match="images/*" caption="Photo Gallery" columns="3" >}}
```

Or with individual images:
```markdown
{{< gallery caption="My Gallery" >}}
  {{< gallery-image src="image1.jpg" alt="Description 1" caption="Caption 1" >}}
  {{< gallery-image src="image2.jpg" alt="Description 2" caption="Caption 2" >}}
{{< /gallery >}}
```

### Alert/Callout Boxes
```markdown
{{< alert type="info" title="Important Note" >}}
This is an informational alert with **markdown** support.
{{< /alert >}}
```

### Enhanced Buttons
```markdown
{{< button href="https://example.com" type="primary" size="lg" target="_blank" >}}
Click Me
{{< /button >}}
```

### Code Blocks with Copy
```markdown
{{< code lang="javascript" title="example.js" copy="true" >}}
const hello = "world";
console.log(hello);
{{< /code >}}
```

## Content Bundles Support

This theme supports Hugo's page bundles for better resource management:

1. **Leaf Bundle**: Create a folder with `index.md` and place images in the same folder
2. **Branch Bundle**: Create a folder with `_index.md` for section pages
3. **Page Resources**: Images in the same folder as your content can be referenced directly

Example structure:
```
content/
├── posts/
│   ├── my-article/
│   │   ├── index.md
│   │   ├── featured-image.jpg
│   │   ├── gallery/
│   │   │   ├── photo1.jpg
│   │   │   └── photo2.jpg
│   │   └── diagrams/
│   │       └── architecture.png
```

Then use in your content:
```markdown
{{< figure src="featured-image.jpg" alt="Featured image" >}}
{{< gallery match="gallery/*" >}}
```

Remember to:
1. Set `draft: false` when ready to publish
2. Add relevant categories and tags
3. Include a featured image for better social sharing
4. Write a compelling excerpt for article cards
5. Use page bundles for better resource organization