import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/middleware-utils';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.contentItem.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
