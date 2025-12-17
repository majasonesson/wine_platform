import Cookies from 'js-cookie';
import { Wine } from '@/types/wine.types';
import { ConnectionRequestWithUser, ConnectionStatus } from '@/types/connection.types';
import { User } from '@/types/user.types';

const getToken = () => Cookies.get('token');

const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Get all users (for producer search)
export const getAllUsers = async (): Promise<User[]> => {
  const response = await fetch('/api/users');

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  const data = await response.json();
  return data.data;
};

// Update wine publish status
export const updatePublishStatus = async (
  id: number,
  publishStatus: { IsPublished: boolean }
) => {
  const token = getToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`/api/wines/${id}/publish`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(publishStatus),
  });

  if (!response.ok) {
    throw new Error('Failed to update publish status');
  }

  return response.json();
};

// Create connection request
export const createConnectionRequest = async (
  ProducerID: number,
  Status: ConnectionStatus = 'PENDING'
) => {
  const token = getToken();

  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch('/api/connections/request', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ProducerID, Status }),
  });

  if (!response.ok) {
    throw new Error('Failed to create connection request');
  }

  return response.json();
};

// Update connection status
export const updateConnectionStatus = async (
  ConnectionID: number,
  Status: ConnectionStatus
) => {
  const token = getToken();

  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`/api/connections/status/${ConnectionID}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ Status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update connection status');
  }

  return response.json();
};

// Get connection requests
export const getConnectionRequests = async (): Promise<ConnectionRequestWithUser[]> => {
  const token = getToken();

  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch('/api/connections/requests', {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch connection requests');
  }

  const data = await response.json();
  return data.data;
};

// Get published wines for connected producers
export const getPublishedWines = async (): Promise<Wine[]> => {
  const token = getToken();

  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch('/api/connections/published/wines', {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch published wines');
  }

  return response.json();
};

// Get published wine by id for connected producers
export const getPublishedWine = async (wineID: number): Promise<Wine> => {
  const token = getToken();

  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`/api/connections/published/wine/${wineID}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch published wine');
  }

  return response.json();
};

