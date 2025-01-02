import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  User,
  Hotel,
  CreditCard,
  Clock,
  CalendarDays,
  UserCircle,
  Phone,
  Mail,
} from 'lucide-react';
import { format } from 'date-fns';
import AdminSidebar from '../../components/Admin/Sidebar';
import { getAdminBookings } from '../../services/Admin/bookingService';

export default function AdminBookingList() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking =>
      booking.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.hotelId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking._id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bookings, searchTerm]);

  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBookings, currentPage]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getStatusBadge = (booking) => {
    if (booking.cancelled) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Cancelled</span>;
    }
  
    switch (booking.paymentStatus) {
      case 'Paid':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Confirmed</span>;
      case 'Pending':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };
  const openModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
    <div className="w-64">
      <AdminSidebar />
    </div>
    <div className="flex-grow w-auto mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center">Booking Management</h1>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
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
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.userId?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.hotelId?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(booking.checkInDate), 'MMM dd, yyyy')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(booking)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(booking)}</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openModal(booking)}
                        className="text-blue-600 hover:text-blue-900 transition duration-150"
                        aria-label={`View details for booking ${booking._id}`}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredBookings.length)}</span> of{' '}
              <span className="font-medium">{filteredBookings.length}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                } transition duration-150`}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                } transition duration-150`}
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Booking Details</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 transition duration-150" aria-label="Close">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3 text-blue-500" />
                <span className="text-gray-700">{selectedBooking.userId?.name}</span>
              </div>
              <div className="flex items-center">
                <Hotel className="w-5 h-5 mr-3 text-blue-500" />
                <span className="text-gray-700">{selectedBooking.hotelId?.name}</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 mr-3 text-blue-500" />
                <span className="text-gray-700">${selectedBooking.amount}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-3 text-blue-500" />
                <span className="text-gray-700">{selectedBooking.paymentStatus}</span>
              </div>
              <div className="flex items-center">
                <CalendarDays className="w-5 h-5 mr-3 text-blue-500" />
                <span className="text-gray-700">
                  {format(new Date(selectedBooking.checkInDate), 'MMM dd, yyyy')} -{' '}
                  {format(new Date(selectedBooking.checkOutDate), 'MMM dd, yyyy')}
                </span>
              </div>
              {selectedBooking.hotelId.managerId && (
  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
    <h3 className="text-lg font-semibold text-gray-800 mb-2">Manager Details</h3>
    <div className="space-y-2">
      <div className="flex items-center">
        <UserCircle className="w-5 h-5 mr-3 text-blue-500" />
        <span className="text-gray-700">{selectedBooking.hotelId.managerId.name}</span>
      </div>
      <div className="flex items-center">
        <Mail className="w-5 h-5 mr-3 text-blue-500" />
        <span className="text-gray-700">{selectedBooking.hotelId.managerId.email}</span>
      </div>
    </div>
  </div>
)}
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}