import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import sql from 'mssql';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import connectToDatabase from '@/lib/db';
import { PLAN_LABELS } from '@/types/stripe.types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_PRODUCTION || '');

const endpointSecret = process.env.WEBHOOK_SECRET_KEY_PRODUCTION || '';

// Disable body parser for webhook
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature') || '';

    console.log('Webhook received');
    console.log('Signature:', sig);

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
      console.log('Webhook received:', {
        type: event.type,
        objectId: 'id' in event.data.object ? event.data.object.id : 'N/A',
      });
    } catch (err: any) {
      console.error('Webhook Error:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.metadata?.signupFlow === 'true') {
    try {
      console.log('handle new user creation');
      console.log('Processing completed checkout:', session);

      if (!session.subscription) {
        throw new Error('No subscription found in checkout session');
      }

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
        { expand: ['items.data.price'] }
      ) as Stripe.Subscription;
      console.log('Retrieved subscription:', subscription.id);

      const customerId = session.customer as string;
      let customer: Stripe.Customer | null = null;
      
      try {
        const retrievedCustomer = await stripe.customers.retrieve(customerId);
        customer = retrievedCustomer.deleted ? null : retrievedCustomer;
        console.log('Retrieved customer:', customer?.id);
      } catch (err) {
        console.error('Stripe customer not found:', customerId);
      }

      const userEmail = session.metadata.email;
      const priceId = session.metadata.priceId;
      const newLabels = PLAN_LABELS[priceId] ?? 0;

      let existingUser = await prisma.users.findFirst({
        where: { stripeCustomerId: customerId },
      });

      if (!existingUser) {
        existingUser = await prisma.users.findUnique({
          where: { Email: userEmail },
        });
      }

      if (existingUser && session.metadata.signupFlow !== 'true') {
        console.log('Processing for user:', existingUser.UserID);

        const currentUser = await prisma.users.findUnique({
          where: { UserID: existingUser.UserID },
          select: {
            labels: true,
            hasUsedFreeTier: true,
          },
        });

        const currentLabels = currentUser?.labels ?? 0;
        const totalLabels = currentLabels + newLabels;

        await prisma.users.update({
          where: { UserID: existingUser.UserID },
          data: {
            stripeCustomerId: customer?.id || null,
            subscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            priceId,
            subscriptionEndDate: new Date((subscription as any).current_period_end * 1000),
            labels: totalLabels,
          },
        });

        console.log('Updated user data');
      } else if (session.metadata.signupFlow === 'true') {
        try {
          console.log('registerData', session.metadata);

          const hashedPassword = await bcrypt.hash(session.metadata.password, 12);

          const pool = await connectToDatabase();
          const transaction = new sql.Transaction(pool);
          await transaction.begin();

          try {
            const userResult = await transaction
              .request()
              .input('FullName', sql.NVarChar, session.metadata.fullName)
              .input('Email', sql.NVarChar, session.metadata.email)
              .input('Password', sql.NVarChar, hashedPassword)
              .input('Role', sql.NVarChar, session.metadata.role)
              .input('Company', sql.NVarChar, session.metadata.company)
              .input('Country', sql.NVarChar, session.metadata.country)
              .input('Region', sql.NVarChar, session.metadata.region)
              .input('District', sql.NVarChar, session.metadata.district).query(`
                INSERT INTO Users (FullName, Email, Password, Role, Company, Country, Region, District)
                OUTPUT INSERTED.UserID
                VALUES (@FullName, @Email, @Password, @Role, @Company, @Country, @Region, @District)
              `);

            const userId = userResult.recordset[0].UserID;

            if (session.metadata.certificationDetails) {
              const certificationDetails = JSON.parse(session.metadata.certificationDetails);
              
              for (const [certType, certData] of Object.entries(certificationDetails)) {
                const cert = certData as any;
                if (cert.expiryDate && cert.referenceNumber) {
                  await transaction
                    .request()
                    .input('UserID', sql.Int, userId)
                    .input('CertificationType', sql.NVarChar, certType)
                    .input('ExpiryDate', sql.Date, new Date(cert.expiryDate))
                    .input('ReferenceNumber', sql.NVarChar, cert.referenceNumber)
                    .input('ImageURL', sql.NVarChar, cert.imageURL || null).query(`
                      INSERT INTO UserCertifications 
                      (UserID, CertificationType, ExpiryDate, ReferenceNumber, ImageURL)
                      VALUES 
                      (@UserID, @CertificationType, @ExpiryDate, @ReferenceNumber, @ImageURL)
                    `);
                }
              }
            }

            await transaction.commit();

            const newUser = await prisma.users.findUnique({
              where: { Email: session.metadata.email },
            });

            if (newUser) {
              await prisma.users.update({
                where: { UserID: newUser.UserID },
                data: {
                  stripeCustomerId: customer?.id || null,
                  subscriptionId: subscription.id,
                  subscriptionStatus: subscription.status,
                  priceId,
                  subscriptionEndDate: new Date(
                    (subscription as any).current_period_end * 1000
                  ),
                  labels: newLabels,
                  Role: newUser.Role || session.metadata.role,
                  FullName: newUser.FullName || session.metadata.fullName,
                  Company: newUser.Company || session.metadata.company,
                  Country: newUser.Country || session.metadata.country,
                  Region: newUser.Region || session.metadata.region,
                  District: newUser.District || session.metadata.district,
                },
              });
              console.log('Updated user with Stripe data');
            }
          } catch (err) {
            await transaction.rollback();
            throw err;
          }
        } catch (err) {
          console.error('registerUser failed:', err);
          throw err;
        }
      }
    } catch (error) {
      console.error('Detailed webhook error:', error);
      throw error;
    }
  } else {
    // handle existing user subscription update
    try {
      console.log('handle existing user subscription update');
      console.log('Processing completed checkout:', session);

      if (!session.subscription) {
        throw new Error('No subscription found in checkout session');
      }

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
        { expand: ['items.data.price'] }
      ) as Stripe.Subscription;

      const customer = await stripe.customers.retrieve(session.customer as string);
      console.log('Retrieved customer:', customer.id);

      if (customer.deleted || !customer.metadata.userId) {
        throw new Error('No userId found in customer metadata');
      }

      const userId = parseInt(customer.metadata.userId);
      console.log('Processing for user:', userId);

      const currentUser = await prisma.users.findUnique({
        where: { UserID: userId },
        select: {
          labels: true,
          hasUsedFreeTier: true,
        },
      });

      const currentLabels = currentUser?.labels ?? 0;
      const priceId = subscription.items.data[0].price.id;
      const newLabels = PLAN_LABELS[priceId];

      await prisma.users.update({
        where: { UserID: userId },
        data: {
          stripeCustomerId: customer.id,
          subscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          priceId: priceId,
          subscriptionEndDate: new Date((subscription as any).current_period_end * 1000),
          labels: newLabels,
        },
      });

      console.log('Updated user data');
    } catch (error) {
      console.error('Detailed webhook error:', error);
      throw error;
    }
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    
    if (customer.deleted) {
      throw new Error('Customer deleted');
    }

    const user = await prisma.users.findFirst({
      where: { stripeCustomerId: customer.id },
    });

    if (!user) {
      throw new Error('User not found for stripeCustomerId: ' + customer.id);
    }

    if (subscription.status === 'canceled' || user.subscriptionStatus === 'canceled') {
      console.log('Subscription already cancelled, skipping update');
      return;
    }

    const priceId = subscription.items.data[0].price.id;
    const newLabels = PLAN_LABELS[priceId];

    await prisma.users.update({
      where: { UserID: user.UserID },
      data: {
        subscriptionStatus: subscription.status,
        subscriptionEndDate: new Date((subscription as any).current_period_end * 1000),
        priceId,
        labels: newLabels,
      },
    });
  } catch (error) {
    console.error('Error in handleSubscriptionUpdated:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    
    if (customer.deleted) {
      throw new Error('Customer deleted');
    }

    const user = await prisma.users.findFirst({
      where: { stripeCustomerId: customer.id },
    });

    if (!user) {
      throw new Error('User not found for stripeCustomerId: ' + customer.id);
    }

    await prisma.users.update({
      where: { UserID: user.UserID },
      data: {
        subscriptionStatus: 'canceled',
        subscriptionId: null,
        subscriptionEndDate: null,
      },
    });

    console.log('Subscription cancelled for user:', user.UserID);
  } catch (error) {
    console.error('Error in handleSubscriptionDeleted:', error);
    throw error;
  }
}

