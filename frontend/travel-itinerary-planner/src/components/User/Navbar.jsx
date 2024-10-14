import React, { useState } from 'react';
import { FaHotel, FaBars, FaTimes, FaUser, FaSearch, FaHeart, FaSuitcase } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const StickyNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  console.log(user,'user');
  
  
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-[#002233] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <FaHotel className="h-8 w-8 text-[#0066FF]" />
              <span className="ml-2 text-xl font-bold text-white">Trip We Go</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-[#0066FF] text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/hotels" className="border-transparent text-gray-300 hover:border-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Hotels
              </Link>
              <Link to="/destinations" className="border-transparent text-gray-300 hover:border-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Destinations
              </Link>
              <Link to="/deals" className="border-transparent text-gray-300 hover:border-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Deals
              </Link>
            </div>
          </div>
          <div className="hidden relative sm:ml-6 sm:flex sm:items-center">
            <button className="ml-3 p-1 rounded-full text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066FF]">
              <span className="sr-only">Favorites</span>
              <FaHeart className="h-6 w-6" />
            </button>
            <button className="ml-3 p-1 rounded-full text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066FF]">
              <span className="sr-only">Bookings</span>
              <FaSuitcase className="h-6 w-6" />
            </button>
            <div className="ml-3 relative">
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    navigate('/login');
                  } else {
                    toggleDropdown();
                  }
                }}
                className="bg-[#0066FF] rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#002233] focus:ring-white"
                id="user-menu"
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                <FaUser className="h-8 w-8 rounded-full p-1 text-white" />
              </button>

              {/* {isLoggedIn && (
                <div className="ml-3 float-left">
                  <span className="text-base font-medium text-white">{user?.name}</span>
                </div>
              )} */}
            </div>


            {isDropdownOpen && isLoggedIn && (
              <div className="absolute top-20 w-48 bg-white rounded-md shadow-lg z-20">
                <div className="px-4 py-2">
                  <div className="text-base font-medium text-black">{user?.name}</div>
                  <div className="text-sm text-gray-500">{user?.email}</div>
                </div>
                <div className="border-t">
                  <div className="py-1">
                    <Link to="/profile" className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-white hover:bg-[#003344]">
                      Your Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-white hover:bg-[#003344]">
                      Settings
                    </Link>
                    <button onClick={() => navigate('/signout')} className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-white hover:bg-[#003344]">
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-[#003344] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className="bg-[#003344] border-[#0066FF] text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              Home
            </Link>
            <Link to="/hotels" className="border-transparent text-gray-300 hover:bg-[#003344] hover:border-gray-300 hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              Hotels
            </Link>
            <Link to="/destinations" className="border-transparent text-gray-300 hover:bg-[#003344] hover:border-gray-300 hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              Destinations
            </Link>
            <Link to="/deals" className="border-transparent text-gray-300 hover:bg-[#003344] hover:border-gray-300 hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              Deals
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-[#003344]">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <FaUser className="h-10 w-10 rounded-full bg-[#0066FF] p-2 text-white" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{isLoggedIn ? user?.name : 'Guest'}</div>
                {isLoggedIn ? (
                  <div className="text-sm font-medium text-gray-300">{user?.email}</div>
                ) : (
                  <div className="text-sm font-medium text-gray-300">Login to see your details</div>
                )}
              </div>
            </div>
            <div className="mt-3 space-y-1">
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="block px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-[#003344]">
                    Your Profile
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-[#003344]">
                    Settings
                  </Link>
                  <button onClick={() => navigate('/signout')} className="block px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-[#003344]">
                    Sign out
                  </button>
                </>
              ) : (
                <Link to="/login" className="block px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-[#003344]">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default StickyNavbar;
