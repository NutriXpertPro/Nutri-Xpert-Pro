
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

interface RouteParams {
  params: { token: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { token } = params;

  try {
    const anamnesisLink = await prisma.anamnesisLink.findUnique({
      where: { token: token },
      include: {
        client: {
          include: {
            anamnesis: true, // Inclui a anamnese existente do cliente
          },
        },
      },
    });

    if (!anamnesisLink) {
      return NextResponse.json({ message: 'Token inválido.' }, { status: 404 });
    }

    if (anamnesisLink.expiresAt < new Date()) {
      return NextResponse.json({ message: 'Token expirado.' }, { status: 400 });
    }

    if (anamnesisLink.usedAt) {
      return NextResponse.json({ message: 'Token já utilizado.' }, { status: 400 });
    }

    if (!anamnesisLink.client) {
      return NextResponse.json({ message: 'Cliente associado ao token não encontrado.' }, { status: 404 });
    }

    // Retorna os dados do cliente e da anamnese existente
    return NextResponse.json({
      client: {
        id: anamnesisLink.client.id,
        name: anamnesisLink.client.name,
        // ... outros dados do cliente que você queira retornar
      },
      anamnesis: anamnesisLink.client.anamnesis, // Pode ser null se não houver anamnese prévia
    }, { status: 200 });

  } catch (error) {
    console.error('Erro ao validar token de anamnese:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao validar token' },
      { status: 500 }
    );
  }
}
