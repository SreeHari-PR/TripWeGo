import React, { useState, useEffect } from 'react';
import { FaBell, FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [manager, setManager] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchManagerProfile = async () => {
      try {
        const managerData = localStorage.getItem('managerData');
        if (managerData) {
          const parsedManagerData = JSON.parse(managerData);
          setManager(parsedManagerData);
        }
      } catch (error) {
        setError('Unable to fetch profile');
      }
    };

    fetchManagerProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('managerData');
    toast.success('Logged out successfully');
    navigate('/manager/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#002233]">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button className="p-1 rounded-full text-[#002233] hover:bg-gray-100 focus:outline-none focus:ring">
            <FaBell className="h-6 w-6" />
          </button>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <img
                className="h-8 w-8 rounded-full"
                src="/placeholder.svg?height=32&width=32"
                alt="User avatar"
              />
              <FaChevronDown className={`h-4 w-4 text-[#002233] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium text-[#002233]">{manager.name}</p>
                    <p className="text-xs text-gray-500">{manager.email}</p>
                  </div>
                  <div className="border-t border-gray-100"></div>
                  <button
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => navigate('/manager/manager-profile')}
                    role="menuitem"
                  >
                    <FaUser className="mr-3 h-4 w-4 text-[#0066FF]" />
                    Profile
                  </button>
                  <button
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    <FaSignOutAlt className="mr-3 h-4 w-4 text-[#0066FF]" />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
