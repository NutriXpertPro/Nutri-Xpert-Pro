import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { sendEmail } from '../../../../frontend/app/lib/sendgrid';
import { v4 as uuidv4 } from 'uuid';
import { addDays } from 'date-fns';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import EvaluationReminderEmail from '../../../../frontend/app/emails/EvaluationReminderEmail';

export async function GET(request: NextRequest) {
  try {
    // Find clients whose next evaluation date is today or in the past
    const clientsDueForEvaluation = await prisma.client.findMany({
      where: {
        nextEvaluationDate: {
          lte: new Date(),
        },
        active: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        nutritionist: {
          select: { email: true, name: true },
        },
      },
    });

    if (clientsDueForEvaluation.length === 0) {
      return NextResponse.json({ message: 'Nenhum cliente com avaliação pendente.' }, { status: 200 });
    }

    for (const client of clientsDueForEvaluation) {
      if (!client.email) {
        console.warn(`Cliente ${client.name} (ID: ${client.id}) não possui email cadastrado. Pulando envio.`);
        continue;
      }

      // Generate evaluation link
      const token = uuidv4();
      const expiresAt = addDays(new Date(), 14); // Link expires in 14 days

      const evaluationLink = await prisma.evaluationLink.create({
        data: {
          token,
          clientId: client.id,
          expiresAt,
        },
      });

      const evaluationUrl = `${process.env.NEXTAUTH_URL}/evaluation/fill/${token}`;

      // Send email
      const nutritionistEmail = client.nutritionist?.email || process.env.DEFAULT_FROM_EMAIL;
      if (!nutritionistEmail) {
        console.error(`Não foi possível determinar o remetente do email para o cliente ${client.name}.`);
        continue;
      }

      const emailHtml = ReactDOMServer.renderToString(
        React.createElement(EvaluationReminderEmail, {
          clientName: client.name,
          evaluationUrl: evaluationUrl,
          validityDays: 14,
        })
      );

      await sendEmail({
        to: client.email,
        from: nutritionistEmail,
        subject: 'Lembrete de Avaliação Nutricional - Nutri Xpert Pro',
        html: emailHtml,
      });

      // Update next evaluation date for the client
      await prisma.client.update({
        where: { id: client.id },
        data: {
          nextEvaluationDate: addDays(new Date(), 14), // Set next evaluation date to 14 days from now
        },
      });

      console.log(`Lembrete de avaliação enviado para ${client.name} (ID: ${client.id}).`);
    }

    return NextResponse.json({ message: 'Processo de envio de lembretes de avaliação concluído.' }, { status: 200 });
  } catch (error) {
    console.error('Erro no processo de envio de lembretes de avaliação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao enviar lembretes de avaliação' },
      { status: 500 }
    );
  }
}
