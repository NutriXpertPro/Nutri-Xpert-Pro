import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/auth';

interface RouteParams {
  params: { clientId: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  const { clientId } = params;

  if (!session || !session.user || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client || client.nutritionistId !== session.user.id) {
      return NextResponse.json({ message: 'Cliente não encontrado ou não autorizado' }, { status: 404 });
    }

    const evaluations = await prisma.evaluation.findMany({
      where: { clientId: clientId },
      orderBy: { createdAt: 'desc' }, // Order by most recent evaluations first
      include: { photos: true }, // Include associated photos
    });

    return NextResponse.json(evaluations);
  } catch (error) {
    console.error('Erro ao buscar histórico de avaliações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao buscar histórico de avaliações' },
      { status: 500 }
    );
  }
}
