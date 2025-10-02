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
    const { nutritionistId, reason } = await request.json();

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
        subscriptionStatus: 'REJECTED',
        isPro: false,
        rejectedAt: new Date(),
        rejectionReason: reason || 'Não especificado',
      },
    });

    await prisma.notification.create({
      data: {
        nutritionistId: nutritionistId,
        type: 'SUBSCRIPTION',
        title: 'Cadastro Não Aprovado',
        message: reason 
          ? `Seu cadastro não foi aprovado. Motivo: ${reason}` 
          : 'Seu cadastro não foi aprovado. Entre em contato com o suporte para mais informações.',
        read: false,
      },
    });

    if (nutritionist.email) {
      await sendEmail({
        to: nutritionist.email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@nutriexpertpro.com',
        subject: 'Cadastro Não Aprovado - Nutri Xpert Pro',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ef4444;">Cadastro Não Aprovado</h2>
            <p>Olá ${nutritionist.name || 'Nutricionista'},</p>
            <p>Infelizmente, seu cadastro não foi aprovado neste momento.</p>
            ${reason ? `<p><strong>Motivo:</strong> ${reason}</p>` : ''}
            <p>Se você acredita que isso é um erro ou deseja mais informações, por favor entre em contato com nosso suporte.</p>
            <p>
              <a href="${process.env.NEXTAUTH_URL}/suporte" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
                Contatar Suporte
              </a>
            </p>
            <p>Atenciosamente,<br>Equipe Nutri Xpert Pro</p>
          </div>
        `,
      });
    }

    return NextResponse.json(
      {
        message: 'Nutricionista rejeitado.',
        nutritionist: updatedNutritionist,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao rejeitar nutricionista:', error);
    return NextResponse.json(
      { error: 'Erro ao rejeitar nutricionista.' },
      { status: 500 }
    );
  }
}
