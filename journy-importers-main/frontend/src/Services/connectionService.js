import { mockProducerWines } from '../Utils/mockData/producersData';
import axios from 'axios';
import Cookies from 'js-cookie';

// Get all producers
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`);

    return response.data.data;
  } catch (error) {
    console.error('Error fetching Producers:', error);
    throw error;
  }
};

export const updatePublishStatus = async (id, publishStatus) => {
  try {
    const token = Cookies.get('token');

    if (!token) {
      console.log('You cant access this page');
      return;
    }
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/wines/updateIsPublished/${id}`,
      publishStatus,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating Product', error);
    throw error;
  }
};

// Create connection request
export const createConnectionRequest = async (ProducerID, Status) => {
  try {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/connections/request`,
      { ProducerID, Status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating connection request:', error);
    throw error;
  }
};

// Update connection status
export const updateConnectionStatus = async (ConnectionID, Status) => {
  try {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('updateConnectionStatus', Status);

    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/connections/status/${ConnectionID}`,
      { Status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating connection request:', error);
    throw error;
  }
};

// Get connection requests
export const getConnectionRequests = async () => {
  try {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/connections/requests`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Error getting connection status:', error);
    throw error;
  }
};

// Get published wines for connected producers
export const getPublishedWines = async () => {
  try {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/connections/published/wines`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error getting published wines:', error);
    throw error;
  }
};

// Get published wine by id for connected producers
export const getPublishedWine = async (wineID) => {
  try {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/connections/published/wine/${wineID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error getting published wine:', error);
    throw error;
  }
};
