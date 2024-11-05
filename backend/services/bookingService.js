// src/services/bookingService.js

const bookingRepository = require('../repositories/bookingRepository');

const bookingService = {
    async listUserBookings(userId) {
        try {
          const bookings = await bookingRepository.getBookingsByUserId(userId);
          return bookings;
        } catch (error) {
          throw error;
        }
      },
      async listManagerBookings(managerId) {
        try {
            const bookings = await bookingRepository.getBookingsByManager(managerId);
            console.log(bookings,'bookings1')
            return bookings;
        } catch (error) {
            throw error;
        }
    },
    
      async cancelUserBooking(bookingId) {
        try {
          const cancelledBooking = await bookingRepository.cancelBooking(bookingId);
          return cancelledBooking;
        } catch (error) {
          throw error;
        }
      }
};

module.exports = bookingService;
