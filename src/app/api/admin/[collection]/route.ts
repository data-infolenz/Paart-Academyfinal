import { NextRequest, NextResponse } from 'next/server';
import type { Blog, GalleryItem, ManagedCourse, Material, MediaItem } from '@/types/cms';
import { makeId, readCms, slugify, updateCms } from '@/server/db';
import { requireAdmin, unauthorized } from '@/server/auth';

const collections = ['admissions', 'enquiries', 'courses', 'materials', 'blogs', 'gallery', 'media'] as const;
type Collection = (typeof collections)[number];

function isCollection(value: string): value is Collection {
  return collections.includes(value as Collection);
}

function lines(value: unknown) {
  return String(value ?? '').split('\n').map((item) => item.trim()).filter(Boolean);
}

export async function GET(_: NextRequest, context: { params: Promise<{ collection: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  const { collection } = await context.params;
  if (!isCollection(collection)) return NextResponse.json({ error: 'Unknown collection' }, { status: 404 });
  const data = await readCms();
  return NextResponse.json(data[collection]);
}

export async function POST(request: NextRequest, context: { params: Promise<{ collection: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  const { collection } = await context.params;
  if (!isCollection(collection)) return NextResponse.json({ error: 'Unknown collection' }, { status: 404 });
  const body = await request.json();
  const item = await updateCms((data) => {
    const now = new Date().toISOString();
    if (collection === 'courses') {
      const record: ManagedCourse = {
        id: makeId('course'),
        slug: slugify(body.slug || body.title || 'course'),
        title: body.title ?? 'New Course',
        category: body.category ?? 'TNPSC',
        shortDescription: body.shortDescription ?? '',
        duration: body.duration ?? '',
        eligibility: body.eligibility ?? '',
        image: body.image ?? '',
        features: lines(body.features),
        examStages: lines(body.examStages),
        enabled: body.enabled ?? true,
        updatedAt: now,
      };
      data.courses.unshift(record);
      return record;
    }
    if (collection === 'blogs') {
      const record: Blog = {
        id: makeId('blog'),
        slug: slugify(body.slug || body.title || 'blog'),
        title: body.title ?? 'New Blog',
        shortDescription: body.shortDescription ?? '',
        content: body.content ?? '',
        author: body.author ?? 'PAART Academy',
        publishedDate: body.publishedDate ?? now.slice(0, 10),
        category: body.category ?? 'Academy',
        featuredImage: body.featuredImage ?? '',
        seoTitle: body.seoTitle ?? body.title ?? 'PAART Academy Blog',
        metaDescription: body.metaDescription ?? body.shortDescription ?? '',
        keywords: body.keywords ?? '',
        published: body.published ?? true,
        updatedAt: now,
      };
      data.blogs.unshift(record);
      return record;
    }
    if (collection === 'materials') {
      const record: Material = {
        id: makeId('material'),
        title: body.title ?? 'New Material',
        category: body.category ?? 'Study Material',
        description: body.description ?? '',
        thumbnail: body.thumbnail ?? '',
        fileUrl: body.fileUrl ?? '',
        externalUrl: body.externalUrl ?? '',
        published: body.published ?? true,
        displayOrder: Number(body.displayOrder ?? data.materials.length + 1),
        createdAt: now,
        updatedAt: now,
      };
      data.materials.unshift(record);
      return record;
    }
    if (collection === 'gallery') {
      const record: GalleryItem = {
        id: makeId('gallery'),
        title: body.title ?? 'Gallery Image',
        description: body.description ?? '',
        category: body.category ?? 'Classroom',
        image: body.image ?? '',
        videoUrl: body.videoUrl ?? '',
        order: Number(body.order ?? data.gallery.length + 1),
        createdAt: now,
      };
      data.gallery.push(record);
      return record;
    }
    const record: MediaItem = {
      id: makeId('media'),
      title: body.title ?? 'Media',
      url: body.url ?? '',
      type: body.type ?? 'link',
      size: Number(body.size ?? 0),
      createdAt: now,
    };
    data.media.unshift(record);
    return record;
  });
  return NextResponse.json(item);
}
