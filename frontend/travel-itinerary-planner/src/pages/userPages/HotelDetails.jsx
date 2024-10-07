import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaClock, FaCalendar, FaWifi, FaCar, FaCoffee,FaBroom, FaSpa, FaUtensils,FaConciergeBell } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';
import * as ReactIcons from 'react-icons';
import StickyNavbar from '../../components/User/Navbar';

const HotelDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [hotel, setHotel] = useState(null); 
  const [activeTab, setActiveTab] = useState('rooms');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await api.get(`/users/hotels/${id}`); 
        console.log(response,'hotels');
        
        setHotel(response.data.hotel);
      } catch (error) {
        toast.error('Error fetching hotel details'); 
      }
    };
    fetchHotel();
  }, [id]);

 
  const nextImage = () => {
    if (hotel) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % hotel.images.gallery.length);
    }
  };

  const prevImage = () => {
    if (hotel) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + hotel.images.gallery.length) % hotel.images.gallery.length);
    }
  };

  const getServiceIcon = (service) => {
    console.log(service,'service');
    
    switch (service.toLowerCase()) {
      case 'wifi':
        return <FaWifi className="w-6 h-6" />;
      case 'parking':
        return <FaCar className="w-6 h-6" />;
      case 'room service':
        return <FaConciergeBell className="w-6 h-6" />;
      case 'housekeeping':
        return <FaBroom className="w-6 h-6" />;
      case 'spa':
        return <FaSpa className="w-6 h-6" />;
      case 'restaurant':
        return <FaUtensils className="w-6 h-6" />;
      default:
        return <FaCoffee className="w-6 h-6" />;
    }
  };

  if (!hotel) {
    return <div>Loading hotel details...</div>; 
  }

  return (

    <div>
    <StickyNavbar />
    <div className="container mx-auto px-4 py-8">
     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Hotel Details */}
        <div className="md:col-span-2">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                {/* Hotel Name and Location */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{hotel.name}</h1>
                  <p className="flex items-center mt-2 text-gray-600">
                    <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                    {hotel.location.city}
                  </p>
                </div>
  
                {/* Hotel Rating */}
                <div className="bg-blue-100 text-blue-800 text-lg font-semibold px-3 py-1 rounded-full flex items-center">
                  <FaStar className="w-4 h-4 mr-1 text-yellow-400" />
                  {hotel.rating}
                </div>
              </div>
  
              {/* Image Gallery */}
              <div className="relative">
                {hotel && hotel.images && hotel.images.gallery && hotel.images.gallery.length > 0 && (
                  <>
                    <img
                      src={hotel.images.gallery[currentImageIndex]}
                      alt={`${hotel.name} - Gallery Image ${currentImageIndex + 1}`}
                      className="rounded-lg object-cover w-full h-64 md:h-96"
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
                  </>
                )}
              </div>
  
              {/* Hotel Description */}
              <p className="mt-4 text-gray-700">{hotel.description}</p>
            </div>
          </div>
        </div>
  
        {/* Contact Information & Check-in Details */}
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
  
      {/* Tabs for Room Types and Services */}
      <div className="mt-8">
        <div className="flex border-b">
          {/* Tab Buttons */}
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
  
        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === 'rooms' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotel.roomTypes.map((room, index) => (
                <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                    <p className="text-gray-600 mb-4">Capacity: {room.number} persons</p>
                    <p className="text-2xl font-bold mb-4">
                      ${room.price} <span className="text-sm font-normal">per night</span>
                    </p>
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
  </div>
  
  );
};

export default HotelDetails;
