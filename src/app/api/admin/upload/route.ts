import { NextRequest, NextResponse } from 'next/server';
import type { MediaItem } from '@/types/cms';
import { makeId, updateCms } from '@/server/db';
import { requireAdmin, unauthorized } from '@/server/auth';
import { saveUpload } from '@/server/uploads';

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) return unauthorized();
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File) || !file.size) return NextResponse.json({ error: 'File is required' }, { status: 400 });
    const uploaded = await saveUpload(file, 'media', true);
    const media = await updateCms((data) => {
      const record: MediaItem = {
        id: makeId('media'),
        title: String(form.get('title') ?? uploaded.name),
        url: uploaded.url,
        type: uploaded.type,
        size: uploaded.size,
        createdAt: new Date().toISOString(),
      };
      data.media.unshift(record);
      return record;
    });
    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Upload failed' }, { status: 400 });
  }
}
