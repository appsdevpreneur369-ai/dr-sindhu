// Before/after screenshots for the 1 Oct 2026 fixes. Usage: node scripts/qa/fix-shots.mjs <base> <outDir>
// Captures: nav active state after a mouse click (desktop, scrolled, mobile menu), About hero, Dr. Sindhu page,
// home doctor card, top bar + hero chip at 360 and 1280 px. Also reports the active link's computed outline/box.
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const [base, out] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function page(width, height = 900, mobile = false) {
  const p = await browser.newPage();
  await p.setViewport({ width, height, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
  await p.evaluateOnNewDocument(() => sessionStorage.setItem('drsdc.bookingPopup', 'closed'));
  return p;
}
const activeStyle = (p) =>
  p.evaluate(() => {
    const a = document.activeElement;
    const cur = document.querySelector('nav[aria-label="Main"] a[aria-current="page"]');
    const s = cur ? getComputedStyle(cur) : null;
    return { focused: a?.tagName + ' ' + (a?.textContent || '').trim().slice(0, 20), outline: s && `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}`, border: s && s.borderWidth, boxShadow: s && s.boxShadow };
  });

// 1) Desktop: click "Treatments" with the mouse, then shoot the header (top + scrolled).
{
  const p = await page(1280);
  await p.goto(`${base}/`, { waitUntil: 'load' });
  await p.click('nav[aria-label="Main"] a[href="/treatments"]');
  await p.waitForFunction(() => location.pathname === '/treatments');
  await wait(1200);
  console.log('after click on Treatments:', JSON.stringify(await activeStyle(p)));
  await p.screenshot({ path: `${out}/nav-desktop-after-click.png`, clip: { x: 0, y: 0, width: 1280, height: 140 } });
  await p.evaluate(() => window.scrollTo(0, 600));
  await wait(500);
  await p.screenshot({ path: `${out}/nav-desktop-scrolled.png`, clip: { x: 0, y: 0, width: 1280, height: 110 } });
  // Keyboard: Tab onto a nav link to show the focus-visible indicator.
  await p.goto(`${base}/about`, { waitUntil: 'load' });
  for (let i = 0; i < 12; i++) {
    await p.keyboard.press('Tab');
    const t = await p.evaluate(() => document.activeElement?.textContent?.trim());
    if (t === 'Treatments') break;
  }
  await p.screenshot({ path: `${out}/nav-desktop-keyboard-focus.png`, clip: { x: 0, y: 0, width: 1280, height: 140 } });
  await p.close();
}
// 2) Mobile menu (360) on /about after tapping.
{
  const p = await page(360, 780, true);
  await p.goto(`${base}/about`, { waitUntil: 'load' });
  await p.tap('button[aria-controls="mobile-menu"]');
  await wait(400);
  await p.screenshot({ path: `${out}/nav-mobile-menu-360.png` });
  await p.close();
}
// 3) Top bar + hero chip, home doctor card, About hero, Dr. Sindhu page.
for (const w of [360, 1280]) {
  const p = await page(w, 900, w < 500);
  await p.goto(`${base}/`, { waitUntil: 'load' });
  await wait(1500);
  await p.screenshot({ path: `${out}/home-top-${w}.png` });
  const card = await p.$('ul[aria-label="Doctors"] li');
  await card.scrollIntoView();
  await wait(1200);
  await card.screenshot({ path: `${out}/home-doctor-card-${w}.png` });
  await p.goto(`${base}/about`, { waitUntil: 'load' });
  await wait(1200);
  await p.screenshot({ path: `${out}/about-hero-${w}.png` });
  await p.goto(`${base}/doctors/dr-sindhu`, { waitUntil: 'load' });
  await wait(1200);
  await p.screenshot({ path: `${out}/doctor-sindhu-${w}.png`, fullPage: w < 500 ? false : false });
  await p.close();
}
for (const w of [390, 768, 1024, 1440]) {
  const p = await page(w, 300, w < 500);
  await p.goto(`${base}/`, { waitUntil: 'load' });
  await wait(800);
  const bar = await p.evaluate(() => {
    const b = document.querySelector('.bg-navy');
    const r = b?.getBoundingClientRect();
    return { visible: !!b && getComputedStyle(b).display !== 'none', height: r ? Math.round(r.height) : 0, overflow: document.documentElement.scrollWidth - innerWidth };
  });
  console.log(`top bar @${w}:`, JSON.stringify(bar));
  await p.screenshot({ path: `${out}/topbar-${w}.png`, clip: { x: 0, y: 0, width: w, height: 160 } });
  await p.close();
}
await browser.close();
