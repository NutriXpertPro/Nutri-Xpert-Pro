import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/backend/lib/auth';
import { prisma } from '@/backend/lib/prisma';
import { sendEmail } from '@/app/lib/sendgrid';

export async function POST(request: NextRequest) {
  const session = await getAuthSession();

  if (!session || !session.user) {
    return NextResponse.json(
      { message: 'Não autorizado.' },
      { status: 401 }
    );
  }

  try {
    const { nutritionistId } = await request.json();

    if (!nutritionistId) {
      return NextResponse.json(
        { message: 'ID do nutricionista é obrigatório.' },
        { status: 400 }
      );
    }

    const nutritionist = await prisma.user.findUnique({
      where: { id: nutritionistId },
    });

    if (!nutritionist) {
      return NextResponse.json(
        { message: 'Nutricionista não encontrado.' },
        { status: 404 }
      );
    }

    if (nutritionist.role !== 'NUTRITIONIST') {
      return NextResponse.json(
        { message: 'Usuário não é um nutricionista.' },
        { status: 400 }
      );
    }

    const updatedNutritionist = await prisma.user.update({
      where: { id: nutritionistId },
      data: {
        subscriptionStatus: 'ACTIVE',
        isPro: true,
        approvedAt: new Date(),
      },
    });

    await prisma.notification.create({
      data: {
        nutritionistId: nutritionistId,
        type: 'SUBSCRIPTION',
        title: 'Cadastro Aprovado!',
        message: 'Seu cadastro foi aprovado. Agora você tem acesso completo a todas as funcionalidades da plataforma!',
        read: false,
      },
    });

    if (nutritionist.email) {
      await sendEmail({
        to: nutritionist.email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@nutriexpertpro.com',
        subject: 'Cadastro Aprovado - Nutri Xpert Pro',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981;">Cadastro Aprovado!</h2>
            <p>Olá ${nutritionist.name || 'Nutricionista'},</p>
            <p>Temos uma ótima notícia! Seu cadastro foi aprovado e agora você tem acesso completo a todas as funcionalidades da plataforma Nutri Xpert Pro.</p>
            <p>Você já pode começar a:</p>
            <ul>
              <li>Cadastrar e gerenciar seus pacientes</li>
              <li>Criar anamneses e avaliações</li>
              <li>Montar dietas personalizadas</li>
              <li>Gerar relatórios profissionais</li>
            </ul>
            <p>
              <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
                Acessar Dashboard
              </a>
            </p>
            <p>Obrigado por escolher o Nutri Xpert Pro!</p>
          </div>
        `,
      });
    }

    return NextResponse.json(
      {
        message: 'Nutricionista aprovado com sucesso.',
        nutritionist: updatedNutritionist,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao aprovar nutricionista:', error);
    return NextResponse.json(
      { error: 'Erro ao aprovar nutricionista.' },
      { status: 500 }
    );
  }
}
