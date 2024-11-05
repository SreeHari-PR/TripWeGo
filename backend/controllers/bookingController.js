// src/controllers/bookingController.js

const bookingService = require('../services/bookingService');

const bookingController = {
    async listUserBookings(req, res) {
        try {
          const userId = req.user._id;
          const bookings = await bookingService.listUserBookings(userId);
          res.status(200).json({ success: true, bookings });
        } catch (error) {
          res.status(500).json({ success: false, message: 'Error retrieving bookings' });
        }
      },
      async listManagerBookings(req, res) {
        try {
          const { managerId } = req.params;
          console.log(req.params,'managerid');
          

            const bookings = await bookingService.listManagerBookings(managerId);
            console.log(bookings,'bookings')
            res.status(200).json({ success: true, bookings });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error retrieving manager bookings' });
        }
    },
    
      async cancelBooking(req, res) {
        try {
          const { bookingId } = req.params;
          const cancelledBooking = await bookingService.cancelUserBooking(bookingId);
          if (!cancelledBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
          }
          res.status(200).json({ success: true, booking: cancelledBooking });
        } catch (error) {
          res.status(500).json({ success: false, message: 'Error canceling booking' });
        }
      }
};

module.exports = bookingController;
