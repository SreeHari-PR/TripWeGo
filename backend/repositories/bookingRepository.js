// src/repositories/bookingRepository.js

const Booking = require('../models/bookingModel');
const Hotel=require('../models/hotelModel')

const bookingRepository = {
    async getBookingsByUserId(userId) {
        try {
          const bookings = await Booking.find({ userId,cancelled:false}).populate('hotelId');
          console.log(bookings,'bookings')
          return bookings;
         
        } catch (error) {
          throw new Error('Error retrieving bookings');
        }
      },

      async getBookingsByManager(managerId) {
        try {
            const bookings = await Booking.find({
                cancelled: false,
                hotelId: { $in: await this.getManagerHotels(managerId) }
            }).populate('hotelId');
            console.log(bookings,'jkhjkk')
            return bookings;
        } catch (error) {
            throw new Error('Error retrieving manager bookings');
        }
    },

    async getManagerHotels(managerId) {
        try {
            const hotels = await Hotel.find({ managerId }).select('_id'); 
            return hotels.map(hotel => hotel._id);
        } catch (error) {
            throw new Error('Error fetching manager hotels');
        }
    },
    
      async cancelBooking(bookingId) {
        try {
          const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { cancelled: true }, 
            { new: true }
          );
          return booking;
        } catch (error) {
          throw new Error('Error canceling booking');
        }
      }
};

module.exports = bookingRepository;
