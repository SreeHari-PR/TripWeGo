import React, { useState } from 'react'
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaClock, FaCalendar, FaWifi, FaCar, FaCoffee, FaDumbbell, FaSpa, FaUtensils } from 'react-icons/fa'


const hotel = {
  id: '1',
  name: 'Grand Luxury Hotel',
  description: 'Experience unparalleled luxury in the heart of the city. Our hotel offers stunning views, world-class amenities, and impeccable service to make your stay truly memorable.',
  address: '123 Main Street, Cityville, State 12345, Country',
  rating: 4.8,
  images: [
    '/placeholder.svg?height=400&width=600',
    '/placeholder.svg?height=400&width=600',
    '/placeholder.svg?height=400&width=600',
  ],
  contactInfo: {
    phone: '+1 (555) 123-4567',
    email: 'info@grandluxuryhotel.com',
    website: 'www.grandluxuryhotel.com',
  },
  checkInTime: '15:00',
  checkOutTime: '11:00',
  roomTypes: [
    { name: 'Deluxe Room', price: 200, capacity: 2 },
    { name: 'Suite', price: 350, capacity: 4 },
    { name: 'Penthouse', price: 500, capacity: 6 },
  ],
  services: ['Free Wi-Fi', 'Parking', 'Room Service', 'Fitness Center', 'Spa', 'Restaurant'],
}

const HotelDetails = () => {
  const [activeTab, setActiveTab] = useState('rooms')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % hotel.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + hotel.images.length) % hotel.images.length)
  }

  const getServiceIcon = (service) => {
    switch (service.toLowerCase()) {
      case 'free wi-fi':
        return <FaWifi className="w-6 h-6" />
      case 'parking':
        return <FaCar className="w-6 h-6" />
      case 'room service':
        return <FaCoffee className="w-6 h-6" />
      case 'fitness center':
        return <FaDumbbell className="w-6 h-6" />
      case 'spa':
        return <FaSpa className="w-6 h-6" />
      case 'restaurant':
        return <FaUtensils className="w-6 h-6" />
      default:
        return <FaCoffee className="w-6 h-6" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-300"
        onClick={() => router.back()}
      >
        Back to Hotels
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{hotel.name}</h1>
                  <p className="flex items-center mt-2 text-gray-600">
                    <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                    {hotel.address}
                  </p>
                </div>
                <div className="bg-blue-100 text-blue-800 text-lg font-semibold px-3 py-1 rounded-full flex items-center">
                  <FaStar className="w-4 h-4 mr-1 text-yellow-400" />
                  {hotel.rating}
                </div>
              </div>
              <div className="relative">
  <img
    src={hotel.images[currentImageIndex]}
    alt={`${hotel.name} - Image ${currentImageIndex + 1}`}
    width={600}
    height={400}
    className="rounded-lg object-cover w-full"
  />
  <button
    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
    onClick={prevImage}
  >
    &#10094;
  </button>
  <button
    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
    onClick={nextImage}
  >
    &#10095;
  </button>
</div>

              <p className="mt-4 text-gray-700">{hotel.description}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-2">
                <p className="flex items-center">
                  <FaPhone className="w-4 h-4 mr-2 text-gray-600" />
                  {hotel.contactInfo.phone}
                </p>
                <p className="flex items-center">
                  <FaEnvelope className="w-4 h-4 mr-2 text-gray-600" />
                  {hotel.contactInfo.email}
                </p>
                <p className="flex items-center">
                  <FaGlobe className="w-4 h-4 mr-2 text-gray-600" />
                  {hotel.contactInfo.website}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Check-in/Check-out</h2>
              <div className="space-y-2">
                <p className="flex items-center">
                  <FaClock className="w-4 h-4 mr-2 text-gray-600" />
                  Check-in: {hotel.checkInTime}
                </p>
                <p className="flex items-center">
                  <FaCalendar className="w-4 h-4 mr-2 text-gray-600" />
                  Check-out: {hotel.checkOutTime}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <div className="flex border-b">
          <button
            className={`py-2 px-4 ${activeTab === 'rooms' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('rooms')}
          >
            Room Types
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'services' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('services')}
          >
            Services
          </button>
        </div>
        <div className="mt-4">
          {activeTab === 'rooms' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hotel.roomTypes.map((room, index) => (
                <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                    <p className="text-gray-600 mb-4">Capacity: {room.capacity} persons</p>
                    <p className="text-2xl font-bold mb-4">${room.price} <span className="text-sm font-normal">per night</span></p>
                    <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'services' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {hotel.services.map((service, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-100 rounded-lg">
                  {getServiceIcon(service)}
                  <span className="ml-2">{service}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HotelDetails