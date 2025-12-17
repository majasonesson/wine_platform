import axios from 'axios';
import Cookies from 'js-cookie';

export const createSubscription = async (priceId, userId) => {
  const token = Cookies.get('token');
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/stripe/create-subscription`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        priceId,
        userId,
      }),
    }
  );

  return response;
};

export const changeImporterSubscription = async (priceId, userId) => {
  const token = Cookies.get('token');
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/importerChangeStripe/change-importer-subscription`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        priceId,
        userId,
      }),
    }
  );

  return response;
};

export const createRegisterSubscription = async (priceId, registrationData) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/publicStripe/create-checkout-session`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: registrationData.email,
        priceId,
        registrationData,
      }),
    }
  );
  
  return response;
};

export const cancelSubscription = async (userId) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/stripe/cancel-subscription`,
      { userId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
};
