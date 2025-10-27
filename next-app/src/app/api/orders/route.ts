import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
    const limit = Math.max(1, Math.min(100, Number(searchParams.get('limit') ?? '10')));
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.order.count(),
    ]);

    return NextResponse.json({ orders, total });
  } catch (err) {
    logger.error({ err }, 'Failed to fetch orders');
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

