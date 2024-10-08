import React, { useState } from 'react';
import { 
  FaHotel, 
  FaUsers, 
  FaCalendarAlt, 
  FaCog, 
  FaChartBar, 
  FaComments, 
  FaTags, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaListAlt,
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/authSlice';

export default function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();  

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { icon: FaHotel, text: 'Dashboard', route: '/admin/dashboard' },
    { icon: FaUsers, text: 'Users', route: '/admin/users' },
    { icon: FaUsers, text: 'Managers', route: '/admin/managers' },
    { icon: FaListAlt, text: 'Category', route: '/admin/categories' }, 
    { icon: FaCalendarAlt, text: 'Bookings', route: '/admin/bookings' },
    { icon: FaHotel, text: 'Hotels', route: '/admin/hotels' },
    { icon: FaChartBar, text: 'services', route: '/admin/services' },
    { icon: FaComments, text: 'Reviews', route: '/admin/reviews' },
    { icon: FaTags, text: 'Promotions', route: '/admin/promotions' },
    { icon: FaCog, text: 'Settings', route: '/admin/settings' },
  ];

  return (
    <>
      <button 
        className="fixed top-4 left-4 z-40 lg:hidden text-white"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      <aside className={
        `fixed top-0 left-0 z-30 w-64 h-screen transition-transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 bg-[#002233] text-white`
      }>
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="flex items-center mb-5 p-2">
            <FaHotel className="w-8 h-8 text-[#0066FF]" />
            <span className="ml-3 text-xl font-semibold">Admin Panel</span>
          </div>
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => navigate(item.route)}
                  className="flex items-center w-full p-2 rounded-lg hover:bg-[#003344] transition-colors"
                >
                  <item.icon className="w-6 h-6 text-[#0066FF]" />
                  <span className="ml-3">{item.text}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="absolute bottom-0 left-0 w-full p-4">
            <button 
              className="flex items-center w-full p-2 rounded-lg hover:bg-[#003344] transition-colors"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="w-6 h-6 text-[#0066FF]" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
