// Accessibility Enhancement JavaScript
// Provides keyboard navigation, focus management, and ARIA support

class AccessibilityManager {
  constructor() {
    this.isKeyboardNavigation = false;
    this.focusableElements = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');
    
    this.init();
  }
  
  init() {
    this.setupKeyboardDetection();
    this.setupFocusManagement();
    this.setupARIAEnhancements();
    this.setupReducedMotion();
    this.setupColorSchemeDetection();
    this.setupTouchTargets();
  }
  
  // Detect keyboard vs mouse navigation
  setupKeyboardDetection() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.isKeyboardNavigation = true;
        document.body.classList.add('keyboard-navigation-active');
        document.body.classList.remove('mouse-navigation-active');
      }
    });
    
    document.addEventListener('mousedown', () => {
      this.isKeyboardNavigation = false;
      document.body.classList.add('mouse-navigation-active');
      document.body.classList.remove('keyboard-navigation-active');
    });
  }
  
  // Enhanced focus management
  setupFocusManagement() {
    // Skip to content functionality
    const skipLinks = document.querySelectorAll('.skip-link');
    skipLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Announce to screen readers
          if (window.announceToScreenReader) {
            window.announceToScreenReader(`Navigated to ${target.getAttribute('aria-label') || targetId}`);
          }
        }
      });
    });
    
    // Focus trap for modals/dialogs
    this.setupFocusTrap();
    
    // Roving tabindex for complex widgets
    this.setupRovingTabindex();
  }
  
  setupFocusTrap() {
    const focusTraps = document.querySelectorAll('.focus-trap');
    
    focusTraps.forEach(trap => {
      const focusableElements = trap.querySelectorAll(this.focusableElements);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      trap.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
        
        if (e.key === 'Escape') {
          this.closeFocusTrap(trap);
        }
      });
    });
  }
  
  closeFocusTrap(trap) {
    const trigger = trap.getAttribute('data-focus-trigger');
    if (trigger) {
      const triggerElement = document.querySelector(trigger);
      if (triggerElement) {
        triggerElement.focus();
      }
    }
    
    trap.classList.remove('focus-trap-active');
    document.body.classList.remove('focus-trap-active');
  }
  
  setupRovingTabindex() {
    const rovingGroups = document.querySelectorAll('[role="tablist"], [role="menubar"], .roving-tabindex');
    
    rovingGroups.forEach(group => {
      const items = group.querySelectorAll('[role="tab"], [role="menuitem"], .roving-item');
      let currentIndex = 0;
      
      // Set initial tabindex
      items.forEach((item, index) => {
        item.setAttribute('tabindex', index === 0 ? '0' : '-1');
      });
      
      group.addEventListener('keydown', (e) => {
        let newIndex = currentIndex;
        
        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault();
            newIndex = (currentIndex + 1) % items.length;
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            newIndex = (currentIndex - 1 + items.length) % items.length;
            break;
          case 'Home':
            e.preventDefault();
            newIndex = 0;
            break;
          case 'End':
            e.preventDefault();
            newIndex = items.length - 1;
            break;
        }
        
        if (newIndex !== currentIndex) {
          items[currentIndex].setAttribute('tabindex', '-1');
          items[newIndex].setAttribute('tabindex', '0');
          items[newIndex].focus();
          currentIndex = newIndex;
        }
      });
    });
  }
  
  // ARIA enhancements
  setupARIAEnhancements() {
    // Auto-generate ARIA labels for buttons without labels
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    buttons.forEach(button => {
      const text = button.textContent.trim();
      const icon = button.querySelector('svg, i');
      
      if (!text && icon) {
        // Try to get label from parent context or data attributes
        const label = button.getAttribute('title') || 
                     button.getAttribute('data-label') ||
                     'Button';
        button.setAttribute('aria-label', label);
      }
    });
    
    // Enhance form controls
    this.enhanceFormControls();
    
    // Setup live regions
    this.setupLiveRegions();
    
    // Enhance navigation
    this.enhanceNavigation();
  }
  
  enhanceFormControls() {
    const formControls = document.querySelectorAll('input, textarea, select');
    
    formControls.forEach(control => {
      const label = document.querySelector(`label[for="${control.id}"]`);
      const description = document.querySelector(`#${control.id}-description`);
      const error = document.querySelector(`#${control.id}-error`);
      
      // Link descriptions and errors
      const describedBy = [];
      if (description) describedBy.push(`${control.id}-description`);
      if (error) describedBy.push(`${control.id}-error`);
      
      if (describedBy.length > 0) {
        control.setAttribute('aria-describedby', describedBy.join(' '));
      }
      
      // Mark required fields
      if (control.hasAttribute('required')) {
        control.setAttribute('aria-required', 'true');
      }
      
      // Mark invalid fields
      if (control.hasAttribute('aria-invalid') || control.classList.contains('error-state')) {
        control.setAttribute('aria-invalid', 'true');
      }
    });
  }
  
  setupLiveRegions() {
    // Create live regions if they don't exist
    if (!document.getElementById('aria-live-polite')) {
      const politeRegion = document.createElement('div');
      politeRegion.id = 'aria-live-polite';
      politeRegion.setAttribute('aria-live', 'polite');
      politeRegion.setAttribute('aria-atomic', 'true');
      politeRegion.className = 'sr-only';
      document.body.appendChild(politeRegion);
    }
    
    if (!document.getElementById('aria-live-assertive')) {
      const assertiveRegion = document.createElement('div');
      assertiveRegion.id = 'aria-live-assertive';
      assertiveRegion.setAttribute('aria-live', 'assertive');
      assertiveRegion.setAttribute('aria-atomic', 'true');
      assertiveRegion.className = 'sr-only';
      document.body.appendChild(assertiveRegion);
    }
  }
  
  enhanceNavigation() {
    // Add current page indicators
    const currentPageLinks = document.querySelectorAll('.nav-active, [aria-current="page"]');
    currentPageLinks.forEach(link => {
      if (!link.hasAttribute('aria-current')) {
        link.setAttribute('aria-current', 'page');
      }
    });
    
    // Enhance dropdown menus
    const dropdowns = document.querySelectorAll('[role="button"][aria-expanded]');
    dropdowns.forEach(dropdown => {
      dropdown.addEventListener('click', () => {
        const expanded = dropdown.getAttribute('aria-expanded') === 'true';
        dropdown.setAttribute('aria-expanded', !expanded);
      });
      
      dropdown.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          dropdown.click();
        }
      });
    });
  }
  
  // Reduced motion support
  setupReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleReducedMotion = (mediaQuery) => {
      if (mediaQuery.matches) {
        document.body.classList.add('reduced-motion');
        
        // Disable autoplay videos
        const videos = document.querySelectorAll('video[autoplay]');
        videos.forEach(video => {
          video.removeAttribute('autoplay');
          video.pause();
        });
        
        // Disable CSS animations
        const style = document.createElement('style');
        style.textContent = `
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        `;
        document.head.appendChild(style);
      } else {
        document.body.classList.remove('reduced-motion');
      }
    };
    
    handleReducedMotion(prefersReducedMotion);
    prefersReducedMotion.addEventListener('change', handleReducedMotion);
  }
  
  // Color scheme detection
  setupColorSchemeDetection() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
    
    const handleColorScheme = () => {
      if (prefersDark.matches) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      
      if (prefersHighContrast.matches) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
    };
    
    handleColorScheme();
    prefersDark.addEventListener('change', handleColorScheme);
    prefersHighContrast.addEventListener('change', handleColorScheme);
  }
  
  // Touch target enhancement
  setupTouchTargets() {
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    
    interactiveElements.forEach(element => {
      if (!element.classList.contains('touch-target')) {
        const rect = element.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
          element.classList.add('touch-target');
        }
      }
    });
  }
  
  // Public methods for external use
  announceToScreenReader(message, priority = 'polite') {
    const liveRegion = document.getElementById(`aria-live-${priority}`);
    if (liveRegion) {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }
  
  focusElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  
  validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    inputs.forEach(input => {
      const isInputValid = input.checkValidity();
      
      if (!isInputValid) {
        isValid = false;
        input.setAttribute('aria-invalid', 'true');
        input.classList.add('error-state');
        
        // Show error message
        const errorId = `${input.id}-error`;
        let errorElement = document.getElementById(errorId);
        
        if (!errorElement) {
          errorElement = document.createElement('div');
          errorElement.id = errorId;
          errorElement.className = 'form-error';
          errorElement.setAttribute('role', 'alert');
          input.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = input.validationMessage;
        
        // Update aria-describedby
        const describedBy = input.getAttribute('aria-describedby') || '';
        if (!describedBy.includes(errorId)) {
          input.setAttribute('aria-describedby', `${describedBy} ${errorId}`.trim());
        }
      } else {
        input.setAttribute('aria-invalid', 'false');
        input.classList.remove('error-state');
        
        // Remove error message
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
          errorElement.remove();
        }
      }
    });
    
    return isValid;
  }
}

// Initialize accessibility manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityManager = new AccessibilityManager();
  });
} else {
  window.accessibilityManager = new AccessibilityManager();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessibilityManager;
}