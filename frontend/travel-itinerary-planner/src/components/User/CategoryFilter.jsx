import React from 'react';
import { FaCheck } from 'react-icons/fa';

const CategoryFilter = ({ categories, setCategories }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Categories</h3>
      {Object.keys(categories).map((category) => (
        <div key={category} className="flex items-center mb-2">
          <button
            className={`w-5 h-5 mr-2 border rounded ${
              categories[category] ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
            } flex items-center justify-center`}
            onClick={() => setCategories(prev => ({ ...prev, [category]: !prev[category] }))}
          >
            {categories[category] && <FaCheck className="text-white text-xs" />}
          </button>
          <label className="text-sm">{category}</label>
        </div>
      ))}
    </div>
  );
};

export default CategoryFilter;