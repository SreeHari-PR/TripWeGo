import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Hotel, Menu, X, User, Heart, Briefcase, MessageCircle } from 'lucide-react';

const StickyNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    if (isLoggedIn && user?.isBlocked) {
      navigate('/login', { state: { message: 'Your account has been blocked. Please contact support.' } });
    }
  }, [isLoggedIn, user?.isBlocked, navigate]);

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Hotel className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white">Trip We Go</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/hotels">Hotels</NavLink>
              <NavLink to="/manager/login">Manager</NavLink>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  navigate('/login');
                } else {
                  toggleDropdown();
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
            >
              <span className="sr-only">Open user menu</span>
              <User className="h-8 w-8 rounded-full p-1 text-white" />
            </button>

            {isDropdownOpen && isLoggedIn && (
              <div className="absolute top-16 right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 transition-all duration-200 ease-in-out transform origin-top-right">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                <div className="py-1">
                  <DropdownLink to="/profile">Your Profile</DropdownLink>
                  <DropdownLink to="/settings">Settings</DropdownLink>
                  <DropdownLink to="/logout">Logout</DropdownLink>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileNavLink to="/">Home</MobileNavLink>
            <MobileNavLink to="/hotels">Hotels</MobileNavLink>
            <MobileNavLink to="/destinations">Destinations</MobileNavLink>
            <MobileNavLink to="/deals">Deals</MobileNavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-blue-700">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <User className="h-10 w-10 rounded-full bg-blue-600 p-2 text-white" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{isLoggedIn ? user?.name : 'Guest'}</div>
                <div className="text-sm font-medium text-blue-300">
                  {isLoggedIn ? user?.email : 'Login to see your details'}
                </div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              {isLoggedIn ? (
                <>
                  <MobileNavLink to="/profile">My Profile</MobileNavLink>
                  <MobileNavLink to="/settings">Settings</MobileNavLink>
                  <MobileNavLink to="/logout">Logout</MobileNavLink>
                </>
              ) : (
                <MobileNavLink to="/login">Sign in</MobileNavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ children, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`${
        isActive ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-blue-700 hover:text-white'
      } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ children, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`${
        isActive ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-blue-700 hover:text-white'
      } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
    >
      {children}
    </Link>
  );
};

const DropdownLink = ({ children, to }) => (
  <Link
    to={to}
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
  >
    {children}
  </Link>
);

export default StickyNavbar;

