// src/app/api/discount/validate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const now = new Date();

  const discount = await prisma.discountCode.findFirst({
    where: {
      code: code.toUpperCase(),
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: now } }, // Valid if expiresAt is in the future
      ],
    },
  });

  if (!discount) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({
    valid: true,
    amount: discount.percentage, // ⚠️ Note this is now `.percentage`
    code: discount.code,
  });
}
