import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/middleware-utils';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { action } = await req.json();

  if (action === 'regenerate-password') {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: params.id },
      data: { passwordHash }
    });

    return NextResponse.json({ plaintextPassword: password });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
