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
      const hotels = await Hotel.find(); 
      return hotels;
    } catch (error) {
      throw new Error('Error fetching hotels: ' + error.message);
    }
  }
  async findByLocation(location) {
    try {
      const regex = new RegExp(location, 'i'); // Create a case-insensitive regex

      const hotels = await Hotel.find({
        $or: [
          { 'location.address': regex },
          { 'location.city': regex },
          { 'location.state': regex },
          { 'location.country': regex },
        ],
      });
      return hotels;
      
    } catch (error) {
      throw new Error('Error finding hotels by location');
    }
  }
  async getHotelById(hotelId) {

    try {
        const hotel = await Hotel.findById(hotelId).populate('services')
        if (!hotel) {
            throw new Error('Hotel not found');
        }
        return hotel;
    } catch (error) {
        throw new Error(`Error retrieving hotel: ${error.message}`);
    }
}
}

module.exports = new HotelRepository();
