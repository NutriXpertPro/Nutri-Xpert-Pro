
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET: Buscar dados de evolução de peso para gráficos
export async function GET(req: Request, { params }: { params: { clientId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const { clientId } = params;

  try {
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        nutritionistId: session.user.id,
      },
    });

    if (!client) {
      return NextResponse.json({ message: 'Cliente não encontrado ou não autorizado' }, { status: 404 });
    }

    const evaluations = await prisma.evaluation.findMany({
      where: {
        clientId: clientId,
        weight: { not: null },
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        createdAt: true,
        weight: true,
      },
    });

    const chartData = evaluations.map(e => ({
      date: e.createdAt.toISOString().split('T')[0], // Formata para YYYY-MM-DD
      Peso: e.weight,
    }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Erro ao buscar dados de evolução de peso:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
