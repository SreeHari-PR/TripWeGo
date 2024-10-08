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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-y-auto"> {/* Enable scrolling here */}
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Hotel Management</h1>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FaPlus className="mr-2" />
                  Add Hotel
                </button>
              )}
            </div>
            
            {showForm ? (
             <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <AddHotelForm onAddHotel={handleAddHotel} onCancel={() => setShowForm(false)} />
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
