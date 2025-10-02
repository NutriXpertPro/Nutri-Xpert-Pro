import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/backend/lib/auth';
import { prisma } from '@/backend/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getAuthSession();

  if (!session || !session.user) {
    return NextResponse.json(
      { message: 'Não autorizado.' },
      { status: 401 }
    );
  }

  try {
    const pendingNutritionists = await prisma.user.findMany({
      where: {
        role: 'NUTRITIONIST',
        subscriptionStatus: 'PENDING',
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        stripePriceId: true,
        stripeCurrentPeriodEnd: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      {
        nutritionists: pendingNutritionists,
        total: pendingNutritionists.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao buscar nutricionistas pendentes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar nutricionistas pendentes.' },
      { status: 500 }
    );
  }
}
