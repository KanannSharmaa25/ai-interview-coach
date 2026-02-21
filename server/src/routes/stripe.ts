import { Router, type Response } from 'express';
import Stripe from 'stripe';
import { stripe, STRIPE_WEBHOOK_SECRET } from '../lib/stripe.js';
import { prisma } from '../lib/db.js';
import { requireAuth, type AuthReq } from '../middleware/auth.js';

export const stripeRouter = Router();

stripeRouter.post('/create-checkout-session', requireAuth, async (req: AuthReq, res: Response) => {
  if (!stripe) {
    res.status(503).json({ error: 'Stripe not configured' });
    return;
  }
  const userId = req.userId!;
  const email = req.userRecord?.email ?? '';
  const { successUrl, cancelUrl } = (req.body as { successUrl?: string; cancelUrl?: string }) || {};
  let user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customerId },
    });
  }
  const priceId = process.env.STRIPE_PREMIUM_PRICE_ID;
  if (!priceId) {
    res.status(503).json({ error: 'STRIPE_PREMIUM_PRICE_ID not set' });
    return;
  }
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl || `${req.headers.origin || ''}/app/settings?success=1`,
    cancel_url: cancelUrl || `${req.headers.origin || ''}/app/settings?cancel=1`,
    metadata: { userId },
    subscription_data: { metadata: { userId } },
  });
  res.json({ url: (session as { url?: string }).url });
});

// Webhook must use raw body; mount at app level with express.raw() for this path
export async function handleStripeWebhook(rawBody: Buffer, sig: string, res: Response): Promise<void> {
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    res.status(503).end();
    return;
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown'}`);
    return;
  }
  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    const userId = sub.metadata?.userId;
    if (userId) {
      const status = sub.status;
      const plan = status === 'active' ? 'premium' : 'free';
      await prisma.user.update({
        where: { id: userId },
        data: { plan },
      });
    }
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { plan: 'premium' },
      });
    }
  }
  res.json({ received: true });
}
