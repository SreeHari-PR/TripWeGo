import React, { useEffect, useState } from 'react'
import { Hotel, MapPin, List, Star, Search, SortAsc, Edit, EyeOff, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../../services/api'
import { motion } from 'framer-motion'
import Swal from 'sweetalert2'

const HotelList = () => {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const [hotelsPerPage] = useState(9)

  useEffect(() => {
    const fetchHotelsByManager = async () => {
      try {
        const manager = JSON.parse(localStorage.getItem('managerData'))
        const managerId = manager?._id
        if (!managerId) {
          throw new Error('Manager ID not found.')
        }

        const response = await api.get(`/manager/hotels?managerId=${managerId}`)
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

  const handleEdit = (hotelId) => {
    window.location.href = `/manager/hotels/edit/${hotelId}`
  }

  const toggleListStatus = async (hotelId, isListed) => {
    try {
      const action = isListed ? 'unlist' : 'list'
      const confirmResult = await Swal.fire({
        title: `Are you sure you want to ${action} this hotel?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `Yes, ${action} it!`
      })

      if (confirmResult.isConfirmed) {
        const response = await api.put(`/manager/hotels/${hotelId}/${action}`, { isListed: !isListed })
        setHotels((prevHotels) => prevHotels.map(hotel => 
          hotel._id === hotelId ? { ...hotel, isListed: !hotel.isListed } : hotel
        ))
        Swal.fire('Success!', `Hotel ${action}ed successfully.`, 'success')
      }
    } catch (error) {
      console.error('Error toggling list status:', error)
      Swal.fire('Error', 'Failed to update hotel listing status.', 'error')
    }
  }

  const filteredHotels = hotels
    .filter(hotel => hotel.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'rating') return b.rating - a.rating
      return 0
    })

  // Get current hotels
  const indexOfLastHotel = currentPage * hotelsPerPage
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#00246B]"></div>
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500 text-center text-xl">{error}</p>
  }

  return (
    <div className="mt-8 container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6 text-[#00246B]">Hotel List</h2>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
        <div className="relative w-full md:w-64 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search hotels..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00246B]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        </div>
        <div className="flex items-center">
          <span className="mr-2">Sort by:</span>
          <select
            className="border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#00246B]"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="rating">Rating</option>
          </select>
          <SortAsc className="ml-2 text-gray-600" size={18} />
        </div>
      </div>
      {currentHotels.length === 0 ? (
        <p className="text-gray-500 text-center text-xl">No hotels found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentHotels.map((hotel, index) => (
              <motion.div
                key={index}
                className="bg-[#CADCFC] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="relative h-48">
                  {hotel.images.mainImage ? (
                    <img
                      src={hotel.images.mainImage}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Hotel className="text-4xl text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-0 right-0 bg-[#00246B] text-white px-2 py-1 m-2 rounded-md">
                    <Star className="inline-block mr-1" size={16} />
                    {hotel.rating || '0'}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-[#00246B]">{hotel.name}</h3>
                  <p className="text-gray-600 mb-2 flex items-center">
                    <MapPin className="mr-2 text-[#00246B]" size={16} />
                    {hotel.location?.city}, {hotel.location?.country}
                  </p>
                  <p className="text-gray-600 mb-2 flex items-center">
                    <List className="mr-2 text-[#00246B]" size={16} />
                    {hotel.category?.name || 'Unknown Category'}
                  </p>
                  <p className="text-gray-600 mb-4 line-clamp-2">{hotel.description}</p>

                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleEdit(hotel._id)}
                      className="text-white bg-[#00246B] px-4 py-2 rounded-lg flex items-center"
                    >
                      <Edit className="mr-2" size={16} /> Edit
                    </button>

                    <button
                      onClick={() => toggleListStatus(hotel._id, hotel.isListed)}
                      className={`px-4 py-2 rounded-lg flex items-center ${hotel.isListed ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                    >
                      {hotel.isListed ? (
                        <>
                          <EyeOff className="mr-2" size={16} /> Unlist
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2" size={16} /> List
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              {Array.from({ length: Math.ceil(filteredHotels.length / hotelsPerPage) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === index + 1
                      ? 'z-10 bg-[#00246B] border-[#00246B] text-white'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredHotels.length / hotelsPerPage)}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </>
      )}
    </div>
  )
}

export default HotelList