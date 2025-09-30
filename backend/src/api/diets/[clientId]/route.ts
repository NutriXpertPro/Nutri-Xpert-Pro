import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { clientId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { clientId } = params;
    const diet = await prisma.diet.findUnique({
      where: { id: clientId, nutritionistId: session.user.id },
      include: { client: true, nutritionist: true },
    });

    if (!diet) {
      return NextResponse.json({ error: 'Dieta não encontrada ou não autorizada' }, { status: 404 });
    }
    return NextResponse.json(diet);
  } catch (error) {
    console.error('Error fetching diet:', error);
    return NextResponse.json({ error: 'Failed to fetch diet' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { clientId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { clientId } = params;
    const body = await request.json();

    // Verify diet ownership
    const existingDiet = await prisma.diet.findUnique({
      where: { id: clientId },
      select: { nutritionistId: true },
    });

    if (!existingDiet || existingDiet.nutritionistId !== session.user.id) {
      return NextResponse.json({ error: 'Dieta não encontrada ou não autorizada' }, { status: 404 });
    }

    const updatedDiet = await prisma.diet.update({
      where: { id: clientId },
      data: {
        name: body.name,
        description: body.description,
        totalCalories: parseFloat(body.totalCalories),
        totalProtein: parseFloat(body.protein),
        totalCarbs: parseFloat(body.carbohydrates),
        totalFat: parseFloat(body.fat),
        mealStructure: body.mealStructure, // JSON field
        active: body.active,
      },
    });
    return NextResponse.json(updatedDiet);
  } catch (error) {
    console.error('Error updating diet:', error);
    return NextResponse.json({ error: 'Failed to update diet' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { clientId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { clientId } = params;

    // Verify diet ownership
    const existingDiet = await prisma.diet.findUnique({
      where: { id: clientId },
      select: { nutritionistId: true },
    });

    if (!existingDiet || existingDiet.nutritionistId !== session.user.id) {
      return NextResponse.json({ error: 'Dieta não encontrada ou não autorizada' }, { status: 404 });
    }

    await prisma.diet.delete({
      where: { id: clientId },
    });
    return NextResponse.json({ message: 'Diet deleted successfully' });
  } catch (error) {
    console.error('Error deleting diet:', error);
    return NextResponse.json({ error: 'Failed to delete diet' }, { status: 500 });
  }
}