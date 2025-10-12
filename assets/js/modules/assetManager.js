// Asset management module
// Handles dynamic loading, caching, and optimization of assets

export class AssetManager {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.preloadQueue = [];
    this.criticalAssets = new Set();
    
    this.init();
  }

  init() {
    this.setupServiceWorker();
    this.setupAssetCaching();
    this.setupDynamicImports();
    this.monitorNetworkCondition();
  }

  // Service Worker setup for asset caching
  setupServiceWorker() {
    if ('serviceWorker' in navigator && 'caches' in window) {
      // Register service worker for asset caching
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }

  // Asset caching strategies
  setupAssetCaching() {
    // Cache critical assets in memory
    this.cacheCriticalAssets();
    
    // Setup cache headers monitoring
    this.monitorCacheHeaders();
  }

  cacheCriticalAssets() {
    const criticalAssets = [
      '/css/style.css',
      '/js/main.js',
      '/images/logo.svg'
    ];

    criticalAssets.forEach(asset => {
      this.criticalAssets.add(asset);
      this.preloadAsset(asset);
    });
  }

  // Dynamic asset loading
  async loadAsset(url, type = 'auto') {
    // Check if already loading
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }

    // Check cache first
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    // Determine asset type if not specified
    if (type === 'auto') {
      type = this.detectAssetType(url);
    }

    // Create loading promise
    const loadingPromise = this.loadAssetByType(url, type);
    this.loadingPromises.set(url, loadingPromise);

    try {
      const asset = await loadingPromise;
      this.cache.set(url, asset);
      this.loadingPromises.delete(url);
      return asset;
    } catch (error) {
      this.loadingPromises.delete(url);
      throw error;
    }
  }

  detectAssetType(url) {
    const extension = url.split('.').pop().toLowerCase();
    const typeMap = {
      'css': 'stylesheet',
      'js': 'script',
      'json': 'json',
      'jpg': 'image',
      'jpeg': 'image',
      'png': 'image',
      'webp': 'image',
      'svg': 'image',
      'gif': 'image',
      'mp4': 'video',
      'webm': 'video',
      'mp3': 'audio',
      'wav': 'audio'
    };
    return typeMap[extension] || 'fetch';
  }

  async loadAssetByType(url, type) {
    switch (type) {
      case 'stylesheet':
        return this.loadStylesheet(url);
      case 'script':
        return this.loadScript(url);
      case 'image':
        return this.loadImage(url);
      case 'json':
        return this.loadJSON(url);
      case 'video':
        return this.loadVideo(url);
      case 'audio':
        return this.loadAudio(url);
      default:
        return this.loadGeneric(url);
    }
  }

  loadStylesheet(url) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = () => resolve(link);
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve(script);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  async loadJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load JSON: ${response.statusText}`);
    }
    return response.json();
  }

  loadVideo(url) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.onloadeddata = () => resolve(video);
      video.onerror = reject;
      video.src = url;
    });
  }

  loadAudio(url) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.onloadeddata = () => resolve(audio);
      audio.onerror = reject;
      audio.src = url;
    });
  }

  async loadGeneric(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load asset: ${response.statusText}`);
    }
    return response;
  }

  // Preload assets
  preloadAsset(url, type = 'auto') {
    if (type === 'auto') {
      type = this.detectAssetType(url);
    }

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    
    switch (type) {
      case 'stylesheet':
        link.as = 'style';
        break;
      case 'script':
        link.as = 'script';
        break;
      case 'image':
        link.as = 'image';
        break;
      case 'video':
        link.as = 'video';
        break;
      case 'audio':
        link.as = 'audio';
        break;
      default:
        link.as = 'fetch';
        link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
  }

  // Dynamic imports for code splitting
  setupDynamicImports() {
    // Create a registry for dynamic modules
    this.moduleRegistry = new Map();
  }

  async loadModule(moduleName) {
    if (this.moduleRegistry.has(moduleName)) {
      return this.moduleRegistry.get(moduleName);
    }

    try {
      const module = await import(`/js/modules/${moduleName}.js`);
      this.moduleRegistry.set(moduleName, module);
      return module;
    } catch (error) {
      console.error(`Failed to load module ${moduleName}:`, error);
      throw error;
    }
  }

  // Network condition monitoring
  monitorNetworkCondition() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      // Adjust loading strategy based on connection
      this.adjustLoadingStrategy(connection);
      
      // Listen for connection changes
      connection.addEventListener('change', () => {
        this.adjustLoadingStrategy(connection);
      });
    }
  }

  adjustLoadingStrategy(connection) {
    const effectiveType = connection.effectiveType;
    const saveData = connection.saveData;
    
    if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
      // Reduce asset loading for slow connections
      this.enableDataSaver();
    } else if (effectiveType === '4g') {
      // Aggressive preloading for fast connections
      this.enableAggressivePreloading();
    }
  }

  enableDataSaver() {
    document.documentElement.classList.add('data-saver');
    
    // Disable non-critical preloading
    this.preloadQueue = [];
    
    // Use lower quality images
    const images = document.querySelectorAll('img[data-src-low]');
    images.forEach(img => {
      if (img.dataset.srcLow) {
        img.dataset.src = img.dataset.srcLow;
      }
    });
  }

  enableAggressivePreloading() {
    document.documentElement.classList.add('fast-connection');
    
    // Preload next page resources
    const nextPageLinks = document.querySelectorAll('a[href^="/"]');
    nextPageLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        this.preloadAsset(link.href);
      }, { once: true });
    });
  }

  // Cache management
  monitorCacheHeaders() {
    // Monitor cache hit rates and adjust strategies
    if ('performance' in window && 'getEntriesByType' in performance) {
      const resources = performance.getEntriesByType('resource');
      
      resources.forEach(resource => {
        if (resource.transferSize === 0 && resource.decodedBodySize > 0) {
          // Cache hit
          console.log(`Cache hit for: ${resource.name}`);
        }
      });
    }
  }

  // Asset fingerprinting and versioning
  getVersionedAssetUrl(assetPath) {
    // Add version parameter for cache busting
    const version = document.querySelector('meta[name="asset-version"]')?.content || Date.now();
    const separator = assetPath.includes('?') ? '&' : '?';
    return `${assetPath}${separator}v=${version}`;
  }

  // Cleanup method
  clearCache() {
    this.cache.clear();
    this.loadingPromises.clear();
    this.moduleRegistry.clear();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      loadingPromises: this.loadingPromises.size,
      modules: this.moduleRegistry.size,
      criticalAssets: this.criticalAssets.size
    };
  }
}

// Utility functions for asset management
export const assetUtils = {
  // Generate responsive image srcset
  generateSrcSet(basePath, sizes = [320, 640, 768, 1024, 1280, 1920]) {
    return sizes.map(size => {
      const path = basePath.replace(/\.(jpg|jpeg|png|webp)$/i, `_${size}w.$1`);
      return `${path} ${size}w`;
    }).join(', ');
  },

  // Get optimal image format
  getOptimalImageFormat() {
    // Check WebP support
    if (document.documentElement.classList.contains('webp')) {
      return 'webp';
    }
    
    // Check AVIF support (future enhancement)
    if ('createImageBitmap' in window) {
      return 'avif';
    }
    
    return 'jpg';
  },

  // Calculate asset priority
  calculateAssetPriority(assetType, isAboveFold = false, isCritical = false) {
    let priority = 0;
    
    if (isCritical) priority += 100;
    if (isAboveFold) priority += 50;
    
    switch (assetType) {
      case 'stylesheet':
        priority += 90;
        break;
      case 'script':
        priority += 80;
        break;
      case 'image':
        priority += 70;
        break;
      case 'font':
        priority += 85;
        break;
      default:
        priority += 60;
    }
    
    return priority;
  }
};