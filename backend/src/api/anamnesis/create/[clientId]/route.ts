
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { calculateBodyFatPercentageNavy } from '@/backend/lib/calculations';
import { authOptions } from '@/backend/lib/auth';

interface RouteParams {
  params: { clientId: string }
}

// Tipagem explícita para session.user
interface SessionUser {
  id: string;
  role: string;
}

interface SessionWithUser {
  user: SessionUser;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions) as SessionWithUser | null;
  const { clientId } = params;

  if (!session || !session.user || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client || !session.user || client.nutritionistId !== session.user.id) {
      return NextResponse.json({ message: 'Cliente não encontrado ou não autorizado' }, { status: 404 });
    }

    const formData = await request.formData();
    const anamnesisData = Object.fromEntries(formData.entries());

    const dataToUpsert: any = { // Use 'any' temporarily for easier merging of properties
      wakeTime: anamnesisData.wakeTime as string || null,
      sleepTime: anamnesisData.sleepTime as string || null,
      weight: anamnesisData.weight ? parseFloat(anamnesisData.weight as string) : null,
      height: anamnesisData.height ? parseFloat(anamnesisData.height as string) : null,
      goal: anamnesisData.goal as string || null,
      neck: anamnesisData.neck ? parseFloat(anamnesisData.neck as string) : null,
      waist: anamnesisData.waist ? parseFloat(anamnesisData.waist as string) : null,
      hip: anamnesisData.hip ? parseFloat(anamnesisData.hip as string) : null,
    };

    // Fetch client to get sex for body fat calculation
    const clientWithSex = await prisma.client.findUnique({
      where: { id: clientId },
      select: { sex: true },
    });

    if (clientWithSex?.sex && dataToUpsert.height && dataToUpsert.neck && dataToUpsert.waist) {
      const bodyFatPercentage = calculateBodyFatPercentageNavy(
        clientWithSex.sex as 'Masculino' | 'Feminino',
        dataToUpsert.height,
        dataToUpsert.neck,
        dataToUpsert.waist,
        dataToUpsert.hip || undefined // hip is optional for men
      );
      dataToUpsert.bodyFatPercentage = bodyFatPercentage;
    }

    const anamnesis = await prisma.anamnesis.upsert({
      where: { clientId: clientId },
      update: dataToUpsert,
      create: {
        clientId: clientId,
        ...dataToUpsert,
      },
    });

    // Photo and initial evaluation logic would go here

    return NextResponse.json(
      { 
        anamnesis,
        message: 'Anamnese salva com sucesso' 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro ao salvar anamnese:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
