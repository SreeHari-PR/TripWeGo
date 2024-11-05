// src/controllers/PaymentController.js
const PaymentService = require('../services/paymentService');

class PaymentController {
  async createOrder(req, res) {
    const { hotelId, roomType, amount } = req.body;
    console.log(req.body,'order');
    console.log(amount,'amount')
     try {
      const order = await PaymentService.createOrder(hotelId, roomType, amount);
      console.log(amount,'amount')
      console.log(order,'order1')
      return res.status(200).json({ order });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async verifyPayment(req, res) {
    const { paymentId, orderId, signature, hotelId, roomType,checkInDate, checkOutDate,amount  } = req.body;
    const userId = req.user._id; 
   
    console.log('Received userId:', userId);  
    console.log('Received amount:', amount); 
    try {
      const bookingDetails = {
        hotelId,
        roomType,
        userId,
        paymentId,
        orderId,
        paymentStatus: 'Paid',
        checkInDate, 
        checkOutDate,
        amount,
      };
      const booking = await PaymentService.verifyPayment(paymentId, orderId, signature, bookingDetails,amount);
      return res.status(200).json({ message: 'Payment successful, booking confirmed', booking });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new PaymentController();
