// src/repositories/adminRepository.js
const {User} = require('../models/userModel');  
const {Manager} = require('../models/managerModel');
const Booking = require('../models/bookingModel');

const getAdminDashboardData = async () => {
  try {
    // Fetch total users
    const totalUsers = await User.countDocuments();

    // Fetch total managers
    const totalManagers = await Manager.countDocuments();
    

    // Fetch total bookings
    const totalBookings = await Booking.countDocuments();
    const totalRevenue=await User.findOne({ isAdmin: true }).select('walletBalance');
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('hotelId', 'name') 
      .populate('userId', 'name email'); 
    return {
      totalUsers,
      totalManagers,
      totalBookings,
      totalRevenue,
      recentBookings,
    };
  } catch (error) {
    throw new Error('Failed to fetch admin dashboard data');
  }
};

module.exports = { getAdminDashboardData };
