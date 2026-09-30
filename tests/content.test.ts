import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { checkReferences, ContentError, FILES, parseAll, parseFile, type RawContent } from '@/lib/content/load';
import { ArticleFrontmatter, ClinicSchema, LegalFrontmatter } from '@/lib/content/schemas';

const dir = path.join(__dirname, '..', 'content');
const read = (f: string) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
const raw = () => Object.fromEntries(Object.keys(FILES).map((f) => [f, read(f)])) as RawContent;

describe('content schema', () => {
  it('every content file parses and all cross-references resolve', () => {
    expect(() => parseAll(raw())).not.toThrow();
  });

  it('a bad field fails with the file and field named', () => {
    const r = raw();
    (r['clinic.json'] as { hours: { days: { sessions: { opens: string }[] }[] } }).hours.days[0].sessions[0].opens = '25:00';
    expect(() => parseAll(r)).toThrowError(/content\/clinic\.json: hours\.days\.0\.sessions\.0\.opens/);
  });

  it('an unknown doctor id in services.json is caught', () => {
    const r = raw();
    (r['services.json'] as { categories: { doctors: string[] }[] }).categories[0].doctors = ['dr-nobody'];
    expect(() => parseAll(r)).toThrowError(ContentError);
  });

  it('an approved phone must be a real +91 mobile; placeholders may be anything', () => {
    const c = parseAll(raw());
    const bad = structuredClone(c);
    bad['clinic.json'].phone = { status: 'approved', display: '+91 XXXXX XXXXX', e164: '+91XXXXXXXXXX' };
    expect(checkReferences(bad).join()).toMatch(/approved phone/);
    const ok = structuredClone(c);
    ok['clinic.json'].phone = { status: 'placeholder', display: '+91 XXXXX XXXXX', e164: '+91XXXXXXXXXX' };
    expect(checkReferences(ok)).toEqual([]);
  });

  it('PIN is empty or 6 digits', () => {
    const c = read('clinic.json');
    c.address.postalCode = '5225';
    expect(() => parseFile('clinic.json', ClinicSchema, c)).toThrow(/postalCode/);
  });

  it('articles and legal pages have valid frontmatter, slug = file name, and real HTML text', () => {
    for (const [sub, schema] of [['education', ArticleFrontmatter], ['legal', LegalFrontmatter]] as const) {
      const files = fs.readdirSync(path.join(dir, sub)).filter((f) => f.endsWith('.md'));
      expect(files.length).toBeGreaterThan(0);
      for (const f of files) {
        const { data, content } = matter(fs.readFileSync(path.join(dir, sub, f), 'utf8'));
        const meta = parseFile(`${sub}/${f}`, schema, data);
        expect(`${meta.slug}.md`).toBe(f);
        expect(content.split(/\s+/).length).toBeGreaterThan(150);
      }
    }
  });

  it('includes the required patient education and the four legal pages; privacy mentions the DPDP Act 2023', () => {
    expect(fs.existsSync(path.join(dir, 'education', 'healthy-gums-healthy-heart.md'))).toBe(true);
    expect(fs.readdirSync(path.join(dir, 'education')).length).toBeGreaterThanOrEqual(3);
    for (const l of ['privacy', 'terms', 'disclaimer', 'cookies']) expect(fs.existsSync(path.join(dir, 'legal', `${l}.md`))).toBe(true);
    expect(fs.readFileSync(path.join(dir, 'legal', 'privacy.md'), 'utf8')).toMatch(/Digital Personal Data Protection Act, 2023/);
  });

  it('no content mentions the other Tadepalli clinic', () => {
    const all = [...Object.keys(FILES).map((f) => fs.readFileSync(path.join(dir, f), 'utf8')), ...['education', 'legal'].flatMap((s) => fs.readdirSync(path.join(dir, s)).map((f) => fs.readFileSync(path.join(dir, s, f), 'utf8')))];
    for (const text of all) expect(text.toLowerCase()).not.toContain('suhasini');
  });

  it('never publishes prices or invented stats', () => {
    const home = read('home.json');
    expect(home.stats.items).toEqual([]);
    expect(home.beforeAfter.items).toEqual([]);
    const services = JSON.stringify(read('services.json'));
    expect(services).not.toMatch(/₹|Rs\.?\s?\d|INR/);
  });
});
