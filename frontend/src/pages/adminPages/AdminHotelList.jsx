import React, { useState, useEffect } from 'react';
import { 
  Hotel, 
  Star, 
  MapPin, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Plus,
  Eye,
  X,
  Phone,
  Mail,
  Globe,
  Users,
  DollarSign,
  Check,
} from 'lucide-react';
import { fetchHotels as getHotels, deleteHotel } from '../../services/Admin/hotelService';
import AdminSidebar from '../../components/Admin/Sidebar';

const AdminHotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadHotels();
  }, [currentPage, searchTerm]);

  const loadHotels = async () => {
    setIsLoading(true);
    try {
      const data = await getHotels(currentPage, searchTerm);
      setHotels(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (hotelId) => {
   
  };

  const handleDelete = async (hotelId) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await deleteHotel(hotelId);
        loadHotels();
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  const handleViewDetails = (hotel) => {
    setSelectedHotel(hotel);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHotel(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64">
        <AdminSidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">Hotel Management</h1>
        </div>

        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search hotels..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Hotel
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hotels.map((hotel) => (
                    <tr key={hotel._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {hotel.images?.mainImage ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={hotel.images.mainImage}
                                alt={hotel.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <Hotel className="h-6 w-6 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{hotel.name}</div>
                            <div className="text-sm text-gray-500">{hotel.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{hotel.location.city}, {hotel.location.country}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-900">{hotel.rating}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(hotel)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(hotel._id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(hotel._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center items-center mt-4 space-x-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                First
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === pageNumber ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Last
              </button>
            </div>
          </>
        )}

{isModalOpen && selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedHotel.name}</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <img
                    src={selectedHotel.images?.mainImage || '/placeholder-image.jpg'}
                    alt={selectedHotel.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <p className="flex items-center mb-2">
                    <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                    {selectedHotel.location.address}, {selectedHotel.location.city}, {selectedHotel.location.country}
                  </p>
                  <p className="flex items-center mb-2">
                    <Star className="h-5 w-5 text-yellow-400 mr-2" />
                    {selectedHotel.rating} / 5
                  </p>
                  <p className="flex items-center mb-2">
                    <Phone className="h-5 w-5 text-gray-500 mr-2" />
                    {selectedHotel.contactInfo.phone}
                  </p>
                  <p className="flex items-center mb-2">
                    <Mail className="h-5 w-5 text-gray-500 mr-2" />
                    {selectedHotel.contactInfo.email}
                  </p>
                  <p className="flex items-center mb-2">
                    <Globe className="h-5 w-5 text-gray-500 mr-2" />
                    {selectedHotel.contactInfo.website}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{selectedHotel.description}</p>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Services</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {selectedHotel.services.map((service, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Room Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedHotel.roomTypes.map((room, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{room.type}</h4>
                      <p className="flex items-center mb-1">
                        <Users className="h-4 w-4 text-gray-500 mr-2" />
                        Max Guests: {room.maxGuests}
                      </p>
                      <p className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                        Price: ${room.price} / night
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};
export default AdminHotelList;

