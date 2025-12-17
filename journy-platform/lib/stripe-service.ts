import Cookies from 'js-cookie';
import { CreateSubscriptionRequest, CancelSubscriptionRequest } from '@/types/stripe.types';

const getToken = () => Cookies.get('token');

// Create subscription
export const createSubscription = async (priceId: string, userId: number) => {
  const token = getToken();
  
  const response = await fetch('/api/stripe/create-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      priceId,
      userId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create subscription');
  }

  return response.json();
};

// Create registration subscription (public - no auth required)
export const createRegisterSubscription = async (
  priceId: string,
  registrationData: any
) => {
  const response = await fetch('/api/stripe/create-subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: registrationData.email,
      priceId,
      registrationData,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create registration subscription');
  }

  return response.json();
};

// Cancel subscription
export const cancelSubscription = async (userId: number) => {
  const token = getToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch('/api/stripe/cancel-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to cancel subscription');
  }

  return response.json();
};

