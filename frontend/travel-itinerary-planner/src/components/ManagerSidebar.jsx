import React from 'react'
import { ChevronDown, Hotel, Users, Calendar, DollarSign, BarChart2, Settings } from 'lucide-react'

export function Sidebar({ sidebarOpen, setSidebarOpen }) {
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
        <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-[#0066FF]">
          <Hotel className="inline-block mr-2" /> Dashboard
        </a>
        <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-[#0066FF]">
          <Users className="inline-block mr-2" /> Guests
        </a>
        <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-[#0066FF]">
          <Calendar className="inline-block mr-2" /> Bookings
        </a>
        <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-[#0066FF]">
          <DollarSign className="inline-block mr-2" /> Revenue
        </a>
        <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-[#0066FF]">
          <BarChart2 className="inline-block mr-2" /> Analytics
        </a>
        <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-[#0066FF]">
          <Settings className="inline-block mr-2" /> Settings
        </a>
      </nav>
    </aside>
  )
}