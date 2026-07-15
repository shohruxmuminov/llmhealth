import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/middleware-utils';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

function generatePassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function generateLogin(firstName: string, lastName: string) {
  const base = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`.replace(/\s+/g, '');
  let login = base;
  let counter = 1;
  while (true) {
    const existing = await prisma.user.findUnique({ where: { login } });
    if (!existing) return login;
    login = `${base}${counter}`;
    counter++;
  }
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { firstName, lastName, phone, photoUrl } = await req.json();

  const login = await generateLogin(firstName, lastName);
  const password = generatePassword();
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      phone,
      photoUrl,
      login,
      passwordHash
    }
  });

  return NextResponse.json({ ...user, plaintextPassword: password });
}
