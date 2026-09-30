// TEST-ONLY end-to-end booking against a LOCAL ClinicFlow API (never staging/production).
// Usage: node scripts/qa/e2e-booking.mjs http://localhost:3200 qa/e2e
// Needs: a site build with NEXT_PUBLIC_CLINICFLOW_API_URL=http://localhost:8088/api/v1 and
// NEXT_PUBLIC_CLINICFLOW_CLINIC_SLUG=dr-sindhu-dental-clinic; the API with SMS disabled (dry-run OTP 123456).
// Scenarios: 1) auto-popup after ~8s → full clinicflow booking with OTP; 2) doctors lookup blocked → enquiry
// fallback sends a real lead; 3) whole API blocked → WhatsApp fallback (link only, no success claimed).
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const [base = 'http://localhost:3200', out = 'qa/e2e'] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const results = [];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const click = async (page, text) => {
  const el = await page.waitForSelector(`[role=dialog] ::-p-text(${text})`, { timeout: 20000 });
  await el.click();
};
const shot = (page, name) => page.screenshot({ path: `${out}/${name}.png` });

async function walk(page, prefix, opts) {
  try {
    return await walkInner(page, prefix, opts);
  } catch (e) {
    await shot(page, `${prefix}-FAILED`);
    throw e;
  }
}

async function walkInner(page, prefix, { expectOtp, email, expectError }) {
  await click(page, 'Bleeding or swollen gums');
  await click(page, 'Continue');
  const day = await page.waitForSelector('[role=dialog] [role=listbox] [role=option]:nth-child(3)');
  await day.click();
  await wait(1200);
  await page.waitForSelector('[role=dialog] [role=radiogroup][aria-label=Time] [role=radio]', { timeout: 20000 });
  // A random free time, so repeated runs don't collide with earlier test bookings.
  const slots = await page.$$('[role=dialog] [role=radiogroup][aria-label=Time] [role=radio]');
  const slot = slots[1 + Math.floor(Math.random() * (slots.length - 1))];
  const slotText = await slot.evaluate((e) => e.textContent);
  await slot.click();
  await click(page, 'Continue');
  await page.waitForSelector('#bk-name');
  await wait(400); // the wizard moves focus to the step heading on the next frame
  await page.type('#bk-name', 'Test Patient');
  await page.type('#bk-phone', '9000000001');
  await page.type('#bk-email', email ?? `drsdc.e2e+${Date.now()}@example.com`);
  await page.click('[role=dialog] input[type=checkbox]');
  await shot(page, `${prefix}-details`);
  await page.click('[role=dialog] button[type=submit]');
  if (expectOtp) {
    await page.waitForSelector('#bk-otp', { timeout: 20000 });
    await wait(400);
    await page.type('#bk-otp', '123456');
    await shot(page, `${prefix}-otp`);
    await page.click('[role=dialog] button[type=submit]');
  }
  if (expectError) {
    const alert = await page.waitForSelector('[role=dialog] [role=alert]', { timeout: 30000 });
    const text = await alert.evaluate((e) => e.textContent);
    await shot(page, `${prefix}-error`);
    return { slotText, error: text, backOnDetails: !!(await page.$('#bk-name')) };
  }
  const h = await page.waitForFunction(() => {
    const t = document.querySelector('[role=dialog] h2')?.textContent ?? '';
    return /confirmed|received|Request sent|WhatsApp/.test(t) ? t : false;
  }, { timeout: 30000 });
  const heading = await h.jsonValue();
  await shot(page, `${prefix}-result`);
  const body = await page.$eval('[role=dialog]', (d) => d.innerText);
  return { slotText, heading, body: body.slice(0, 400) };
}

// 1) Auto-popup + full ClinicFlow booking
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const t0 = Date.now();
  await page.goto(`${base}/`, { waitUntil: 'load' });
  await page.waitForSelector('[role=dialog]', { timeout: 20000 });
  const openedAfter = Math.round((Date.now() - t0) / 100) / 10;
  await wait(2500); // health check
  await shot(page, '1-popup');
  const r = await walk(page, '1-clinicflow', { expectOtp: true });
  results.push({ scenario: 'clinicflow booking via auto-popup', popupOpenedAfterSeconds: openedAfter, ...r });
  // Same email again (it now has a patient login) → honest "email already registered" error, back on details.
  await page.click('[role=dialog] button[aria-label="Close booking"]');
  await page.click('header button[aria-haspopup=dialog]');
  await page.waitForSelector('[role=dialog]');
  await wait(2500);
  const again = await walk(page, '1b-email-taken', { expectOtp: true, email: 'drsdc.e2e.repeat@example.com', expectError: false }).catch((e) => ({ error: String(e) }));
  const dup = await (async () => {
    await page.click('[role=dialog] button[aria-label="Close booking"]');
    await page.click('header button[aria-haspopup=dialog]');
    await page.waitForSelector('[role=dialog]');
    await wait(2500);
    return walk(page, '1c-email-taken', { expectOtp: true, email: 'drsdc.e2e.repeat@example.com', expectError: true });
  })();
  results.push({ scenario: 'first booking with a fixed email', heading: again.heading ?? again.error });
  results.push({ scenario: 'second booking, same email → emailTaken message', ...dup });
  // popup must not auto-open again in the same session
  await page.keyboard.press('Escape');
  await page.goto(`${base}/about`, { waitUntil: 'load' });
  await wait(10000);
  results.push({ scenario: 'no second auto-open this session', dialogPresent: !!(await page.$('[role=dialog]')) });
  await page.close();
}

// 2) Enquiry fallback: the doctors lookup fails → site must switch to enquiry and send a real lead.
{
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setRequestInterception(true);
  page.on('request', (rq) => (/\/api\/clinicflow\/clinics\/[0-9a-f-]{36}\/doctors$/.test(rq.url()) ? rq.respond({ status: 503, contentType: 'application/json', body: '{"success":false,"error":{"code":"DOWN"}}' }) : rq.continue()));
  await page.goto(`${base}/`, { waitUntil: 'load' });
  await page.click('div.fixed button[aria-haspopup=dialog]'); // sticky mobile action bar
  await page.waitForSelector('[role=dialog]');
  await wait(2000);
  const note = await page.$eval('[role=dialog]', (d) => d.innerText.includes('appointment request'));
  const r = await walk(page, '2-enquiry', { expectOtp: false });
  results.push({ scenario: 'enquiry fallback (doctors API down)', modeNoteShown: note, ...r });
  await ctx.close();
}

// 3) API completely unreachable → WhatsApp link, never a success message.
{
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.setRequestInterception(true);
  page.on('request', (rq) => (/\/api\/clinicflow\/|localhost:8088/.test(rq.url()) ? rq.abort() : rq.continue()));
  await page.goto(`${base}/book?problem=toothache`, { waitUntil: 'load' });
  await wait(2500);
  const text = await page.$eval('main', (m) => m.innerText);
  results.push({ scenario: 'API unreachable → WhatsApp mode on /book (prefilled toothache)', showsWhatsAppNote: /open in WhatsApp/.test(text), startsAtDoctorStep: /Choose your doctor/.test(text) });
  await page.screenshot({ path: `${out}/3-whatsapp-book.png` });
  await ctx.close();
}

await browser.close();
fs.writeFileSync(`${out}/results.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
