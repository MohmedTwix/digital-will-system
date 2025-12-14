const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const outDir = path.join(__dirname, '..', 'docs', 'screenshots');
  fs.mkdirSync(outDir, { recursive: true });

  // Pages to capture (served via Live Server or local server)
  const base = process.env.BASE_URL || 'http://127.0.0.1:5500';
  const pages = [
    { url: '/login.html', name: 'login' },
    { url: '/index.html', name: 'dashboard' },
    { url: '/record.html', name: 'record' },
    { url: '/numbers.html', name: 'numbers' },
    { url: '/email.html', name: 'email' }
  ];

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  for (const p of pages) {
    const url = base + p.url;
    console.log('Capturing', url);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Wait small extra time for scripts to finish
      await page.waitForTimeout(800);

      // If page has a login flow, attempt a demo login for dashboard
      if (p.name === 'dashboard') {
        // nothing; index.html shows dashboard when logged in via real app
      }

      const file = path.join(outDir, `${p.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log('Saved', file);
    } catch (err) {
      console.error('Failed to capture', url, err.message);
    }
  }

  await browser.close();
  console.log('Done. Screenshots are in', outDir);
})();
