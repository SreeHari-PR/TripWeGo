// src/controllers/adminController.js

const adminService = require('../services/adminService');
const managerService=require('../services/managerService')
const HttpStatusCodes=require('../utils/httpStatusCodes')

class AdminController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { token, user } = await adminService.loginAdmin(email, password);
            
            res.send({ token, user });
        } catch (error) {
            res.status(HttpStatusCodes.BAD_REQUEST).send(error.message);
        }
    }

    async listUsers(req, res) {
        try {
            const users = await adminService.listUsers();
            res.send(users);
        } catch (error) {
            res.status(HttpStatusCodes.BAD_REQUEST).send(error.message);
        }
    }

    async listManagers(req, res) {
        try {
            const managers = await adminService.listManagers();
            console.log(managers,'hfhgtyu')
            res.send(managers);
        } catch (error) {
            res.status(HttpStatusCodes.BAD_REQUEST).send(error.message);
        }
    }


    async getManagerDetails(req, res) {
         console.log('ksdjksdj')
        try {
            const manager = await adminService.getManagerDetails(req.params.id);
            console.log(manager,'hsdgfjh')
            res.send(manager); 
        } catch (error) {
            res.status(HttpStatusCodes.BAD_REQUEST).send(error.message);
        }
    }

    async approveManager(req, res) {
        try {
            const manager = await adminService.approveManager(req.params.id);
            res.send(manager);
        } catch (error) {
            res.status(HttpStatusCodes.BAD_REQUEST).send(error.message);
        }
    }

    async blockUser(req, res) {
        try {
            const user = await adminService.blockUser(req.params.id);
            res.send(user);
        } catch (error) {
            res.status(HttpStatusCodes.BAD_REQUEST).send(error.message);
        }
    }

    async unblockUser(req, res) {
        try {
            const user = await adminService.unblockUser(req.params.id);
            res.send(user);
        } catch (error) {
            res.status(HttpStatusCodes.BAD_REQUEST).send(error.message);
        }
    }
    async getManagers  (req, res)  {
        try {
          const managers = await managerService.getManagersWithHotelCount();
          res.status(HttpStatusCodes.OK).json(managers);
        } catch (error) {
          res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching managers', error });
        }
}
   async getAdminWallet  (req, res)  {
    try {
        const walletDetails = await adminService.getAdminWalletDetails();
        res.json({ data: walletDetails });
    } catch (error) {
        console.error(error.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving admin wallet and transactions' });
    }
}
async  getDashboardData  (req, res){
    try {
        console.log('ajhsd')
      const data = await adminService.fetchAdminDashboardData();
      console.log(data,'jdks')
      res.status(HttpStatusCodes.OK).json({ success: true, data });
    } catch (error) {
        console.log(error,'ghhggh')
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  };
    
}

module.exports = new AdminController();
