// src/services/hotelService.js
const hotelRepository = require('../repositories/hotelRepository');
const Category = require('../models/categoryModel');
const Service = require('../models/serviceModel');
const Joi = require('joi');

class HotelService {
  async addHotel(managerId, hotelData,  { mainImageUrl, imageUrls }) {
    // Joi validation schema for hotel data
    console.log(managerId,'id')
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

    // Validate the incoming hotel data
    const { error } = schema.validate(hotelData);
    if (error) {
      console.log('Validation Error:', error.details);
        throw new Error(error.details[0].message);
    }

    // Check if the category exists
    const categoryExists = await Category.findById(hotelData.category);
    if (!categoryExists) {
        throw new Error('Invalid category selected.');
    }

    // Check if the services exist (if services are provided)
    const serviceIds = hotelData.services || [];
    const servicesExist = await Service.find({ '_id': { $in: serviceIds } });
    if (servicesExist.length !== serviceIds.length) {
        throw new Error('One or more selected services are invalid.');
    }

    // Prepare the hotel data for insertion
    const hotelToCreate = { 
        ...hotelData, 
        managerId, 
        images: {
          mainImage: mainImageUrl, 
          gallery: imageUrls,
        } 
    };

    // Call the repository function to create the hotel
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
}

module.exports = new HotelService();
