const Service = require('../models/serviceModel');

class ServiceRepository {
    async createService(serviceData) {
        try {
            const service = new Service(serviceData);
            return await service.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllServices() {
        try {
            return await Service.find();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async findServiceById(serviceId) {
        try {
            return await Service.findById(serviceId);
        } catch (error) {
            throw new Error('Service not found');
        }
    }
    async findByName(name) {
        try {
            return await Service.findOne({ name });
        } catch (error) {
            throw new Error('Error fetching service by name');
        }
    }
}

module.exports = new ServiceRepository();
