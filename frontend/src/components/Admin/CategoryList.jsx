import React from 'react'
import { FiEdit, FiTrash2 } from 'react-icons/fi'
import api from '../../services/api'

export default function CategoryList({ categories, onEditCategory, onDeleteCategory }) {

  const handleDelete = async (index, categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/admin/delete-category/${categoryId}`)
        onDeleteCategory(index)
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('Failed to delete category')
      }
    }
  }

  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{category.name}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">{category.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEditCategory(index)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <FiEdit className="inline-block" />
                </button>
                <button
                  onClick={() => handleDelete(index, category._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FiTrash2 className="inline-block" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
