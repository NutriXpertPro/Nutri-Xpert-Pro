import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getAuthSession();

  if (!session || !session.user || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const nutritionistId = session.user.id;

  try {
    const body = await request.json();
    const { clientId, name, description, meals } = body;

    if (!clientId || !name) {
      return NextResponse.json({ message: 'Cliente e nome da dieta são obrigatórios.' }, { status: 400 });
    }

    const diet = await prisma.diet.create({
      data: {
        clientId,
        nutritionistId,
        name,
        description,
        mealStructure: meals, // Save the meals array to the mealStructure field
      },
    });

    return NextResponse.json({ diet }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar dieta:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao criar dieta' },
      { status: 500 }
    );
  }
}