import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Search, ChevronLeft, ChevronRight, Star, MapPin } from "lucide-react";
import api from "../../services/api";
import StickyNavbar from "../../components/User/Navbar";

export default function HotelListing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(6);
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

  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <StickyNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Discover Your Perfect Stay</h1>
        <div className="relative max-w-md mx-auto mb-8">
          <input
            type="search"
            placeholder="Search hotels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentHotels.map((hotel) => (
            <div
              key={hotel._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative">
                <img
                  src={hotel.images.mainImage}
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(hotel._id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md focus:outline-none"
                  aria-label={favorites.includes(hotel._id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(hotel._id) ? "text-red-500 fill-current" : "text-gray-400"
                    }`}
                  />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{hotel.name}</h3>
                <div className="flex items-center mb-2">
                  <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600">{hotel.location.city}</span>
                </div>
                <div className="flex items-center mb-4">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium text-gray-700">{hotel.rating}</span>
                </div>
                <button
                  onClick={() => navigate(`/hotels/${hotel._id}`)}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out flex items-center justify-center"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            <button
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`px-4 py-2 ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "border border-gray-300 text-gray-700"
                } rounded-md hover:bg-gray-100 transition-colors duration-300`}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}