// src/controllers/walletController.js
const WalletService = require('../services/walletService');

class WalletController {
    async getBalance(req, res) {
        const userId = req.user._id;
        try {
          const { balance, transactions } = await WalletService.getBalance(userId);
          res.status(200).json({ balance, transactions });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }

  async addFunds(req, res) {
    const userId = req.user._id;
    const { amount } = req.body;
    try {
      const updatedUser = await WalletService.addFunds(userId, amount);
      res.status(200).json({
        message: 'Funds added',
        balance: updatedUser.walletBalance,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deductFunds(req, res) {
    const userId = req.user._id;
    const { amount } = req.body;
    try {
      const updatedUser = await WalletService.deductFunds(userId, amount);
      res.status(200).json({
        message: 'Funds deducted',
        balance: updatedUser.walletBalance,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new WalletController();
