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
      const hotels = await Hotel.find({isListed: true});
      return hotels;
    } catch (error) {
      throw new Error('Error fetching hotels: ' + error.message);
    }
  }
  async findHotelsByFilters({ searchTerm, checkInDate, checkOutDate, guestCount }) {
    const query = {};
    if (searchTerm) {
        const regex = new RegExp(searchTerm, 'i');
        query.$or = [
            { 'location.address': regex },
            { 'location.city': regex },
            { 'location.state': regex },
            { 'location.country': regex },
            { name: regex }
        ];
    }
    if (checkInDate && checkOutDate) {
        query.$and = [
            { checkInTime: { $lte: checkInDate } },
            { checkOutTime: { $gte: checkOutDate } }
        ];
    }
    if (guestCount) {
        const guestCountNumber = parseInt(guestCount, 10);  
        if (!isNaN(guestCountNumber)) {
            query.roomTypes = { 
                $elemMatch: { maxGuests: { $gte: guestCountNumber } }
            };
        }

    try {
        const hotels = await Hotel.find(query);
        return hotels;
    } catch (error) {
        throw new Error('Error finding hotels with specified filters');
    }
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
  async countByManagerId(managerId) {
    return Hotel.countDocuments({ managerId });
  }
  async updateHotel(hotelId, hotelData) {
    try {
      const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, hotelData, { new: true }).populate('category services');
      if (!updatedHotel) {
        throw new Error('Hotel not found');
      }
      return updatedHotel;
    } catch (error) {
      throw new Error('Error updating hotel: ' + error.message);
    }
  }

  async updateListingStatus(hotelId, isListed) {
    try {
      const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, { isListed }, { new: true });
      if (!updatedHotel) {
        throw new Error('Hotel not found');
      }
      return updatedHotel;
    } catch (error) {
      throw new Error('Error updating hotel listing status: ' + error.message);
    }
  }

}

module.exports = new HotelRepository();
