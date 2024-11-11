// src/repositories/bookingRepository.js

const Booking = require('../models/bookingModel');
const Hotel=require('../models/hotelModel')

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
    },
    async getBookings(page = 1, limit = 10, search = '') {
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
         console.log(bookings,'bookings')
        const totalBookings = await Booking.countDocuments(query);
    
        return {
          data: bookings,
          totalPages: Math.ceil(totalBookings / limit),
          currentPage: page,
        };
      }
};

module.exports = bookingRepository;
