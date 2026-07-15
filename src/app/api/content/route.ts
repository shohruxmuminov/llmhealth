import { prisma } from '@/lib/prisma';
import { isUser, isAdmin } from '@/lib/middleware-utils';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // Allow both users and admins to view content
  const authenticated = (await isUser()) || (await isAdmin());
  if (!authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  let items;
  if (query) {
    items = await prisma.contentItem.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { keywords: { contains: query } },
          { description: { contains: query } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  } else {
    items = await prisma.contentItem.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  return NextResponse.json(items);
}
