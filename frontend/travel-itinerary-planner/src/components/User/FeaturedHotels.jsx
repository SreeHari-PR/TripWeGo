import React from "react"
import { FaMapMarkerAlt, FaStar } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

export default function FeaturedHotels({ hotels }) {
  const navigate = useNavigate()

  if (hotels.length === 0) return <p>No hotels to display</p>

  const handleNavigate = (id) => {
    navigate(`/hotels/${id}`)
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Hotels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
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
                <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                <p className="flex items-center mb-2">
                  <FaMapMarkerAlt className="w-4 h-4 mr-2 text-gray-500" />
                  {hotel.location?.address}, {hotel.location?.city}, {hotel.location?.state}, {hotel.location?.country}
                </p>
                <p className="flex items-center mb-4">
                  <FaStar className="w-4 h-4 mr-2 text-yellow-400" /> {hotel.rating} ({hotel.reviews} reviews)
                </p>
                <div className="flex justify-between items-center">
                  <button className="bg-[#0066FF] hover:bg-[#002233] text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}