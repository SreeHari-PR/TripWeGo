import React, { useState } from 'react'
import { Search, Calendar, Users, X } from 'lucide-react'
import api from "../../services/api";

export default function SearchForm({ onSearch }){
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)

  const handleSearch = async (e) => {
    e.preventDefault()

    try {
      const response = await api.get('/users/search', {
        params: {
          searchTerm: location,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          guestCount: guests,
        },
      })

      onSearch(response.data); 
    } catch (error) {
      console.error('Error fetching hotels:', error)
    }
  }

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row">
        <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-200">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="location"
              placeholder="Where are you going?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border-gray-300 rounded-md focus:ring-[#00246B] focus:border-[#00246B]"
            />
            {location && (
              <button
                type="button"
                onClick={() => setLocation('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-200">
          <label htmlFor="check-in" className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              id="check-in"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border-gray-300 rounded-md focus:ring-[#00246B] focus:border-[#00246B]"
            />
          </div>
        </div>
        <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-200">
          <label htmlFor="check-out" className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              id="check-out"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border-gray-300 rounded-md focus:ring-[#00246B] focus:border-[#00246B]"
            />
          </div>
        </div>
        <div className="flex-1 p-4">
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              id="guests"
              min="1"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full pl-10 pr-3 py-2 border-gray-300 rounded-md focus:ring-[#00246B] focus:border-[#00246B]"
            />
          </div>
        </div>
        <div className="p-4">
          <button
            type="submit"
            className="w-full bg-[#00246B] text-white px-6 py-3 rounded-md hover:bg-[#00246B]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00246B]"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  )
}

