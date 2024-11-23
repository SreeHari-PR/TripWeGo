import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Search, ChevronLeft, ChevronRight, Star, MapPin, Filter, X } from 'lucide-react';
import api from "../../services/api";
import StickyNavbar from "../../components/User/Navbar";
import CategoryFilter from "../../components/User/CategoryFilter";
import PriceFilter from "../../components/User/PriceFilter";

export default function HotelListing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(6);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotelsAndCategories = async () => {
      try {
        const [hotelsResponse, categoriesResponse] = await Promise.all([
          api.get("/users/hotels"),
          api.get("/users/categories"),
        ]);

        const hotelsData = hotelsResponse.data.data || [];
        const categoriesData = categoriesResponse.data.data || [];

        const categoryMap = new Map(categoriesData.map(category => [category._id, category.name]));
        const processedHotels = hotelsData.map(hotel => ({
          ...hotel,
          price: hotel.roomTypes && hotel.roomTypes[0] ? hotel.roomTypes[0].price : undefined,
          category: categoryMap.get(hotel.category) || 'Uncategorized',
        }));

        setHotels(processedHotels);

        const uniqueCategories = Array.from(new Set(processedHotels.map(hotel => hotel.category)));
        setCategories(uniqueCategories);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchHotelsAndCategories();
  }, []);

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(hotel.category);
    const matchesPrice = !hotel.price || (hotel.price >= priceRange.min && hotel.price <= priceRange.max);
    
    console.log(`Hotel ${hotel.name}: Category: ${hotel.category}, Matches: ${matchesCategory}`);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

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

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <StickyNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Discover Your Perfect Stay</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="relative flex-grow max-w-md mx-auto md:mx-0 mb-4 md:mb-0">
            <input
              type="search"
              placeholder="Search hotels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden bg-blue-600 text-white px-6 py-2 rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition duration-300"
          >
            {showFilters ? <X className="mr-2" /> : <Filter className="mr-2" />}
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="md:flex md:space-x-8">
          <div className={`md:w-1/4 mb-8 md:mb-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6">
              <CategoryFilter
                categories={categories}
                selectedCategories={selectedCategories}
                onChange={handleCategoryChange}
              />
              <PriceFilter
                minPrice={priceRange.min}
                maxPrice={priceRange.max}
                onChange={handlePriceChange}
              />
            </div>
          </div>

          <div className="md:w-3/4">
            {currentHotels.length === 0 ? (
              <div className="text-center text-gray-600 bg-white rounded-lg shadow-md p-8">
                <p className="text-xl font-semibold mb-4">No hotels found matching your criteria.</p>
                <p>Try adjusting your filters or search term.</p>
              </div>
            ) : (
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
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md focus:outline-none hover:bg-gray-100 transition duration-300"
                        aria-label={favorites.includes(hotel._id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites.includes(hotel._id) ? "text-red-500 fill-current" : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{hotel.name}</h3>
                      <div className="flex items-center mb-3">
                        <MapPin className="w-4 h-4 text-blue-600 mr-1" />
                        <span className="text-sm text-gray-600">{hotel.location.city}</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center bg-yellow-100 px-2 py-1 rounded">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium text-gray-700">{hotel.rating || 'N/A'}</span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">
                          {hotel.price ? `$${hotel.price}/night` : 'Price not available'}
                        </span>
                      </div>
                      <button
                        onClick={() => navigate(`/hotels/${hotel._id}`)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out flex items-center justify-center"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-2">
                <button
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 transition duration-300"
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
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                    } rounded-md transition duration-300`}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 transition duration-300"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

