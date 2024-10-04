import React from "react";

export default function SearchForm() {
  return (
    <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
          Destination
        </label>
        <input
          id="destination"
          placeholder="Where are you going?"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF]"
        />
      </div>
      <div>
        <label htmlFor="check-in" className="block text-sm font-medium text-gray-700 mb-1">
          Check-in
        </label>
        <input
          id="check-in"
          type="date"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF]"
        />
      </div>
      <div>
        <label htmlFor="check-out" className="block text-sm font-medium text-gray-700 mb-1">
          Check-out
        </label>
        <input
          id="check-out"
          type="date"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF]"
        />
      </div>
      <div>
        <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
          Guests
        </label>
        <select
          id="guests"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF]"
        >
          <option>Select</option>
          <option value="1">1 Guest</option>
          <option value="2">2 Guests</option>
          <option value="3">3 Guests</option>
          <option value="4">4+ Guests</option>
        </select>
      </div>
    </form>
  );
}
