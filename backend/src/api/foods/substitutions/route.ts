import { NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/backend/lib/auth';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const foodId = searchParams.get('foodId');

  if (!foodId) {
    return NextResponse.json({ message: 'ID do alimento é obrigatório' }, { status: 400 });
  }

  try {
    const originalFood = await prisma.food.findUnique({
      where: { id: foodId },
      select: { category: true },
    });

    if (!originalFood) {
      return NextResponse.json({ message: 'Alimento não encontrado' }, { status: 404 });
    }

    const substituteFoods = await prisma.food.findMany({
      where: {
        category: originalFood.category,
        id: { not: foodId }, // Exclude the original food itself
        active: true,
      },
      orderBy: { name: 'asc' },
      take: 10, // Limit to 10 suggestions for now
    });

    return NextResponse.json({ substitutes: substituteFoods });
  } catch (error) {
    console.error('Erro ao buscar substituições de alimentos:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
