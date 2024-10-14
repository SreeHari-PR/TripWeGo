import React, { useEffect, useState } from 'react'
import { FaHotel, FaMapMarkerAlt, FaList, FaStar, FaSearch, FaSort } from 'react-icons/fa'
import api from '../../services/api'
import { motion } from 'framer-motion'

const HotelList = () => {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    const fetchHotelsByManager = async () => {
      try {
        const manager = JSON.parse(localStorage.getItem('managerData'))
        const managerId = manager?._id
        if (!managerId) {
          throw new Error('Manager ID not found.')
        }

        const response = await api.get(`/manager/hotels?managerId=${managerId}`)
        console.log(response,'response');
        
        setHotels(response.data.hotels)
        setLoading(false)
      } catch (error) {
        setError('Failed to fetch hotels')
        setLoading(false)
        console.error('Error fetching hotels:', error)
      }
    }

    fetchHotelsByManager()
  }, [])

  const filteredHotels = hotels
    .filter(hotel => hotel.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'rating') return b.rating - a.rating
      return 0
    })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500 text-center text-xl">{error}</p>
  }

  return (
    <div className="mt-8 container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6 text-black-800">Hotel List</h2>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
        <div className="relative w-full md:w-64 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search hotels..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="flex items-center">
          <span className="mr-2">Sort by:</span>
          <select
            className="border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="rating">Rating</option>
          </select>
          <FaSort className="ml-2 text-gray-600" />
        </div>
      </div>
      {filteredHotels.length === 0 ? (
        <p className="text-gray-500 text-center text-xl">No hotels found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="relative h-48">
                {hotel.images.mainImage? (
                  <img
                    src={hotel.images.mainImage}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <FaHotel className="text-4xl text-gray-400" />
                  </div>
                )}
                <div className="absolute top-0 right-0 bg-indigo-600 text-white px-2 py-1 m-2 rounded-md">
                  <FaStar className="inline-block mr-1" />
                  {hotel.rating || '0'}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-black-800">{hotel.name}</h3>
                <p className="text-gray-600 mb-2 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-black-600" />
                  {hotel.location?.city}, {hotel.location?.country}
                </p>
                <p className="text-gray-600 mb-2 flex items-center">
                  <FaList className="mr-2 text-black-600" />
                  {hotel.category?.name || 'Unknown Category'}
                </p>
                <p className="text-gray-600 mb-4 line-clamp-2">{hotel.description}</p>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 text-black-700">Services:</h4>
                  <div className="flex flex-wrap gap-2">
                    {hotel.services.slice(0, 3).map((service, serviceIndex) => (
                      <span key={serviceIndex} className="bg-indigo-100 text-black-800 px-2 py-1 rounded-full text-sm">
                        {service.name || 'Unknown Service'}
                      </span>
                    ))}
                    {hotel.services.length > 3 && (
                      <span className="bg-indigo-100 text-black-800 px-2 py-1 rounded-full text-sm">
                        +{hotel.services.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HotelList