import bcrypt from 'bcryptjs';
import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_PRODUCTION);

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { email, priceId, registrationData } = req.body;
    const hashedPassword = await bcrypt.hash(registrationData.password, 12);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email, // will auto-link to a new customer
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONT_END_URL}/chooseplan-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONT_END_URL}/chooseplan-canceled`,
      allow_promotion_codes: true,
      metadata: {
        ...registrationData,
        email: registrationData.email,
        password: hashedPassword,
        signupFlow: 'true',
        priceId,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Checkout creation error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

export default router;
