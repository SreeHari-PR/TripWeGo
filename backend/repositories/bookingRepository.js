// src/repositories/bookingRepository.js

const Booking = require('../models/bookingModel');

const bookingRepository = {
    async getBookingsByUserId(userId) {
        return Booking.find({ userId, cancelled: false }).populate('hotelId');
    },

    async getBookingsByManager(managerId) {
        return Booking.find({
            cancelled: false,
            hotelId: { $in: await this.getManagerHotels(managerId) }
        }).populate('hotelId');
    },

    async getManagerHotels(managerId) {
        const hotels = await Hotel.find({ managerId }).select('_id');
        return hotels.map(hotel => hotel._id);
    },

    async getBookingById(bookingId) {
        return Booking.findById(bookingId).populate('hotelId');
    },

    async cancelBooking(bookingId) {
        return Booking.findByIdAndUpdate(bookingId, { cancelled: true }, { new: true });
    }
};

module.exports = bookingRepository;
