// config/razorpayConfig.js
const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
    key_id:"rzp_test_XnSWcDHvXwMKdf",
  key_secret:"NehtVXa3MOzjSmg29peiBR9S",
});

module.exports = razorpayInstance;
