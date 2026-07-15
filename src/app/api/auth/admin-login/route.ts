import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const ADMIN_PIN = process.env.ADMIN_PIN || '2424';

export async function POST(req: Request) {
  const { pin } = await req.json();
  const ip = req.headers.get('x-forwarded-for') || 'unknown';

  // Rate limiting check
  const attempt = await prisma.loginAttempt.findFirst({
    where: { ip }
  });

  if (attempt && attempt.count >= 5) {
    const now = new Date();
    const diff = now.getTime() - attempt.lastAttempt.getTime();
    const fifteenMinutes = 15 * 60 * 1000;

    if (diff < fifteenMinutes) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    } else {
      // Reset after timeout
      await prisma.loginAttempt.update({
        where: { id: attempt.id },
        data: { count: 0, lastAttempt: now }
      });
    }
  }

  if (pin === ADMIN_PIN) {
    // Success
    if (attempt) {
      await prisma.loginAttempt.update({
        where: { id: attempt.id },
        data: { count: 0, lastAttempt: new Date() }
      });
    }

    const token = signToken({ role: 'admin' });
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return NextResponse.json({ success: true });
  } else {
    // Failure
    if (attempt) {
      await prisma.loginAttempt.update({
        where: { id: attempt.id },
        data: { count: attempt.count + 1, lastAttempt: new Date() }
      });
    } else {
      await prisma.loginAttempt.create({
        data: { ip, count: 1, lastAttempt: new Date() }
      });
    }
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
  }
}
