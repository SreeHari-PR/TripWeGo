// src/services/PaymentService.js
const PaymentRepository = require('../repositories/paymentRepository');
const {User} = require('../models/userModel'); 
const Hotel=require('../models/hotelModel')


const MANAGER_SHARE_PERCENTAGE = 0.8;
const ADMIN_SHARE_PERCENTAGE = 0.2;

class PaymentService {
  async createOrder(hotelId, roomType, amount) {
    const currency = 'INR';
    const receipt = `receipt_${hotelId}`;
    const order = await PaymentRepository.createOrder(amount, currency, receipt);
    console.log(order, 'order2');

    return order;
  }

  async verifyPayment(paymentId, orderId, signature, bookingDetails,amount) {
    const isValidSignature = await PaymentRepository.verifySignature(paymentId, orderId, signature);
    console.log(amount,'amount')
    if (!isValidSignature) {
      throw new Error('Invalid payment signature');
    }

    const booking = await PaymentRepository.saveBooking(bookingDetails);


    await this.distributeAmount(bookingDetails.hotelId, amount);

    return booking;
  }

  async distributeAmount(hotelId, amount) {

    try {
      if (typeof amount !== 'number' || isNaN(amount)) {
        throw new Error(`Invalid amount: ${amount}`);
      }
  
      const managerShare = amount * MANAGER_SHARE_PERCENTAGE;
      const adminShare = amount * ADMIN_SHARE_PERCENTAGE;
      const hotel = await Hotel.findById(hotelId).populate('managerId');
      const manager = hotel.managerId;
        console.log('Manager retrieved:', manager)
      if (manager) {
        const currentWalletBalance = manager.walletBalance || 0; 
        manager.walletBalance = currentWalletBalance + managerShare;
  
        if (isNaN(manager.walletBalance)) {
          throw new Error(`Calculated walletBalance is NaN for manager with hotel ID: ${hotelId}`);
        }
  
        await manager.save();
      } else {
        console.error('Manager not found for hotel ID:', hotelId);
      }
      const adminUser = await User.findOne({ isAdmin: true });
      if (adminUser) {
        const currentAdminWalletBalance = adminUser.walletBalance || 0; 
        adminUser.walletBalance = currentAdminWalletBalance + adminShare;
  
        if (isNaN(adminUser.walletBalance)) {
          throw new Error('Calculated walletBalance is NaN for admin user.');
        }
  
        await adminUser.save();
      } else {
        console.error('Admin account not found');
      }
    } catch (error) {
      console.error('Error distributing payment:', error);
      throw new Error('Failed to distribute payment between admin and manager');
    }
  }
  
}

module.exports = new PaymentService();
