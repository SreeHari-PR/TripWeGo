// src/repositories/managerRepository.js
const { Manager } = require('../models/managerModel')
const Transaction=require('../models/transactionModel')

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
      async getManagersWithHotelCount() {
        return Manager.aggregate([
          {
            $lookup: {
              from: 'hotels', 
              localField: '_id',
              foreignField: 'managerId',
              as: 'hotels',
            },
          },
          {
            $addFields: {
              hotelCount: { $size: '$hotels' },
            },
          },
        ]);
      }

      async getWalletAndTransactions(managerId) {
        try {
            const manager = await Manager.findById(managerId, 'walletBalance');
            if (!manager) {
                throw new Error('Manager not found');
            }
            const transactions = await Transaction.find({ managerId })
                .sort({ date: -1 })
                .select('amount type date description');
            
            return {
                walletBalance: manager.walletBalance,
                transactions
            };
        } catch (error) {
            console.error('Error retrieving wallet and transactions:', error);
            throw error;
        }
    }
}

module.exports = new ManagerRepository();
