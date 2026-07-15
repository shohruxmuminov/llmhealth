import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/middleware-utils';
import { NextResponse } from 'next/server';

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const items = await prisma.contentItem.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, description, images, category, link, keywords } = await req.json();

  const item = await prisma.contentItem.create({
    data: {
      title,
      description,
      images: JSON.stringify(images),
      category,
      link,
      keywords
    }
  });

  return NextResponse.json(item);
}
