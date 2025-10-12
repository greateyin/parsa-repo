/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.{html,md}',
    './assets/**/*.js',
    './exampleSite/content/**/*.{html,md}',
    './exampleSite/layouts/**/*.html',
    './static/**/*.html',
    './data/**/*.{json,yaml,yml,toml}',
    './i18n/**/*.{json,yaml,yml,toml}'
  ],
  // Enhanced purging configuration for production builds
  safelist: [
    // Always keep these classes regardless of detection
    'sr-only',
    'focus:not-sr-only',
    'line-clamp-1',
    'line-clamp-2', 
    'line-clamp-3',
    'touch-active',
    'fonts-loaded',
    'fonts-fallback',
    'chinese-lang',
    'rtl-lang',
    'webp',
    'lazy',
    'loaded',
    'in-view',
    'menu-open',
    // Animation classes that might be added dynamically
    'fade-in',
    'slide-in-right',
    'slide-out-right',
    'bounce-in',
    // Search and interaction states
    'search-active',
    'mobile-menu-open',
    // Language-specific classes
    'zh-font',
    'zh-spacing',
    'rtl-support',
    // Touch device classes
    'touch-device',
    // Notification classes
    'notification',
    // Dynamic color classes for themes
    /^bg-(primary|accent|background|foreground|muted|card)/,
    /^text-(primary|accent|background|foreground|muted|card)/,
    /^border-(primary|accent|background|foreground|muted|card)/,
    // Responsive classes that might be used conditionally
    /^(xs|sm|md|lg|xl|2xl|3xl):/,
    // Grid and layout classes
    /^grid-cols-/,
    /^col-span-/,
    // Spacing classes commonly used in templates
    /^(p|m|px|py|mx|my|mt|mb|ml|mr|pt|pb|pl|pr)-/,
    // Hover and focus states
    /^hover:/,
    /^focus:/,
    /^active:/,
    /^group-hover:/,
    // Dark mode classes (if enabled)
    /^dark:/
  ],
  theme: {
    // Enhanced responsive breakpoints for mobile-first design
    screens: {
      'xs': '320px',    // Extra small devices (small phones)
      'sm': '640px',    // Small devices (large phones)
      'md': '768px',    // Medium devices (tablets)
      'lg': '1024px',   // Large devices (laptops)
      'xl': '1280px',   // Extra large devices (desktops)
      '2xl': '1440px',  // 2X large devices (large desktops)
      '3xl': '1600px',  // 3X large devices (ultra-wide)
      
      // Custom breakpoints for specific use cases
      'mobile': {'max': '767px'},     // Mobile-only styles
      'tablet': {'min': '768px', 'max': '1023px'}, // Tablet-only styles
      'desktop': {'min': '1024px'},   // Desktop and up
      
      // Touch device detection
      'touch': {'raw': '(hover: none) and (pointer: coarse)'},
      'no-touch': {'raw': '(hover: hover) and (pointer: fine)'},
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        xs: '1rem',
        sm: '1.5rem',
        md: '2rem',
        lg: '2.5rem',
        xl: '3rem',
        '2xl': '4rem',
      },
      screens: {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Enhanced spacing for mobile-first design
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      
      // Touch-friendly sizing
      minHeight: {
        'touch': '44px',  // Minimum touch target size
        'screen-small': '100svh', // Small viewport height
        'screen-dynamic': '100dvh', // Dynamic viewport height
      },
      
      minWidth: {
        'touch': '44px',  // Minimum touch target size
      },
      
      // Enhanced font families with Chinese typography support
      fontFamily: {
        'sans': [
          // English fonts
          'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto',
          // Chinese fonts (Simplified & Traditional)
          'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Source Han Sans SC', 'Noto Sans CJK SC',
          'PingFang TC', 'Hiragino Sans CNS', 'Microsoft JhengHei', 'Source Han Sans TC', 'Noto Sans CJK TC',
          // Fallbacks
          'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji'
        ],
        'serif': [
          // English serif fonts
          'Georgia', 'Cambria', 'Times New Roman', 'Times',
          // Chinese serif fonts
          'Source Han Serif SC', 'Noto Serif CJK SC', 'Songti SC', 'SimSun',
          'Source Han Serif TC', 'Noto Serif CJK TC', 'Songti TC', 'PMingLiU',
          // Fallbacks
          'serif'
        ],
        'mono': [
          // Code fonts with Chinese support
          'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', 'Menlo', 'Consolas',
          // Chinese monospace
          'Source Han Sans SC', 'Noto Sans Mono CJK SC',
          'Source Han Sans TC', 'Noto Sans Mono CJK TC',
          // Fallbacks
          'monospace'
        ]
      },
      
      // Enhanced font sizes for responsive typography with Chinese optimization
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.2rem', letterSpacing: '0.025em' }],
        'sm': ['0.875rem', { lineHeight: '1.4rem', letterSpacing: '0.025em' }],
        'base': ['1rem', { lineHeight: '1.6rem', letterSpacing: '0.025em' }],
        'lg': ['1.125rem', { lineHeight: '1.8rem', letterSpacing: '0.025em' }],
        'xl': ['1.25rem', { lineHeight: '2rem', letterSpacing: '0.025em' }],
        '2xl': ['1.5rem', { lineHeight: '2.2rem', letterSpacing: '0.025em' }],
        '3xl': ['1.875rem', { lineHeight: '2.6rem', letterSpacing: '0.025em' }],
        '4xl': ['2.25rem', { lineHeight: '3rem', letterSpacing: '0.025em' }],
        '5xl': ['3rem', { lineHeight: '3.6rem', letterSpacing: '0.025em' }],
        '6xl': ['3.75rem', { lineHeight: '4.2rem', letterSpacing: '0.025em' }],
        '7xl': ['4.5rem', { lineHeight: '5rem', letterSpacing: '0.025em' }],
        '8xl': ['6rem', { lineHeight: '6.5rem', letterSpacing: '0.025em' }],
        '9xl': ['8rem', { lineHeight: '8.5rem', letterSpacing: '0.025em' }],
        
        // Responsive font sizes optimized for Chinese
        'fluid-sm': 'clamp(0.875rem, 2vw, 1rem)',
        'fluid-base': 'clamp(1rem, 2.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 3vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 3.5vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 4vw, 2.25rem)',
        'fluid-3xl': 'clamp(1.875rem, 5vw, 3rem)',
        'fluid-4xl': 'clamp(2.25rem, 6vw, 3.75rem)',
        
        // Chinese-specific font sizes
        'zh-xs': ['0.75rem', { lineHeight: '1.3rem', letterSpacing: '0.05em' }],
        'zh-sm': ['0.875rem', { lineHeight: '1.5rem', letterSpacing: '0.05em' }],
        'zh-base': ['1rem', { lineHeight: '1.7rem', letterSpacing: '0.05em' }],
        'zh-lg': ['1.125rem', { lineHeight: '1.9rem', letterSpacing: '0.05em' }],
        'zh-xl': ['1.25rem', { lineHeight: '2.1rem', letterSpacing: '0.05em' }],
        'zh-2xl': ['1.5rem', { lineHeight: '2.4rem', letterSpacing: '0.05em' }],
        'zh-3xl': ['1.875rem', { lineHeight: '2.8rem', letterSpacing: '0.05em' }],
        'zh-4xl': ['2.25rem', { lineHeight: '3.2rem', letterSpacing: '0.05em' }],
      },
      
      // Enhanced line heights for Chinese typography
      lineHeight: {
        'none': '1',
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '2',
        // Chinese-optimized line heights
        'zh-tight': '1.4',
        'zh-normal': '1.7',
        'zh-relaxed': '1.8',
        'zh-loose': '2.2',
      },
      
      // Letter spacing optimized for Chinese
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0em',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
        // Chinese-specific spacing
        'zh-normal': '0.05em',
        'zh-wide': '0.1em',
        'zh-wider': '0.15em',
      },
      
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "slide-in-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(100%)"
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)"
          }
        },
        "slide-out-right": {
          "0%": {
            opacity: "1",
            transform: "translateX(0)"
          },
          "100%": {
            opacity: "0",
            transform: "translateX(100%)"
          }
        },
        "bounce-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.3)"
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.05)"
          },
          "70%": {
            transform: "scale(0.9)"
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-out",
        "bounce-in": "bounce-in 0.6s ease-out"
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}