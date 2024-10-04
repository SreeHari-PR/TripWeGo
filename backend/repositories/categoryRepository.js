const Category=require('../models/categoryModel')

class CategoryRepository{
    async addCategory(data){
        const newCategory=new Category(data);
        return await newCategory.save();
    }
    async getAllCategories(){
        return await Category.find({});
    }
    async getCategoryById(id){
        return await Category.findById(id);
    }
    async deleteCategory(id){
        return await Category.findByIdAndDelete(id);
    }
}
module.exports= new CategoryRepository();