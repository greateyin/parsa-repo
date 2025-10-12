/**
 * BackstopJS onBefore script
 * Runs before each visual test scenario
 */

module.exports = async (page, scenario, vp) => {
  console.log('SCENARIO > ' + scenario.label);
  
  // Set user agent
  await page.setUserAgent('BackstopJS');
  
  // Disable animations for consistent screenshots
  await page.evaluateOnNewDocument(() => {
    // Disable CSS animations
    const style = document.createElement('style');
    style.innerHTML = `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `;
    document.head.appendChild(style);
  });
  
  // Set viewport
  await page.setViewport({
    width: vp.width,
    height: vp.height,
    deviceScaleFactor: 1
  });
  
  // Wait for fonts to load
  await page.evaluateHandle('document.fonts.ready');
};