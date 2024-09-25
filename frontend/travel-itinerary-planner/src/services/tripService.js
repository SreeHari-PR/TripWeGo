// src/services/tripService.js
import api from './api';

const getTrips = async (token) => {
  const response = await api.get('/trips', {
    headers: { Authorization: token },
  });
  return response.data;
};

const getTrip = async (tripId, token) => {
  const response = await api.get(`/trips/${tripId}`, {
    headers: { Authorization: token },
  });
  return response.data;
};

const createTrip = async (tripData, token) => {
  const response = await api.post('/trips', tripData, {
    headers: { Authorization: token },
  });
  return response.data;
};

export { getTrips, getTrip, createTrip };
