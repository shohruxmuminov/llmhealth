import { getAuthSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function isAdmin() {
  const session = await getAuthSession();
  return session && (session as any).role === 'admin';
}

export async function isUser() {
  const session = await getAuthSession();
  return session && (session as any).role === 'user';
}
