import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const nutritionistId = session.user.id;

    const pendingEvaluations = await prisma.evaluation.findMany({
      where: {
        status: 'PENDING',
        client: {
          nutritionistId: nutritionistId,
        },
        dueDate: {
          lte: new Date(), // Evaluations due today or in the past
        },
      },
      include: {
        client: {
          select: { id: true, name: true },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    return NextResponse.json(pendingEvaluations);
  } catch (error) {
    console.error('Erro ao buscar avaliações pendentes:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao buscar avaliações pendentes' },
      { status: 500 }
    );
  }
}
