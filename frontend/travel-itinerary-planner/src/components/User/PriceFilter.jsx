import React, { useState, useEffect } from 'react';

const PriceFilter = ({ minPrice, maxPrice, onChange }) => {
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  useEffect(() => {
    setLocalMin(minPrice);
    setLocalMax(maxPrice);
  }, [minPrice, maxPrice]);

  const handleChange = () => {
    onChange(localMin, localMax);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Price Range</h3>
      <div className="flex items-center space-x-4">
        <input
          type="number"
          value={localMin}
          onChange={(e) => setLocalMin(Number(e.target.value))}
          onBlur={handleChange}
          min={0}
          max={localMax}
          className="w-24 px-2 py-1 border rounded text-gray-700"
        />
        <span className="text-gray-500">to</span>
        <input
          type="number"
          value={localMax}
          onChange={(e) => setLocalMax(Number(e.target.value))}
          onBlur={handleChange}
          min={localMin}
          className="w-24 px-2 py-1 border rounded text-gray-700"
        />
      </div>
    </div>
  );
};

export default PriceFilter;

