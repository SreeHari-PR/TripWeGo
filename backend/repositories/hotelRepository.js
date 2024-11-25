// src/repositories/hotelRepository.js
const Hotel = require('../models/hotelModel');

class HotelRepository {
  async createHotel(hotelData) {
    try {
      const hotel = new Hotel(hotelData);
      return await hotel.save();
    } catch (error) {
      throw new Error('Error creating hotel: ' + error.message);
    }
  }

  async findAllByManager(managerId) {
    try {
      return await Hotel.find({ managerId: managerId })
        .populate('category', 'name')
        .populate('services', 'name');
    } catch (error) {
      throw new Error('Error finding hotels by manager: ' + error.message);
    }
  }

  async getAllHotels() {
    try {
      const hotels = await Hotel.find({ isListed: true });
      return hotels;
    } catch (error) {
      throw new Error('Error fetching hotels: ' + error.message);
    }
  }

  async findHotelsByFilters({ searchTerm, checkInDate, checkOutDate, guestCount }) {
    try {
      const query = {};
      if (searchTerm) {
        const regex = new RegExp(searchTerm, 'i');
        query.$or = [
          { 'location.address': regex },
          { 'location.city': regex },
          { 'location.state': regex },
          { 'location.country': regex },
          { name: regex },
        ];
      }
      if (checkInDate && checkOutDate) {
        query.$and = [
          { checkInTime: { $lte: checkInDate } },
          { checkOutTime: { $gte: checkOutDate } },
        ];
      }
      if (guestCount) {
        const guestCountNumber = parseInt(guestCount, 10);
        if (!isNaN(guestCountNumber)) {
          query.roomTypes = {
            $elemMatch: { maxGuests: { $gte: guestCountNumber } },
          };
        }
      }

      const hotels = await Hotel.find(query);
      return hotels;
    } catch (error) {
      throw new Error('Error finding hotels with specified filters: ' + error.message);
    }
  }

  async getHotelById(hotelId) {
    try {
      const hotel = await Hotel.findById(hotelId).populate('services');
      if (!hotel) {
        throw new Error('Hotel not found');
      }
      return hotel;
    } catch (error) {
      throw new Error('Error retrieving hotel: ' + error.message);
    }
  }

  async countByManagerId(managerId) {
    try {
      return await Hotel.countDocuments({ managerId });
    } catch (error) {
      throw new Error('Error counting hotels by manager: ' + error.message);
    }
  }

  async updateHotel(hotelId, hotelData) {
    try {
      const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, hotelData, { new: true })
        .populate('category services');
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

  async addReviewToHotel(hotelId, userId, rating, comment) {
    try {
      // Find the hotel by ID
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        throw new Error('Hotel not found');
      }
  
      // Check if the user has already reviewed the hotel
      const existingReview = hotel.reviews.find(
        (review) => review.userId.toString() === userId
      );
      if (existingReview) {
        throw new Error('User has already reviewed this hotel');
      }
  
      // Add the new review
      const newReview = {
        userId,
        rating,
        comment,
      };
      hotel.reviews.push(newReview);
  
      // Update the average rating
      const totalReviews = hotel.reviews.length;
      const totalRating = hotel.reviews.reduce((sum, review) => sum + review.rating, 0);
      hotel.rating = totalRating / totalReviews;
  
      // Save the updated hotel
      await hotel.save();
  
      return {
        message: 'Review added successfully',
        hotel,
      };
    } catch (error) {
      throw error;
    }
  }
  async getReviewsByHotelId  (hotelId)  {
    try {
      const hotel = await Hotel.findById(hotelId).populate('reviews.userId', 'name'); // Optionally, populate user details
      if (!hotel) {
        throw new Error("Hotel not found");
      }
      return hotel.reviews; // Return only the reviews
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

module.exports = new HotelRepository();
