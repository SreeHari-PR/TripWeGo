// src/repositories/PaymentRepository.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/bookingModel');

class PaymentRepository {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: "rzp_test_rwud39pugiL6zo",
      key_secret: "JLkOG8uWsGrEd7GthYgW475S",
    });
  }

  async createOrder(amount, currency, receipt) {
    try {
      const options = {
        amount, 
        currency,
        receipt
      };
      
      console.log('Creating Razorpay order with options:', options);
  
      const order = await this.razorpay.orders.create(options);
      console.log('Razorpay order created:', order); 
  
      return order;
    } catch (error) {
      console.error('Error creating Razorpay order:', error); 
      throw new Error('Failed to create Razorpay order');
    }
  }
  
  async verifySignature(paymentId, orderId, signature) {
    try {
      const generatedSignature = crypto.createHmac('sha256',"JLkOG8uWsGrEd7GthYgW475S" )
        .update(orderId + '|' + paymentId)
        .digest('hex');

      return generatedSignature === signature;
    } catch (error) {
      throw new Error('Payment verification failed');
    }
  }

  async saveBooking(bookingData) {
    try {
      console.log('Booking data to be saved:', bookingData); 
  
      const booking = new Booking(bookingData);
      await booking.save();
      return booking;
    } catch (error) {
      console.error('Error saving booking:', error); 
      throw new Error('Failed to save booking in the database');
    }
  }
  
}

module.exports = new PaymentRepository();
