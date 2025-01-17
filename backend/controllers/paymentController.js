// src/controllers/PaymentController.js
const PaymentService = require('../services/paymentService');
const HttpStatusCodes=require('../utils/httpStatusCodes')

class PaymentController {
  // src/controllers/PaymentController.js
async createOrder(req, res) {
  const { hotelId, roomType, amount } = req.body;
  console.log('Amount in rupees:', amount);
  try {
    const order = await PaymentService.createOrder(hotelId, amount);
    return res.status(HttpStatusCodes.OK).json({ order });
  } catch (error) {
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}


  async verifyPayment(req, res) {
    const { paymentId, orderId, signature, hotelId, roomTypes,checkInDate, checkOutDate,amount} = req.body;
    console.log('verifypayment',req.body)
    const userId = req.user._id; 
    
   
    console.log('Received userId:', userId);  
    console.log('Received amount:', amount); 
    try {
      const bookingDetails = {
        hotelId,
        roomTypes,
        userId,
        paymentId,
        orderId,
        paymentStatus: 'Paid',
        checkInDate, 
        checkOutDate,
        amount,
      };
  
      console.log(bookingDetails,'jhkkjjkhj')
      const booking = await PaymentService.verifyPayment(paymentId, orderId, signature, bookingDetails,amount);
      return res.status(HttpStatusCodes.OK).json({ message: 'Payment successful, booking confirmed', booking });
    } catch (error) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }
}

module.exports = new PaymentController();
