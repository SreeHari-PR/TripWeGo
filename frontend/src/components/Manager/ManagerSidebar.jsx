import React from 'react';
import { ChevronDown, Hotel, Users, Calendar, DollarSign, BarChart2, Settings,Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  // Define routes and icons as an array
  const routes = [
    { name: 'Dashboard', path: '/manager/dashboard', icon: <Hotel className="inline-block mr-2" /> },
    { name: 'Hotels', path: '/manager/hotels', icon: <Users className="inline-block mr-2" /> },
    { name: 'Bookings', path: '/manager/bookings', icon: <Calendar className="inline-block mr-2" /> },
    { name: 'Wallet', path: '/manager/wallet', icon: <Wallet className="inline-block mr-2" /> },
   
  ];

  return (
    <aside
      className={`bg-[#00246B]/90 text-[#CADCFC] w-64 space-y-6 py-7 px-4 fixed inset-y-0 left-0 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 transition-all duration-300 ease-in-out z-40`}
    >
      <div className="flex items-center justify-between px-4">
        <span className="text-2xl font-semibold">Trip We Go</span>
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
            className="block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-[#CADCFC] hover:text-[#00246B]"
          >
            {route.icon} {route.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}
