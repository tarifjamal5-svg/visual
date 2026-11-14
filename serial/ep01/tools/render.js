// Рендер кадров серии в видео через Playwright + ffmpeg.
// node render.js <ep_dir> <out.mp4> [workers=3] [fps=30] [from=0] [to=duration]
// node render.js <ep_dir> --stills <outdir> t1 t2 ...   (контрольные кадры)
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function openPage(browser, ep) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await page.goto('file://' + path.resolve(ep, 'anim', 'episode.html'));
  await page.evaluate(() => window.ready);
  return page;
}

async function stills(ep, outdir, times) {
  fs.mkdirSync(outdir, { recursive: true });
  const browser = await chromium.launch();
  const page = await openPage(browser, ep);
  for (const t of times) {
    await page.evaluate(([t]) => window.renderFrame(t, Math.round(t * 30)), [t]);
    await page.screenshot({ path: path.join(outdir, `f_${t.toFixed(2)}.png`), clip: { x: 0, y: 0, width: 1080, height: 1920 } });
  }
  await browser.close();
}

async function renderRange(browser, ep, fps, f0, f1, outFile) {
  const page = await openPage(browser, ep);
  const cdp = await page.context().newCDPSession(page);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', '-r', String(fps), outFile], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = f0; f < f1; f++) {
    await page.evaluate(([t, n]) => window.renderFrame(t, n), [f / fps, f]);
    const shot = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 95, optimizeForSpeed: true, clip: { x: 0, y: 0, width: 1080, height: 1920, scale: 1 } });
    const buf = Buffer.from(shot.data, 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - f0) % 150 === 0) console.log(`[${path.basename(outFile)}] ${f - f0}/${f1 - f0} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await page.close();
}

(async () => {
  const ep = path.resolve(process.argv[2]);
  if (process.argv[3] === '--stills') {
    await stills(ep, process.argv[4], process.argv.slice(5).map(Number));
    return;
  }
  const out = path.resolve(process.argv[3]);
  const workers = Number(process.argv[4] || 3), fps = Number(process.argv[5] || 30);
  const browser = await chromium.launch();
  const probe = await openPage(browser, ep);
  const dur = await probe.evaluate(() => window.DURATION);
  await probe.close();
  const from = Number(process.argv[6] || 0), to = Number(process.argv[7] || dur);
  const F0 = Math.round(from * fps), F1 = Math.round(to * fps);
  const tmp = out + '.parts';
  fs.mkdirSync(tmp, { recursive: true });
  const per = Math.ceil((F1 - F0) / workers);
  const jobs = [];
  for (let w = 0; w < workers; w++) {
    const a = F0 + w * per, b = Math.min(F1, a + per);
    if (a < b) jobs.push(renderRange(browser, ep, fps, a, b, path.join(tmp, `part${w}.mp4`)));
  }
  await Promise.all(jobs);
  await browser.close();
  const list = jobs.map((_, w) => `file '${path.join(tmp, `part${w}.mp4`)}'`).join('\n');
  fs.writeFileSync(path.join(tmp, 'list.txt'), list);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'list.txt'), '-c', 'copy', out]);
  console.log('done', out);
})();
