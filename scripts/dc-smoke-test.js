const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

function findChrome() {
  const cacheDir = path.join(process.env.HOME, '.cache/ms-playwright');
  const dirs = fs.readdirSync(cacheDir).filter(d => /^chromium-\d+$/.test(d));
  for (const d of dirs) {
    const p1 = path.join(cacheDir, d, 'chrome-linux64/chrome');
    const p2 = path.join(cacheDir, d, 'chrome-linux/chrome');
    if (fs.existsSync(p1)) return p1;
    if (fs.existsSync(p2)) return p2;
  }
  throw new Error('no chromium build found in ' + cacheDir);
}

async function main() {
  const file = process.argv[2];
  const categoryLabel = process.argv[3] || '';
  const modeLabel = process.argv[4] || '';
  if (!file) { console.error('usage: node dc-smoke-test.js <index.html> [categoryLabel] [modeLabel]'); process.exit(1); }

  const browser = await chromium.launch({ executablePath: findChrome() });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));

  await page.goto('file://' + path.resolve(file));
  await page.waitForTimeout(1200);

  if (categoryLabel) {
    await page.getByText(categoryLabel, { exact: false }).first().click();
    await page.waitForTimeout(400);
  }
  if (modeLabel) {
    await page.getByText(modeLabel, { exact: false }).first().click();
    await page.waitForTimeout(600);
    const body1 = await page.textContent('body');
    console.log('after entering mode, contains REEL:', body1.includes('REEL'));
    const buttons = await page.locator('button').all();
    if (buttons.length) { await buttons[Math.min(3, buttons.length - 1)].click().catch(() => {}); }
    await page.waitForTimeout(500);
  }

  const finalText = await page.textContent('body');
  console.log('final body snippet:', finalText.slice(0, 200).replace(/\s+/g, ' '));
  console.log('errors:', errors);
  await browser.close();
  if (errors.length) process.exit(1);
}

main();
