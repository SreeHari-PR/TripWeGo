const categoryService = require('../services/categoryService');
const HttpStatusCodes=require('../utils/httpStatusCodes')
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
            res.status(HttpStatusCodes.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }

    async getCategories(req, res) {
        try {
            const categories = await categoryService.getAllCategories();
            res.status(HttpStatusCodes.OK).json({
                success: true,
                data: categories
            });
        } catch (error) {
            res.status(HttpStatusCodes.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteCategory(req, res) {
        try {
            await categoryService.deleteCategory(req.params.id);
            res.status(HttpStatusCodes.OK).json({
                success: true,
                message: 'Category deleted successfully'
            });
        } catch (error) {
            res.status(HttpStatusCodes.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new CategoryController();
