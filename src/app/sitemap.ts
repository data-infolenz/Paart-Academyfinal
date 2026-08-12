import type { MetadataRoute } from 'next';
import { readCms } from '@/server/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { settings, blogs, courses } = await readCms();
  const base = settings.canonicalUrl.replace(/\/$/, '');
  const staticPages = ['', '/about', '/courses', '/admissions', '/blogs', '/gallery', '/contact'].map((route) => ({ url: `${base}${route}`, lastModified: new Date() }));
  return [
    ...staticPages,
    ...courses.map((course) => ({ url: `${base}/courses/${course.slug}`, lastModified: new Date(course.updatedAt) })),
    ...blogs.filter((blog) => blog.published).map((blog) => ({ url: `${base}/blogs/${blog.slug}`, lastModified: new Date(blog.updatedAt) })),
  ];
}
