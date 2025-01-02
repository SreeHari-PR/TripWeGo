import api from '../api';

export const getBookings = async () => {
  try {
    const response = await api.get('/users/bookings');
    return response.data.bookings;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to load bookings';
  }
};

export const cancelBooking = async (bookingId, cancellationFee) => {
  try {
    await api.delete(`/users/bookings/${bookingId}/cancel`, {
     data: { cancellationFee },
    });
  } catch (error) {
    throw error.response?.data?.message || 'Failed to cancel booking';
  }
};
