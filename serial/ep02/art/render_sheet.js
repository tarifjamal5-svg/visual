// Рендер листа героев и локаций в PNG: node render_sheet.js <outdir> [scale]
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const out = process.argv[2] || '.';
  const scale = Number(process.argv[3] || 1);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: scale });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await page.goto('file://' + path.resolve(__dirname, 'sheet.html'));
  await page.waitForTimeout(300);
  await (await page.$('#chars')).screenshot({ path: path.join(out, 'sheet_characters.png') });
  await (await page.$('#locs')).screenshot({ path: path.join(out, 'sheet_locations.png') });
  await browser.close();
  console.log('ok');
})();
