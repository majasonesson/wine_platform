export interface StripeCheckoutSession {
  url: string;
  sessionId?: string;
}

export interface CreateSubscriptionRequest {
  priceId: string;
  userId: number;
}

export interface CancelSubscriptionRequest {
  userId: number;
}

export const STRIPE_PRICE_IDS = {
  FREE_TIER: 'price_1RBYWRFPy4bqkt3MvVg7mTbQ',
  BASIC: 'price_1QzcPLFPy4bqkt3MpWFyTCFj',
  STANDARD: 'price_1QzcQ3FPy4bqkt3MWXSmL1R8',
  PREMIUM: 'price_1QzcQeFPy4bqkt3MGn07agJa',
} as const;

export const PLAN_LABELS: Record<string, number> = {
  [STRIPE_PRICE_IDS.FREE_TIER]: 3,
  [STRIPE_PRICE_IDS.BASIC]: 15,
  [STRIPE_PRICE_IDS.STANDARD]: 30,
  [STRIPE_PRICE_IDS.PREMIUM]: 50,
};

