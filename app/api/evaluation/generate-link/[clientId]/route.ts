import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

interface RouteParams {
  params: { clientId: string };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
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

    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14); // Link expires in 14 days

    const evaluationLink = await prisma.evaluationLink.create({
      data: {
        token,
        clientId,
        expiresAt,
      },
    });

    const evaluationUrl = `${process.env.NEXTAUTH_URL}/evaluation/fill/${token}`;

    return NextResponse.json({
      token: evaluationLink.token,
      url: evaluationUrl,
      expiresAt: evaluationLink.expiresAt,
    });
  } catch (error) {
    console.error('Erro ao gerar link de avaliação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao gerar link de avaliação' },
      { status: 500 }
    );
  }
}
