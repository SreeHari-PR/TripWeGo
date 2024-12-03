import React, { useState, useEffect } from 'react'
import { Users, Calendar, Hotel, DollarSign } from 'lucide-react'
import { Sidebar } from '../../components/Manager/ManagerSidebar'
import { Navbar } from '../../components/Manager/ManagerNavbar'
import api from '../../services/api'
import BookingsChart from '../../components/Manager/BookingsChart'
import RevenueBarChart from '../../components/Manager/RevenueBarChart'
export default function ManagerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const allBookings = response.data.bookings;

        
        const recentBookings = allBookings
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setBookings(recentBookings);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching bookings');
        setLoading(false);
      }
    };

    fetchManagerBookings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
              {/* Dashboard Cards */}
              <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
                <div className="p-3 mr-4 text-white bg-[#0066FF] rounded-full">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">Total Guests</p>
                  <p className="text-lg font-semibold text-[#002233]">1,257</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
                <div className="p-3 mr-4 text-white bg-[#0066FF] rounded-full">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">Bookings Today</p>
                  <p className="text-lg font-semibold text-[#002233]">35</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
                <div className="p-3 mr-4 text-white bg-[#0066FF] rounded-full">
                  <Hotel className="w-6 h-6" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">Room Occupancy</p>
                  <p className="text-lg font-semibold text-[#002233]">85%</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
                <div className="p-3 mr-4 text-white bg-[#0066FF] rounded-full">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-lg font-semibold text-[#002233]">$15,789</p>
                </div>
              </div>
            </div>

            {/* Charts and Tables */}
            <div className="grid gap-6 mb-8 md:grid-cols-2">



              <BookingsChart bookings={bookings} />
              <RevenueBarChart/>
             </div>


              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-[#002233]">Recent Bookings</h2>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                      <thead className="text-xs uppercase bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-[#002233]">Hotel Name</th>
                          <th scope="col" className="px-6 py-3 text-[#002233]">Room</th>
                          <th scope="col" className="px-6 py-3 text-[#002233]">Check-in</th>
                          <th scope="col" className="px-6 py-3 text-[#002233]">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking._id} className="bg-white border-b">
                            <td className="px-6 py-4">{booking.hotelId.name}</td>
                            <td className="px-6 py-4">{booking.roomTypes.join(', ')}</td>
                            <td className="px-6 py-4">
                              {new Date(booking.checkInDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`text-xs font-medium px-2.5 py-0.5 rounded ${booking.cancelled
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-green-100 text-green-800'
                                  }`}
                              >
                                {booking.cancelled ? 'Cancelled' : booking.paymentStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
        </main>
      </div>
    </div>
  )
}