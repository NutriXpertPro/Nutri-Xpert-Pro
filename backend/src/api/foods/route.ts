import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // TODO: Implement authentication/authorization for nutritionist
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const category = searchParams.get('category');

    const where: any = {};
    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive', // Case-insensitive search
      };
    }
    if (category) {
      where.category = {
        contains: category,
        mode: 'insensitive', // Case-insensitive search
      };
    }

    const foods = await prisma.food.findMany({
      where,
    });
    return NextResponse.json(foods);
  } catch (error) {
    console.error('Error fetching foods:', error);
    return NextResponse.json({ error: 'Failed to fetch foods' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // TODO: Implement authentication/authorization for nutritionist
  try {
    const body = await request.json();
    const newFood = await prisma.food.create({
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
    return NextResponse.json(newFood, { status: 201 });
  } catch (error) {
    console.error('Error creating food:', error);
    return NextResponse.json({ error: 'Failed to create food' }, { status: 500 });
  }
}
