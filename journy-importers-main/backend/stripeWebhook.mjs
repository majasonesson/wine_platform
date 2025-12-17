import express from 'express';
import Stripe from 'stripe';
import 'dotenv/config';
import prisma from './lib/prisma.mjs';
import { registerUser } from './controllers/userController.mjs';
import sql from 'mssql';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_PRODUCTION);
const endpointSecret = process.env.WEBHOOK_SECRET_KEY_PRODUCTION;

const webhookHandler = async (request, response) => {
  const sig = request.headers['stripe-signature'];

  console.log('Webhook received');
  console.log('Signature:', sig);
  console.log('Secret:', endpointSecret);

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    console.log('Webhook received:', {
      type: event.type,
      objectId: event.data.object.id,
    });

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleCheckoutCompleted(session);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.json({ received: true });
  } catch (err) {
    console.error('Webhook Error:', err.message);
    response.status(400).send(`Webhook Error: ${err.message}`);
  }
};

async function handleCheckoutCompleted(session) {
  // handle new user creation
  if (session.metadata.signupFlow === 'true') {
    try {
      console.log('handle new user creation');
      console.log('Processing completed checkout:', session);

      if (!session.subscription) {
        throw new Error('No subscription found in checkout session');
      }

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription,
        {
          expand: ['items.data.price'],
        }
      );
      console.log('Retrieved subscription:', subscription.id);

      const customerId = session.customer;

      let customer;
      try {
        customer = await stripe.customers.retrieve(customerId);
        console.log('Retrieved customer:', customer.id);
      } catch (err) {
        console.error('Stripe customer not found:', customerId);
        customer = null;
      }

      const userEmail = session.metadata.email;
      const isSignupFlow = session.metadata.signupFlow === 'true';

      const priceId = session.metadata.priceId;
      const newLabels = getPlanLabels(priceId) ?? 0;

      // Try finding by Stripe customer ID first
      let existingUser = await prisma.users.findFirst({
        where: { stripeCustomerId: customerId },
      });

      // Fallback to email if not found
      if (!existingUser) {
        existingUser = await prisma.users.findUnique({
          where: { Email: userEmail },
        });
      }

      if (existingUser && !isSignupFlow) {
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

        const updatedUser = await prisma.users.update({
          where: { UserID: existingUser.UserID },
          data: {
            stripeCustomerId: customer?.id || null,
            subscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            priceId,
            subscriptionEndDate: new Date(
              subscription.current_period_end * 1000
            ),
            labels: totalLabels,
          },
        });

        console.log('Updated user data:', updatedUser);
      } else if (isSignupFlow) {
        try{
          console.log('registerData', session.metadata);
  
          await registerUser(
            session.metadata.fullName,
            session.metadata.email,
            session.metadata.password,
            session.metadata.role,
            session.metadata.company,
            session.metadata.country,
            session.metadata.region,
            session.metadata.district,
            JSON.parse(session.metadata.certificationDetails)
          );
  
          const newUser = await prisma.users.findUnique({
            where: { Email: session.metadata.email },
          });
  
          if (newUser) {
            // Update user with Stripe data and ensure Role is set
            await prisma.users.update({
              where: { UserID: newUser.UserID },
              data: {
                stripeCustomerId: customer?.id || null,
                subscriptionId: subscription.id,
                subscriptionStatus: subscription.status,
                priceId,
                subscriptionEndDate: new Date(
                  subscription.current_period_end * 1000
                ),
                labels: newLabels,
                // Ensure Role is set from metadata if missing
                Role: newUser.Role || session.metadata.role,
                // Also update other fields if they're missing
                FullName: newUser.FullName || session.metadata.fullName,
                Company: newUser.Company || session.metadata.company,
                Country: newUser.Country || session.metadata.country,
                Region: newUser.Region || session.metadata.region,
                District: newUser.District || session.metadata.district,
              },
            });
            console.log('Updated user with Stripe data and ensured Role is set');
          } else {
            console.error(
              'New user registration failed: not found after register'
            );
          }
        } catch (err) {
          console.error('registerUser failed:', err);
          throw err; // Re-throw to prevent webhook from succeeding with incomplete data
        }

        // SAFETY NET: Update role using direct SQL query to Azure
        if (session.metadata.email && session.metadata.role) {
          try {
            const { default: connectToDatabase } = await import('./ConnectDB.mjs');
            const pool = await connectToDatabase();
            
            console.log(`Setting role to: ${session.metadata.role} for email: ${session.metadata.email}`);
            
            await pool.request()
              .input('Role', sql.NVarChar, session.metadata.role)
              .input('Email', sql.NVarChar, session.metadata.email)
              .query('UPDATE Users SET Role = @Role WHERE Email = @Email');
              
            console.log('Successfully updated role via SQL');
          } catch (sqlError) {
            console.error('Failed to update role via SQL:', sqlError);
          }
        }
      }
    } catch (error) {
      console.error('Detailed webhook error:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
    // handle existing user subscription update
  } else {
    try {
      console.log('handle existing user subscription update');
      console.log('Processing completed checkout:', session);

      if (!session.subscription) {
        throw new Error('No subscription found in checkout session');
      }

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription,
        {
          expand: ['items.data.price'],
        }
      );
      console.log('Retrieved subscription:', subscription.id);

      const customer = await stripe.customers.retrieve(session.customer);
      console.log('Retrieved customer:', customer.id);

      if (!customer.metadata.userId) {
        throw new Error('No userId found in customer metadata');
      }

      const userId = parseInt(customer.metadata.userId);
      console.log('Processing for user:', userId);

      // Get current user data to preserve existing labels
      const currentUser = await prisma.users.findUnique({
        where: { UserID: userId },
        select: {
          labels: true,
          hasUsedFreeTier: true,
        },
      });

      const currentLabels = currentUser?.labels ?? 0;
      console.log('Current labels:', currentLabels);

      // Calculate new labels to add
      const priceId = subscription.items.data[0].price.id;
      const newLabels = getPlanLabels(priceId);
      console.log('New labels to add:', newLabels);

      // Update user data while preserving existing labels
      const updatedUser = await prisma.users.update({
        where: {
          UserID: userId,
        },
        data: {
          stripeCustomerId: customer.id,
          subscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          priceId: priceId,
          subscriptionEndDate: new Date(subscription.current_period_end * 1000),
          labels: newLabels,
          // Don't modify hasUsedFreeTier - keep its existing value
        },
      });

      console.log('Updated user data:', updatedUser);
    } catch (error) {
      console.error('Detailed webhook error:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }
}

// Update getPlanLabels function to be more explicit
function getPlanLabels(priceId) {
  const planLabels = {
    price_1RBYWRFPy4bqkt3MvVg7mTbQ: 3, // Free tier
    price_1QzcPLFPy4bqkt3MpWFyTCFj: 15, // Basic plan
    price_1QzcQ3FPy4bqkt3MWXSmL1R8: 30, // Standard plan
    price_1QzcQeFPy4bqkt3MGn07agJa: 50, // Premium plan
  };

  const labels = planLabels[priceId];
  if (!labels) {
    console.error('No label count found for priceId:', priceId);
    return 3; // Default to free tier
  }
  return labels;
}

async function handleSubscriptionUpdated(subscription) {
  try {
    const customer = await stripe.customers.retrieve(subscription.customer);
    const user = await prisma.users.findUnique({
      where: { stripeCustomerId: customer.id },
    });
    if (!user) {
      throw new Error('User not found for stripeCustomerId: ' + customer.id);
    }

    // Don't update if subscription is cancelled
    if (subscription.status === 'canceled') {
      console.log('Subscription already cancelled, skipping update');
      return;
    }

    // Don't update if user's subscription is already marked as cancelled
    if (user?.subscriptionStatus === 'canceled') {
      console.log('User subscription already cancelled, skipping update');
      return;
    }

    const priceId = subscription.items.data[0].price.id;
    const newLabels = getPlanLabels(priceId);

    console.log('Updating subscription for user:', user.UserID);
    console.log('New priceId:', priceId);
    console.log('New labels:', newLabels);

    await prisma.users.update({
      where: { UserID: user.UserID },
      data: {
        subscriptionStatus: subscription.status,
        subscriptionEndDate: new Date(subscription.current_period_end * 1000),
        priceId,
        labels: newLabels,
      },
    });
  } catch (error) {
    console.error('Error in handleSubscriptionUpdated:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription) {
  try {
    const customer = await stripe.customers.retrieve(subscription.customer);

    const user = await prisma.users.findUnique({
      where: { stripeCustomerId: customer.id },
    });
    if (!user) {
      throw new Error('User not found for stripeCustomerId: ' + customer.id);
    }

    await prisma.users.update({
      where: {
        UserID: user.UserID,
      },
      data: {
        subscriptionStatus: 'canceled',
        subscriptionId: null,
        subscriptionEndDate: null,
        // Keep existing labels
      },
    });

    console.log('Subscription cancelled for user:', customer.metadata.userId);
  } catch (error) {
    console.error('Error in handleSubscriptionDeleted:', error);
    throw error;
  }
}

export default webhookHandler;
