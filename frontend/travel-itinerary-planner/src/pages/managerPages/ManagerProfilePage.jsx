import React, { useState, useEffect } from 'react';
import { FaCamera, FaEdit, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from '../../components/ManagerNavbar';
import { Sidebar } from '../../components/ManagerSidebar';

export default function ManagerProfile() {
  const [manager, setManager] = useState({});
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchManagerProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <div className="h-48 w-full md:w-48 relative">
                  <img
                    className="h-full w-full object-cover md:h-full md:w-48"
                    src="/placeholder.svg?height=192&width=192"
                    alt="Profile"
                  />
                  <button className="absolute bottom-2 right-2 bg-[#0066FF] text-white p-2 rounded-full hover:bg-[#0055CC] transition duration-300">
                    <FaCamera className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-8 w-full">
                <div className="uppercase tracking-wide text-sm text-[#0066FF] font-semibold mb-1">Manager Profile</div>
                {error ? (
                  <p className="text-red-500 mb-4">{error}</p>
                ) : (
                  <div>
                    <h2 className="text-3xl font-bold text-[#002233] mb-2">{manager.name}</h2>
                    <p className="text-gray-500 mb-4">{manager.email}</p>
                  </div>
                )}

                {isEditing ? (
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#002233]">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={manager.name}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0066FF] focus:ring focus:ring-[#0066FF] focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#002233]">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={manager.email}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0066FF] focus:ring focus:ring-[#0066FF] focus:ring-opacity-50"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button type="submit" className="bg-[#0066FF] text-white px-4 py-2 rounded-md hover:bg-[#0055CC] transition duration-300">Save Changes</button>
                      <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 text-[#002233] px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex space-x-4">
                      <button onClick={() => setIsEditing(true)} className="flex items-center bg-[#0066FF] text-white px-4 py-2 rounded-md hover:bg-[#0055CC] transition duration-300">
                        <FaEdit className="mr-2" /> Edit Profile
                      </button>
                      <button onClick={() => setShowResetPassword(true)} className="flex items-center bg-gray-200 text-[#002233] px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300">
                        <FaLock className="mr-2" /> Reset Password
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {showResetPassword && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                <h3 className="text-2xl font-bold text-[#002233] mb-4">Reset Password</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-[#002233]">Current Password</label>
                    <input
                      type="password"
                      id="current-password"
                      name="current-password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0066FF] focus:ring focus:ring-[#0066FF] focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-[#002233]">New Password</label>
                    <input
                      type="password"
                      id="new-password"
                      name="new-password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0066FF] focus:ring focus:ring-[#0066FF] focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-[#002233]">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirm-password"
                      name="confirm-password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0066FF] focus:ring focus:ring-[#0066FF] focus:ring-opacity-50"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button type="submit" className="bg-[#0066FF] text-white px-4 py-2 rounded-md hover:bg-[#0055CC] transition duration-300">Reset Password</button>
                    <button type="button" onClick={() => setShowResetPassword(false)} className="bg-gray-200 text-[#002233] px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
