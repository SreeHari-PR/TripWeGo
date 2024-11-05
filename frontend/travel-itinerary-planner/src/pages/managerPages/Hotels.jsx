import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import AddHotelForm from '../../components/Manager/AddHotelForm';
import HotelList from '../../components/Manager/HotelList';
import { Sidebar } from '../../components/Manager/ManagerSidebar'
import { Navbar } from '../../components/Manager/ManagerNavbar'

const AdminHotelsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleAddHotel = (newHotel) => {
    setHotels([...hotels, newHotel]);
    setShowForm(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-y-auto">
          <div className="container  px-4 py-8">
            <div className="flex justify-between items-center mb-6">
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center px-4 py-2 bg-[#0066FF] text-white rounded-md hover:bg-[#0055cc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066FF]"
                >
                  <FaPlus className="mr-2" />
                  Add Hotel
                </button>
              )}
            </div>

            {showForm ? (
              <div className="bg-white rounded-lg shadow-md  p-6 mb-8">
                <AddHotelForm onSubmit={handleAddHotel} onCancel={() => setShowForm(false)} />
              </div>
            ) : (
              <HotelList hotels={hotels} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHotelsPage;
