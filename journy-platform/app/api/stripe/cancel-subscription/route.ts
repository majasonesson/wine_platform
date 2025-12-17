import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { CancelSubscriptionRequest } from '@/types/stripe.types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_PRODUCTION || '');

export async function POST(request: NextRequest) {
  try {
    const body: CancelSubscriptionRequest = await request.json();
    const { userId } = body;
    
    console.log('Cancelling subscription for user:', userId);

    const user = await prisma.users.findUnique({
      where: { UserID: parseInt(userId.toString()) },
      select: {
        subscriptionId: true,
        labels: true,
      },
    });

    if (!user?.subscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      );
    }

    await stripe.subscriptions.cancel(user.subscriptionId);

    await prisma.users.update({
      where: { UserID: parseInt(userId.toString()) },
      data: {
        subscriptionStatus: 'canceled',
        subscriptionId: null,
        subscriptionEndDate: null,
        priceId: null,
      },
    });

    console.log('Subscription cancelled for user:', userId);
    return NextResponse.json(
      {
        status: 'success',
        message: 'Subscription cancelled successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

