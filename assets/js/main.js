// Main JavaScript functionality for the theme
// Enhanced with performance optimization, asset management, and accessibility

import { PerformanceOptimizer, performanceUtils } from './modules/performance.js';
import { AssetManager, assetUtils } from './modules/assetManager.js';

(function() {
  'use strict';

  // Initialize performance optimizer and asset manager
  let performanceOptimizer;
  let assetManager;

  // Initialize modules when DOM is ready
  function initializeModules() {
    performanceOptimizer = new PerformanceOptimizer();
    assetManager = new AssetManager();
    
    // Initialize accessibility features
    initializeAccessibilityFeatures();
    
    // Make utilities available globally for debugging
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      window.performanceUtils = performanceUtils;
      window.assetUtils = assetUtils;
      window.performanceOptimizer = performanceOptimizer;
      window.assetManager = assetManager;
    }
  }

  // ===== ACCESSIBILITY FEATURES =====
  
  function initializeAccessibilityFeatures() {
    // Enhanced keyboard navigation
    setupKeyboardNavigation();
    
    // Mobile menu accessibility
    setupMobileMenuAccessibility();
    
    // Search accessibility
    setupSearchAccessibility();
    
    // Focus management
    setupFocusManagement();
    
    // Announce page changes for screen readers
    announcePageLoad();
  }
  
  function setupKeyboardNavigation() {
    // Handle escape key globally
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close mobile menu
        const mobileMenu = document.querySelector('[data-mobile-menu]');
        if (mobileMenu && !mobileMenu.classList.contains('translate-x-full')) {
          closeMobileMenu();
        }
        
        // Close any open dropdowns or modals
        const openDropdowns = document.querySelectorAll('[aria-expanded="true"]');
        openDropdowns.forEach(dropdown => {
          dropdown.setAttribute('aria-expanded', 'false');
        });
      }
    });
    
    // Enhanced tab navigation for card components
    const articleCards = document.querySelectorAll('article[role="article"]');
    articleCards.forEach(card => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const link = card.querySelector('a');
          if (link) {
            e.preventDefault();
            link.click();
          }
        }
      });
    });
  }
  
  function setupMobileMenuAccessibility() {
    const menuButton = document.querySelector('[data-mobile-menu-button]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    const menuOverlay = document.querySelector('[data-mobile-menu-overlay]');
    const closeButton = document.querySelector('[data-mobile-menu-close]');
    
    if (!menuButton || !mobileMenu) return;
    
    // Store the element that opened the menu for focus restoration
    let menuTrigger = null;
    
    function openMobileMenu() {
      menuTrigger = document.activeElement;
      mobileMenu.classList.remove('translate-x-full');
      mobileMenu.setAttribute('aria-hidden', 'false');
      menuButton.setAttribute('aria-expanded', 'true');
      document.body.classList.add('focus-trap-active');
      
      // Focus the close button
      setTimeout(() => {
        closeButton?.focus();
      }, 300);
      
      // Announce to screen readers
      if (window.announceToScreenReader) {
        window.announceToScreenReader('Menu opened', 'assertive');
      }
    }
    
    function closeMobileMenu() {
      mobileMenu.classList.add('translate-x-full');
      mobileMenu.setAttribute('aria-hidden', 'true');
      menuButton.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('focus-trap-active');
      
      // Restore focus to trigger
      if (menuTrigger) {
        menuTrigger.focus();
        menuTrigger = null;
      }
      
      // Announce to screen readers
      if (window.announceToScreenReader) {
        window.announceToScreenReader('Menu closed', 'assertive');
      }
    }
    
    // Event listeners
    menuButton.addEventListener('click', openMobileMenu);
    closeButton?.addEventListener('click', closeMobileMenu);
    menuOverlay?.addEventListener('click', closeMobileMenu);
    
    // Make closeMobileMenu available globally
    window.closeMobileMenu = closeMobileMenu;
  }
  
  function setupSearchAccessibility() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const query = e.target.value.trim();
        if (query.length > 2) {
          // Announce search progress
          if (window.announceToScreenReader) {
            window.announceToScreenReader(`Searching for ${query}`, 'polite');
          }
        }
      }, 500);
    });
    
    // Handle search suggestions navigation
    searchInput.addEventListener('keydown', (e) => {
      const suggestions = document.getElementById('search-suggestions');
      if (!suggestions || suggestions.classList.contains('hidden')) return;
      
      const suggestionItems = suggestions.querySelectorAll('[role="option"]');
      const currentFocus = suggestions.querySelector('[aria-selected="true"]');
      let currentIndex = currentFocus ? Array.from(suggestionItems).indexOf(currentFocus) : -1;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          currentIndex = Math.min(currentIndex + 1, suggestionItems.length - 1);
          updateSuggestionFocus(suggestionItems, currentIndex);
          break;
        case 'ArrowUp':
          e.preventDefault();
          currentIndex = Math.max(currentIndex - 1, -1);
          updateSuggestionFocus(suggestionItems, currentIndex);
          break;
        case 'Enter':
          if (currentFocus) {
            e.preventDefault();
            currentFocus.click();
          }
          break;
        case 'Escape':
          suggestions.classList.add('hidden');
          searchInput.setAttribute('aria-expanded', 'false');
          break;
      }
    });
  }
  
  function updateSuggestionFocus(items, index) {
    items.forEach((item, i) => {
      item.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
  }
  
  function setupFocusManagement() {
    // Ensure skip links work properly
    const skipLinks = document.querySelectorAll('.skip-link');
    skipLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Remove tabindex after focus
          target.addEventListener('blur', () => {
            target.removeAttribute('tabindex');
          }, { once: true });
        }
      });
    });
    
    // Manage focus for dynamically loaded content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Add touch targets to new interactive elements
              const interactiveElements = node.querySelectorAll?.('button, a, input, select, textarea');
              interactiveElements?.forEach(el => {
                if (!el.classList.contains('touch-target')) {
                  const rect = el.getBoundingClientRect();
                  if (rect.width < 44 || rect.height < 44) {
                    el.classList.add('touch-target');
                  }
                }
              });
            }
          });
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  function announcePageLoad() {
    // Announce page load to screen readers
    const pageTitle = document.title;
    if (window.announceToScreenReader && pageTitle) {
      setTimeout(() => {
        window.announceToScreenReader(`Page loaded: ${pageTitle}`, 'polite');
      }, 1000);
    }
  }

  // ===== MULTILINGUAL SUPPORT AND FONT LOADING =====

  // Language detection and font optimization
  function initializeLanguageSupport() {
    const html = document.documentElement;
    const lang = html.getAttribute('lang') || 'en';
    const isChineseLang = ['zh', 'zh-cn', 'zh-tw', 'zh-hk'].includes(lang.toLowerCase());
    
    // Add language-specific classes
    if (isChineseLang) {
      html.classList.add('chinese-lang');
      
      // Optimize font loading for Chinese
      if ('fonts' in document) {
        // Preload Chinese fonts
        const chineseFonts = [
          'PingFang SC',
          'PingFang TC', 
          'Hiragino Sans GB',
          'Hiragino Sans CNS',
          'Microsoft YaHei',
          'Microsoft JhengHei',
          'Source Han Sans SC',
          'Source Han Sans TC'
        ];
        
        chineseFonts.forEach(font => {
          document.fonts.load(`16px "${font}"`).catch(() => {
            // Font loading failed, continue with fallbacks
          });
        });
      }
    }
    
    // RTL language support
    const isRTL = html.getAttribute('dir') === 'rtl';
    if (isRTL) {
      html.classList.add('rtl-lang');
    }
    
    // Store language preference
    localStorage.setItem('preferred-language', lang);
  }

  // Font loading optimization
  function optimizeFontLoading() {
    if ('fonts' in document) {
      // Load critical fonts first
      const criticalFonts = [
        '400 16px Inter',
        '500 16px Inter',
        '600 16px Inter'
      ];
      
      Promise.all(criticalFonts.map(font => document.fonts.load(font)))
        .then(() => {
          document.documentElement.classList.add('fonts-loaded');
        })
        .catch(() => {
          // Fallback fonts will be used
          document.documentElement.classList.add('fonts-fallback');
        });
    }
  }

  // Language switching functionality
  function initializeLanguageSwitching() {
    // Handle language preference persistence
    const currentLang = document.documentElement.getAttribute('lang');
    const savedLang = localStorage.getItem('preferred-language');
    
    // If user has a saved preference different from current, show notification
    if (savedLang && savedLang !== currentLang) {
      const availableLanguages = document.querySelectorAll('[hreflang]');
      const hasPreferredLang = Array.from(availableLanguages).some(link => 
        link.getAttribute('hreflang') === savedLang
      );
      
      if (hasPreferredLang) {
        showLanguageSuggestion(savedLang);
      }
    }
  }

  // Show language suggestion notification
  function showLanguageSuggestion(preferredLang) {
    // Create a subtle notification for language switching
    const notification = document.createElement('div');
    notification.className = 'language-suggestion fixed top-4 right-4 z-50 bg-card border border-border rounded-lg shadow-lg p-4 max-w-sm opacity-0 transform translate-y-2 transition-all duration-300';
    notification.innerHTML = `
      <div class="flex items-start space-x-3">
        <svg class="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
        </svg>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-foreground">Language Preference</p>
          <p class="text-xs text-muted-foreground mt-1">Switch to your preferred language?</p>
          <div class="flex space-x-2 mt-2">
            <button class="switch-lang-btn text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/90 transition-colors">
              Switch
            </button>
            <button class="dismiss-lang-btn text-xs text-muted-foreground hover:text-foreground transition-colors">
              Dismiss
            </button>
          </div>
        </div>
        <button class="close-lang-btn text-muted-foreground hover:text-foreground">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('opacity-0', 'translate-y-2');
    }, 100);
    
    // Handle actions
    const switchBtn = notification.querySelector('.switch-lang-btn');
    const dismissBtn = notification.querySelector('.dismiss-lang-btn');
    const closeBtn = notification.querySelector('.close-lang-btn');
    
    const closeNotification = () => {
      notification.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => notification.remove(), 300);
    };
    
    switchBtn.addEventListener('click', () => {
      const langLink = document.querySelector(`[hreflang="${preferredLang}"]`);
      if (langLink) {
        window.location.href = langLink.href;
      }
    });
    
    dismissBtn.addEventListener('click', closeNotification);
    closeBtn.addEventListener('click', closeNotification);
    
    // Auto-dismiss after 10 seconds
    setTimeout(closeNotification, 10000);
  }

  // DOM ready function
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  // Initialize everything when DOM is ready
  ready(() => {
    initializeModules();
    initializeLanguageSupport();
    optimizeFontLoading();
    initializeLanguageSwitching();
    initMobileMenu();
    initSmoothScrolling();
    initSearch();
    initTouchInteractions();
    initResponsiveImages();
    initViewportHandling();
    initPerformanceOptimizations();
    initScrollAnimations();
  });

  // Enhanced mobile menu functionality with slide-out animation
  function initMobileMenu() {
    const mobileMenuButton = document.querySelector('[data-mobile-menu-button]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    const mobileMenuOverlay = document.querySelector('[data-mobile-menu-overlay]');
    const mobileMenuClose = document.querySelector('[data-mobile-menu-close]');
    const hamburgerIcon = document.querySelector('[data-menu-icon="hamburger"]');
    const closeIcon = document.querySelector('[data-menu-icon="close"]');

    if (!mobileMenuButton || !mobileMenu) return;

    function openMobileMenu() {
      // Show menu and trigger animations
      mobileMenu.classList.remove('translate-x-full');
      mobileMenu.classList.add('translate-x-0');
      mobileMenu.setAttribute('aria-hidden', 'false');
      
      // Show overlay
      if (mobileMenuOverlay) {
        mobileMenuOverlay.classList.remove('opacity-0');
        mobileMenuOverlay.classList.add('opacity-100');
      }
      
      // Update button state
      mobileMenuButton.setAttribute('aria-expanded', 'true');
      
      // Toggle icons
      if (hamburgerIcon && closeIcon) {
        hamburgerIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
      }
      
      // Prevent body scroll with enhanced mobile handling
      document.body.classList.add('overflow-hidden', 'menu-open');
      
      // Focus management - focus first menu item
      const firstMenuItem = mobileMenu.querySelector('nav a');
      if (firstMenuItem) {
        setTimeout(() => firstMenuItem.focus(), 100);
      }
    }

    function closeMobileMenu() {
      // Hide menu with animation
      mobileMenu.classList.remove('translate-x-0');
      mobileMenu.classList.add('translate-x-full');
      mobileMenu.setAttribute('aria-hidden', 'true');
      
      // Hide overlay
      if (mobileMenuOverlay) {
        mobileMenuOverlay.classList.remove('opacity-100');
        mobileMenuOverlay.classList.add('opacity-0');
      }
      
      // Update button state
      mobileMenuButton.setAttribute('aria-expanded', 'false');
      
      // Toggle icons
      if (hamburgerIcon && closeIcon) {
        hamburgerIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      }
      
      // Restore body scroll
      document.body.classList.remove('overflow-hidden', 'menu-open');
      
      // Return focus to menu button
      mobileMenuButton.focus();
    }

    function toggleMobileMenu() {
      const isOpen = mobileMenuButton.getAttribute('aria-expanded') === 'true';
      
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    }

    // Event listeners
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileMenuOverlay) {
      mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const isOpen = mobileMenuButton.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
          closeMobileMenu();
        }
      }
    });

    // Close menu when clicking on menu links
    const menuLinks = mobileMenu.querySelectorAll('nav a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        const isOpen = mobileMenuButton.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
          closeMobileMenu();
        }
      });
    });

    // Handle focus trap within mobile menu
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    mobileMenu.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        const focusableContent = mobileMenu.querySelectorAll(focusableElements);
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    });

    // Enhanced resize and orientation change handling
    let resizeTimeout;
    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth >= 768) { // md breakpoint
          const isOpen = mobileMenuButton.getAttribute('aria-expanded') === 'true';
          if (isOpen) {
            closeMobileMenu();
          }
        }
      }, 100);
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', function() {
      // Handle orientation change with delay for viewport adjustment
      setTimeout(handleResize, 200);
    });
  }

  // Smooth scrolling for anchor links
  function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          const headerHeight = document.querySelector('header')?.offsetHeight || 0;
          const targetPosition = target.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Copy to clipboard functionality
  window.copyToClipboard = function(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showNotification('Link copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy: ', err);
        fallbackCopyTextToClipboard(text);
      });
    } else {
      fallbackCopyTextToClipboard(text);
    }
  };

  // Fallback copy function for older browsers
  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showNotification('Link copied to clipboard!');
      } else {
        showNotification('Failed to copy link');
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
      showNotification('Failed to copy link');
    }
    
    document.body.removeChild(textArea);
  }

  // Show notification
  function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 px-4 py-2 rounded-md text-white z-50 transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
      notification.style.opacity = '1';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Lazy loading for images
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

  // Enhanced search functionality
  let searchIndex = null;
  let searchTimeout = null;

  // Load search index
  function loadSearchIndex() {
    return fetch('/index.json')
      .then(response => response.json())
      .then(data => {
        searchIndex = data;
        return data;
      })
      .catch(err => {
        console.error('Failed to load search index:', err);
        return [];
      });
  }

  // Initialize search functionality
  function initSearch() {
    const searchInput = document.querySelector('[data-search-input]');
    const searchResults = document.querySelector('[data-search-results]');
    
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
      const query = this.value.trim();
      
      clearTimeout(searchTimeout);
      
      if (query.length < 2) {
        if (searchResults) {
          searchResults.innerHTML = '';
          searchResults.classList.add('hidden');
        }
        return;
      }

      searchTimeout = setTimeout(() => {
        performQuickSearch(query);
      }, 300);
    });

    // Quick search for suggestions dropdown
    function performQuickSearch(query) {
      if (!searchIndex || !searchResults) return;

      const results = searchInIndex(query, 5);

      if (results.length > 0) {
        searchResults.innerHTML = results.map(result => `
          <a href="${result.permalink}" class="block p-3 hover:bg-muted rounded-md transition-colors">
            <h4 class="font-medium text-foreground">${highlightText(result.title, query)}</h4>
            <p class="text-sm text-muted-foreground mt-1">${highlightText(result.summary || '', query)}</p>
          </a>
        `).join('');
        searchResults.classList.remove('hidden');
      } else {
        searchResults.innerHTML = '<div class="p-3 text-muted-foreground">No results found</div>';
        searchResults.classList.remove('hidden');
      }
    }

    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target) && !searchResults?.contains(e.target)) {
        if (searchResults) {
          searchResults.classList.add('hidden');
        }
      }
    });
  }

  // Initialize full search page functionality
  function initializeSearch() {
    if (!searchIndex) {
      loadSearchIndex().then(() => {
        setupSearchPage();
      });
    } else {
      setupSearchPage();
    }
  }

  // Setup search page functionality
  function setupSearchPage() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const noResults = document.getElementById('no-results');
    const initialContent = document.getElementById('initial-content');
    const searchLoading = document.getElementById('search-loading');
    const resultsContainer = document.getElementById('results-container');
    const searchStats = document.getElementById('search-stats');

    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
      const query = this.value.trim();
      
      clearTimeout(searchTimeout);
      
      if (query.length < 2) {
        showInitialState();
        return;
      }

      showLoadingState();
      
      searchTimeout = setTimeout(() => {
        performFullSearch(query);
      }, 300);
    });

    function showInitialState() {
      if (searchResults) searchResults.classList.add('hidden');
      if (noResults) noResults.classList.add('hidden');
      if (searchLoading) searchLoading.classList.add('hidden');
      if (initialContent) initialContent.classList.remove('hidden');
    }

    function showLoadingState() {
      if (initialContent) initialContent.classList.add('hidden');
      if (searchResults) searchResults.classList.add('hidden');
      if (noResults) noResults.classList.add('hidden');
      if (searchLoading) searchLoading.classList.remove('hidden');
    }

    function showResults(results, query) {
      if (searchLoading) searchLoading.classList.add('hidden');
      if (initialContent) initialContent.classList.add('hidden');
      
      if (results.length > 0) {
        if (noResults) noResults.classList.add('hidden');
        if (searchResults) searchResults.classList.remove('hidden');
        
        // Update stats
        if (searchStats) {
          const resultText = results.length === 1 ? 'result found for' : 'results found for';
          searchStats.innerHTML = `${results.length} ${resultText} "<strong>${escapeHtml(query)}</strong>"`;
        }
        
        // Render results
        if (resultsContainer) {
          resultsContainer.innerHTML = results.map(result => createArticleCard(result, query)).join('');
        }
      } else {
        if (searchResults) searchResults.classList.add('hidden');
        if (noResults) noResults.classList.remove('hidden');
      }
    }

    function performFullSearch(query) {
      if (!searchIndex) return;

      const results = searchInIndex(query, 50); // More results for full search
      showResults(results, query);
    }

    // Make performSearch available globally for URL parameter handling
    window.performSearch = performFullSearch;
  }

  // Search in index with scoring
  function searchInIndex(query, limit = 10) {
    if (!searchIndex) return [];

    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 0);
    
    const results = searchIndex.map(item => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const contentLower = item.content.toLowerCase();
      const summaryLower = (item.summary || '').toLowerCase();
      
      // Title matches (highest priority)
      queryWords.forEach(word => {
        if (titleLower.includes(word)) {
          score += titleLower === word ? 100 : (titleLower.startsWith(word) ? 50 : 20);
        }
      });
      
      // Summary matches (medium priority)
      queryWords.forEach(word => {
        if (summaryLower.includes(word)) {
          score += 10;
        }
      });
      
      // Content matches (lower priority)
      queryWords.forEach(word => {
        if (contentLower.includes(word)) {
          score += 5;
        }
      });
      
      // Tag matches (medium priority)
      if (item.tags) {
        item.tags.forEach(tag => {
          const tagLower = tag.toLowerCase();
          queryWords.forEach(word => {
            if (tagLower.includes(word)) {
              score += tagLower === word ? 30 : 15;
            }
          });
        });
      }
      
      // Category matches (medium priority)
      if (item.categories) {
        item.categories.forEach(category => {
          const categoryLower = category.toLowerCase();
          queryWords.forEach(word => {
            if (categoryLower.includes(word)) {
              score += categoryLower === word ? 25 : 12;
            }
          });
        });
      }
      
      return { ...item, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
    
    return results;
  }

  // Highlight search terms in text
  function highlightText(text, query) {
    if (!text || !query) return text;
    
    const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    let highlightedText = text;
    
    queryWords.forEach(word => {
      const regex = new RegExp(`(${escapeRegExp(word)})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
    });
    
    return highlightedText;
  }

  // Create article card HTML
  function createArticleCard(article, query) {
    const image = article.image ? `
      <div class="relative aspect-video overflow-hidden">
        <img src="${article.image}" alt="${escapeHtml(article.title)}" 
             class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
             loading="lazy">
        ${article.categories && article.categories.length > 0 ? `
          <span class="absolute top-3 left-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
            ${escapeHtml(article.categories[0])}
          </span>
        ` : ''}
      </div>
    ` : '';

    return `
      <article class="group overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        ${image}
        <div class="p-5">
          <h3 class="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            <a href="${article.permalink}">${highlightText(article.title, query)}</a>
          </h3>
          <p class="text-muted-foreground text-sm mb-4 line-clamp-2">
            ${highlightText(article.summary || '', query)}
          </p>
          <div class="flex items-center justify-between text-xs text-muted-foreground">
            <div class="flex items-center space-x-3">
              ${article.author ? `<span>${escapeHtml(article.author)}</span>` : ''}
              ${article.readTime ? `<span>${article.readTime} min read</span>` : ''}
            </div>
            <div class="flex items-center">
              <svg class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  // Utility functions
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Make functions available globally
  window.initializeSearch = initializeSearch;
  window.performSearch = function(query) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.value = query;
      if (typeof setupSearchPage === 'function') {
        setupSearchPage();
      }
    }
  };

  // Enhanced touch interaction handling
  function initTouchInteractions() {
    // Add touch class to body for touch-specific styles
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.body.classList.add('touch-device');
    }

    // Enhanced touch feedback for buttons and links
    const touchElements = document.querySelectorAll('button, a, .touch-target');
    
    touchElements.forEach(element => {
      element.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
      }, { passive: true });
      
      element.addEventListener('touchend', function() {
        setTimeout(() => {
          this.classList.remove('touch-active');
        }, 150);
      }, { passive: true });
      
      element.addEventListener('touchcancel', function() {
        this.classList.remove('touch-active');
      }, { passive: true });
    });
  }

  // Responsive image handling with WebP support
  function initResponsiveImages() {
    // WebP support detection
    function supportsWebP() {
      return new Promise(resolve => {
        const webP = new Image();
        webP.onload = webP.onerror = () => resolve(webP.height === 2);
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
      });
    }

    supportsWebP().then(supported => {
      if (supported) {
        document.documentElement.classList.add('webp');
      }
    });

    // Enhanced lazy loading with intersection observer
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Handle responsive images with srcset
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }
            
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            
            img.classList.remove('lazy');
            img.classList.add('loaded');
            imageObserver.unobserve(img);
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
    }
  }

  // Viewport height handling for mobile browsers
  function initViewportHandling() {
    // Handle dynamic viewport height on mobile
    function setViewportHeight() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setViewportHeight();
    
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setViewportHeight, 100);
    });
    
    window.addEventListener('orientationchange', () => {
      setTimeout(setViewportHeight, 200);
    });
  }

  // Performance optimizations
  function initPerformanceOptimizations() {
    // Preload critical resources
    const criticalImages = document.querySelectorAll('img[data-preload]');
    criticalImages.forEach(img => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img.src || img.dataset.src;
      document.head.appendChild(link);
    });

    // Optimize scroll performance
    let ticking = false;
    function updateScrollPosition() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      // Update any scroll-dependent elements
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      parallaxElements.forEach(element => {
        element.style.transform = `translateY(${rate}px)`;
      });
      
      ticking = false;
    }

    function requestScrollUpdate() {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  }

  // Scroll-triggered animations with Intersection Observer
  function initScrollAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // If reduced motion is preferred, show all elements immediately
      const animatedElements = document.querySelectorAll('.scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .stagger-grid > *');
      animatedElements.forEach(element => {
        element.classList.add('in-view');
      });
      return;
    }

    if ('IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // Unobserve after animation to improve performance
            animationObserver.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
      });

      // Observe elements with scroll animation classes
      const scrollElements = document.querySelectorAll('.scroll-fade-in, .scroll-slide-left, .scroll-slide-right');
      scrollElements.forEach(element => {
        animationObserver.observe(element);
      });

      // Handle staggered grid animations
      const staggerGrids = document.querySelectorAll('.stagger-grid');
      staggerGrids.forEach(grid => {
        const gridObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const children = entry.target.children;
              Array.from(children).forEach((child, index) => {
                setTimeout(() => {
                  child.classList.add('in-view');
                }, index * 100); // 100ms delay between each item
              });
              gridObserver.unobserve(entry.target);
            }
          });
        }, {
          rootMargin: '0px 0px -100px 0px',
          threshold: 0.1
        });
        
        gridObserver.observe(grid);
      });
    }
  }

  // Enhanced card hover effects with performance optimization
  function initCardEffects() {
    const cards = document.querySelectorAll('.article-card, .featured-card, .card-hover-effect');
    
    cards.forEach(card => {
      // Add will-change property on hover start for better performance
      card.addEventListener('mouseenter', function() {
        this.style.willChange = 'transform, box-shadow';
      }, { passive: true });
      
      card.addEventListener('mouseleave', function() {
        this.style.willChange = 'auto';
      }, { passive: true });
      
      // Add touch feedback for mobile devices
      card.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
      }, { passive: true });
      
      card.addEventListener('touchend', function() {
        setTimeout(() => {
          this.classList.remove('touch-active');
        }, 150);
      }, { passive: true });
    });
  }

  // Parallax effect for hero sections
  function initParallaxEffects() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) return;

    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;

    let ticking = false;
    
    function updateParallax() {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const rate = scrolled * (element.dataset.parallax || -0.5);
        element.style.transform = `translateY(${rate}px)`;
      });
      
      ticking = false;
    }

    function requestParallaxUpdate() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
  }

  // Text reveal animations
  function initTextRevealAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) return;

    const textRevealElements = document.querySelectorAll('.text-reveal');
    
    if ('IntersectionObserver' in window) {
      const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const text = entry.target.textContent;
            const words = text.split(' ');
            
            entry.target.innerHTML = words.map((word, index) => 
              `<span style="animation-delay: ${index * 0.1}s">${word}</span>`
            ).join(' ');
            
            textObserver.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.5
      });

      textRevealElements.forEach(element => {
        textObserver.observe(element);
      });
    }
  }

  // Enhanced button and link interactions
  function initInteractiveElements() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('button, .btn, .btn-primary');
    
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

    // Enhanced focus management
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(element => {
      element.addEventListener('focus', function() {
        this.classList.add('focus-visible');
      });
      
      element.addEventListener('blur', function() {
        this.classList.remove('focus-visible');
      });
    });
  }

  // Loading state animations
  function initLoadingAnimations() {
    // Add loading skeleton animations
    const skeletonElements = document.querySelectorAll('.skeleton');
    
    skeletonElements.forEach(element => {
      element.addEventListener('animationend', function() {
        this.classList.add('loaded');
      });
    });

    // Handle image loading states
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', function() {
          this.classList.add('loaded');
        });
        
        img.addEventListener('error', function() {
          this.classList.add('error');
        });
      }
    });
  }

  // Micro-interactions and feedback
  function initMicroInteractions() {
    // Add bounce effect to interactive elements
    const bounceElements = document.querySelectorAll('.micro-bounce');
    
    bounceElements.forEach(element => {
      element.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = '';
        }, 100);
      });
    });

    // Add wiggle effect on hover
    const wiggleElements = document.querySelectorAll('.micro-wiggle');
    
    wiggleElements.forEach(element => {
      let wiggleTimeout;
      
      element.addEventListener('mouseenter', function() {
        clearTimeout(wiggleTimeout);
        this.classList.add('wiggling');
        
        wiggleTimeout = setTimeout(() => {
          this.classList.remove('wiggling');
        }, 500);
      });
    });
  }

  // Performance monitoring and optimization
  function initPerformanceMonitoring() {
    // Monitor animation performance
    let animationFrameId;
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 60;

    function measureFPS() {
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
        
        // Reduce animations if FPS is too low
        if (fps < 30) {
          document.body.classList.add('low-performance');
        } else {
          document.body.classList.remove('low-performance');
        }
      }
      
      animationFrameId = requestAnimationFrame(measureFPS);
    }

    // Start monitoring only if animations are enabled
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      measureFPS();
    }

    // Stop monitoring when page is hidden
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else if (!prefersReducedMotion) {
        measureFPS();
      }
    });
  }

  // Initialize all functionality when DOM is ready
  ready(function() {
    // Initialize multilingual support first
    initializeLanguageSupport();
    optimizeFontLoading();
    initializeLanguageSwitching();
    
    // Initialize other functionality
    initMobileMenu();
    initSmoothScrolling();
    initLazyLoading();
    initTouchInteractions();
    initResponsiveImages();
    initViewportHandling();
    initPerformanceOptimizations();
    
    // Initialize animation and visual effects
    initScrollAnimations();
    initCardEffects();
    initParallaxEffects();
    initTextRevealAnimations();
    initInteractiveElements();
    initLoadingAnimations();
    initMicroInteractions();
    initPerformanceMonitoring();
    
    // Load search index on page load
    loadSearchIndex().then(() => {
      initSearch();
    });
    
    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');
    
    // Add responsive classes based on screen size
    function updateResponsiveClasses() {
      const width = window.innerWidth;
      document.body.classList.remove('mobile', 'tablet', 'desktop');
      
      if (width < 768) {
        document.body.classList.add('mobile');
      } else if (width < 1024) {
        document.body.classList.add('tablet');
      } else {
        document.body.classList.add('desktop');
      }
    }
    
    updateResponsiveClasses();
    window.addEventListener('resize', updateResponsiveClasses);
  });

  // Handle page visibility changes
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      // Page is hidden
      console.log('Page hidden');
    } else {
      // Page is visible
      console.log('Page visible');
    }
  });

  // Newsletter subscription handling
  function initNewsletterSubscription() {
    const newsletterForms = document.querySelectorAll('form[action*="newsletter"], form[action*="subscribe"]');
    
    newsletterForms.forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Basic email validation
        if (!email || !isValidEmail(email)) {
          showNotification('Please enter a valid email address', 'error');
          return;
        }
        
        // Show loading state
        submitButton.textContent = 'Subscribing...';
        submitButton.disabled = true;
        
        // Simulate subscription (replace with actual implementation)
        setTimeout(() => {
          showNotification('Thank you for subscribing!', 'success');
          this.reset();
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        }, 1500);
      });
    });
  }
  
  // Email validation helper
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Footer social media link tracking (optional analytics)
  function initSocialMediaTracking() {
    const socialLinks = document.querySelectorAll('footer a[href*="twitter.com"], footer a[href*="facebook.com"], footer a[href*="linkedin.com"], footer a[href*="github.com"], footer a[href*="instagram.com"], footer a[href*="youtube.com"]');
    
    socialLinks.forEach(link => {
      link.addEventListener('click', function() {
        const platform = this.href.includes('twitter') ? 'Twitter' :
                         this.href.includes('facebook') ? 'Facebook' :
                         this.href.includes('linkedin') ? 'LinkedIn' :
                         this.href.includes('github') ? 'GitHub' :
                         this.href.includes('instagram') ? 'Instagram' :
                         this.href.includes('youtube') ? 'YouTube' : 'Unknown';
        
        // Track social media clicks (replace with your analytics implementation)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'social_click', {
            'social_platform': platform,
            'link_url': this.href
          });
        }
        
        console.log(`Social media click: ${platform}`);
      });
    });
  }
  
  // Enhanced footer functionality
  function initFooterFeatures() {
    initNewsletterSubscription();
    initSocialMediaTracking();
    
    // Add smooth scroll to top functionality if back-to-top button exists
    const backToTopButton = document.querySelector('[data-back-to-top]');
    if (backToTopButton) {
      backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
      
      // Show/hide back to top button based on scroll position
      window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
          backToTopButton.classList.remove('opacity-0', 'pointer-events-none');
          backToTopButton.classList.add('opacity-100');
        } else {
          backToTopButton.classList.add('opacity-0', 'pointer-events-none');
          backToTopButton.classList.remove('opacity-100');
        }
      });
    }
  }
  
  // Initialize all functionality when DOM is ready
  ready(function() {
    // Initialize core functionality
    initializeLanguageSupport();
    optimizeFontLoading();
    initializeLanguageSwitching();
    
    // Initialize UI components
    initMobileMenu();
    initSmoothScrolling();
    initLazyLoading();
    initTouchInteractions();
    initResponsiveImages();
    initViewportHandling();
    initPerformanceOptimizations();
    initScrollAnimations();
    
    // Initialize search functionality
    loadSearchIndex().then(() => {
      initSearch();
    });
    
    // Initialize footer features
    initFooterFeatures();
    
    // Page-specific initializations
    if (document.getElementById('search-input')) {
      initializeSearch();
    }
    
    // Handle URL parameters for search
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q') || urlParams.get('query');
    if (searchQuery && typeof window.performSearch === 'function') {
      window.performSearch(searchQuery);
    }
    
    console.log('Theme initialized successfully');
  });

})();