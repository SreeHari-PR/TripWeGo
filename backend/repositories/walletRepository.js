// src/repositories/walletRepository.js
const { User } = require('../models/userModel');
const Transaction = require('../models/transactionModel');

class WalletRepository {
    async getBalance(userId) {
        const user = await User.findById(userId);
        const transactions = await Transaction.find({ userId }).sort({ date: -1 });
      
        return user ? { balance: user.walletBalance, transactions } : null;
      }

  async credit(userId, amount) {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { walletBalance: amount } },
      { new: true }
    );

    if (updatedUser) {
      await this.createTransaction(userId, amount, 'credit', 'Funds added to wallet');
    }
    return updatedUser;
  }

  async debit(userId, amount) {
    const user = await User.findById(userId);
    if (!user || user.walletBalance < amount) {
      throw new Error('Insufficient funds');
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { walletBalance: -amount } },
      { new: true }
    );

    if (updatedUser) {
      await this.createTransaction(userId, amount, 'debit', 'Funds deducted from wallet');
    }
    return updatedUser;
  }
  async createTransaction(userId, amount, type, description) {
    return await Transaction.create({
      userId,
      amount,
      type,
      description,
    });
  }
  async getAdminWalletAndTransactions() {
    try {
      const adminUser = await User.findOne({ isAdmin: true }).select('walletBalance');
      console.log(adminUser,'kjljdsj');
      
      if (!adminUser) {
        throw new Error('Admin user not found');
      }
      const transactions = await Transaction.find({ userId: adminUser._id }).sort({ date: -1 }); 
      console.log(transactions,'hsdjh')
      return {
        walletBalance: adminUser.walletBalance,
        transactions: transactions,
      };
    } catch (error) {
      console.error('Error fetching wallet balance and transactions:', error);
      throw error;
    }
  }
async addTransaction (userId, amount, type, description = '') {
  try {
      const transaction = new Transaction({
          userId,
          amount,
          type,
          description,
      });

      const savedTransaction = await transaction.save();
      return savedTransaction;
  } catch (error) {
      console.error('Error creating transaction:', error.message);
      throw new Error('Error creating transaction');
  }
};
}

module.exports = new WalletRepository();
