const { test, expect } = require('@playwright/test');

/**
 * Cross-browser navigation functionality tests
 */

test.describe('Navigation Cross-Browser Tests', () => {
  test('should have sticky header behavior', async ({ page }) => {
    await page.goto('/');
    
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Scroll down and check if header is still visible
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(100);
    
    // Header should still be visible (sticky behavior)
    await expect(header).toBeVisible();
  });

  test('should handle mobile menu toggle', async ({ page, isMobile }) => {
    if (!isMobile) {
      await page.setViewportSize({ width: 375, height: 667 });
    }
    
    await page.goto('/');
    
    // Look for mobile menu toggle
    const menuToggle = page.locator('.menu-toggle, .hamburger, .mobile-menu-button, [aria-label*="menu"]');
    
    if (await menuToggle.count() > 0) {
      // Click menu toggle
      await menuToggle.first().click();
      
      // Check if mobile menu is visible
      const mobileMenu = page.locator('.mobile-menu, .nav-mobile, .menu-mobile');
      if (await mobileMenu.count() > 0) {
        await expect(mobileMenu.first()).toBeVisible();
      }
    }
  });

  test('should highlight active navigation items', async ({ page }) => {
    await page.goto('/');
    
    // Get navigation links
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();
    
    if (linkCount > 1) {
      // Click on a navigation link
      const secondLink = navLinks.nth(1);
      const href = await secondLink.getAttribute('href');
      
      if (href && href !== '#' && !href.startsWith('javascript:')) {
        await secondLink.click();
        await page.waitForLoadState('networkidle');
        
        // Check if the clicked link has active state
        const activeLink = page.locator('nav a.active, nav a[aria-current], nav .active a');
        if (await activeLink.count() > 0) {
          await expect(activeLink.first()).toBeVisible();
        }
      }
    }
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper ARIA labels
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check for skip links
    const skipLink = page.locator('a[href="#main"], a[href="#content"], .skip-link');
    if (await skipLink.count() > 0) {
      await expect(skipLink.first()).toBeVisible();
    }
  });

  test('should work with keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Start keyboard navigation
    await page.keyboard.press('Tab');
    
    let tabCount = 0;
    const maxTabs = 10;
    
    // Tab through navigation elements
    while (tabCount < maxTabs) {
      const focusedElement = page.locator(':focus');
      
      if (await focusedElement.count() > 0) {
        const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
        
        // If we reach a navigation link, test Enter key
        if (tagName === 'a') {
          const href = await focusedElement.getAttribute('href');
          if (href && href !== '#' && !href.startsWith('javascript:')) {
            // Press Enter to activate link
            await page.keyboard.press('Enter');
            await page.waitForLoadState('networkidle');
            
            // Verify navigation worked
            expect(page.url()).toContain(href);
            break;
          }
        }
      }
      
      await page.keyboard.press('Tab');
      tabCount++;
    }
  });
});