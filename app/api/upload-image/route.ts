import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ message: 'Nome do arquivo não fornecido.' }, { status: 400 });
  }

  try {
    const blob = await put(filename, request.body!, {
      access: 'public',
    });

    const { anamnesisId, evaluationId, type } = Object.fromEntries(searchParams.entries());

    if (!type) {
      return NextResponse.json({ message: 'Tipo de imagem não fornecido.' }, { status: 400 });
    }

    if (!anamnesisId && !evaluationId) {
      return NextResponse.json({ message: 'anamnesisId ou evaluationId deve ser fornecido.' }, { status: 400 });
    }

    const photo = await prisma.photo.create({
      data: {
        url: blob.url,
        type: type as string,
        anamnesisId: anamnesisId as string | undefined,
        evaluationId: evaluationId as string | undefined,
      },
    });

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao fazer upload da imagem' },
      { status: 500 }
    );
  }
}
