// src/services/adminService.js

const userRepository = require('../repositories/userRepository');
const managerRepository=require('../repositories/managerRepository')
const walletRepository=require('../repositories/walletRepository')
const adminRepository=require('../repositories/adminRepository')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AdminService {
    async loginAdmin(email, password) {
        const user = await userRepository.findUserByEmail(email);
        if (!user || !user.isAdmin) {
            throw new Error('Invalid email or password');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new Error('Invalid email or password');
        }

        const token = user.generateAuthToken();
        console.log(token,'token');
        
        return { token, user };
    }

    async listUsers() {
        return await userRepository.getAllUsers();
    }

    async listManagers() {
        return await managerRepository.getAllManagers();
    }
    async getManagerDetails(id) {
        const manager = await managerRepository.findManagerById(id);
        console.log(manager,'manager')
        if (!manager) {
            throw new Error('Manager not found');
        }
        return manager; 
    }

    async approveManager(id) {
        const manager = await managerRepository.findManagerById(id);
        if (!manager) throw new Error('Manager not found');
        manager.approved = true;
        await manager.save();
        return manager;
    }

    async blockUser(id) {
        const user = await userRepository.findUserById(id);
        if (!user) throw new Error('User not found');
        user.isBlocked = true;
        await user.save();
        return user;
    }

    async unblockUser(id) {
        const user = await userRepository.findUserById(id);
        if (!user) throw new Error('User not found');
        user.isBlocked = false;
        await user.save();
        return user;
    }
    async getAdminWalletDetails() {
       
        const admin = await walletRepository.getAdminWalletAndTransactions();
        
        if (!admin) {
            throw new Error('Admin not found');
        }

        return {
            walletBalance: admin.walletBalance,
            transactions: admin.transactions
        };
    }
    async fetchAdminDashboardData() {
        try {
          const data = await adminRepository.getAdminDashboardData();
          console.log(data,'djhsd')
          return data;
        } catch (error) {
            console.log(error)
          throw new Error(error.message);
        }
      }
}

module.exports = new AdminService();
