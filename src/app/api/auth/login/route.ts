import { NextRequest, NextResponse } from 'next/server';
import { createSessionValue, setAdminCookie, verifyAdmin } from '@/server/auth';

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email?: string; password?: string };
  if (!body.email || !body.password || !verifyAdmin(body.email, body.password)) {
    return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  setAdminCookie(response, createSessionValue());
  return response;
}
