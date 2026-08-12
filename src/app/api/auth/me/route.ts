import { NextResponse } from 'next/server';
import { requireAdmin } from '@/server/auth';

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, email: session.email });
}
