import React, { useEffect, useState } from 'react';
import { FaHotel, FaMapMarkerAlt, FaList } from 'react-icons/fa';
import api from '../../services/api';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHotelsByManager = async () => {
      try {
        const manager = JSON.parse(localStorage.getItem('managerData'));
        const managerId = manager?._id;
        if (!managerId) {
          throw new Error('Manager ID not found.');
        }

        const response = await api.get(`/manager/hotels?managerId=${managerId}`);
        setHotels(response.data.hotels);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch hotels');
        setLoading(false);
        console.error('Error fetching hotels:', error);
      }
    };

    fetchHotelsByManager();
  }, []);

  if (loading) {
    return <p>Loading hotels...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Hotel List</h2>
      {hotels.length === 0 ? (
        <p className="text-gray-500">No hotels added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotels.map((hotel, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <FaHotel className="mr-2 text-indigo-600" />
                {hotel.name}
              </h3>
              <p className="text-gray-600 mb-2 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-indigo-600" />
                {hotel.location?.address}, {hotel.location?.city}, {hotel.location?.state}, {hotel.location?.country}
              </p>
              <p className="text-gray-600 mb-2 flex items-center">
                <FaList className="mr-2 text-indigo-600" />
                {hotel.category?.name || 'Unknown Category'} {/* Display category name */}
              </p>
              <p className="text-gray-600 mb-2">{hotel.description}</p>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Services:</h4>
                <ul className="list-disc list-inside">
                  {hotel.services.map((service, serviceIndex) => (
                    <li key={serviceIndex}>
                      {service.name || 'Unknown Service'} {/* Display service name */}
                    </li>
                  ))}
                </ul>
              </div>
              {Array.isArray(hotel.pictures) && hotel.pictures.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Pictures:</h4>
                  <div className="flex flex-wrap gap-2">
                    {hotel.pictures.map((picture, pictureIndex) => (
                      <img
                        key={pictureIndex}
                        src={picture}
                        alt={`${hotel.name} - ${pictureIndex + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelList;
