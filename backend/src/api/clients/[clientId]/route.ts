import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/backend/lib/auth';
import { prisma } from '../../../../lib/prisma';

export async function GET(req: Request, { params }: { params: { clientId: string } }) {
  const session = await getServerSession(authOptions);
  const { clientId } = params;

  if (!session || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const client = await prisma.client.findUnique({
      where: {
        id: clientId,
      },
      include: {
        evaluations: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    // Security check: Ensure the requested client belongs to the logged-in nutritionist
    if (!client || client.nutritionistId !== session.user.id) {
      return NextResponse.json({ message: 'Cliente não encontrado ou não autorizado' }, { status: 404 });
    }

    return NextResponse.json({ client });
  } catch (error) {
    console.error(`Erro ao buscar cliente ${clientId}:`, error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { clientId: string } }) {
  const session = await getServerSession(authOptions);
  const { clientId } = params;

  if (!session || !session.user || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // First, verify this client belongs to the user
    const clientToUpdate = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!clientToUpdate || !session.user || clientToUpdate.nutritionistId !== session.user.id) {
      return NextResponse.json({ message: 'Cliente não encontrado ou não autorizado' }, { status: 404 });
    }

    // Proceed with the update
    const updatedClient = await prisma.client.update({
      where: {
        id: clientId,
      },
      data: {
        ...body,
      },
    });

    return NextResponse.json({ client: updatedClient });
  } catch (error) {
    console.error(`Erro ao atualizar cliente ${clientId}:`, error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}