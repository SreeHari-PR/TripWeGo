require('dotenv').config();
const bcrypt = require('bcrypt');
const { findManagerById, findManagerByEmail, createManager,updateManager } = require('../repositories/managerRepository');
const {  validateManager } = require('../models/managerModel');
const sendEmail = require('../utils/sendEmail');
const generateOtp = require('../utils/generateOtp');
const pendingManagers = new Map();


class ManagerService {
    async registerManager(managerData) {
        const { error } = validateManager(managerData);
        if (error) {
          throw new Error(error.details[0].message);
        }
        const existingManager = await findManagerByEmail(managerData.email);
        if (existingManager) {
          throw new Error('Email already exists');
        }
        const otp = generateOtp();
        console.log('managerotp', otp);
      
        pendingManagers.set(managerData.email, { ...managerData, otp });
      
        // Send OTP via email
        await sendEmail(managerData.email, 'Your OTP Code', `Your OTP code is ${otp}. Please enter this code to verify your email.`);
      
        return { message: 'Manager registered successfully. Please verify your OTP.' };
      }

    async verifyManagerOtp(email, otp) {
        const managerData = pendingManagers.get(email);
        if (!managerData) {
            throw new Error('OTP expired or manager not found');
        }

        if (managerData.otp !== otp) {
            throw new Error('Invalid OTP');
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(managerData.password, salt);

        const newManager = {
            ...managerData,
            password: hashedPassword,
            verified: true,
            license: managerData.license,
            kyc: managerData.kyc,
        };

        const manager = await createManager(newManager);
        pendingManagers.delete(email);

        return { message: 'Manager verified and registered successfully.', manager };
    }

    async approveManager(managerId) {
        const manager = await findManagerById(managerId);
        if (!manager) {
            throw new Error('Manager not found');
        }

        manager.approved = true;
        await manager.save();
        return manager;
    }

    async loginManager(email, password) {
        const manager = await findManagerByEmail(email);
        if (!manager) {
            throw new Error('Invalid email or password');
        }

        const validPassword = await bcrypt.compare(password, manager.password);
        if (!validPassword) {
            throw new Error('Invalid email or password');
        }

        if (!manager.verified) {
            throw new Error('Your email is not verified. Please verify your email using the OTP sent to you.');
        }

        if (!manager.approved) {
            throw new Error('Your account is pending approval by admin.');
        }

        const token = manager.generateAuthToken();
        console.log(token,'token');
        
        return { manager, token };
    }

    async getManagerProfile(managerId) {
        const manager = await findManagerById(managerId);
        if (!manager) {
            throw new Error('Manager not found');
        }
        return manager;
    }

    async blockManager(managerId) {
        const manager = await findManagerById(managerId);
        if (!manager) {
            throw new Error('Manager not found');
        }
        if (manager.isBlocked) {
            throw new Error('Manager already blocked');
        }
        manager.isBlocked = true;
        await manager.save();
        return manager;
    }

    async unblockManager(managerId) {
        const manager = await findManagerById(managerId);
        if (!manager) {
            throw new Error('Manager not found');
        }

        if (!manager.isBlocked) {
            throw new Error('Manager is not blocked');
        }

        manager.isBlocked = false;
        await manager.save();

        return manager;
    }
    async editManagerProfile(managerId, updateData) {
        const manager = await findManagerById(managerId);
        console.log(manager,'gjhgjg');
        
        
        if (!manager) {
          throw new Error('Manager not found');
        }
        const updatedManager = await updateManager(managerId, updateData);
        return updatedManager;
      }
}

module.exports = ManagerService;
