import api from '../api';

export const fetchCategories = async () => {
  try {
    const response = await api.get('/admin/categories');
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch categories.');
  }
};

export const addCategory = async (categoryData) => {
  try {
    const response = await api.post('/admin/categories', categoryData);
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to add category.');
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    await api.delete(`/admin/categories/${categoryId}`);
    return true;
  } catch (error) {
    throw new Error('Failed to delete category.');
  }
};
