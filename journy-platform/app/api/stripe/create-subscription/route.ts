import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { CreateSubscriptionRequest } from '@/types/stripe.types';
import { STRIPE_PRICE_IDS } from '@/types/stripe.types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_PRODUCTION || '');

const FREE_TIER_PRICE_ID = STRIPE_PRICE_IDS.FREE_TIER;

export async function POST(request: NextRequest) {
  try {
    const body: CreateSubscriptionRequest = await request.json();
    const { priceId, userId } = body;

    const isFreetier = priceId === FREE_TIER_PRICE_ID;

    const existingUser = await prisma.users.findUnique({
      where: { UserID: parseInt(userId.toString()) },
      select: {
        stripeCustomerId: true,
        subscriptionStatus: true,
        hasUsedFreeTier: true,
        priceId: true,
        labels: true,
      },
    });

    if (
      isFreetier &&
      (existingUser?.hasUsedFreeTier === 1 || existingUser?.priceId)
    ) {
      return NextResponse.json(
        {
          error:
            'Free tier is only available for new users who have never had a paid subscription',
        },
        { status: 400 }
      );
    }

    let customer;

    if (existingUser?.stripeCustomerId) {
      try {
        const retrievedCustomer = await stripe.customers.retrieve(
          existingUser.stripeCustomerId
        );

        // Check if customer was deleted
        if (retrievedCustomer.deleted) {
          customer = await stripe.customers.create({
            metadata: { userId: userId.toString() },
          });
        } else {
          customer = retrievedCustomer;
          // Check and patch missing metadata
          if (!customer.metadata?.userId) {
            await stripe.customers.update(customer.id, {
              metadata: { userId: userId.toString() },
            });
          }
        }
      } catch (stripeError) {
        customer = await stripe.customers.create({
          metadata: { userId: userId.toString() },
        });
      }
    } else {
      customer = await stripe.customers.create({
        metadata: { userId: userId.toString() },
      });

      await prisma.users.update({
        where: { UserID: parseInt(userId.toString()) },
        data: { stripeCustomerId: customer.id },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/canceled`,
      metadata: {
        userId: userId.toString(),
        isReactivation: 'false',
      },
      allow_promotion_codes: true,
    });

    if (isFreetier) {
      await prisma.users.update({
        where: { UserID: parseInt(userId.toString()) },
        data: { hasUsedFreeTier: 1 },
      });
    }

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error: any) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      {
        error: error.message,
        type: error.type,
        code: error.code,
      },
      { status: 500 }
    );
  }
}

