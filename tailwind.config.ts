import type { Config } from 'tailwindcss';
import brand from './content/brand.json';

// Every colour is a CSS variable generated from content/brand.json (src/lib/theme.ts). Never hard-code a hex in a component.
const colors = Object.fromEntries(Object.keys(brand.colors).map((k) => [k, `rgb(var(--c-${k}) / <alpha-value>)`]));

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    screens: { xs: '400px', sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
    extend: {
      colors,
      fontFamily: { heading: ['var(--font-heading)'], body: ['var(--font-body)'] },
      borderRadius: { brand: 'var(--radius)' },
      maxWidth: { site: '76rem', prose: '42rem' },
      boxShadow: {
        soft: '0 1px 2px rgb(var(--c-text) / 0.04), 0 8px 24px -12px rgb(var(--c-text) / 0.18)',
        lift: '0 2px 4px rgb(var(--c-text) / 0.05), 0 18px 40px -18px rgb(var(--c-primaryDeep) / 0.35)',
      },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'none' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      },
      animation: { 'fade-up': 'fade-up .5s ease-out both', float: 'float 6s ease-in-out infinite' },
    },
  },
  plugins: [],
};
export default config;
