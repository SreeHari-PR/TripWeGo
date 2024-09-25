// src/controllers/adminController.js

const adminService = require('../services/adminService');

class AdminController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { token, user } = await adminService.loginAdmin(email, password);
            res.send({ token, user });
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async listUsers(req, res) {
        try {
            const users = await adminService.listUsers();
            res.send(users);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async listManagers(req, res) {
        try {
            const managers = await adminService.listManagers();
            console.log(managers,'hfhgtyu')
            res.send(managers);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    // New function to get manager details for approval
    async getManagerDetails(req, res) {
         console.log('ksdjksdj')
        try {
            const manager = await adminService.getManagerDetails(req.params.id);
            console.log(manager,'hsdgfjh')
            res.send(manager); 
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async approveManager(req, res) {
        try {
            const manager = await adminService.approveManager(req.params.id);
            res.send(manager);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async blockUser(req, res) {
        try {
            const user = await adminService.blockUser(req.params.id);
            res.send(user);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async unblockUser(req, res) {
        try {
            const user = await adminService.unblockUser(req.params.id);
            res.send(user);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
}

module.exports = new AdminController();
