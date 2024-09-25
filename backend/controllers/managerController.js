const ManagerService = require('../services/managerService');
const managerService = new ManagerService();

class ManagerController {
    async registerManager(req, res) {
        console.log(req.body,'jsjksj');
        
        try {
          if (!req.body.license || !req.body.kyc) {
            throw new Error('License and KYC documents are required');
          }
      
          const managerData = {
            ...req.body,
          };
      
          const result = await managerService.registerManager(managerData);
          res.status(200).send(result);
        } catch (error) {
          res.status(400).send({ error: error.message });
        }
      }
      
    async approveManager(req, res) {
        const { managerId } = req.body;
        try {
            const manager = await managerService.approveManager(managerId);
            res.status(200).send({ message: 'Manager approved successfully', manager });
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

    async verifyManagerOtp(req, res) {
        const { email, otp } = req.body;
        try {
            const result = await managerService.verifyManagerOtp(email, otp);
            res.status(200).send(result);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

    async resendManagerOtp(req, res) {
        const { email } = req.body;
        try {
            const result = await managerService.resendManagerOtp(email);
            res.status(200).send(result);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

    async loginManager(req, res) {
        const { email, password } = req.body;
        try {
            const managerData = await managerService.loginManager(email, password);
            res.status(200).send({ data:  managerData });
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

    async getManagerProfile(req, res) {
        const managerId = req.manager._id;
        console.log(managerId)
        try {
            const manager = await managerService.getManagerProfile(managerId);
            res.status(200).send(manager);
        } catch (error) {
            res.status(404).send({ error: error.message });
        }
    }

    async blockManager(req, res) {
        const { managerId } = req.body;
        try {
            const manager = await managerService.blockManager(managerId);
            res.status(200).send({ message: 'Manager blocked successfully', manager });
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

    async unblockManager(req, res) {
        const { managerId } = req.body;
        try {
            const manager = await managerService.unblockManager(managerId);
            res.status(200).send({ message: 'Manager unblocked successfully', manager });
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }
}

module.exports = new ManagerController();
