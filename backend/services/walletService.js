// src/services/walletService.js
const WalletRepository = require('../repositories/walletRepository');

class WalletService {
    async getBalance(userId) {
        const balance = await WalletRepository.getBalance(userId); 
      
        return  balance;
      }

  async addFunds(userId, amount) {
    return await WalletRepository.credit(userId, amount);
  }

  async deductFunds(userId, amount) {
    const balance = await this.getBalance(userId);
    if (balance < amount) {
      throw new Error('Insufficient balance');
    }
    return await WalletRepository.debit(userId, amount);
  }
}

module.exports = new WalletService();
