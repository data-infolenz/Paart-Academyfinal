import { NextRequest, NextResponse } from 'next/server';
import type { Enquiry } from '@/types/cms';
import { makeId, updateCms } from '@/server/db';

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<Enquiry>;
  if (!body.name || !body.phone || !body.courseInterested) {
    return NextResponse.json({ error: 'Name, phone and course are required' }, { status: 400 });
  }
  const enquiry = await updateCms((data) => {
    const record: Enquiry = {
      id: makeId('enq'),
      name: body.name ?? '',
      phone: body.phone ?? '',
      courseInterested: body.courseInterested ?? '',
      message: body.message ?? '',
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    data.enquiries.unshift(record);
    return record;
  });
  return NextResponse.json({ ok: true, enquiry });
}
