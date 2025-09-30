
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../frontend/app/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../../frontend/app/lib/auth';
import { v4 as uuidv4 } from 'uuid'; // Para gerar tokens únicos

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

    // Gerar um token único
    const token = uuidv4();
    // Definir expiração para 7 dias a partir de agora
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Salvar o link de anamnese no banco de dados
    const anamnesisLink = await prisma.anamnesisLink.create({
      data: {
        token,
        clientId,
        expiresAt,
      },
    });

    // Construir o URL completo para o paciente
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'; // Use a variável de ambiente ou fallback
    const virtualAnamnesisUrl = `${baseUrl}/anamnesis/fill/${anamnesisLink.token}`;

    return NextResponse.json({
      message: 'Link de anamnese virtual gerado com sucesso',
      link: virtualAnamnesisUrl,
      token: anamnesisLink.token,
      expiresAt: anamnesisLink.expiresAt,
    }, { status: 200 });

  } catch (error) {
    console.error('Erro ao gerar link de anamnese virtual:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao gerar link' },
      { status: 500 }
    );
  }
}
