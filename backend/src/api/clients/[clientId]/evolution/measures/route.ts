
import { NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/backend/lib/auth';

// GET: Buscar dados de evolução de medidas para gráficos
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
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        createdAt: true,
        bodyFatPercentage: true,
        neck: true,
        waist: true,
        hip: true,
      },
    });

    const chartData = evaluations.map(e => ({
      date: e.createdAt.toISOString().split('T')[0], // Formata para YYYY-MM-DD
      "Percentual de Gordura": e.bodyFatPercentage,
      Pescoço: e.neck,
      Cintura: e.waist,
      Quadril: e.hip,
    }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Erro ao buscar dados de evolução de medidas:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
