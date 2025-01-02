import api from '../api';

export const hotelService = {
  getHotelDetails: async (id) => {
    const response = await api.get(`/users/hotels/${id}`);
    return response.data.hotel;
  },

  getHotelReviews: async (id) => {
    const response = await api.get(`/users/hotels/${id}/reviews`);
    return response.data.reviews;
  },

  addHotelReview: async (id, newReview) => {
    const response = await api.post(`/users/hotels/${id}/addreviews`, newReview);
    return response.data.hotel.reviews;
  },

  createOrder: async (orderData) => {
    const response = await api.post(`/users/create-order`, orderData);
    return response.data.order;
  },

  verifyPayment: async (paymentData) => {
    const token = localStorage.getItem('token');
    return api.post('/users/verify-payment', paymentData, {
      headers: {
        Authorization: `${token}`,
      },
    });
  },
};

