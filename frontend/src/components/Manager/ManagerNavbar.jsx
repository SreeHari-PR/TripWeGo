import React, { useState, useEffect } from 'react';
import { FaBell, FaUser, FaSignOutAlt, FaChevronDown,FaFacebookMessenger} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

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
        <h1 className="text-3xl font-bold text-[#002233]">Manager</h1>
        <div className="flex items-center space-x-6">
          <button className="relative text-[#002233] p-2 hover:bg-gray-200 rounded-full focus:ring">
            <FaBell className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 bg-red-600 border-white border-2 rounded-full"></span>
          </button>
          <button 
          onClick={()=>navigate('/manager/chat')}
          className="relative text-[#002233] p-2 hover:bg-gray-200 rounded-full focus:ring">
            <FaFacebookMessenger className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 bg-red-600 border-white border-2 rounded-full"></span>
          </button>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none hover:text-[#0066FF]"
            >
              <FaUser className="h-6 w-6 text-[#002233]" />
              <FaChevronDown
                className={`h-4 w-4 text-[#002233] transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-2">
                  <p className="px-4 py-2 text-sm font-medium text-gray-800">{manager.name}</p>
                  <p className="px-4 pb-2 text-xs text-gray-500">{manager.email}</p>
                  <div className="border-t border-gray-200"></div>
                  <button
                    onClick={() => navigate('/manager/manager-profile')}
                    className="flex items-center px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-100"
                  >
                    <FaUser className="mr-2 h-4 w-4" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="mr-2 h-4 w-4" />
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
