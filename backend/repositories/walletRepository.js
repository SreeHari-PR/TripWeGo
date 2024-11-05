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

  // New method to create a transaction record
  async createTransaction(userId, amount, type, description) {
    return await Transaction.create({
      userId,
      amount,
      type,
      description,
    });
  }
  async getAdminWalletAndTransactions() {
    return await User.findOne({ isAdmin: true }).select('walletBalance transactions');
}
}

module.exports = new WalletRepository();
