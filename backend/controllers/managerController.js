const ManagerService = require('../services/managerService');
const managerRepository=require('../repositories/managerRepository')
const HttpStatusCodes=require('../utils/httpStatusCodes')
const managerService = new ManagerService();

class ManagerController {
    async registerManager(req, res) {
        try {
          if (!req.body.license || !req.body.kyc) {
            throw new Error('License and KYC documents are required');
          }
      
          const managerData = {
            ...req.body,
          };
          console.log(managerData,'sgd')
      
          const result = await managerService.registerManager(managerData);
          res.status(HttpStatusCodes.OK).send(result);
        } catch (error) {
          res.status(HttpStatusCodes.BAD_REQUEST).send({ error: error.message });
        }
      }
      
    async approveManager(req, res) {
        const { managerId } = req.body;
        try {
            const manager = await managerService.approveManager(managerId);
            res.status(HttpStatusCodes.OK).send({ message: 'Manager approved successfully', manager });
        } catch (error) {
            res.status(HttpStatusCodes.BAD_REQUEST).send({ error: error.message });
        }
    }

    async verifyManagerOtp(req, res) {
        const { email, otp } = req.body;
        try {
            const result = await managerService.verifyManagerOtp(email, otp);
            res.status(HttpStatusCodes.OK).send(result);
        } catch (error) {
            res.status(HttpStatusCodes.BAD_REQUEST).send({ error: error.message });
        }
    }

    async resendManagerOtp(req, res) {
        const { email } = req.body;
        try {
            const result = await managerService.resendManagerOtp(email);
            res.status(HttpStatusCodes.OK).send(result);
        } catch (error) {
            res.status(HttpStatusCodes.BAD_REQUEST).send({ error: error.message });
        }
    }

    async loginManager(req, res) {
        const { email, password } = req.body;
        try {
            const managerData = await managerService.loginManager(email, password);
            res.status(HttpStatusCodes.OK).send({ data:  managerData });
        } catch (error) {
            res.status(HttpStatusCodes.BAD_REQUEST).send({ error: error.message });
        }
    }

    async getManagerProfile(req, res) {
        const { managerId } = req.query;
        console.log(managerId)
        try {
            const manager = await managerService.getManagerProfile(managerId);
            res.status(HttpStatusCodes.OK).send(manager);
        } catch (error) {
            res.status(404).send({ error: error.message });
        }
    }

    async blockManager(req, res) {
        const { managerId } = req.body;
        console.log(req.body,'managwr');
        
        try {
            const manager = await managerService.blockManager(managerId);
            res.status(HttpStatusCodes.OK).send({ message: 'Manager blocked successfully', manager });
        } catch (error) {
            res.status(HttpStatusCodes.BAD_REQUEST).send({ error: error.message });
        }
    }

    async unblockManager(req, res) {
        const { managerId } = req.body;
        try {
            const manager = await managerService.unblockManager(managerId);
            res.status(HttpStatusCodes.OK).send({ message: 'Manager unblocked successfully', manager });
        } catch (error) {
            res.status(HttpStatusCodes.BAD_REQUEST).send({ error: error.message });
        }
    }
    async editManagerProfile(req, res)  {
        console.log('gdfsfssd');
        
        try {
            const managerId = req.query  
          const updateData = req.body;  
          console.log(managerId,'manager');
          
      
          const updatedManager = await managerService.editManagerProfile(managerId, updateData);
      
          res.status(HttpStatusCodes.OK).json({
            success: true,
            message: 'Manager profile updated successfully',
            data: updatedManager
          });
        } catch (error) {
          res.status(HttpStatusCodes.BAD_REQUEST).json({
            success: false,
            message: error.message || 'Something went wrong',
          });
        }}
      async  updateProfileImage  (req, res)  {
            try {
              const { imageUrl } = req.body;
              const { managerId } = req.body; 
              console.log(req.body,'hskjdfjkh');
              

              const updatedManager = await managerRepository.updateProfilePicture(managerId, imageUrl);
          
              if (updatedManager) {
                res.status(HttpStatusCodes.OK).json({ success: true, message: 'Profile image updated', data: updatedManager });
              } else {
                res.status(404).json({ success: false, message: 'Manager not found' });
              }
            } catch (error) {
              res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Server error', error: error.message });
            }
          };
          async getManagerWalletAndTransactions(req, res) {
            console.log('hsjkdfh');
            
            try {
                const { managerId } = req.params;
                console.log(req.params,'id')
                const data = await managerService.getManagerWalletAndTransactions(managerId);
                res.status(HttpStatusCodes.OK).json({ success: true, data });
            } catch (error) {
                res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
            }
        }
}

module.exports = new ManagerController();
