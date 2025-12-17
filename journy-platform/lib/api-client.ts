import Cookies from 'js-cookie';
import { Wine, WineFormData } from '@/types/wine.types';
import { User } from '@/types/user.types';
import { LoginResponse } from '@/types/api.types';

const getToken = () => Cookies.get('token');

const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Authentication
export const signIn = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
};

export const updateRole = async (email: string, role: string) => {
  const response = await fetch('/api/users/update/role', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, role }),
  });

  if (!response.ok) {
    throw new Error('Failed to update role');
  }

  return response.json();
};

export const createPassword = async (newPassword: string, token: string) => {
  const response = await fetch(`/api/users/createpassword/${token}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newPassword }),
  });

  if (!response.ok) {
    throw new Error('Failed to create password');
  }

  return response.json();
};

// Wine/Product Management
export const getProduct = async (wineId: number): Promise<Wine> => {
  const response = await fetch(`/api/wines/${wineId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch wine');
  }

  return response.json();
};

export const getProducts = async (): Promise<Wine[]> => {
  const token = getToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch('/api/wines', {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch wines');
  }

  return response.json();
};

export const addProduct = async (formData: FormData) => {
  const token = getToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch('/api/wines', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to add wine');
  }

  return response.json();
};

export const updateProduct = async (id: number, formData: FormData) => {
  const token = getToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`/api/wines/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to update wine');
  }

  return response.json();
};

export const deleteProduct = async (id: number) => {
  const token = getToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`/api/wines/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete wine');
  }

  return response.json();
};

// User Management
export const fetchUser = async (id: number) => {
  const token = getToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`/api/users/profile/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  return response.json();
};

export const changePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
) => {
  const token = getToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`/api/users/change-password/${userId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!response.ok) {
    throw new Error('Failed to change password');
  }

  return response.json();
};

export const getCertifications = async () => {
  const token = getToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch('/api/users/certifications', {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch certifications');
  }

  return response.json();
};

export const requestPasswordReset = async (email: string) => {
  const response = await fetch('/api/users/request-reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Failed to request password reset');
  }

  return response.json();
};

export const updateUser = async (id: number, formData: FormData) => {
  const token = getToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`/api/users/profile/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  const data = await response.json();
  return data.data;
};

