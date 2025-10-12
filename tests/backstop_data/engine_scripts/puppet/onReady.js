/**
 * BackstopJS onReady script
 * Runs when the page is ready for screenshot
 */

module.exports = async (page, scenario, vp) => {
  console.log('READY > ' + scenario.label);
  
  // Wait for images to load
  await page.evaluate(async () => {
    const selectors = Array.from(document.querySelectorAll("img"));
    await Promise.all(selectors.map(img => {
      if (img.complete) return;
      return new Promise((resolve, reject) => {
        img.addEventListener('load', resolve);
        img.addEventListener('error', reject);
      });
    }));
  });
  
  // Wait for any lazy-loaded content
  await page.waitForTimeout(500);
  
  // Hide elements that might cause flaky tests
  await page.evaluate(() => {
    // Hide elements with current time/date
    const timeElements = document.querySelectorAll('.time, .date, .timestamp');
    timeElements.forEach(el => el.style.visibility = 'hidden');
    
    // Hide dynamic counters
    const counters = document.querySelectorAll('.counter, .view-count');
    counters.forEach(el => el.style.visibility = 'hidden');
  });
};