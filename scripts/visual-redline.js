#!/usr/bin/env node
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureVisuals(inputHtmlPath, outputDir = './visual-audits') {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const absolutePath = path.resolve(inputHtmlPath);
  console.log(`Navigating to file://${absolutePath}`);
  await page.goto(`file://${absolutePath}`, { waitUntil: 'load', timeout: 15000 });

  const baseName = path.basename(inputHtmlPath, path.extname(inputHtmlPath));
  const screenshotPath = path.join(outputDir, `${baseName}-viewport.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });

  console.log(`✅ Visual Redline snapshot captured at: ${screenshotPath}`);
  await browser.close();
  return screenshotPath;
}

const target = process.argv[2] || '/home/ubuntu/.infra-packages/unslop/examples/hero.html';
captureVisuals(target).catch(err => {
  console.error("Visual redline failed:", err);
  process.exit(1);
});
