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
c.glowFooter = mix(c.primary, c.dark, 0.4);
c.glowBooking = mix(c.primary, c.primaryDeep, 0.4);
c.glowTile = mix(c.primary, c.primaryDeep, 0.6);

const N = 4.5; // normal text
const L = 3.0; // large text / UI components
// [foreground, background, minimum, where]
const pairs = [
  ['text', 'background', N, 'body text'],
  ['text', 'surface', N, 'card text'],
  ['text', 'mint', N, 'text on mint tints (chips, summaries)'],
  ['text', 'sand', N, 'text on sand sections'],
  ['text', 'coralSoft', N, 'CTA band, mode notes'],
  ['textSecondary', 'background', N, 'muted text'],
  ['textSecondary', 'surface', N, 'muted text on cards'],
  ['textSecondary', 'mint', N, 'muted text on page header gradient'],
  ['textSecondary', 'sand', N, 'muted text on sand'],
  ['textSecondary', 'coralSoft', N, 'muted text on coral tint'],
  ['primary', 'background', N, 'links, eyebrows'],
  ['primary', 'surface', N, 'links on cards'],
  ['primary', 'mint', N, 'links / icons on mint'],
  ['primary', 'sand', N, 'eyebrow on sand'],
  ['primaryDeep', 'surface', N, 'ghost button text'],
  ['primaryDeep', 'mint', N, 'selected chips, avatars'],
  ['primaryDeep', 'sand', N, 'tile footer text on sand'],
  ['primaryDeep', 'coralSoft', N, 'tile footer text on coral tint'],
  ['surface', 'cta', N, 'coral CTA button'],
  ['surface', 'ctaHover', N, 'coral CTA hover'],
  ['surface', 'primary', N, 'primary button'],
  ['surface', 'primaryHover', N, 'primary button hover'],
  ['surface', 'whatsapp', N, 'WhatsApp button'],
  ['surface', 'primaryDeep', N, 'WhatsApp hover'],
  ['ctaHover', 'coralSoft', N, 'Draft badge, Clinic Head chip (text)'],
  ['cta', 'coralSoft', L, 'UI: coral icons on coral tint (non-text)'],
  ['cta', 'surface', N, 'coral text on white'],
  ['onDark', 'dark', N, 'footer headings/links'],
  ['onDarkMuted', 'dark', N, 'footer text'],
  ['coralOnDark', 'dark', N, 'footer icons, Draft badge on dark'],
  ['onDark', 'primaryDeep', N, 'booking band, dark tile'],
  ['onDarkMuted', 'primaryDeep', N, 'booking band text'],
  ['coralOnDark', 'primaryDeep', N, 'booking band eyebrow'],
  ['onDarkMuted', 'glowFooter', N, 'footer text over the blurred primary glow (primary 40% on dark)'],
  ['onDark', 'glowFooter', N, 'footer links over the glow'],
  ['onDarkMuted', 'glowBooking', N, 'booking band text over its glow (primary 40% on primaryDeep)'],
  ['onDark', 'glowTile', N, 'dark bento tile text over its circle (primary 60% on primaryDeep)'],
  ['dark', 'coralOnDark', N, 'step numbers'],
  ['success', 'surface', N, 'open now'],
  ['success', 'mint', N, 'open now on mint'],
  ['danger', 'surface', N, 'closed now, errors'],
  ['danger', 'mint', N, 'closed now on mint'],
  ['primary', 'mintStrong', L, 'UI: avatar ring/progress (non-text)'],
  ['border', 'surface', 1.0, 'INFO: hairline borders (decorative)'],
  ['decorativeCoral', 'background', L, 'INFO: decorative coral — never text'],
  ['decorativeSage', 'background', L, 'INFO: decorative sage — never text'],
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
