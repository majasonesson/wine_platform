import express from 'express';
import Stripe from 'stripe';
import prisma from '../lib/prisma.mjs';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_PRODUCTION);

const FREE_TIER_PRICE_ID =
  process.env.NODE_ENV === 'development'
    ? 'price_1RBYWRFPy4bqkt3MvVg7mTbQ' // Your test free tier price ID
    : 'price_1RBYWRFPy4bqkt3MvVg7mTbQ'; // Replace with production ID when ready

router.post('/change-importer-subscription', async (req, res) => {
  try {
    const { priceId, userId } = req.body;

    // Check if this is the free tier
    const isFreetier = priceId === FREE_TIER_PRICE_ID;

    // Get user data including free tier usage
    const existingUser = await prisma.users.findUnique({
      where: { UserID: parseInt(userId) },
      select: {
        stripeCustomerId: true,
        subscriptionStatus: true,
        hasUsedFreeTier: true,
        priceId: true,
        labels: true,
      },
    });

    // Prevent free tier reuse
    if (
      isFreetier &&
      (existingUser.hasUsedFreeTier === 1 || existingUser.priceId)
    ) {
      return res.status(400).json({
        error:
          'Free tier is only available for new users who have never had a paid subscription',
      });
    }

    // Create or retrieve customer
    let customer;

    if (existingUser?.stripeCustomerId) {
      try {
        customer = await stripe.customers.retrieve(
          existingUser.stripeCustomerId
        );

        // Check and patch missing metadata
        if (!customer.metadata?.userId) {
          await stripe.customers.update(customer.id, {
            metadata: { userId: userId.toString() },
          });
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

      // Update user with new Stripe customer ID
      await prisma.users.update({
        where: { UserID: parseInt(userId) },
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
      success_url: `${process.env.FRONT_END_URL}/importer-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONT_END_URL}/importer-canceled`,
      metadata: {
        userId: userId.toString(),
        isReactivation: 'false',
      },
      allow_promotion_codes: true,
    });
    res.json({ url: session.url });

    // If this is free tier, mark it as  used
    if (isFreetier) {
      await prisma.users.update({
        where: { UserID: parseInt(userId) },
        data: { hasUsedFreeTier: 1 },
      });
    }
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({
      error: error.message,
      type: error.type,
      code: error.code,
    });
  }
});

router.post('/cancel-subscription', async (req, res) => {
  try {
    const { userId } = req.body;
    console.log('Cancelling subscription for user:', userId);

    const user = await prisma.users.findUnique({
      where: { UserID: parseInt(userId) },
      select: {
        subscriptionId: true,
        labels: true, // Add this to preserve current labels
      },
    });

    if (!user?.subscriptionId) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    // Cancel immediately instead of at period end
    const subscription = await stripe.subscriptions.cancel(user.subscriptionId);

    // Keep existing labels but mark subscription as cancelled
    await prisma.users.update({
      where: { UserID: parseInt(userId) },
      data: {
        subscriptionStatus: 'canceled',
        subscriptionId: null, // Clear the subscription ID
        subscriptionEndDate: null, // Clear the end date
        priceId: null, // Clear the price ID
        // Don't modify labels - keep existing ones
      },
    });

    console.log('Subscription cancelled for user:', userId);
    res.json({
      status: 'success',
      message: 'Subscription cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
