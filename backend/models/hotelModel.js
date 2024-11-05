const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  contactInfo: {
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: false,
    },
  },
  images: {
    mainImage: {
      type: String,
      required: true,
    },
    gallery: [
      {
        type: String,
      },
    ],
  },
  roomTypes: [
    {
      type: {
        type: String,
        required: true,
      },
      number: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      maxGuests: {     
        type: Number,
        required: true,
        min: 1,        
      },
    },
  ],
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: false,
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
      },
      comment: {
        type: String,
        required: false,
      },
      rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  checkInTime: {
    type: String,
    required: true,
  },
  checkOutTime: {
    type: String,
    required: true,
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manager', 
    required: true,
  },
  openingDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isListed: {
    type: Boolean,
    default: true, 
  },
});

module.exports = mongoose.model('Hotel', hotelSchema);
