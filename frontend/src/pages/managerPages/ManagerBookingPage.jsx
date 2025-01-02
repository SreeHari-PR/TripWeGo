import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Hotel, Bed, CalendarCheck, CalendarX, Loader, CheckCircle, AlertCircle, Eye, X, ChevronLeft, ChevronRight, User, CreditCard, Mail } from 'lucide-react';
import api from '../../services/api';
import { Sidebar } from '../../components/Manager/ManagerSidebar';
import { Navbar } from '../../components/Manager/ManagerNavbar';

const ManagerBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [bookingsPerPage] = useState(10);

    useEffect(() => {
        const fetchManagerBookings = async () => {
            try {
                const manager = JSON.parse(localStorage.getItem('managerData'));
                const managerId = manager?._id;

                if (!managerId) {
                    toast.error('Manager not found. Please log in.');
                    setLoading(false);
                    return;
                }

                const response = await api.get(`/manager/bookings/${managerId}`);
                console.log(response.data.bookings)

                setBookings(response.data.bookings);
                setLoading(false);
            } catch (error) {
                toast.error('Error fetching bookings');
                setLoading(false);
            }
        };

        fetchManagerBookings();
    }, []);

    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
    };

    // Pagination logic
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
    const totalPages = Math.ceil(bookings.length / bookingsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="animate-spin text-4xl text-blue-500" />
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="container mx-auto p-4 text-center">
                <AlertCircle className="text-5xl text-yellow-500 mb-4 inline-block" />
                <p className="text-xl font-semibold text-gray-700">No bookings available</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto p-4">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                            <Hotel className="mr-2 text-blue-600" />
                            Manager Bookings
                        </h2>
                        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                        <th className="py-3 px-6 text-left">Hotel Name</th>
                                        <th className="py-3 px-6 text-left">Room Type</th>
                                        <th className="py-3 px-6 text-left">Check-In</th>
                                        <th className="py-3 px-6 text-left">Check-Out</th>
                                        <th className="py-3 px-6 text-left">Status</th>
                                        <th className="py-3 px-6 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 text-sm font-light">
                                    {currentBookings.map((booking) => (
                                        <tr key={booking._id} className="border-b border-gray-200 hover:bg-gray-100">
                                            <td className="py-3 px-6 text-left whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Hotel className="mr-2 text-blue-500" />
                                                    <span className="font-medium">{booking.hotelId.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                <div className="flex items-center">
                                                    <Bed className="mr-2 text-gray-500" />
                                                    <span>
                                                        {booking.roomTypes.length > 0 ? (
                                                            booking.roomTypes.map((type, index) => (
                                                                <span key={index} className="block">
                                                                    {type}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span>No room type available</span>
                                                        )}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                <div className="flex items-center">
                                                    <CalendarCheck className="mr-2 text-green-500" />
                                                    <span>{new Date(booking.checkInDate).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                <div className="flex items-center">
                                                    <CalendarX className="mr-2 text-red-500" />
                                                    <span>{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                {booking.paymentStatus === 'Paid' ? (
                                                    <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">
                                                        <CheckCircle className="inline mr-1" />
                                                        Paid
                                                    </span>
                                                ) : (
                                                    <span className="bg-yellow-200 text-yellow-600 py-1 px-3 rounded-full text-xs">
                                                        <AlertCircle className="inline mr-1" />
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                <button
                                                    onClick={() => handleViewDetails(booking)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-300 ease-in-out"
                                                >
                                                    <Eye className="mr-2" />
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 flex justify-center">
                            <nav className="inline-flex rounded-md shadow">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                </button>
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => paginate(index + 1)}
                                        className={`px-4 py-2 border border-gray-300 text-sm font-medium ${
                                            currentPage === index + 1
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        } transition duration-300 ease-in-out`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && selectedBooking && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 ease-in-out">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold">Booking Details</h3>
                <button onClick={closeModal} className="text-white hover:text-gray-200 transition duration-300 ease-in-out">
                    <X className="h-6 w-6" />
                </button>
            </div>
            <div className="p-6 space-y-6">
                {/* Hotel Details */}
                <div className="flex items-center space-x-4">
                    <Hotel className="h-8 w-8 text-blue-500" />
                    <div>
                        <p className="text-sm text-gray-500">Hotel</p>
                        <p className="font-semibold">{selectedBooking.hotelId.name}</p>
                    </div>
                </div>
                
                {/* Room Type */}
                <div className="flex items-center space-x-4">
                    <Bed className="h-8 w-8 text-blue-500" />
                    <div>
                        <p className="text-sm text-gray-500">Room Type</p>
                        <p className="font-semibold">
                            {selectedBooking.roomTypes.length > 0
                                ? selectedBooking.roomTypes.join(", ")
                                : "No room type available"}
                        </p>
                    </div>
                </div>
                
                {/* Booking Dates */}
                <div className="flex items-center space-x-4">
                    <CalendarCheck className="h-8 w-8 text-green-500" />
                    <div>
                        <p className="text-sm text-gray-500">Check-In Date</p>
                        <p className="font-semibold">{new Date(selectedBooking.checkInDate).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <CalendarX className="h-8 w-8 text-red-500" />
                    <div>
                        <p className="text-sm text-gray-500">Check-Out Date</p>
                        <p className="font-semibold">{new Date(selectedBooking.checkOutDate).toLocaleDateString()}</p>
                    </div>
                </div>
                
                {/* Payment Details */}
                <div className="flex items-center space-x-4">
                    <CreditCard className="h-8 w-8 text-yellow-500" />
                    <div>
                        <p className="text-sm text-gray-500">Payment Status</p>
                        <p className={`font-semibold ${selectedBooking.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {selectedBooking.paymentStatus}
                        </p>
                    </div>
                </div>
                
                {/* User Details */}
                <div className="flex items-center space-x-4">
                    <User className="h-8 w-8 text-blue-500" />
                    <div>
                        <p className="text-sm text-gray-500">User Name</p>
                        <p className="font-semibold">{selectedBooking.userId.name}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <Mail className="h-8 w-8 text-blue-500" />
                    <div>
                        <p className="text-sm text-gray-500">User Email</p>
                        <p className="font-semibold">{selectedBooking.userId.email}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
)}

        </div>
    );
};

export default ManagerBookingsPage;

