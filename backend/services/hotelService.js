// src/services/hotelService.js
const mongoose = require('mongoose')
const hotelRepository = require('../repositories/hotelRepository');
const Category = require('../models/categoryModel');
const Service = require('../models/serviceModel');
const Joi = require('joi');

class HotelService {
  async addHotel(managerId, hotelData, { mainImageUrl, imageUrls }) {
    console.log(managerId, 'id')
    delete hotelData.images;
    const schema = Joi.object({
      // managerId: Joi.string().hex().length(24).required(),
      name: Joi.string().min(3).max(50).required(),
      description: Joi.string().required(),
      location: Joi.object({
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
      }).required(),
      contactInfo: Joi.object({
        phone: Joi.string().required(),
        email: Joi.string().email().required(),
        website: Joi.string().uri().optional(),
      }).required(),
      // images: Joi.object({
      //     mainImage: Joi.string().uri().required(),
      //     gallery: Joi.array().items(Joi.string().uri()).optional(),
      // }).optional(),
      roomTypes: Joi.array().items(
        Joi.object({
          type: Joi.string().required(),
          number: Joi.number().integer().required(),
          price: Joi.number().precision(2).required(),
          maxGuests: Joi.number().integer().positive().required(),
        })

      ).required(),
      services: Joi.array().items(Joi.string().hex().length(24)).optional(),
      category: Joi.string().required(),
      rating: Joi.number().min(0).max(5).optional(),
      reviews: Joi.array().items(
        Joi.object({
          userId: Joi.string().hex().length(24),
          comment: Joi.string().optional(),
          rating: Joi.number().min(0).max(5).required(),
          createdAt: Joi.date().optional(),
        })
      ).optional(),
      checkInTime: Joi.string().required(),
      checkOutTime: Joi.string().required(),
      openingDate: Joi.date().required(),
    });


    const { error } = schema.validate(hotelData);
    if (error) {
      console.log('Validation Error:', error.details);
      throw new Error(error.details[0].message);
    }


    const categoryExists = await Category.findById(hotelData.category);
    if (!categoryExists) {
      throw new Error('Invalid category selected.');
    }


    const serviceIds = hotelData.services || [];
    const servicesExist = await Service.find({ '_id': { $in: serviceIds } });
    if (servicesExist.length !== serviceIds.length) {
      throw new Error('One or more selected services are invalid.');
    }


    const hotelToCreate = {
      ...hotelData,
      managerId,
      images: {
        mainImage: mainImageUrl,
        gallery: imageUrls,
      }
    };
    return hotelRepository.createHotel(hotelToCreate);
  }

  async listHotelsByManager(managerId) {

    return await hotelRepository.findAllByManager(managerId);
  }
  async getAllHotels() {
    try {
      const hotels = await hotelRepository.getAllHotels();
      return hotels;
    } catch (error) {
      throw new Error('Error fetching hotels: ' + error.message);
    }
  }
  async searchHotels({ searchTerm, checkInDate, checkOutDate, guestCount }) {
    if (!searchTerm && !checkInDate && !checkOutDate && !guestCount) {
        throw new Error('At least one search parameter is required');
    }

    const checkIn = checkInDate ? new Date(checkInDate) : null;
    const checkOut = checkOutDate ? new Date(checkOutDate) : null;

    return await hotelRepository.findHotelsByFilters({
        searchTerm,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guestCount
    });
}
  async getSingleHotelPage(hotelId) {
    try {
      const hotel = await hotelRepository.getHotelById(hotelId);
      return hotel;
    } catch (error) {
      throw new Error(`Failed to fetch hotel details: ${error.message}`);
    }
  }
  async editHotel(hotelId, hotelData) {


    if (hotelData.category) {
      const categoryExists = await Category.findById(hotelData.category);
      if (!categoryExists) {
        throw new Error('Invalid category selected.');
      }
    }
    if (hotelData.services && hotelData.services.length > 0) {
      const serviceIds = await Promise.all(
        hotelData.services.map(async (service) => {
          if (mongoose.Types.ObjectId.isValid(service)) {
            return service;
          } else {
            const serviceDoc = await Service.findOne({ name: service });
            if (!serviceDoc) {
              throw new Error(`Service '${service}' does not exist.`);
            }
            return serviceDoc._id;
          }
        })
      );
      const servicesExist = await Service.find({ '_id': { $in: serviceIds } });
      if (servicesExist.length !== serviceIds.length) {
        throw new Error('One or more selected services are invalid.');
      }
      hotelData.services = serviceIds;
    }

    return hotelRepository.updateHotel(hotelId, hotelData);
  }

  async updateListingStatus(hotelId, isListed) {
    return await hotelRepository.updateListingStatus(hotelId, isListed);
  }
}

module.exports = new HotelService();
