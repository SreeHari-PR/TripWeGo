import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaHotel, FaBed, FaCalendarCheck, FaCalendarTimes, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import api from '../../services/api';
import { Sidebar } from '../../components/Manager/ManagerSidebar'
import { Navbar } from '../../components/Manager/ManagerNavbar'
const ManagerBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

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

                setBookings(response.data.bookings);
                setLoading(false);
            } catch (error) {
                toast.error('Error fetching bookings');
                setLoading(false);
            }
        };

        fetchManagerBookings();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="container mx-auto p-4 text-center">
                <FaExclamationCircle className="text-5xl text-yellow-500 mb-4 inline-block" />
                <p className="text-xl font-semibold text-gray-700">No bookings available</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <Navbar />
                <div className="container mx-auto p-4">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                        <FaHotel className="mr-2 text-blue-600" />
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
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {bookings.map((booking) => (
                                    <tr key={booking._id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FaHotel className="mr-2 text-blue-500" />
                                                <span className="font-medium">{booking.hotelId.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            <div className="flex items-center">
                                                <FaBed className="mr-2 text-gray-500" />
                                                <span>{booking.roomType}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            <div className="flex items-center">
                                                <FaCalendarCheck className="mr-2 text-green-500" />
                                                <span>{new Date(booking.checkInDate).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            <div className="flex items-center">
                                                <FaCalendarTimes className="mr-2 text-red-500" />
                                                <span>{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            {booking.paymentStatus === 'Paid' ? (
                                                <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">
                                                    <FaCheckCircle className="inline mr-1" />
                                                    Paid
                                                </span>
                                            ) : (
                                                <span className="bg-yellow-200 text-yellow-600 py-1 px-3 rounded-full text-xs">
                                                    <FaExclamationCircle className="inline mr-1" />
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerBookingsPage;