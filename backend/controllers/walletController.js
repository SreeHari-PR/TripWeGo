// src/controllers/walletController.js
const WalletService = require('../services/walletService');
const HttpStatusCodes=require('../utils/httpStatusCodes')

class WalletController {
    async getBalance(req, res) {
        const userId = req.user._id;
        try {
          const { balance, transactions } = await WalletService.getBalance(userId);
          res.status(HttpStatusCodes.OK).json({ balance, transactions });
        } catch (error) {
          res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
      }

  async addFunds(req, res) {
    const userId = req.user._id;
    const { amount } = req.body;
    try {
      const updatedUser = await WalletService.addFunds(userId, amount);
      res.status(HttpStatusCodes.OK).json({
        message: 'Funds added',
        balance: updatedUser.walletBalance,
      });
    } catch (error) {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  async deductFunds(req, res) {
    const userId = req.user._id;
    const { amount } = req.body;
    try {
      const updatedUser = await WalletService.deductFunds(userId, amount);
      res.status(HttpStatusCodes.OK).json({
        message: 'Funds deducted',
        balance: updatedUser.walletBalance,
      });
    } catch (error) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }
}

module.exports = new WalletController();
