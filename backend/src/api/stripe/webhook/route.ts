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
        await prisma.user.update({
          where: { stripeSubscriptionId: failedSubscriptionId },
          data: {
            isPro: false, // Revoke access on payment failure
          },
        });
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
