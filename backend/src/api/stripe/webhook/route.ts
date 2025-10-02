import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/backend/lib/prisma';
import { stripe } from '@/backend/lib/stripe';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ message: 'Webhook secret or signature missing.' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text(); // Use req.text() for Next.js App Router
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ message: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = checkoutSession.subscription as string;
      const customerId = checkoutSession.customer as string;
      const userId = checkoutSession.metadata?.userId as string;

      if (subscriptionId && customerId && userId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { role: true }
        });

        const updateData: any = {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        };

        if (user?.role === 'NUTRITIONIST') {
          updateData.subscriptionStatus = 'PENDING';
          updateData.isPro = false;
        } else {
          updateData.isPro = true;
        }

        await prisma.user.update({
          where: { id: userId },
          data: updateData,
        });

        if (user?.role === 'NUTRITIONIST') {
          await prisma.notification.create({
            data: {
              nutritionistId: userId,
              type: 'SUBSCRIPTION',
              title: 'Pagamento Recebido',
              message: 'Seu pagamento foi confirmado. Aguarde aprovação do cadastro para acessar todas as funcionalidades.',
              read: false,
            },
          });
        }
      }
      break;
    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice;
      const succeededSubscriptionId = invoice.subscription as string;

      if (succeededSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(succeededSubscriptionId);
        await prisma.user.update({
          where: { stripeSubscriptionId: succeededSubscriptionId },
          data: {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            isPro: true,
          },
        });
      }
      break;
    case 'invoice.payment_failed':
      const failedInvoice = event.data.object as Stripe.Invoice;
      const failedSubscriptionId = failedInvoice.subscription as string;

      if (failedSubscriptionId) {
        const user = await prisma.user.findUnique({
          where: { stripeSubscriptionId: failedSubscriptionId },
        });

        if (user) {
          await prisma.user.update({
            where: { stripeSubscriptionId: failedSubscriptionId },
            data: {
              isPro: false,
            },
          });

          await prisma.notification.create({
            data: {
              nutritionistId: user.id,
              type: 'SUBSCRIPTION',
              title: 'Falha no Pagamento',
              message: 'Houve uma falha no processamento do seu pagamento. Por favor, atualize seus dados de pagamento para continuar usando a plataforma.',
              read: false,
            },
          });

          if (user.email) {
            const { sendEmail } = await import('@/app/lib/sendgrid');
            await sendEmail({
              to: user.email,
              from: process.env.SENDGRID_FROM_EMAIL || 'noreply@nutriexpertpro.com',
              subject: 'Falha no Pagamento - Nutri Xpert Pro',
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #ef4444;">Falha no Pagamento</h2>
                  <p>Olá ${user.name || 'Nutricionista'},</p>
                  <p>Infelizmente, houve uma falha no processamento do seu último pagamento.</p>
                  <p>Seu acesso à plataforma foi temporariamente suspenso. Para reativar, por favor atualize seus dados de pagamento.</p>
                  <p>
                    <a href="${process.env.NEXTAUTH_URL}/assinatura" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
                      Atualizar Pagamento
                    </a>
                  </p>
                  <p>Se você tiver dúvidas, entre em contato com nosso suporte.</p>
                  <p>Atenciosamente,<br>Equipe Nutri Xpert Pro</p>
                </div>
              `,
            });
          }
        }
      }
      break;
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;

      await prisma.user.update({
        where: { stripeSubscriptionId: deletedSubscription.id },
        data: {
          isPro: false,
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
        },
      });
      break;
    // Add more event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
