// Performance optimization module
// Handles lazy loading, image optimization, and performance monitoring

export class PerformanceOptimizer {
  constructor() {
    this.observers = new Map();
    this.loadedResources = new Set();
    this.performanceMetrics = {};
    
    this.init();
  }

  init() {
    this.setupLazyLoading();
    this.setupImageOptimization();
    this.setupResourcePreloading();
    this.monitorPerformance();
  }

  // Enhanced lazy loading with intersection observer
  setupLazyLoading() {
    if (!('IntersectionObserver' in window)) {
      // Fallback for older browsers
      this.loadAllImages();
      return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Observe all lazy images
    const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
    lazyImages.forEach(img => {
      img.classList.add('lazy');
      imageObserver.observe(img);
    });

    this.observers.set('images', imageObserver);

    // Lazy load other resources
    this.setupLazyIframes();
    this.setupLazyVideos();
  }

  loadImage(img) {
    // Handle responsive images with srcset
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
    }
    
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
    
    img.classList.remove('lazy');
    img.classList.add('loaded');
    
    // Remove data attributes to clean up DOM
    delete img.dataset.src;
    delete img.dataset.srcset;
  }

  loadAllImages() {
    // Fallback for browsers without IntersectionObserver
    const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
    lazyImages.forEach(img => this.loadImage(img));
  }

  setupLazyIframes() {
    const iframeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const iframe = entry.target;
          if (iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
            delete iframe.dataset.src;
          }
          observer.unobserve(iframe);
        }
      });
    }, {
      rootMargin: '100px 0px'
    });

    const lazyIframes = document.querySelectorAll('iframe[data-src]');
    lazyIframes.forEach(iframe => iframeObserver.observe(iframe));
    
    this.observers.set('iframes', iframeObserver);
  }

  setupLazyVideos() {
    const videoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target;
          if (video.dataset.src) {
            video.src = video.dataset.src;
            video.load();
            delete video.dataset.src;
          }
          observer.unobserve(video);
        }
      });
    }, {
      rootMargin: '100px 0px'
    });

    const lazyVideos = document.querySelectorAll('video[data-src]');
    lazyVideos.forEach(video => videoObserver.observe(video));
    
    this.observers.set('videos', videoObserver);
  }

  // Image optimization and WebP support
  setupImageOptimization() {
    this.detectWebPSupport().then(supported => {
      if (supported) {
        document.documentElement.classList.add('webp');
        this.preferWebPImages();
      }
    });
  }

  detectWebPSupport() {
    return new Promise(resolve => {
      const webP = new Image();
      webP.onload = webP.onerror = () => resolve(webP.height === 2);
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  preferWebPImages() {
    // Replace image sources with WebP versions if available
    const images = document.querySelectorAll('img[data-webp]');
    images.forEach(img => {
      if (img.dataset.webp) {
        img.src = img.dataset.webp;
        if (img.dataset.webpSrcset) {
          img.srcset = img.dataset.webpSrcset;
        }
      }
    });
  }

  // Resource preloading based on user interaction
  setupResourcePreloading() {
    // Preload resources on hover/focus
    const preloadLinks = document.querySelectorAll('a[data-preload]');
    preloadLinks.forEach(link => {
      let preloadTimeout;
      
      const preloadResource = () => {
        if (this.loadedResources.has(link.href)) return;
        
        preloadTimeout = setTimeout(() => {
          this.preloadPage(link.href);
        }, 100); // Small delay to avoid unnecessary preloads
      };
      
      const cancelPreload = () => {
        clearTimeout(preloadTimeout);
      };
      
      link.addEventListener('mouseenter', preloadResource);
      link.addEventListener('focus', preloadResource);
      link.addEventListener('mouseleave', cancelPreload);
      link.addEventListener('blur', cancelPreload);
    });

    // Preload critical resources based on viewport
    this.preloadCriticalResources();
  }

  preloadPage(url) {
    if (this.loadedResources.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
    
    this.loadedResources.add(url);
  }

  preloadCriticalResources() {
    // Preload above-the-fold images
    const criticalImages = document.querySelectorAll('img[data-critical]');
    criticalImages.forEach(img => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img.src || img.dataset.src;
      document.head.appendChild(link);
    });
  }

  // Performance monitoring
  monitorPerformance() {
    if (!('PerformanceObserver' in window)) return;

    // Monitor Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.performanceMetrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP monitoring not supported');
    }

    // Monitor First Input Delay
    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          this.performanceMetrics.fid = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID monitoring not supported');
    }

    // Monitor Cumulative Layout Shift
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.performanceMetrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS monitoring not supported');
    }

    // Report metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.reportPerformanceMetrics();
      }, 5000); // Wait 5 seconds after load
    });
  }

  reportPerformanceMetrics() {
    // Get navigation timing
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      this.performanceMetrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      this.performanceMetrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      this.performanceMetrics.ttfb = navigation.responseStart - navigation.requestStart;
    }

    // Log metrics for debugging (remove in production)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Performance Metrics:', this.performanceMetrics);
    }

    // Send metrics to analytics (if configured)
    if (window.gtag && this.performanceMetrics.lcp) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: 'LCP',
        value: Math.round(this.performanceMetrics.lcp)
      });
    }
  }

  // Cleanup method
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Utility functions for performance optimization
export const performanceUtils = {
  // Debounce function for scroll/resize events
  debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  // Throttle function for high-frequency events
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Check if element is in viewport
  isInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
      rect.top >= -threshold &&
      rect.left >= -threshold &&
      rect.bottom <= windowHeight + threshold &&
      rect.right <= windowWidth + threshold
    );
  },

  // Preload image
  preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },

  // Get optimal image size based on device
  getOptimalImageSize(baseWidth, baseHeight) {
    const dpr = window.devicePixelRatio || 1;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    
    // Calculate optimal dimensions
    const optimalWidth = Math.min(baseWidth * dpr, screenWidth);
    const optimalHeight = Math.min(baseHeight * dpr, screenHeight);
    
    return { width: optimalWidth, height: optimalHeight };
  }
};