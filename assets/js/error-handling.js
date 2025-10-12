/**
 * Error Handling and Graceful Degradation
 * Provides fallbacks and error recovery for the Hugo theme
 */

class ErrorHandler {
  constructor() {
    this.init();
  }

  init() {
    // Set up global error handlers
    this.setupGlobalErrorHandlers();
    
    // Initialize image error handling
    this.initImageErrorHandling();
    
    // Initialize form error handling
    this.initFormErrorHandling();
    
    // Initialize navigation fallbacks
    this.initNavigationFallbacks();
    
    // Initialize content loading fallbacks
    this.initContentFallbacks();
    
    // Initialize accessibility fallbacks
    this.initAccessibilityFallbacks();
  }

  setupGlobalErrorHandlers() {
    // Handle JavaScript errors gracefully
    window.addEventListener('error', (event) => {
      console.warn('JavaScript error occurred:', event.error);
      this.showErrorNotification('A minor error occurred. The page should still function normally.');
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.warn('Unhandled promise rejection:', event.reason);
      event.preventDefault(); // Prevent the default browser behavior
    });

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleResourceError(event.target);
      }
    }, true);
  }

  initImageErrorHandling() {
    // Handle image loading errors
    document.addEventListener('error', (event) => {
      if (event.target.tagName === 'IMG') {
        this.handleImageError(event.target);
      }
    }, true);

    // Set up lazy loading fallback
    if ('IntersectionObserver' in window) {
      this.initLazyLoading();
    } else {
      // Fallback: load all images immediately
      this.loadAllImages();
    }
  }

  handleImageError(img) {
    // Prevent infinite error loops
    if (img.dataset.errorHandled) return;
    img.dataset.errorHandled = 'true';

    // Hide the broken image
    img.style.display = 'none';

    // Show placeholder
    const placeholder = img.nextElementSibling;
    if (placeholder && placeholder.classList.contains('image-error-placeholder')) {
      placeholder.style.display = 'flex';
    } else {
      // Create and insert placeholder
      const newPlaceholder = this.createImagePlaceholder(img.alt || 'Image');
      img.parentNode.insertBefore(newPlaceholder, img.nextSibling);
    }
  }

  createImagePlaceholder(altText) {
    const placeholder = document.createElement('div');
    placeholder.className = 'image-error-placeholder w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex flex-col items-center justify-center text-muted-foreground/50';
    placeholder.innerHTML = `
      <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span class="text-xs text-center px-2">${altText || 'Image failed to load'}</span>
    `;
    return placeholder;
  }

  initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  loadAllImages() {
    // Fallback for browsers without IntersectionObserver
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }

  initFormErrorHandling() {
    // Handle form submission errors
    document.addEventListener('submit', (event) => {
      const form = event.target;
      if (form.tagName === 'FORM') {
        this.handleFormSubmission(form, event);
      }
    });

    // Handle form validation
    document.addEventListener('invalid', (event) => {
      this.handleFormValidation(event.target);
    }, true);
  }

  handleFormSubmission(form, event) {
    // Add loading state
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Loading...';
      
      // Reset after timeout as fallback
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }, 10000);
    }

    // Handle search form specifically
    if (form.classList.contains('search-form')) {
      // If search functionality is not available, redirect to categories
      if (!window.searchIndex) {
        event.preventDefault();
        window.location.href = '/categories/';
      }
    }
  }

  handleFormValidation(field) {
    // Remove existing error messages
    const existingError = field.parentNode.querySelector('.validation-error');
    if (existingError) {
      existingError.remove();
    }

    // Add error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'validation-error text-red-600 text-sm mt-1';
    errorMessage.textContent = field.validationMessage || 'Please check this field';
    field.parentNode.appendChild(errorMessage);

    // Remove error on input
    field.addEventListener('input', () => {
      if (field.validity.valid && errorMessage.parentNode) {
        errorMessage.remove();
      }
    }, { once: true });
  }

  initNavigationFallbacks() {
    // Handle mobile menu fallback
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileToggle && mobileMenu) {
      // Ensure menu works without JavaScript
      mobileToggle.addEventListener('click', (event) => {
        event.preventDefault();
        mobileMenu.classList.toggle('hidden');
        mobileToggle.setAttribute('aria-expanded', 
          mobileMenu.classList.contains('hidden') ? 'false' : 'true'
        );
      });

      // Handle keyboard navigation
      mobileToggle.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          mobileToggle.click();
        }
      });
    }

    // Handle dropdown menus
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.dropdown-trigger');
      const menu = dropdown.querySelector('.dropdown-menu');
      
      if (trigger && menu) {
        trigger.addEventListener('click', (event) => {
          event.preventDefault();
          menu.classList.toggle('hidden');
        });

        // Close on outside click
        document.addEventListener('click', (event) => {
          if (!dropdown.contains(event.target)) {
            menu.classList.add('hidden');
          }
        });
      }
    });
  }

  initContentFallbacks() {
    // Handle missing content gracefully
    this.handleMissingContent();
    
    // Handle infinite scroll fallback
    this.initInfiniteScrollFallback();
    
    // Handle modal fallbacks
    this.initModalFallbacks();
  }

  handleMissingContent() {
    // Check for empty content areas and show appropriate messages
    const contentAreas = document.querySelectorAll('.content-area, .article-grid, .search-results');
    
    contentAreas.forEach(area => {
      if (area.children.length === 0 || area.textContent.trim() === '') {
        this.showEmptyState(area);
      }
    });
  }

  showEmptyState(container) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state text-center py-16';
    emptyState.innerHTML = `
      <div class="max-w-md mx-auto">
        <svg class="w-16 h-16 mx-auto text-muted-foreground/40 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
        <h3 class="text-xl font-semibold text-foreground mb-3">No content found</h3>
        <p class="text-muted-foreground mb-6">There is no content available at the moment.</p>
        <a href="/" class="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          Back to Home
        </a>
      </div>
    `;
    container.appendChild(emptyState);
  }

  initInfiniteScrollFallback() {
    // Show pagination if infinite scroll fails
    const infiniteScrollTrigger = document.querySelector('.infinite-scroll-trigger');
    const pagination = document.querySelector('.pagination-nojs');
    
    if (infiniteScrollTrigger && pagination) {
      // Hide infinite scroll trigger and show pagination as fallback
      setTimeout(() => {
        if (!window.infiniteScrollLoaded) {
          infiniteScrollTrigger.style.display = 'none';
          pagination.style.display = 'flex';
        }
      }, 5000);
    }
  }

  initModalFallbacks() {
    // Handle modal functionality without JavaScript
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (event) => {
        const targetId = trigger.dataset.modalTarget;
        const modal = document.getElementById(targetId);
        
        if (modal) {
          event.preventDefault();
          this.showModal(modal);
        }
      });
    });
  }

  showModal(modal) {
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    
    // Handle close buttons
    const closeButtons = modal.querySelectorAll('.modal-close');
    closeButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.hideModal(modal);
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.hideModal(modal);
      }
    });

    // Close on backdrop click
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        this.hideModal(modal);
      }
    });
  }

  hideModal(modal) {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }

  initAccessibilityFallbacks() {
    // Ensure keyboard navigation works
    this.initKeyboardNavigation();
    
    // Handle focus management
    this.initFocusManagement();
    
    // Handle screen reader announcements
    this.initScreenReaderSupport();
  }

  initKeyboardNavigation() {
    // Handle tab navigation for custom elements
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        this.handleTabNavigation(event);
      }
    });
  }

  handleTabNavigation(event) {
    // Ensure focus stays within modals
    const openModal = document.querySelector('.modal[style*="display: block"]');
    if (openModal) {
      const focusableElements = openModal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }

  initFocusManagement() {
    // Ensure focus is visible
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  initScreenReaderSupport() {
    // Add live region for dynamic content updates
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
  }

  announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  handleResourceError(element) {
    console.warn('Resource failed to load:', element.src || element.href);
    
    // Handle different types of resource errors
    if (element.tagName === 'LINK' && element.rel === 'stylesheet') {
      this.handleCSSError(element);
    } else if (element.tagName === 'SCRIPT') {
      this.handleJSError(element);
    }
  }

  handleCSSError(link) {
    // Add fallback styles if CSS fails to load
    const fallbackCSS = document.createElement('style');
    fallbackCSS.textContent = `
      /* Fallback styles for critical elements */
      .btn { padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.25rem; }
      .btn:hover { background: #2563eb; }
      .card { border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0; }
      .hidden { display: none !important; }
      .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
    `;
    document.head.appendChild(fallbackCSS);
  }

  handleJSError(script) {
    // Handle JavaScript loading errors
    console.warn('JavaScript file failed to load:', script.src);
    
    // Show notification that some features may not work
    this.showErrorNotification('Some interactive features may not be available. The site will still function normally.');
  }

  showErrorNotification(message) {
    // Only show one notification at a time
    if (document.querySelector('.error-notification')) return;

    const notification = document.createElement('div');
    notification.className = 'error-notification fixed top-4 right-4 bg-amber-100 border border-amber-400 text-amber-800 px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm';
    notification.innerHTML = `
      <div class="flex items-start">
        <svg class="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <div class="flex-1">
          <p class="text-sm">${message}</p>
        </div>
        <button class="ml-2 text-amber-600 hover:text-amber-800" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);
  }
}

// Initialize error handling when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ErrorHandler();
  });
} else {
  new ErrorHandler();
}

// Export for use in other modules
window.ErrorHandler = ErrorHandler;