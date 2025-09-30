import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/backend/lib/auth';
import { prisma } from '@/backend/lib/prisma';
import { stripe } from '@/backend/lib/stripe';

export async function POST(request: NextRequest) {
  const session = await getAuthSession();

  if (!session || !session.user || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json(
      { message: 'Não autorizado. Apenas nutricionistas podem iniciar assinaturas.' },
      { status: 401 }
    );
  }

  const nutritionistId = session.user.id;

  try {
    const { priceId } = await request.json();

    if (!priceId) {
      return NextResponse.json({ message: 'ID do plano de preço é obrigatório.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: nutritionistId },
    });

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
    }

    let customerId = user.stripeCustomerId;

    // Create a new Stripe customer if one doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
      });
      customerId = customer.id;

      // Update user in DB with new customer ID
      await prisma.user.update({
        where: { id: nutritionistId },
        data: { stripeCustomerId: customerId },
      });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'], // Add 'pix' or other methods if supported by Stripe and your region
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.headers.get('origin')}/dashboard?success=true`,
      cancel_url: `${request.headers.get('origin')}/dashboard?canceled=true`,
      metadata: {
        userId: nutritionistId,
      },
    });

    return NextResponse.json({ url: stripeSession.url }, { status: 200 });
  } catch (error) {
    console.error('Erro ao criar sessão de checkout do Stripe:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao criar sessão de checkout.' },
      { status: 500 }
    );
  }
}
