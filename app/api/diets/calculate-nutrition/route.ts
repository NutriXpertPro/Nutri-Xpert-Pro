import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const { mealStructure } = await req.json();

  if (!mealStructure || !Array.isArray(mealStructure)) {
    return NextResponse.json({ message: 'Estrutura da refeição inválida' }, { status: 400 });
  }

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  try {
    for (const meal of mealStructure) {
      if (meal.foods && Array.isArray(meal.foods)) {
        for (const foodItem of meal.foods) {
          const food = await prisma.food.findUnique({
            where: { id: foodItem.foodId },
            select: { calories: true, protein: true, carbohydrates: true, fat: true },
          });

          if (food && foodItem.quantity) {
            const quantityMultiplier = foodItem.quantity / 100; // Assuming nutritional values are per 100g
            totalCalories += (food.calories || 0) * quantityMultiplier;
            totalProtein += (food.protein || 0) * quantityMultiplier;
            totalCarbs += (food.carbohydrates || 0) * quantityMultiplier;
            totalFat += (food.fat || 0) * quantityMultiplier;
          }
        }
      }
    }

    return NextResponse.json({
      totalCalories: parseFloat(totalCalories.toFixed(2)),
      totalProtein: parseFloat(totalProtein.toFixed(2)),
      totalCarbs: parseFloat(totalCarbs.toFixed(2)),
      totalFat: parseFloat(totalFat.toFixed(2)),
    });
  } catch (error) {
    console.error('Erro ao calcular nutrição:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
