import React, { useState, useEffect } from "react";
import { FaStar, FaHeart, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 
import api from "../../services/api";
import StickyNavbar from "../../components/User/Navbar";

export default function HotelListing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate(); 
  
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await api.get("/users/hotels"); 
        setHotels(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  if (loading) {
    return <p>Loading hotels...</p>;
  }

  return (
    <div>
      <StickyNavbar />
      <div className="container mx-auto p-4 space-y-6">
        <div className="relative max-w-md mx-auto">
          <input
            type="search"
            placeholder="Search hotels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map(hotel => (
         <div
         key={hotel._id}
         className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
         onClick={() => navigate(`/hotels/${hotel._id}`)}
       >
         <img src={hotel.images.mainImage} alt={hotel.name} className="w-full h-48 object-cover" />
         <div className="p-4">
           <div className="flex justify-between items-center mb-2">
             <h3 className="text-xl font-semibold">{hotel.name}</h3>
             <button
               onClick={(e) => {
                 e.stopPropagation(); 
                 toggleFavorite(hotel._id);
               }}
               className="text-2xl focus:outline-none"
               aria-label={favorites.includes(hotel._id) ? "Remove from favorites" : "Add to favorites"}
             >
               <FaHeart className={favorites.includes(hotel._id) ? "text-red-500" : "text-gray-300"} />
             </button>
           </div>
           <div className="flex items-center space-x-1 mb-2">
             {[...Array(5)].map((_, i) => (
               <FaStar
                 key={i}
                 className={`h-5 w-5 ${i < Math.floor(hotel.rating) ? "text-yellow-400" : "text-gray-300"}`}
               />
             ))}
             <span className="ml-2 text-sm text-gray-600">{hotel.rating.toFixed(1)}</span>
           </div>
           <button
             className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
             onClick={(e) => {
               e.stopPropagation(); 
             }}
           >
             Book Now
           </button>
         </div>
       </div>
          ))}
        </div>

        <div className="flex justify-center items-center space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
            <FaChevronLeft className="text-gray-600" />
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">1</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md">2</button>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">3</button>
          <span className="px-4 py-2">...</span>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
            <FaChevronRight className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
