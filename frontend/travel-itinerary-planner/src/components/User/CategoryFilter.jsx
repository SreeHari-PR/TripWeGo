import React from 'react';
import { Check } from 'lucide-react';

const CategoryFilter = ({ categories, selectedCategories, onChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Categories</h3>
      <div className="space-y-2">
        {categories.map((category,index) => (
          <label key={index} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => onChange(category)}
              className="hidden"
            />
            <div className={`w-5 h-5 border rounded flex items-center justify-center ${
              selectedCategories.includes(category) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
            }`}>
              {selectedCategories.includes(category) && <Check size={16} className="text-white" />}
            </div>
            <span className="text-gray-700">{category}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;

