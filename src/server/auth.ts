import { createHmac, pbkdf2Sync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const sessionCookie = 'paart_admin_session';
const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@paartacademy.in';
const adminPassword = process.env.ADMIN_PASSWORD ?? 'Paart@2026';
const authSecret = process.env.AUTH_SECRET ?? process.env.JWT_SECRET ?? 'paart-local-development-secret';
const passwordSalt = process.env.ADMIN_PASSWORD_SALT ?? 'paart-admin-salt';

function hashPassword(password: string) {
  return pbkdf2Sync(password, passwordSalt, 120000, 32, 'sha256').toString('hex');
}

function sign(value: string) {
  return createHmac('sha256', authSecret).update(value).digest('hex');
}

export function verifyAdmin(email: string, password: string) {
  const expectedEmail = adminEmail.toLowerCase();
  const incomingEmail = email.trim().toLowerCase();
  const expectedHash = process.env.ADMIN_PASSWORD_HASH ?? hashPassword(adminPassword);
  const incomingHash = hashPassword(password);
  return incomingEmail === expectedEmail && timingSafeEqual(Buffer.from(incomingHash), Buffer.from(expectedHash));
}

export function createSessionValue() {
  const payload = Buffer.from(JSON.stringify({ email: adminEmail, exp: Date.now() + 1000 * 60 * 60 * 8 })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function readSession(value?: string) {
  if (!value) return null;
  const [payload, signature] = value.split('.');
  if (!payload || !signature || signature !== sign(payload)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { email: string; exp: number };
    if (session.exp < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const store = await cookies();
  return readSession(store.get(sessionCookie)?.value);
}

export function setAdminCookie(response: NextResponse, value: string) {
  response.cookies.set(sessionCookie, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.set(sessionCookie, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 });
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
