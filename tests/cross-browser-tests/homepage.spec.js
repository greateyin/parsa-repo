const { test, expect } = require('@playwright/test');

/**
 * Cross-browser homepage functionality tests
 */

test.describe('Homepage Cross-Browser Tests', () => {
  test('should load homepage with correct structure', async ({ page }) => {
    await page.goto('/');
    
    // Check basic page structure
    await expect(page.locator('html')).toHaveAttribute('lang');
    await expect(page.locator('head title')).not.toBeEmpty();
    await expect(page.locator('meta[name="viewport"]')).toBeVisible();
    
    // Check header navigation
    await expect(page.locator('header nav')).toBeVisible();
    await expect(page.locator('header .logo, header h1')).toBeVisible();
    
    // Check main content area
    await expect(page.locator('main')).toBeVisible();
    
    // Check footer
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should display hero section correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check for hero section
    const heroSection = page.locator('.hero, .banner, .jumbotron').first();
    if (await heroSection.count() > 0) {
      await expect(heroSection).toBeVisible();
    }
  });

  test('should display article cards', async ({ page }) => {
    await page.goto('/');
    
    // Look for article cards with various possible selectors
    const articleCards = page.locator('article, .post, .card, .article-card').first();
    await expect(articleCards).toBeVisible();
  });

  test('should have working navigation menu', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation links
    const navLinks = page.locator('nav a, .nav-link');
    const linkCount = await navLinks.count();
    
    if (linkCount > 0) {
      // Click first navigation link
      const firstLink = navLinks.first();
      const href = await firstLink.getAttribute('href');
      
      if (href && href !== '#' && !href.startsWith('javascript:')) {
        await firstLink.click();
        await page.waitForLoadState('networkidle');
        
        // Verify navigation worked
        expect(page.url()).toContain(href);
      }
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile navigation (hamburger menu)
    const mobileMenu = page.locator('.mobile-menu, .hamburger, .menu-toggle');
    if (await mobileMenu.count() > 0) {
      await expect(mobileMenu).toBeVisible();
    }
    
    // Check content is not overflowing
    const body = page.locator('body');
    const bodyBox = await body.boundingBox();
    expect(bodyBox.width).toBeLessThanOrEqual(375);
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Check if focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});