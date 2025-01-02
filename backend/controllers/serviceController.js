const serviceService = require('../services/serviceService');
const HttpStatusCodes=require('../utils/httpStatusCodes')

const createService = async (req, res) => {
    try {
        const { name, description, icon } = req.body;  // Now we accept icon too

        // Call the service layer to handle business logic
        const service = await serviceService.createService({ name, description, icon });

        return res.status(201).json({
            message: 'Service created successfully',
            service
        });
    } catch (error) {
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

const getAllServices = async (req, res) => {
    try {
        // Call the service layer to fetch services
        const services = await serviceService.getAllServices();
        return res.status(HttpStatusCodes.OK).json({ services });
    } catch (error) {
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

module.exports = {
    createService,
    getAllServices,
};
