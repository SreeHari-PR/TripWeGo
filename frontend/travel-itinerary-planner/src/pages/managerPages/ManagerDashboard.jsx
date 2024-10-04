import React, { useState } from 'react'
import { Users, Calendar, Hotel, DollarSign } from 'lucide-react'
import { Sidebar } from '../../components/Manager/ManagerSidebar'
import { Navbar } from '../../components/Manager/ManagerNavbar'

export default function ManagerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-[#002233]">Booking Trends</h2>
                <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-[#002233]">Chart Placeholder</span>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-[#002233]">Recent Bookings</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-[#002233]">Guest Name</th>
                        <th scope="col" className="px-6 py-3 text-[#002233]">Room</th>
                        <th scope="col" className="px-6 py-3 text-[#002233]">Check-in</th>
                        <th scope="col" className="px-6 py-3 text-[#002233]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b">
                        <td className="px-6 py-4">John Doe</td>
                        <td className="px-6 py-4">101</td>
                        <td className="px-6 py-4">2023-09-23</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Confirmed</span>
                        </td>
                      </tr>
                      <tr className="bg-white border-b">
                        <td className="px-6 py-4">Jane Smith</td>
                        <td className="px-6 py-4">205</td>
                        <td className="px-6 py-4">2023-09-24</td>
                        <td className="px-6 py-4">
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Pending</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}