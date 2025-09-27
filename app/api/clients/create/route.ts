
import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getAuthSession();

  if (!session || !session.user || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json(
      {
        message: 'Não autorizado',
        debug: {
          sessionExists: !!session,
          userExists: !!session?.user,
          userRole: session?.user?.role || 'N/A',
          expectedRole: 'NUTRITIONIST',
        },
      },
      { status: 401 }
    );
  }

  const nutritionistId = session.user.id;

  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string | null;
    const phone = formData.get('phone') as string | null;
    const birthDateStr = formData.get('birthDate') as string | null;
    const sex = formData.get('sex') as string | null;
    const profession = formData.get('profession') as string | null;
    const notes = formData.get('notes') as string | null;
    const evaluationType = formData.get('evaluationType') as 'virtual' | 'presencial';

    if (!name) {
      return NextResponse.json({ message: 'Nome do cliente é obrigatório.' }, { status: 400 });
    }

    const birthDate = birthDateStr ? new Date(birthDateStr) : null;

    const client = await prisma.client.create({
      data: {
        nutritionistId,
        name,
        email,
        phone,
        birthDate,
        sex,
        profession,
        notes,
        evaluationType,
      },
    });

    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao criar cliente' },
      { status: 500 }
    );
  }
}
