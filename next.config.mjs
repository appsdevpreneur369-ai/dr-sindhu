import fs from 'node:fs';
import { buildRedirects } from './src/lib/site-redirects.mjs';

const readJson = (f) => JSON.parse(fs.readFileSync(new URL(`./content/${f}`, import.meta.url), 'utf8'));
const env = process.env.NEXT_PUBLIC_SITE_ENV || 'development';
const noindex = env !== 'production' || process.env.NEXT_PUBLIC_NOINDEX === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Separate build folders for test variants (e.g. NEXT_DIST_DIR=.next-e2e); default .next.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
  async redirects() {
    return buildRedirects({ portal: readJson('portal.json'), plan: readJson('plan.json').plan, doctors: readJson('doctors.json').doctors });
  },
  async headers() {
    const security = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];
    // Non-production must never be indexed (robots.txt and <meta robots> also say so).
    const robots = noindex ? [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] : [];
    return [{ source: '/:path*', headers: [...security, ...robots] }];
  },
};

export default nextConfig;
