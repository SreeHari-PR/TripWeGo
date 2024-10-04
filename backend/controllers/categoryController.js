const categoryService = require('../services/categoryService');

class CategoryController {
    async addCategory(req, res) {
        try {
            const category = await categoryService.createCategory(req.body);
            res.status(201).json({
                success: true,
                message: 'Category added successfully',
                data: category
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getCategories(req, res) {
        try {
            const categories = await categoryService.getAllCategories();
            res.status(200).json({
                success: true,
                data: categories
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteCategory(req, res) {
        try {
            await categoryService.deleteCategory(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Category deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new CategoryController();
