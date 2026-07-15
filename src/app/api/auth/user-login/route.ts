import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { login, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { login }
  });

  if (!user) {
    return NextResponse.json({ error: 'Invalid login or password' }, { status: 401 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Invalid login or password' }, { status: 401 });
  }

  const token = signToken({ role: 'user', userId: user.id });
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  return NextResponse.json({ success: true, user: { firstName: user.firstName, lastName: user.lastName } });
}
