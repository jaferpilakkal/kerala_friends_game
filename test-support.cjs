// Development tools only; the deployed application has no Node dependencies.
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseUrl = process.env.TEST_URL || 'http://127.0.0.1:8000/';
const outputDir = path.resolve(process.env.TEST_OUTPUT_DIR || path.join(__dirname, 'test-results', new Date().toISOString().replace(/[:.]/g, '-')));
fs.mkdirSync(outputDir, { recursive: true });
const artifact = name => path.join(outputDir, name);
const launchOptions = {
  headless: true,
  ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}),
  args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'],
};
module.exports = { chromium, baseUrl, artifact, launchOptions };
