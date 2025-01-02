// services/bookingService.js
import api from "../api";

export const getAdminBookings = async () => {
  try {
    const response = await api.get('/admin/bookings');
    return response.data.data;
  } catch (error) {
    throw error; 
  }
};
