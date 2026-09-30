import 'server-only';
import { Montserrat, Roboto } from 'next/font/google';
import { siteBrand } from './content';

// next/font must be declared statically; brand.json picks from this registry by name (max 2 fonts).
// display: 'swap' so the chosen fonts always appear (redesign, 30 Sep 2026). With 'optional', first-time visitors
// on slow connections kept the fallback font. next/font preloads both and uses metric-matched fallbacks.
// Headings and sub-headings: Roboto. Body text: Montserrat (owner's choice, 30 Sep 2026).
const roboto = Roboto({ subsets: ['latin'], weight: ['500', '700', '900'], variable: '--font-roboto', display: 'swap' });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-montserrat', display: 'swap' });

const registry: Record<string, { variable: string; cssVar: string; fallback: string }> = {
  Roboto: { variable: roboto.variable, cssVar: '--font-roboto', fallback: "system-ui, 'Segoe UI', Arial, sans-serif" },
  Montserrat: { variable: montserrat.variable, cssVar: '--font-montserrat', fallback: "system-ui, 'Segoe UI', Arial, sans-serif" },
};

function font(name: string) {
  const f = registry[name];
  if (!f) throw new Error(`brand.json font "${name}" is not registered in src/lib/theme.ts`);
  return f;
}

const heading = font(siteBrand.fonts.heading);
const body = font(siteBrand.fonts.body);

export const fontClassNames = [heading.variable, body.variable].join(' ');

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

/** :root CSS variables generated from brand.json (colours as "r g b" so Tailwind opacity modifiers work). */
export const themeCss = `:root{${Object.entries(siteBrand.colors)
  .map(([k, v]) => `--c-${k}:${hexToRgb(v)};`)
  .join('')}--radius:${siteBrand.radius};--font-heading:var(${heading.cssVar}),${heading.fallback};--font-body:var(${body.cssVar}),${body.fallback};}`;
