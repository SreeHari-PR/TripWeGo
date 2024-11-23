const Category = require('../models/categoryModel');

class CategoryRepository {
    async addCategory(data) {
        try {
            const newCategory = new Category(data);
            return await newCategory.save();
        } catch (error) {
            console.error("Error adding category:", error);
            throw error;
        }
    }

    async getAllCategories() {
        try {
            return await Category.find({});
        } catch (error) {
            console.error("Error fetching all categories:", error);
            throw error;
        }
    }

    async getCategoryById(id) {
        try {
            return await Category.findById(id);
        } catch (error) {
            console.error("Error fetching category by ID:", error);
            throw error;
        }
    }

    async deleteCategory(id) {
        try {
            return await Category.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error deleting category:", error);
            throw error;
        }
    }
}

module.exports = new CategoryRepository();
