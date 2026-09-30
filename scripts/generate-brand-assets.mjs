// Builds web assets from the logo masters in images/ and draws placeholder illustrations in brand.json colours.
// Run: npm run brand   (re-run after replacing the logo files or changing colours)
// Outputs: public/brand/logo-mark.png, (public/brand/logo-title.png only if logo.full is set), src/app/icon.png, src/app/apple-icon.png,
//          src/app/favicon.ico, public/images/og.png, public/images/illustrations/*.webp, public/images/gallery/*.webp
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const read = (f) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const { colors: c } = read('content/brand.json');
const images = read('content/images.json');
const clinic = read('content/clinic.json');
const out = (p) => {
  const full = path.join(root, p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  return full;
};

// ---------- Logo ----------
const markSrc = path.join(root, images.logo.source.src);
const mark = sharp(markSrc).trim();
const markBuf = await mark.png().toBuffer();
const markMeta = await sharp(markBuf).metadata();
await sharp(markBuf).resize({ width: 512 }).png({ compressionLevel: 9, palette: false }).toFile(out('public/brand/logo-mark.png'));
const markOut = await sharp(out('public/brand/logo-mark.png')).metadata();
console.log(`logo-mark ${markOut.width}x${markOut.height} (from ${markMeta.width}x${markMeta.height})`);
// The logo-with-name is published only when images.json has logo.full (the supplied artwork shows a different
// clinic name, so it is deliberately not published). Remove any stale copy.
if (images.logo.full && images.logo.sourceTitle) {
  const titleBuf = await sharp(path.join(root, images.logo.sourceTitle.src)).trim().png().toBuffer();
  await sharp(titleBuf).png({ compressionLevel: 9 }).toFile(out(`public${images.logo.full.src}`));
} else {
  fs.rmSync(path.join(root, 'public/brand/logo-title.png'), { force: true });
}

// Square icons: the mark centred on transparent (icon) or on the warm background (apple-icon, needs opaque).
async function squareIcon(size, bg, pad) {
  const inner = Math.round(size * (1 - pad * 2));
  const m = await sharp(markBuf).resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: bg } }).composite([{ input: m, gravity: 'center' }]).png().toBuffer();
}
const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
const hexRgb = (h) => ({ r: parseInt(h.slice(1, 3), 16), g: parseInt(h.slice(3, 5), 16), b: parseInt(h.slice(5, 7), 16), alpha: 1 });
fs.writeFileSync(out('src/app/icon.png'), await squareIcon(512, transparent, 0.04));
fs.writeFileSync(out('src/app/apple-icon.png'), await squareIcon(180, hexRgb(c.background), 0.1));
// favicon.ico with embedded 16/32/48 PNGs.
const icoSizes = [16, 32, 48];
const pngs = await Promise.all(icoSizes.map((s) => squareIcon(s, transparent, 0)));
const header = Buffer.alloc(6 + 16 * pngs.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);
let offset = header.length;
pngs.forEach((p, i) => {
  const o = 6 + i * 16;
  header.writeUInt8(icoSizes[i] % 256, o);
  header.writeUInt8(icoSizes[i] % 256, o + 1);
  header.writeUInt16LE(1, o + 4);
  header.writeUInt16LE(32, o + 6);
  header.writeUInt32LE(p.length, o + 8);
  header.writeUInt32LE(offset, o + 12);
  offset += p.length;
});
fs.writeFileSync(out('src/app/favicon.ico'), Buffer.concat([header, ...pngs]));

// ---------- Illustration kit (SVG in brand colours) ----------
const TOOTH = 'M0,-110 C45,-140 95,-120 105,-70 C115,-20 95,20 80,60 C70,95 65,140 45,150 C25,160 20,110 10,80 C5,65 -5,65 -10,80 C-20,110 -25,160 -45,150 C-65,140 -70,95 -80,60 C-95,20 -115,-20 -105,-70 C-95,-120 -45,-140 0,-110 Z';
const LEAF = 'M0,0 C30,-44 84,-46 116,-12 C84,22 30,26 0,0 Z';
const tooth = (x, y, s, fill = '#FFFFFF', stroke = c.primary) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="${TOOTH}" fill="${fill}" stroke="${stroke}" stroke-width="${6 / s}" stroke-linejoin="round"/><path d="M-60,-70 C-40,-95 -10,-98 10,-88" fill="none" stroke="${c.mintStrong}" stroke-width="${10 / s}" stroke-linecap="round"/></g>`;
const leaf = (x, y, s, rot, fill = c.decorativeSage) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="${LEAF}" fill="${fill}"/><path d="M6,0 C40,-8 80,-10 108,-12" stroke="${c.primary}" stroke-width="3" fill="none" opacity=".5"/></g>`;
const sparkle = (x, y, s, fill = c.decorativeCoral) =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M0,-20 C3,-5 5,-3 20,0 C5,3 3,5 0,20 C-3,5 -5,3 -20,0 C-5,-3 -3,-5 0,-20 Z" fill="${fill}"/>`;
const blob = (x, y, r, fill, op = 1) =>
  `<path transform="translate(${x} ${y}) scale(${r / 100})" d="M60,-72 C88,-50 104,-8 92,34 C80,76 40,104 -6,102 C-52,100 -92,70 -100,26 C-108,-18 -86,-62 -48,-84 C-10,-106 32,-94 60,-72 Z" fill="${fill}" opacity="${op}"/>`;
const bg = (w, h, from = c.mint, to = c.background) =>
  `<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#bg)"/>`;
const dots = (w, h, fill = c.primary) => {
  let s = '';
  for (let x = 40; x < w; x += 48) for (let y = 40; y < h; y += 48) s += `<circle cx="${x}" cy="${y}" r="2" fill="${fill}" opacity=".08"/>`;
  return s;
};
const tag = (w, h, text) =>
  `<g transform="translate(${w - 40} ${h - 40})"><rect x="${-(text.length * 13 + 36)}" y="-44" width="${text.length * 13 + 36}" height="44" rx="22" fill="${c.surface}" opacity=".92"/><text x="-18" y="-15" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="600" fill="${c.primaryDeep}">${text}</text></g>`;
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;

const scenes = {
  // Hero: deliberately NOT a tooth (keeps DRSDC visually distinct from other local clinic sites) — layered
  // gum-line hills, a coral sun and a leaf sprig growing from healthy ground: "healthy gums first".
  'public/images/illustrations/hero.webp': [1200, 1350, (w, h) =>
    bg(w, h, c.coralSoft, c.mint) + dots(w, h) +
    `<circle cx="820" cy="400" r="210" fill="${c.decorativeCoral}" opacity=".55"/><circle cx="820" cy="400" r="140" fill="${c.coralSoft}" opacity=".9"/>` +
    `<path d="M0,900 C220,800 420,820 620,880 C820,940 1000,860 1200,780 V1350 H0 Z" fill="${c.decorativeSage}" opacity=".55"/>` +
    `<path d="M0,1010 C260,930 520,990 760,1030 C940,1060 1080,1000 1200,960 V1350 H0 Z" fill="${c.primary}" opacity=".85"/>` +
    `<path d="M0,1140 C300,1080 620,1150 900,1160 C1040,1165 1130,1130 1200,1110 V1350 H0 Z" fill="${c.primaryDeep}"/>` +
    // leaf sprig
    `<path d="M600,1020 C590,900 600,760 640,620" stroke="${c.primaryDeep}" stroke-width="12" fill="none" stroke-linecap="round"/>` +
    leaf(630, 820, 2.1, -150, c.decorativeSage) + leaf(612, 900, 1.8, -20, c.primary) + leaf(640, 690, 1.9, -60, c.primary) + leaf(626, 760, 1.5, -130, c.decorativeSage) +
    sparkle(300, 330, 1.8, c.primary) + sparkle(1010, 700, 1.3, c.surface) + sparkle(220, 760, 1.1, c.decorativeCoral) + sparkle(960, 220, 1, c.primary)],
  'public/images/illustrations/about.webp': [1200, 900, (w, h) =>
    bg(w, h, c.sand, c.mint) + dots(w, h) +
    `<rect x="700" y="90" width="380" height="300" rx="28" fill="${c.surface}" opacity=".85"/><path d="M890,90 V390 M700,240 H1080" stroke="${c.mintStrong}" stroke-width="10"/>` +
    `<rect x="120" y="640" width="960" height="24" rx="12" fill="${c.primaryDeep}" opacity=".15"/>` +
    // dental chair
    `<path d="M300,600 C300,520 330,470 400,460 L640,440 C690,436 720,470 700,510 L660,580 C650,600 630,610 610,610 L340,620 C318,620 300,612 300,600 Z" fill="${c.primary}"/>` +
    `<path d="M640,445 C650,380 690,330 740,320 C770,316 780,340 770,360 L720,450 Z" fill="${c.primaryHover}"/>` +
    `<rect x="510" y="610" width="40" height="40" fill="${c.primaryDeep}"/><rect x="360" y="640" width="200" height="16" rx="8" fill="${c.primaryDeep}"/>` +
    // lamp
    `<path d="M560,180 C640,180 700,220 720,300" stroke="${c.text}" stroke-width="10" fill="none" opacity=".55"/><ellipse cx="540" cy="190" rx="70" ry="34" fill="${c.decorativeCoral}"/><ellipse cx="540" cy="200" rx="40" ry="14" fill="${c.surface}"/>` +
    leaf(180, 520, 1.3, -60) + leaf(200, 560, 1.1, -110, c.primary) + `<rect x="150" y="560" width="90" height="90" rx="16" fill="${c.decorativeCoral}" opacity=".8"/>` + sparkle(980, 520, 1.3)],
  'public/images/illustrations/gums-heart.webp': [1200, 750, (w, h) =>
    bg(w, h, c.coralSoft, c.mint) + dots(w, h) + blob(340, 380, 220, c.surface, 0.6) + blob(860, 380, 220, c.surface, 0.6) + tooth(340, 380, 1.6) +
    `<path transform="translate(860 360) scale(1.9)" d="M0,40 C-60,0 -80,-30 -60,-58 C-40,-84 -8,-72 0,-48 C8,-72 40,-84 60,-58 C80,-30 60,0 0,40 Z" fill="${c.decorativeCoral}"/>` +
    `<path d="M500,380 C580,300 640,300 700,370" stroke="${c.primary}" stroke-width="8" stroke-dasharray="4 18" stroke-linecap="round" fill="none"/>` +
    `<path d="M500,420 C580,500 640,500 700,430" stroke="${c.primary}" stroke-width="8" stroke-dasharray="4 18" stroke-linecap="round" fill="none" opacity=".6"/>` + leaf(420, 250, 1, -30) + sparkle(1000, 180, 1.2, c.primary)],
  'public/images/illustrations/extraction.webp': [1200, 750, (w, h) =>
    bg(w, h, c.mint, c.sand) + dots(w, h) + blob(600, 380, 280, c.surface, 0.55) +
    `<rect x="330" y="250" width="260" height="220" rx="26" fill="${c.surface}" stroke="${c.mintStrong}" stroke-width="8"/><path d="M360,300 H560 M360,340 H560 M360,380 H560 M360,420 H560" stroke="${c.mintStrong}" stroke-width="6"/>` +
    `<rect x="640" y="230" width="240" height="260" rx="60" fill="${c.decorativeSage}"/><rect x="700" y="200" width="120" height="50" rx="18" fill="${c.primary}"/>` +
    sparkle(930, 240, 1.4, c.surface) + sparkle(900, 540, 1, c.decorativeCoral) + tooth(260, 560, 0.5)],
  'public/images/illustrations/root-canal.webp': [1200, 750, (w, h) =>
    bg(w, h, c.sand, c.mint) + dots(w, h) + blob(600, 380, 300, c.surface, 0.55) + tooth(600, 380, 2) +
    `<path d="M600,250 C585,330 560,420 520,560 M600,250 C615,330 640,420 680,560" stroke="${c.decorativeCoral}" stroke-width="12" fill="none" stroke-linecap="round"/>` +
    `<ellipse cx="600" cy="260" rx="70" ry="40" fill="${c.coralSoft}" stroke="${c.decorativeCoral}" stroke-width="6"/>` + sparkle(860, 200, 1.3, c.primary) + leaf(320, 520, 1, -20)],
  'public/images/illustrations/deep-cleaning.webp': [1200, 750, (w, h) =>
    bg(w, h, c.mint, c.coralSoft) + dots(w, h) +
    `<path d="M0,560 C200,500 400,600 600,540 C800,480 1000,580 1200,520 V750 H0 Z" fill="${c.decorativeCoral}" opacity=".45"/>` +
    [240, 420, 600, 780, 960].map((x) => tooth(x, 420, 0.8)).join('') +
    `<g transform="rotate(-18 600 200)"><rect x="300" y="170" width="560" height="36" rx="18" fill="${c.primary}"/><rect x="800" y="120" width="120" height="60" rx="10" fill="${c.surface}" stroke="${c.primary}" stroke-width="6"/></g>` + sparkle(1060, 160, 1.3, c.primary)],
};

const gallery = [
  ['reception', (w, h) => `<rect x="160" y="520" width="520" height="130" rx="40" fill="${c.primary}"/><rect x="190" y="440" width="460" height="110" rx="40" fill="${c.primaryHover}"/><rect x="760" y="380" width="300" height="270" rx="24" fill="${c.surface}" stroke="${c.mintStrong}" stroke-width="8"/><rect x="790" y="330" width="240" height="60" rx="14" fill="${c.decorativeCoral}"/>` + leaf(110, 440, 1.2, -70) + leaf(120, 480, 1, -120, c.primary)],
  ['chair', (w, h) => `<path d="M300,600 C300,520 330,470 400,460 L640,440 C690,436 720,470 700,510 L660,580 C650,600 630,610 610,610 L340,620 C318,620 300,612 300,600 Z" fill="${c.primary}"/><path d="M640,445 C650,380 690,330 740,320 C770,316 780,340 770,360 L720,450 Z" fill="${c.primaryHover}"/><rect x="510" y="610" width="40" height="60" fill="${c.primaryDeep}"/><path d="M820,160 C860,220 860,300 820,360" stroke="${c.text}" stroke-width="10" fill="none" opacity=".5"/><ellipse cx="790" cy="150" rx="70" ry="34" fill="${c.decorativeCoral}"/>`],
  ['sterilisation', (w, h) => `<rect x="300" y="300" width="400" height="300" rx="30" fill="${c.surface}" stroke="${c.primary}" stroke-width="10"/><circle cx="500" cy="450" r="90" fill="${c.mint}" stroke="${c.primary}" stroke-width="10"/><rect x="760" y="360" width="140" height="240" rx="14" fill="${c.coralSoft}" stroke="${c.decorativeCoral}" stroke-width="6"/><rect x="920" y="380" width="120" height="220" rx="14" fill="${c.coralSoft}" stroke="${c.decorativeCoral}" stroke-width="6"/>` + sparkle(250, 250, 1.3, c.primary)],
  ['xray', (w, h) => `<rect x="260" y="200" width="680" height="440" rx="30" fill="${c.primaryDeep}"/><rect x="290" y="230" width="620" height="380" rx="16" fill="${c.dark}"/>` + [440, 560, 680, 800].map((x) => tooth(x - 40, 420, 0.55, '#DDE9E3', '#DDE9E3')).join('') + `<rect x="560" y="640" width="80" height="50" fill="${c.primaryDeep}"/>`],
  ['consult', (w, h) => `<rect x="240" y="440" width="720" height="40" rx="20" fill="${c.primary}"/><rect x="300" y="480" width="30" height="170" fill="${c.primaryDeep}"/><rect x="870" y="480" width="30" height="170" fill="${c.primaryDeep}"/><rect x="480" y="300" width="240" height="140" rx="14" fill="${c.surface}" stroke="${c.mintStrong}" stroke-width="8"/>` + tooth(600, 370, 0.35) + `<circle cx="180" cy="420" r="60" fill="${c.decorativeCoral}" opacity=".8"/><circle cx="1020" cy="420" r="60" fill="${c.decorativeSage}"/>`],
  ['kids', (w, h) => tooth(420, 420, 1.4) + `<circle cx="380" cy="400" r="10" fill="${c.text}"/><circle cx="460" cy="400" r="10" fill="${c.text}"/><path d="M380,450 C400,480 440,480 460,450" stroke="${c.text}" stroke-width="8" fill="none" stroke-linecap="round"/><rect x="700" y="480" width="120" height="120" rx="18" fill="${c.decorativeCoral}"/><rect x="840" y="520" width="80" height="80" rx="14" fill="${c.decorativeSage}"/><circle cx="820" cy="420" r="50" fill="${c.primary}"/>` + sparkle(900, 260, 2, c.decorativeCoral) + sparkle(700, 300, 1.2, c.primary)],
];
for (const [name, draw] of gallery) {
  scenes[`public/images/gallery/${name}.webp`] = [1200, 900, (w, h) => bg(w, h, c.mint, c.sand) + dots(w, h) + blob(600, 450, 380, c.surface, 0.5) + draw(w, h) + tag(w, h, 'Photo coming soon')];
}

for (const [file, [w, h, draw]] of Object.entries(scenes)) {
  await sharp(Buffer.from(svg(w, h, draw(w, h)))).webp({ quality: 80 }).toFile(out(file));
}

// ---------- Open Graph image (1200x630) ----------
const ogMark = await sharp(markBuf).resize({ height: 270 }).png().toBuffer();
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const ogSvg = svg(1200, 630,
  bg(1200, 630, c.background, c.mint) + dots(1200, 630) + blob(1050, 120, 220, c.coralSoft, 0.9) + blob(1080, 560, 160, c.decorativeSage, 0.35) +
  `<text x="510" y="250" font-family="Georgia, 'Times New Roman', serif" font-size="68" font-weight="700" fill="${c.text}">${esc(clinic.name.value.replace(' Dental Clinic', ''))}</text>` +
  `<text x="510" y="330" font-family="Georgia, 'Times New Roman', serif" font-size="56" fill="${c.primaryDeep}">Dental Clinic</text>` +
  `<rect x="510" y="370" width="80" height="6" rx="3" fill="${c.decorativeCoral}"/>` +
  `<text x="510" y="440" font-family="Segoe UI, Arial, sans-serif" font-size="32" fill="${c.textSecondary}">${esc(`${clinic.address.street}, ${clinic.address.locality}`)}</text>` +
  `<text x="510" y="490" font-family="Segoe UI, Arial, sans-serif" font-size="28" fill="${c.primary}">Gum care · Root canal · Oral surgery</text>`);
await sharp(Buffer.from(ogSvg)).composite([{ input: ogMark, left: 110, top: 180 }]).png({ compressionLevel: 9 }).toFile(out('public/images/og.png'));

console.log('brand assets written');
