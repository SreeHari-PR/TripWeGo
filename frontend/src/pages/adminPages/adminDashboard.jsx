import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/Admin/Sidebar';
import { Users, Calendar, BarChart2, IndianRupee } from 'lucide-react';
import BookingChart from '../../components/Admin/BookingChart';
import RevenueBarChart from '../../components/Admin/RevenueBarChart';

import { getDashboardData } from '../../services/Admin/adminService';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data from the backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data.data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const { totalUsers, totalManagers, totalBookings, totalRevenue, recentBookings } = dashboardData;

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <main className="p-6 flex-1">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Guests */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500 rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Guests</p>
                <p className="text-2xl font-semibold">{totalUsers}</p>
              </div>
            </div>
          </div>

          {/* Total Managers */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500 rounded-full">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Managers</p>
                <p className="text-2xl font-semibold">{totalManagers}</p>
              </div>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500 rounded-full">
                <BarChart2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-semibold">{totalBookings}</p>
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500 rounded-full">
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-semibold">{totalRevenue.walletBalance.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
  
        <div className="grid gap-6 mb-8 md:grid-cols-2">
            
            <BookingChart bookings={recentBookings} />
            <RevenueBarChart bookings={recentBookings} />
            </div>
          

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="pb-3 text-sm font-semibold text-gray-600">Hotel NAME</th>
                    <th className="pb-3 text-sm font-semibold text-gray-600">ROOM</th>
                    <th className="pb-3 text-sm font-semibold text-gray-600">CHECK-IN</th>
                    <th className="pb-3 text-sm font-semibold text-gray-600">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-3 text-sm">{booking.hotelId.name}</td>
                      <td className="py-3 text-sm">{booking.roomTypes}</td>
                      <td className="py-3 text-sm">
                        {new Date(booking.checkInDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${booking.paymentStatus === 'Paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                            }`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
   
      </main>
    </div>
  );
};

export default AdminDashboard;
