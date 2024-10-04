import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import api from '../../services/api'; 

export default function FeaturedHotels() {
  const [hotels, setHotels] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await api.get('/users/hotels'); 
        setHotels(response.data.data); 
      } catch (err) {
        setError('Error fetching hotels');
        console.error(err);
      } finally {
        setLoading(false); 
      }
    };

    fetchHotels();
  }, []); 

  if (loading) return <p>Loading...</p>; 
  if (error) return <p>{error}</p>; 

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Featured Hotels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <div key={hotel._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={hotel.images.mainImage || '/placeholder.svg?height=200&width=400&text=Hotel+' + hotel.name}
                alt={hotel.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                <p className="flex items-center mb-2">
                  <FaMapMarkerAlt className="w-4 h-4 mr-2 text-gray-500" />
                  {/* Modify this line to display the location correctly */}
                  {hotel.location?.address}, {hotel.location?.city}, {hotel.location?.state}, {hotel.location?.country}
                </p>
                <p className="flex items-center mb-4">
                  <FaStar className="w-4 h-4 mr-2 text-yellow-400" /> {hotel.rating} ({hotel.reviews} reviews)
                </p>
                <div className="flex justify-between items-center">
                  <button className="bg-[#0066FF] hover:bg-[#002233] text-white font-bold py-2 px-4 rounded">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
