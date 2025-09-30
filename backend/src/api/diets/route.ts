import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/backend/lib/auth';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const nutritionistId = searchParams.get('nutritionistId');

    const where: any = {};
    if (clientId) {
      where.clientId = clientId;
    }
    if (nutritionistId) {
      where.nutritionistId = nutritionistId;
    }

    const diets = await prisma.diet.findMany({
      where,
      include: { client: true, nutritionist: true },
    });
    return NextResponse.json(diets);
  } catch (error) {
    console.error('Error fetching diets:', error);
    return NextResponse.json({ error: 'Failed to fetch diets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const newDiet = await prisma.diet.create({
      data: {
        clientId: body.clientId,
        nutritionistId: body.nutritionistId,
        name: body.name,
        description: body.description,
        totalCalories: parseFloat(body.totalCalories),
        totalProtein: parseFloat(body.totalProtein),
        totalCarbs: parseFloat(body.totalCarbs),
        totalFat: parseFloat(body.totalFat),
        mealStructure: body.mealStructure, // JSON field
        active: body.active,
      },
    });
    return NextResponse.json(newDiet, { status: 201 });
  } catch (error) {
    console.error('Error creating diet:', error);
    return NextResponse.json({ error: 'Failed to create diet' }, { status: 500 });
  }
}
