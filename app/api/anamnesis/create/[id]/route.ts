
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { id: string }
}

// POST /api/anamnesis/create/[id] - Criar anamnese para cliente
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const clientId = params.id;

    // Verificar se cliente existe
    const client = await prisma.client.findFirst({
      where: { 
        id: clientId,
        active: true 
      }
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se já existe anamnese para este cliente
    const existingAnamnesis = await prisma.anamnesis.findUnique({
      where: { clientId }
    });

    if (existingAnamnesis) {
      return NextResponse.json(
        { error: 'Cliente já possui anamnese cadastrada' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    
    // Extrair dados do formulário
    const anamnesisData = {
      clientId,
      wakeTime: formData.get('wakeTime') as string || null,
      sleepTime: formData.get('sleepTime') as string || null,
      sleepDifficulty: formData.get('sleepDifficulty') as string || null,
      trainTime: formData.get('trainTime') as string || null,
      trainDuration: formData.get('trainDuration') ? parseInt(formData.get('trainDuration') as string) : null,
      trainDays: formData.get('trainDays') as string || null,
      weight: formData.get('weight') ? parseFloat(formData.get('weight') as string) : null,
      height: formData.get('height') ? parseFloat(formData.get('height') as string) : null,
      weightTrend: formData.get('weightTrend') as string || null,
      restrictedFoods: formData.get('restrictedFoods') as string || null,
      previousDiet: formData.get('previousDiet') as string || null,
      dietResult: formData.get('dietResult') as string || null,
      intestineFunction: formData.get('intestineFunction') as string || null,
      daysWithoutBathroom: formData.get('daysWithoutBathroom') ? parseInt(formData.get('daysWithoutBathroom') as string) : null,
      bathroomFrequency: formData.get('bathroomFrequency') ? parseInt(formData.get('bathroomFrequency') as string) : null,
      waterIntake: formData.get('waterIntake') ? parseFloat(formData.get('waterIntake') as string) : null,
      sweetCravings: formData.get('sweetCravings') ? parseInt(formData.get('sweetCravings') as string) : 5,
      hungerTimes: formData.get('hungerTimes') as string || null,
      snackPreference: formData.get('snackPreference') as string || null,
      favoriteFruits: formData.get('favoriteFruits') as string || null,
      familyHistory: formData.get('familyHistory') as string || null,
      healthProblems: formData.get('healthProblems') as string || null,
      healthProblemsDetails: formData.get('healthProblemsDetails') as string || null,
      jointProblems: formData.get('jointProblems') as string || null,
      medications: formData.get('medications') as string || null,
      medicationsDetails: formData.get('medicationsDetails') as string || null,
      smoking: formData.get('smoking') as string || null,
      medicationIntolerance: formData.get('medicationIntolerance') as string || null,
      intoleranceDetails: formData.get('intoleranceDetails') as string || null,
      contraceptive: formData.get('contraceptive') as string || null,
      thermogenics: formData.get('thermogenics') as string || null,
      alcohol: formData.get('alcohol') as string || null,
      alcoholFrequency: formData.get('alcoholFrequency') ? parseInt(formData.get('alcoholFrequency') as string) : null,
      anabolics: formData.get('anabolics') as string || null,
      anabolicsProblems: formData.get('anabolicsProblems') as string || null,
      futureAnabolics: formData.get('futureAnabolics') as string || null,
      goal: formData.get('goal') as string || null,
      commitment: formData.get('commitment') as string || null,
      neck: formData.get('neck') ? parseFloat(formData.get('neck') as string) : null,
      waist: formData.get('waist') ? parseFloat(formData.get('waist') as string) : null,
      hip: formData.get('hip') ? parseFloat(formData.get('hip') as string) : null,
    };

    // Criar anamnese
    const anamnesis = await prisma.anamnesis.create({
      data: anamnesisData
    });

    // Processar fotos se existirem
    const frontPhoto = formData.get('frontPhoto') as File;
    const sidePhoto = formData.get('sidePhoto') as File;
    const backPhoto = formData.get('backPhoto') as File;

    const photoPromises = [];

    if (frontPhoto && frontPhoto.size > 0) {
      // Aqui você implementaria o upload da foto
      // Por enquanto, vamos simular uma URL
      photoPromises.push(
        prisma.photo.create({
          data: {
            anamnesisId: anamnesis.id,
            type: 'frente',
            url: `/uploads/anamnesis/${anamnesis.id}/front.jpg` // URL simulada
          }
        })
      );
    }

    if (sidePhoto && sidePhoto.size > 0) {
      photoPromises.push(
        prisma.photo.create({
          data: {
            anamnesisId: anamnesis.id,
            type: 'lado',
            url: `/uploads/anamnesis/${anamnesis.id}/side.jpg` // URL simulada
          }
        })
      );
    }

    if (backPhoto && backPhoto.size > 0) {
      photoPromises.push(
        prisma.photo.create({
          data: {
            anamnesisId: anamnesis.id,
            type: 'costas',
            url: `/uploads/anamnesis/${anamnesis.id}/back.jpg` // URL simulada
          }
        })
      );
    }

    // Criar fotos se existirem
    if (photoPromises.length > 0) {
      await Promise.all(photoPromises);
    }

    // Criar primeira avaliação quinzenal se for virtual
    if (client.evaluationType === 'virtual') {
      await prisma.evaluation.create({
        data: {
          clientId,
          type: 'quinzenal',
          status: 'pending',
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 dias
        }
      });
    }

    return NextResponse.json(
      { 
        anamnesis,
        message: 'Anamnese criada com sucesso' 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro ao criar anamnese:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
