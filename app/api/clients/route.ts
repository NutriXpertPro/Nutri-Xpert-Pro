import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const evaluationType = searchParams.get('type');
  const dietType = searchParams.get('dietType'); // New: Extract dietType

  if (!session || !session.user || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const whereClause: any = {
      nutritionistId: session.user.id,
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (evaluationType) {
      whereClause.evaluationType = evaluationType;
    }

    if (dietType) { // New: Filter by dietType
      whereClause.diets = {
        some: {
          type: dietType,
        },
      };
    }

    const clients = await prisma.client.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json({ clients });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}