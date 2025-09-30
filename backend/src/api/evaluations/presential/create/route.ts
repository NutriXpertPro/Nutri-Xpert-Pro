
import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/backend/lib/auth';
import { prisma } from '@/backend/lib/prisma';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  const session = await getAuthSession();

  if (!session || !session.user || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const nutritionistId = session.user.id;

  try {
    const formData = await request.formData();
    const clientId = formData.get('clientId') as string;
    const weight = parseFloat(formData.get('weight') as string);
    const neck = parseFloat(formData.get('neck') as string);
    const waist = parseFloat(formData.get('waist') as string);
    const hip = formData.get('hip') ? parseFloat(formData.get('hip') as string) : null;
    const nextEvaluationDate = new Date(formData.get('nextEvaluationDate') as string);
    const notes = formData.get('notes') as string | null;

    const photo_front = formData.get('photo_front') as File | null;
    const photo_side = formData.get('photo_side') as File | null;
    const photo_back = formData.get('photo_back') as File | null;

    // 1. Create the Evaluation
    const evaluation = await prisma.evaluation.create({
      data: {
        clientId,
        weight,
        neck,
        waist,
        hip,
        notes,
        type: 'presencial',
        status: 'COMPLETED',
        dueDate: new Date(), // Presential evaluation is completed on the same day
        completedAt: new Date(),
      },
    });

    // 2. Upload photos and create Photo records
    const photoUploads = [];
    if (photo_front) {
      photoUploads.push(
        put(`evaluations/${evaluation.id}/front.jpg`, photo_front, { access: 'public' }).then(async (blob) => {
          await prisma.photo.create({
            data: {
              evaluationId: evaluation.id,
              url: blob.url,
              type: 'front',
            },
          });
        })
      );
    }
    if (photo_side) {
      photoUploads.push(
        put(`evaluations/${evaluation.id}/side.jpg`, photo_side, { access: 'public' }).then(async (blob) => {
          await prisma.photo.create({
            data: {
              evaluationId: evaluation.id,
              url: blob.url,
              type: 'side',
            },
          });
        })
      );
    }
    if (photo_back) {
      photoUploads.push(
        put(`evaluations/${evaluation.id}/back.jpg`, photo_back, { access: 'public' }).then(async (blob) => {
          await prisma.photo.create({
            data: {
              evaluationId: evaluation.id,
              url: blob.url,
              type: 'back',
            },
          });
        })
      );
    }

    await Promise.all(photoUploads);

    // 3. Update Client's nextEvaluationDate
    await prisma.client.update({
      where: { id: clientId },
      data: { nextEvaluationDate },
    });

    // 4. Create Appointment for the next evaluation
    await prisma.appointment.create({
      data: {
        clientId,
        nutritionistId,
        date: nextEvaluationDate,
        type: 'PRESENTIAL',
        notes: 'Próxima avaliação presencial',
      },
    });

    return NextResponse.json({ message: 'Avaliação presencial criada com sucesso.' }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar avaliação presencial:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao criar avaliação presencial' },
      { status: 500 }
    );
  }
}
