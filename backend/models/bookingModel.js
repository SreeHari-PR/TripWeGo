// src/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    roomTypes: [
        {
            type: String,
            required: true
        }
    ],
    paymentId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        default: 'Pending'
    },
    checkInDate: { 
        type: Date, 
        required: true 
    },  
    checkOutDate: { 
        type: Date, 
        required: true 
    },
    amount: {
        type: Number,
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    cancelled: {
        type: Boolean, 
        default: false 
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
