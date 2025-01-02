// src/services/hotelService.js

import api from '../api'; 

export const fetchHotels = async (page = 1, searchTerm = '') => {
  try {
    const response = await api.get(`/admin/hotels`, {
      params: { page, searchTerm },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching hotels');
  }
};

export const deleteHotel = async (hotelId) => {
  try {
    await api.delete(`/admin/hotels/${hotelId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error deleting hotel');
  }
};

// Add other hotel-related services here if needed (e.g., createHotel, updateHotel, etc.)
