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

    async updateManager(managerId, updateData) {
        return await Manager.findByIdAndUpdate(managerId, updateData, { new: true });
      }

    async deleteManager(id) {
        return await Manager.findByIdAndDelete(id);
    }

    async getAllManagers() {
        return await Manager.find({});
    }
    async updateProfilePicture(managerId, imageUrl) {
        try {
          const updatedManager = await Manager.findByIdAndUpdate(managerId, {
            profilePicture: imageUrl,
          }, { new: true });
          return updatedManager;
        } catch (error) {
          throw new Error('Error updating profile picture');
        }
      }
}

module.exports = new ManagerRepository();
