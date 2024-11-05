import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../redux/authSlice';
import { 
  Hotel, 
  Users, 
  Calendar, 
  BarChart, 
  List, 
  Wallet,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';

export default function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { icon: Home, text: 'Dashboard', route: '/admin/dashboard' },
    { icon: Users, text: 'Users', route: '/admin/users' },
    { icon: Users, text: 'Managers', route: '/admin/managers' },
    { icon: List, text: 'Category', route: '/admin/categories' }, 
    { icon: Calendar, text: 'Bookings', route: '/admin/bookings' },
    { icon: Hotel, text: 'Hotels', route: '/admin/hotels' },
    { icon: BarChart, text: 'Services', route: '/admin/services' },
    { icon: Wallet, text: 'Wallet', route: '/admin/wallet' },
  ];

  return (
    <>
      <button 
        className="fixed top-4 left-4 z-40 lg:hidden bg-[#00246B] text-white p-2 rounded-md shadow-lg"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`
        fixed top-0 left-0 z-30 w-64 h-screen transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 bg-[#00246B] text-white
        shadow-xl
      `}>
        <div className="h-full px-3 py-4 overflow-y-auto flex flex-col">
          <div className="flex items-center mb-8 p-2 bg-[#001A4D] rounded-lg">
            <span className="ml-5 text-xl font-bold tracking-wide text-[#CADCFC]">Admin Panel</span>
          </div>
          <nav className="flex-grow">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.route;
                return (
                  <li key={index}>
                    <button
                      onClick={() => navigate(item.route)}
                      className={`
                        flex items-center w-full p-3 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-[#CADCFC] text-[#00246B] shadow-md' 
                          : 'hover:bg-[#003399] text-[#CADCFC] hover:text-white'}
                      `}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-[#00246B]' : 'text-[#CADCFC]'}`} />
                      <span className="ml-3 font-medium">{item.text}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-auto">
            <button 
              className="flex items-center w-full p-3 rounded-lg hover:bg-red-600 transition-all duration-200 text-[#CADCFC] hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3 font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}