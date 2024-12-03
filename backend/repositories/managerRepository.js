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
            const manager = await Manager.findById(managerId, 'walletBalance transactions');
            if (!manager) {
                throw new Error('Manager not found');
            }
    
            const sortedTransactions = manager.transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
            return {
                walletBalance: manager.walletBalance,
                transactions: sortedTransactions
            };
        } catch (error) {
            console.error('Error retrieving wallet and transactions:', error);
            throw error;
        }
    }
    
    
    async deductBalance(managerId, amount) {
      try {
          const transaction = {
              date: new Date(),
              description: 'Balance deduction',
              amount: amount,
              transactionType: 'debit'
          };
  
          return await Manager.findByIdAndUpdate(
              managerId,
              {
                  $inc: { walletBalance: -amount },
                  $push: { transactions: transaction }
              },
              { new: true }
          );
      } catch (error) {
          console.error('Error deducting balance and adding transaction:', error);
          throw error;
      }
  }
  
}

module.exports = new ManagerRepository();
