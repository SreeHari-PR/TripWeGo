import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from '../../components/Manager/ManagerNavbar';
import { Sidebar } from '../../components/Manager/ManagerSidebar';
import ManagerProfileInfo from '../../components/Manager/ManagerProfileInfo';
import ManagerProfilePicture from '../../components/Manager/ManagerProfilePicture';

export default function ManagerProfile() {
  const [manager, setManager] = useState({});
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            <div className="md:flex">
              <ManagerProfilePicture />
              <ManagerProfileInfo manager={manager} error={error} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
