import api from './api';

export const getBookings = async (token) => {
  try {
    const response = await api.get('/users/bookings', {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data.bookings;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to load bookings';
  }
};

export const cancelBooking = async (bookingId, token, cancellationFee) => {
  try {
    await api.delete(`/users/bookings/${bookingId}/cancel`, {
      headers: {
        Authorization: ` ${token}`,
      },
      data: { cancellationFee },
    });
  } catch (error) {
    throw error.response?.data?.message || 'Failed to cancel booking';
  }
};
