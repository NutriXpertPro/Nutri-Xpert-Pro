
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../frontend/app/lib/prisma';

interface RouteParams {
  params: { clientId: string };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { clientId } = params;
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ message: 'Token não fornecido.' }, { status: 400 });
  }

  try {
    const anamnesisLink = await prisma.anamnesisLink.findUnique({
      where: { token: token },
    });

    if (!anamnesisLink || anamnesisLink.clientId !== clientId) {
      return NextResponse.json({ message: 'Token inválido ou não corresponde ao cliente.' }, { status: 404 });
    }

    if (anamnesisLink.expiresAt < new Date()) {
      return NextResponse.json({ message: 'Token expirado.' }, { status: 400 });
    }

    if (anamnesisLink.usedAt) {
      return NextResponse.json({ message: 'Token já utilizado.' }, { status: 400 });
    }

    const formData = await request.formData();
    const anamnesisData = Object.fromEntries(formData.entries());

    // Mapeie os dados do formulário para o formato do seu modelo Prisma Anamnesis
    // Certifique-se de converter tipos (ex: string para number) conforme necessário
    const dataToUpsert = {
      wakeTime: anamnesisData.wakeTime as string || null,
      sleepTime: anamnesisData.sleepTime as string || null,
      weight: anamnesisData.weight ? parseFloat(anamnesisData.weight as string) : null,
      height: anamnesisData.height ? parseFloat(anamnesisData.height as string) : null,
      goal: anamnesisData.goal as string || null,
      // ... adicione todos os campos da sua anamnese aqui
    };

    const anamnesis = await prisma.anamnesis.upsert({
      where: { clientId: clientId },
      update: dataToUpsert,
      create: {
        clientId: clientId,
        ...dataToUpsert,
      },
    });

    // Marcar o token como usado
    await prisma.anamnesisLink.update({
      where: { id: anamnesisLink.id },
      data: { usedAt: new Date() },
    });

    return NextResponse.json(
      { 
        anamnesis,
        message: 'Anamnese salva com sucesso' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro ao submeter anamnese virtual:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao submeter anamnese' },
      { status: 500 }
    );
  }
}
