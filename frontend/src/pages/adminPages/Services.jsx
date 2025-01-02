import React, { useState, useEffect } from 'react';
import AddServiceForm from '../../components/Admin/AddServiceForm';
import ServiceList from '../../components/Admin/ServiceList';
import AdminSidebar from '../../components/Admin/Sidebar';
import api from '../../services/api';
import { FaPlus } from 'react-icons/fa';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/admin/services');
        setServices(response.data.services);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleAddService = (newService) => {
    setServices([...services, newService]);
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 flex-shrink-0">
        <AdminSidebar />
      </div>
      <div className="flex-grow overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Hotel Services Admin</h1>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaPlus className="mr-2" /> Add Service
              </button>
            )}
          </div>

          {showForm ? (
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Service</h2>
              <AddServiceForm onAddService={handleAddService} onCancel={handleCancel} />
            </div>
          ) : (
            <>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-600">Loading services...</p>
                </div>
              ) : (
                <>
                  {services.length > 0 ? (
                    <div className="bg-white shadow-md rounded-lg p-6">
                      <h2 className="text-xl font-semibold mb-4 text-gray-700">Service List</h2>
                      <ServiceList services={services} />
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-64">
                      <p className="text-gray-600">No services added yet. Click the "Add Service" button to get started.</p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminServices;