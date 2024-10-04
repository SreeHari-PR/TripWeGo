import React from 'react'
import { ChevronDown, Hotel, Users, Calendar, DollarSign, BarChart2, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  // Define routes and icons as an array
  const routes = [
    { name: 'Dashboard', path: '/manager/dashboard', icon: <Hotel className="inline-block mr-2" /> },
    { name: 'Hotels', path: '/manager/hotels', icon: <Users className="inline-block mr-2" /> },
    { name: 'Bookings', path: '/manager/bookings', icon: <Calendar className="inline-block mr-2" /> },
    { name: 'Revenue', path: '/manager/revenue', icon: <DollarSign className="inline-block mr-2" /> },
    { name: 'Analytics', path: '/manager/analytics', icon: <BarChart2 className="inline-block mr-2" /> },
    { name: 'Settings', path: '/manager/settings', icon: <Settings className="inline-block mr-2" /> },
  ];

  return (
    <aside
      className={`bg-[#002233] text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 transition duration-200 ease-in-out`}
    >
      <div className="flex items-center justify-between px-4">
        <span className="text-2xl font-semibold">Hotel Manager</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
          <ChevronDown className={`h-6 w-6 transform ${sidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <nav>
        {/* Dynamically render buttons for each route */}
        {routes.map((route) => (
          <button
            key={route.path}
            onClick={() => navigate(route.path)}
            className="block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-[#0066FF]"
          >
            {route.icon} {route.name}
          </button>
        ))}
      </nav>
    </aside>
  )
}
