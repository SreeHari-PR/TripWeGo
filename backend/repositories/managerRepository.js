// src/repositories/managerRepository.js
const { Manager } = require('../models/managerModel')

class ManagerRepository {
    async createManager(managerData) {
        const manager = new Manager(managerData);
        await manager.save();
        return manager;
    }

    async findManagerById(id) {
        return await Manager.findById(id);
    }

    async findManagerByEmail(email) {
        return await Manager.findOne({ email });
    }

    async updateManager(id, updateData) {
        return await Manager.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteManager(id) {
        return await Manager.findByIdAndDelete(id);
    }

    async getAllManagers() {
        return await Manager.find({});
    }
}

module.exports = new ManagerRepository();
