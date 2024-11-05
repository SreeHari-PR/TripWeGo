import React from 'react';

const PriceFilter = ({ priceRange, setPriceRange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Price Range</h3>
      <div className="flex items-center space-x-4">
        <input
          type="range"
          min="0"
          max="500"
          value={priceRange[0]}
          onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
          className="w-full"
        />
        <input
          type="range"
          min="0"
          max="500"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          className="w-full"
        />
      </div>
      <div className="flex justify-between mt-2">
        <span>${priceRange[0]}</span>
        <span>${priceRange[1]}</span>
      </div>
    </div>
  );
};

export default PriceFilter;