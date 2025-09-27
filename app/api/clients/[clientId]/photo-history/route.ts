import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/auth';

export async function GET(req: Request, { params }: { params: { clientId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const { clientId } = params;

  try {
    // Verify that the client belongs to the nutritionist
    const client = await prisma.client.findUnique({
      where: { id: clientId, nutritionistId: session.user.id },
    });

    if (!client) {
      return NextResponse.json({ message: 'Cliente não encontrado ou não autorizado' }, { status: 404 });
    }

    const photoHistory = await prisma.evaluation.findMany({
      where: { clientId: clientId },
      orderBy: { createdAt: 'asc' },
      include: {
        photos: {
          select: { url: true, type: true },
        },
      },
    });

    const formattedData = photoHistory.map(evalItem => ({
      evaluationId: evalItem.id,
      date: evalItem.createdAt.toISOString().split('T')[0], // Format as YYYY-MM-DD
      photos: evalItem.photos,
    }));

    return NextResponse.json({ photoHistory: formattedData });
  } catch (error) {
    console.error('Erro ao buscar histórico de fotos:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
