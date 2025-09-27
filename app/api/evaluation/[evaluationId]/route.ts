
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

interface RouteParams {
  params: { evaluationId: string };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  const { evaluationId } = params;

  if (!session) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const evaluation = await prisma.evaluation.findUnique({
      where: { id: evaluationId },
      include: { client: true },
    });

    if (!evaluation || !session.user || evaluation.client.id !== session.user.id) {
      return NextResponse.json({ message: 'Avaliação não encontrada ou não autorizada' }, { status: 404 });
    }

    if (evaluation.status === 'COMPLETED') {
      return NextResponse.json({ message: 'Esta avaliação já foi concluída.' }, { status: 400 });
    }

    const formData = await request.formData();
    const evaluationData = Object.fromEntries(formData.entries());

    const dataToUpdate = {
      weight: evaluationData.weight ? parseFloat(evaluationData.weight as string) : null,
      neck: evaluationData.neck ? parseFloat(evaluationData.neck as string) : null,
      waist: evaluationData.waist ? parseFloat(evaluationData.waist as string) : null,
      hip: evaluationData.hip ? parseFloat(evaluationData.hip as string) : null,
      status: 'COMPLETED' as const,
      completedAt: new Date(),
    };

    const updatedEvaluation = await prisma.evaluation.update({
      where: { id: evaluationId },
      data: dataToUpdate,
    });

    // Placeholder for photo upload logic
    const photoPromises = ['frontPhoto', 'sidePhoto', 'backPhoto'].map(async (photoType) => {
      const photo = formData.get(photoType) as File;
      if (photo && photo.size > 0) {
        // Simulate upload and get a URL
        const simulatedUrl = `/uploads/evaluations/${evaluationId}/${photo.name}`;
        return prisma.photo.create({
          data: {
            evaluationId: evaluationId,
            type: photoType.replace('Photo', ''), // front, side, back
            url: simulatedUrl,
          },
        });
      }
      return null;
    });

    await Promise.all(photoPromises);

    return NextResponse.json({ evaluation: updatedEvaluation });

  } catch (error) {
    console.error(`Erro ao atualizar avaliação ${evaluationId}:`, error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
