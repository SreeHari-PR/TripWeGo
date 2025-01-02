import React, { useState } from "react"
import { FaMapMarkerAlt, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

export default function FeaturedHotels({ hotels }) {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const hotelsPerPage = 3
   console.log(hotels,'jhsdh')
  if (hotels.length === 0) return <p className="text-[#00246B]">No hotels to display</p>

  const handleNavigate = (id) => {
    navigate(`/hotels/${id}`)
  }

  // Calculate pagination
  const indexOfLastHotel = currentPage * hotelsPerPage
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel)
  const totalPages = Math.ceil(hotels.length / hotelsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <section className="py-16 bg-[#CADCFC]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-[#00246B]">Hotels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentHotels.map((hotel) => (
            <div
              key={hotel._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
              onClick={() => handleNavigate(hotel._id)}
            >
              <img
                src={hotel.images.mainImage || `/placeholder.svg?height=200&width=400&text=Hotel+${hotel.name}`}
                alt={hotel.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-[#00246B]">{hotel.name}</h3>
                <p className="flex items-center mb-2 text-[#00246B]">
                  <FaMapMarkerAlt className="w-4 h-4 mr-2 text-[#00246B]" />
                  {hotel.location?.address}, {hotel.location?.city}, {hotel.location?.state}, {hotel.location?.country}
                </p>
                <p className="flex items-center mb-4 text-[#00246B]">
                  <FaStar className="w-4 h-4 mr-2 text-yellow-400" /> {hotel.rating} Rating
                </p>
                <div className="flex justify-between items-center">
                  <button className="bg-[#00246B] hover:bg-[#CADCFC] text-[#CADCFC] hover:text-[#00246B] font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                   View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-center items-center mt-8">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="mr-2 px-4 py-2 rounded-md bg-[#00246B] text-[#CADCFC] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft />
          </button>
          {[...Array(totalPages).keys()].map((number) => (
            <button
              key={number + 1}
              onClick={() => paginate(number + 1)}
              className={`mx-1 px-4 py-2 rounded-md ${
                currentPage === number + 1
                  ? 'bg-[#00246B] text-[#CADCFC]'
                  : 'bg-[#CADCFC] text-[#00246B] hover:bg-[#00246B] hover:text-[#CADCFC]'
              }`}
            >
              {number + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="ml-2 px-4 py-2 rounded-md bg-[#00246B] text-[#CADCFC] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  )
}