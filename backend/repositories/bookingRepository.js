// src/repositories/bookingRepository.js

const Booking = require('../models/bookingModel');
const Hotel = require('../models/hotelModel');

const bookingRepository = {
    async getBookingsByUserId(userId) {
        try {
            return await Booking.find({ userId, cancelled: false })
                .populate('hotelId')
                .sort({ createdAt: -1 });
        } catch (error) {
            console.error("Error fetching bookings by user ID:", error);
            throw error;
        }
    },

    async getBookingsByManager(managerId) {
        try {
            const hotelIds = await this.getManagerHotels(managerId);
            return await Booking.find({
                hotelId: { $in: hotelIds }
            })
                .populate('hotelId')
                .sort({ createdAt: -1 });
        } catch (error) {
            console.error("Error fetching bookings by manager ID:", error);
            throw error;
        }
    },

    async getManagerHotels(managerId) {
        try {
            const hotels = await Hotel.find({ managerId }).select('_id');
            return hotels.map(hotel => hotel._id);
        } catch (error) {
            console.error("Error fetching hotels by manager ID:", error);
            throw error;
        }
    },

    async getBookingById(bookingId) {
        try {
            return await Booking.findById(bookingId).populate('hotelId');
        } catch (error) {
            console.error("Error fetching booking by ID:", error);
            throw error;
        }
    },

    async cancelBooking(bookingId) {
        try {
            return await Booking.findByIdAndUpdate(bookingId, { cancelled: true }, { new: true });
        } catch (error) {
            console.error("Error cancelling booking:", error);
            throw error;
        }
    },

    async getBookings(page = 1, limit = 10, search = '') {
        try {
            const query = search
                ? { paymentStatus: { $regex: search, $options: 'i' } }
                : {};

            const bookings = await Booking.find(query)
                .populate({ path: 'userId', select: 'name email' })
                .populate({
                    path: 'hotelId',
                    populate: { path: 'managerId', select: 'name email contactNumber' },
                    select: 'name location',
                })
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 });

            const totalBookings = await Booking.countDocuments(query);

            return {
                data: bookings,
                totalPages: Math.ceil(totalBookings / limit),
                currentPage: page,
            };
        } catch (error) {
            console.error("Error fetching bookings with pagination and search:", error);
            throw error;
        }
    }
};

module.exports = bookingRepository;
