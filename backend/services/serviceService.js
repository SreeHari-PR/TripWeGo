const serviceRepository = require('../repositories/serviceRepository');

class ServiceService {
    async createService(serviceData) {
        const { name, description, icon } = serviceData;

        // Validate the input
        if (!name) {
            throw new Error('Service name is required');
        }

        // Check if service already exists
        const existingService = await serviceRepository.findByName(name);
        if (existingService) {
            throw new Error('Service with this name already exists');
        }

        // Add new service via the repository
        return await serviceRepository.createService({ name, description, icon });
    }

    async getAllServices() {
        // Fetch all services via the repository
        return await serviceRepository.getAllServices();
    }

    // More business logic related to services can go here
}

module.exports = new ServiceService();
