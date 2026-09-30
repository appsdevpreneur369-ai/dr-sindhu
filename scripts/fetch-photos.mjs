// Downloads the site's stock photographs (Unsplash License: free to use, no attribution required — credits are
// still recorded in content/photo-credits.json). These are REPRESENTATIVE images, not photos of this clinic or its
// doctors; replace them with the clinic's own photos when available (docs/EDITING.md).
// Run: node scripts/fetch-photos.mjs   (needs internet; only run when changing the selection)
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
// id → [output file, width, height]
const PHOTOS = {
  fBiJxs5GhaM: ['hero.jpg', 1200, 1400],
  e7MJLM5VGjY: ['about.jpg', 1400, 1050],
  lilsT4lhaLQ: ['treat-gum-care.jpg', 1200, 800],
  '8BkF0sTC6Uo': ['treat-general-dentistry.jpg', 1200, 800],
  QWgq6Rjw0SE: ['treat-root-canal-treatment.jpg', 1200, 800],
  y8fWicGsv4g: ['treat-oral-surgery.jpg', 1200, 800],
  W9YEY6G8LVM: ['treat-dental-implants.jpg', 1200, 800],
  oZKmP9VdvB0: ['treat-oral-hygiene.jpg', 1200, 800],
  '1AhGNGKuhR0': ['treat-cosmetic-dentistry.jpg', 1200, 800],
  LOgBp87WzIk: ['treat-dentures.jpg', 1200, 800],
  B9lLokDYTMY: ['treat-orthodontics.jpg', 1200, 800],
  B_sK_xgzwVA: ['gallery-reception.jpg', 1200, 900],
  vVKh9xeLub4: ['gallery-treatment-room.jpg', 1200, 900],
  Pc8lpKJwecM: ['gallery-chair.jpg', 1200, 900],
  R8MoN4FV5q0: ['gallery-instruments.jpg', 1200, 900],
  DwlC4fija6o: ['gallery-xray.jpg', 1200, 900],
  Fdku_oMrDvk: ['gallery-modern-chair.jpg', 1200, 900],
  '2nV0wnVubAA': ['article-gums-heart.jpg', 1200, 750],
  kQF6yN9Ek0U: ['article-extraction.jpg', 1200, 750],
  spLCJw0kUk8: ['article-root-canal.jpg', 1200, 750],
  'ys-bNF00aeQ': ['article-deep-cleaning.jpg', 1200, 750],
};

const outDir = path.join(root, 'public', 'images', 'photos');
fs.mkdirSync(outDir, { recursive: true });
const credits = {};
for (const [id, [file, w, h]] of Object.entries(PHOTOS)) {
  const info = await (await fetch(`https://unsplash.com/napi/photos/${id}`, { headers: { Accept: 'application/json' } })).json();
  if (info.premium || info.plus) throw new Error(`${id} is a premium photo — not allowed`);
  const img = Buffer.from(await (await fetch(`${info.urls.raw}&w=${w}&h=${h}&fit=crop&crop=faces,entropy&q=80&fm=jpg`)).arrayBuffer());
  await sharp(img).resize(w, h, { fit: 'cover' }).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(outDir, file));
  credits[file] = { source: 'Unsplash', license: 'Unsplash License', id, photographer: info.user?.name ?? '', url: info.links?.html ?? '', description: info.alt_description ?? '' };
  console.log(file, info.user?.name);
}
fs.writeFileSync(path.join(root, 'content', 'photo-credits.json'), `${JSON.stringify({ _note: 'Representative stock photos (Unsplash License). Not photos of this clinic or its doctors.', photos: credits }, null, 2)}\n`);
