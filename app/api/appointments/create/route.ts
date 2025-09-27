import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AppointmentType } from '@prisma/client';

export async function POST(request: NextRequest) {
  const session = await getAuthSession();

  if (!session || !session.user || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json(
      { message: 'Não autorizado. Apenas nutricionistas podem criar agendamentos.' },
      { status: 401 }
    );
  }

  const nutritionistId = session.user.id;

  try {
    const { clientId, date, type, notes } = await request.json();

    if (!clientId || !date || !type) {
      return NextResponse.json({ message: 'Dados de agendamento incompletos.' }, { status: 400 });
    }

    // Validate appointment type
    if (!Object.values(AppointmentType).includes(type)) {
      return NextResponse.json({ message: 'Tipo de agendamento inválido.' }, { status: 400 });
    }

    // Check if client belongs to the nutritionist
    const client = await prisma.client.findUnique({
      where: {
        id: clientId,
        nutritionistId: nutritionistId,
      },
    });

    if (!client) {
      return NextResponse.json({ message: 'Cliente não encontrado ou não pertence a este nutricionista.' }, { status: 404 });
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        clientId,
        nutritionistId,
        date: new Date(date), // Ensure date is a proper Date object
        type,
        notes,
      },
    });

    return NextResponse.json({ appointment: newAppointment }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao criar agendamento.' },
      { status: 500 }
    );
  }
}
