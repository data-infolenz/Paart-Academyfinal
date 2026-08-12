import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://paartacademy.in';
  return { rules: { userAgent: '*', allow: '/', disallow: '/admin' }, sitemap: `${base.replace(/\/$/, '')}/sitemap.xml` };
}
