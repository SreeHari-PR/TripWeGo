// src/services/bookingService.js

const bookingRepository = require('../repositories/bookingRepository');
const managerRepository = require('../repositories/managerRepository');
const userRepository=require('../repositories/userRepository');
const walletRepository = require('../repositories/walletRepository');
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
            console.log(bookings,'manager');
            
            return bookings;
        } catch (error) {
            throw error;
        }
    },
    
    async cancelUserBooking(bookingId) {
      try {
         
          const booking = await bookingRepository.getBookingById(bookingId);
          if (!booking) throw new Error('Booking not found');
  
          const checkInDate = new Date(booking.checkInDate);
          const currentDate = new Date();
          const daysUntilCheckIn = Math.ceil((checkInDate - currentDate) / (1000 * 60 * 60 * 24));
  
          let refundAmount = 0;
          if (daysUntilCheckIn >= 7) {
              refundAmount = booking.amount; 
          } else if (daysUntilCheckIn >= 3) {
              refundAmount = booking.amount * 0.5; 
          } else {
              refundAmount = 0; 
          }
  
          console.log(`Refund Amount: ${refundAmount}`);
  
         
          const adminDeduction = refundAmount * 0.2;
          const managerDeduction = refundAmount * 0.8;
  
          
          if (adminDeduction > 0) {
              await userRepository.deductBalance(booking.userId, adminDeduction);
          }
          if (managerDeduction > 0) {
              await managerRepository.deductBalance(booking.hotelId.managerId, managerDeduction);
          }
          await userRepository.addBalance(booking.userId, refundAmount);
          await walletRepository.addTransaction(
            booking.userId,
            refundAmount,
            'credit',
            'Booking refund'
        );
          const cancelledBooking = await bookingRepository.cancelBooking(bookingId);
          cancelledBooking.refundAmount = refundAmount; 
          return cancelledBooking;
      } catch (error) {
          console.error('Error cancelling booking:', error);
          throw new Error('Error canceling booking');
      }
  },
  async listBookings(page, limit, search) {
    return await bookingRepository.getBookings(page, limit, search);
  },
  
};

module.exports = bookingService;
