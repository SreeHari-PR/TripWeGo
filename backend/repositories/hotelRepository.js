// src/repositories/hotelRepository.js
const Hotel = require('../models/hotelModel');

class HotelRepository {
  async createHotel(hotelData) {
    const hotel = new Hotel(hotelData);
    return hotel.save();
  }

  async findAllByManager(managerId) {
    return Hotel.find({ managerId: managerId })
    .populate('category', 'name')    
    .populate('services', 'name');   
}
async getAllHotels() {
    try {
      const hotels = await Hotel.find(); // Fetch all hotels from the database
      return hotels;
    } catch (error) {
      throw new Error('Error fetching hotels: ' + error.message);
    }
  }
}

module.exports = new HotelRepository();
