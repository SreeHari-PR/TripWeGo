import React, { useEffect, useState } from 'react'
import { FiList } from 'react-icons/fi'
import CategoryFormModal from '../../components/Admin/CategoryFormModal'
import CategoryList from '../../components/Admin/CategoryList'
import AdminSidebar from '../../components/Admin/Sidebar'
import api from '../../services/api'

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/categories')
      setCategories(response.data.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleAddCategory = (newCategory) => {
    setCategories([...categories, newCategory])
  }

  const handleDeleteCategory = (index) => {
    const updatedCategories = categories.filter((_, i) => i !== index)
    setCategories(updatedCategories)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64">
        <AdminSidebar />
      </div>
      <div className="flex-grow w-auto mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <FiList className="mr-2" />
            Category Management
          </h1>
          <CategoryFormModal onAddCategory={handleAddCategory} />
        </div>
        {categories.length > 0 ? (
          <CategoryList
            categories={categories}
            onDeleteCategory={handleDeleteCategory}
          />
        ) : (
          <p className="text-gray-500 text-center">No categories added yet.</p>
        )}
      </div>
    </div>
  )
}
