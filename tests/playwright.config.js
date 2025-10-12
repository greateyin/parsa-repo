// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Cross-browser compatibility test configuration
 * Tests the Hugo theme across different browsers and devices
 */
module.exports = defineConfig({
  testDir: './cross-browser-tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'reports/playwright-report' }],
    ['json', { outputFile: 'reports/playwright-results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:1313',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },
  ],

  webServer: {
    command: 'cd ../exampleSite && hugo server --port 1313 --disableFastRender',
    port: 1313,
    reuseExistingServer: !process.env.CI,
  },
});