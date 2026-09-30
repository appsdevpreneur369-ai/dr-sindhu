// WCAG 2.x contrast check for every text/background pair the site uses. Run: npm run contrast
// Fails (exit 1) if any pair is below its minimum: 4.5:1 normal text, 3:1 large text (≥24px, or ≥18.66px bold) / UI.
// Colours named decorative* are checked as INFO only: they may never be used for text.
import fs from 'node:fs';

const { colors: c } = JSON.parse(fs.readFileSync(new URL('../content/brand.json', import.meta.url), 'utf8'));

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

// Semi-transparent glows behind text, blended exactly as the CSS draws them (worst case: full overlap).
const mix = (a, b, t) => '#' + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * t + parseInt(b.slice(i, i + 2), 16) * (1 - t)).toString(16).padStart(2, '0')).join('');
c.glowFooter = mix(c.primary, c.navy, 0.25);
c.glowSteps = mix(c.primary, c.navy, 0.3);
c.bannerMid = c.primary; // inner-page banner gradient: primaryDeep → primary → primaryHover (worst case: primary)

const N = 4.5; // normal text
const L = 3.0; // large text / UI components
// [foreground, background, minimum, where]
const pairs = [
  ['text', 'background', N, 'body text'],
  ['text', 'surfaceAlt', N, 'text on alternate sections'],
  ['text', 'sky', N, 'text on sky tints'],
  ['text', 'greenSoft', N, 'text on green tints'],
  ['textSecondary', 'background', N, 'muted text'],
  ['textSecondary', 'surfaceAlt', N, 'muted text on alternate sections'],
  ['textSecondary', 'sky', N, 'muted text on hero gradient'],
  ['textSecondary', 'greenSoft', N, 'muted text on hero gradient (green end)'],
  ['primary', 'background', N, 'links, stats numbers'],
  ['primary', 'surfaceAlt', N, 'links on alternate sections'],
  ['primary', 'sky', N, 'links / icons on sky'],
  ['primaryDeep', 'sky', N, 'hero badge, ghost button'],
  ['green', 'background', N, 'eyebrows, qualification'],
  ['green', 'surfaceAlt', N, 'eyebrows on alternate sections'],
  ['green', 'greenSoft', N, 'experience chip'],
  ['onDark', 'primary', N, 'blue buttons, banner text'],
  ['onDark', 'primaryHover', N, 'blue button hover'],
  ['onDark', 'primaryDeep', N, 'banner start, badges'],
  ['onDarkMuted', 'bannerMid', 3.0, 'banner breadcrumbs/intro (large-ish text, worst point of gradient)'],
  ['onDark', 'green', N, 'green buttons, step icons'],
  ['onDark', 'greenHover', N, 'green button hover'],
  ['onDark', 'whatsapp', N, 'WhatsApp button'],
  ['onDark', 'navy', N, 'footer, steps band, top bar'],
  ['onDarkMuted', 'navy', N, 'footer / steps text'],
  ['greenOnDark', 'navy', N, 'footer icons, eyebrow on navy'],
  ['onDarkMuted', 'glowFooter', N, 'footer text over the blue glow'],
  ['onDarkMuted', 'glowSteps', N, 'steps text over the blue glow'],
  ['primaryDeep', 'surface', N, 'light button text'],
  ['warningText', 'warningSoft', N, 'Draft badge'],
  ['warning', 'surface', N, 'closed-now, errors (no red)'],
  ['warning', 'sky', N, 'closed-now on sky'],
  ['success', 'surface', N, 'open now'],
  ['primary', 'skyStrong', L, 'UI: progress / rings (non-text)'],
  ['leaf', 'background', L, 'INFO: leaf green — decoration only, never text'],
];

let fail = 0;
for (const [fg, bg, min, where] of pairs) {
  if (!c[fg] || !c[bg]) throw new Error(`unknown colour ${fg} or ${bg}`);
  const r = ratio(c[fg], c[bg]);
  const info = where.startsWith('INFO');
  const ok = r >= min;
  if (!ok && !info) fail++;
  console.log(`${ok ? 'PASS' : info ? 'info' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1  (min ${min})  ${fg} ${c[fg]} on ${bg} ${c[bg]}  — ${where}`);
}
console.log(fail ? `\n${fail} pair(s) below WCAG AA` : '\nAll text pairs meet WCAG AA.');
process.exitCode = fail ? 1 : 0;
