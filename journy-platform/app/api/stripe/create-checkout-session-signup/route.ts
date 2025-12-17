import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import bcrypt from 'bcryptjs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_PRODUCTION as string);

export async function POST(request: NextRequest) {
  try {
    const { email, priceId, registrationData } = await request.json();

    // Hash password before storing in metadata
    const hashedPassword = await bcrypt.hash(registrationData.password, 12);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/chooseplan-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/chooseplan-canceled`,
      allow_promotion_codes: true,
      metadata: {
        ...registrationData,
        email: registrationData.email,
        password: hashedPassword,
        signupFlow: 'true',
        priceId,
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

