// src/controllers/bookingController.js

const bookingService = require('../services/bookingService');
const HttpStatusCodes=require('../utils/httpStatusCodes')
const Booking = require('../models/bookingModel');

const bookingController = {
    async listUserBookings(req, res) {
        try {
          const userId = req.user._id;
          const bookings = await bookingService.listUserBookings(userId);
          res.status(HttpStatusCodes.OK).json({ success: true, bookings });
        } catch (error) {
          res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Error retrieving bookings' });
        }
      },
      async listManagerBookings(req, res) {
        try {
          const { managerId } = req.params;
          console.log(req.params,'managerid');
           const bookings = await bookingService.listManagerBookings(managerId);
            console.log(bookings,'bookings')
            res.status(HttpStatusCodes.OK).json({ success: true, bookings });
        } catch (error) {
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Error retrieving manager bookings' });
        }
    },
    
      async cancelBooking(req, res) {
        try {
          const { bookingId } = req.params;
          
          const cancelledBooking = await bookingService.cancelUserBooking(bookingId);
          

          if (!cancelledBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
          }
          res.status(HttpStatusCodes.OK).json({ success: true, booking: cancelledBooking });
        } catch (error) {
          res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Error canceling booking' });
        }
      },
      async getBookings  (req, res) {
        try {
          const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 10;
          const search = req.query.search || '';
      
          const bookings = await bookingService.listBookings(page, limit, search);
      
          res.status(HttpStatusCodes.OK).json({
            success: true,
            data: bookings.data,
            totalPages: bookings.totalPages,
            currentPage: bookings.currentPage,
          });
        } catch (error) {
          console.error('Error fetching bookings:', error);
          res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch bookings',
          });
        }
      },
      async getManagerByBooking (req, res) {
        const { bookingId } = req.params;
      
        try {
          const booking = await Booking.findById(bookingId)
            .populate({
              path: 'hotelId',
              populate: { path: 'managerId', model: 'Manager' },
            });
      
          if (!booking) return res.status(404).json({ message: 'Booking not found' });
      
          const manager = booking.hotelId.managerId;
          if (!manager) return res.status(404).json({ message: 'Manager not found' });
      
          res.status(200).json(manager);
        } catch (error) {
          console.error('Error fetching manager data:', error);
          res.status(500).json({ message: 'Server error' });
        }
      },
      
    

};

module.exports = bookingController;
