import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { foodId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { foodId } = params;
    const food = await prisma.food.findUnique({
      where: { id: foodId },
    });

    if (!food) {
      return NextResponse.json({ error: 'Alimento não encontrado' }, { status: 404 });
    }
    return NextResponse.json(food);
  } catch (error) {
    console.error('Error fetching food:', error);
    return NextResponse.json({ error: 'Failed to fetch food' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { foodId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { foodId } = params;
    const body = await request.json();
    const updatedFood = await prisma.food.update({
      where: { id: foodId },
      data: {
        name: body.name,
        category: body.category,
        calories: parseFloat(body.calories),
        protein: parseFloat(body.protein),
        carbohydrates: parseFloat(body.carbohydrates),
        fat: parseFloat(body.fat),
        fiber: parseFloat(body.fiber),
        sodium: parseFloat(body.sodium),
        calcium: parseFloat(body.calcium),
        iron: parseFloat(body.iron),
        magnesium: parseFloat(body.magnesium),
        phosphorus: parseFloat(body.phosphorus),
        potassium: parseFloat(body.potassium),
        zinc: parseFloat(body.zinc),
        vitaminA: parseFloat(body.vitaminA),
        vitaminB1: parseFloat(body.vitaminB1),
        vitaminB2: parseFloat(body.vitaminB2),
        vitaminB3: parseFloat(body.vitaminB3),
        vitaminB6: parseFloat(body.vitaminB6),
        vitaminB12: parseFloat(body.vitaminB12),
        vitaminC: parseFloat(body.vitaminC),
        vitaminD: parseFloat(body.vitaminD),
        vitaminE: parseFloat(body.vitaminE),
        folate: parseFloat(body.folate),
      },
    });
    return NextResponse.json(updatedFood);
  } catch (error) {
    console.error('Error updating food:', error);
    return NextResponse.json({ error: 'Failed to update food' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { foodId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { foodId } = params;
    await prisma.food.delete({
      where: { id: foodId },
    });
    return NextResponse.json({ message: 'Food deleted successfully' });
  } catch (error) {
    console.error('Error deleting food:', error);
    return NextResponse.json({ error: 'Failed to delete food' }, { status: 500 });
  }
}