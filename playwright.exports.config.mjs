import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './packages/deck-engine/__tests__/browser',
  testMatch: '**/*.visual.mjs',
  outputDir: './test-results/exports',
  workers: 1,
  use: {
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    trace: 'retain-on-failure',
  },
  projects: [
    // Keep Windows LCD text antialiasing out of DOM-vs-SVG pixel comparisons.
    { name: 'chromium', use: { browserName: 'chromium', launchOptions: { args: ['--disable-lcd-text'] } } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
})
