
const CategoryRepository=require('../repositories/categoryRepository')

class CategoryService{
    async createCategory(categoryData){
        const {name}=categoryData;
        const existingCategory=await CategoryRepository.getAllCategories();
        if(existingCategory.find(category=>category.name===name)){
            throw new Error('Category already exists')
        }
        return await CategoryRepository.addCategory(categoryData);
     }
     async getAllCategories() {
        return await CategoryRepository.getAllCategories();
    }

    async getCategoryById(id) {
        return await CategoryRepository.getCategoryById(id);
    }

    async deleteCategory(id) {
        return await CategoryRepository.deleteCategory(id);
    }

}
module.exports = new CategoryService();