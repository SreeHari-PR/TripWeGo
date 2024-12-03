import React from 'react';
import AdminSidebar from '../../components/Admin/Sidebar';
import { Users, Calendar, BarChart2, DollarSign} from 'lucide-react';


const AdminDashboard = () => {
  const recentBookings = [
    { guestName: "John Doe", room: "101", checkIn: "2023-09-23", status: "Confirmed" },
    { guestName: "Jane Smith", room: "205", checkIn: "2023-09-24", status: "Pending" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
    <div className="w-64">
      <AdminSidebar />
    </div>

      {/* Main Content */}
      <main className="p-6">
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
                <p className="text-2xl font-semibold">1,257</p>
              </div>
            </div>
          </div>

          {/* Bookings Today */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500 rounded-full">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bookings Today</p>
                <p className="text-2xl font-semibold">35</p>
              </div>
            </div>
          </div>

          {/* Room Occupancy */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500 rounded-full">
                <BarChart2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Room Occupancy</p>
                <p className="text-2xl font-semibold">85%</p>
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500 rounded-full">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-semibold">$15,789</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Booking Trends */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Booking Trends</h2>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500">Chart Placeholder</p>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="pb-3 text-sm font-semibold text-gray-600">GUEST NAME</th>
                    <th className="pb-3 text-sm font-semibold text-gray-600">ROOM</th>
                    <th className="pb-3 text-sm font-semibold text-gray-600">CHECK-IN</th>
                    <th className="pb-3 text-sm font-semibold text-gray-600">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-3 text-sm">{booking.guestName}</td>
                      <td className="py-3 text-sm">{booking.room}</td>
                      <td className="py-3 text-sm">{booking.checkIn}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            booking.status === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
