import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye, FaSearch, FaPlus, FaTimes } from 'react-icons/fa';
import api from '../../services/api';
import AdminSidebar from '../../components/Admin/Sidebar';

export default function AdminManagerList() {
  const [managers, setManagers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedManager, setSelectedManager] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const token = localStorage.getItem('token'); 
        console.log(token,'token');
        
        const response = await api.get('/admin/managers', {
          headers: {
            Authorization: `${token}` 
          }
        });
        setManagers(response.data);
      } catch (error) {
        console.error('Error fetching managers:', error);
      }
    };
    fetchManagers();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredManagers = managers.filter((manager) =>
    manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = async (manager) => {
    try {
      setLoadingDetails(true);
      const response = await api.get(`/admin/managers/${manager._id}`);
      setSelectedManager(response.data);
      setIsModalOpen(true);
      setLoadingDetails(false);
    } catch (error) {
      console.error('Error fetching manager details:', error);
      setLoadingDetails(false);
    }
  };

  const handleApprove = async (managerId) => {
    try {
      await api.post(`/admin/managers/${managerId}/approve`);
      setSelectedManager({ ...selectedManager, approved: true });
      alert('Manager approved successfully.');
    } catch (error) {
      console.error('Error approving manager:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedManager(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64">
        <AdminSidebar />
      </div>
      <div className="flex-grow w-auto mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#002233] mb-6">Manager List</h1>
        <div className="mb-4 flex justify-between items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search managers..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
              value={searchTerm}
              onChange={handleSearch}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Approved
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hotels
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredManagers.map((manager) => (
                <tr key={manager._id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-gray-900 whitespace-no-wrap">{manager.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{manager.email}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{manager.approved ? 'true' : 'false'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{manager.hotels || 0}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(manager.status)}`}>
                      {manager.status}
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex space-x-3">
                      <button className="text-blue-600 hover:text-blue-900" title="View Details" onClick={() => handleViewDetails(manager)}>
                        <FaEye />
                      </button>
                      {/* <button className="text-green-600 hover:text-green-900" title="Edit">
                        <FaEdit />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Delete">
                        <FaTrash />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && selectedManager && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#002233]">Manager Details</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <FaTimes />
                </button>
              </div>
              {loadingDetails ? (
                <p>Loading...</p>
              ) : (
                <div className="space-y-4">
                  <p><strong>Name:</strong> {selectedManager.name}</p>
                  <p><strong>Email:</strong> {selectedManager.email}</p>
                  <p><strong>License:</strong> <a href={selectedManager.license} target="_blank" rel="noopener noreferrer" className="text-blue-500">View License</a></p>
                  <p><strong>KYC:</strong> <a href={selectedManager.kyc} target="_blank" rel="noopener noreferrer" className="text-blue-500">View KYC</a></p>
                  <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full ${getStatusColor(selectedManager.status)}`}>{selectedManager.status}</span></p>
                </div>
              )}

              {!selectedManager.approved && (
                <button
                  onClick={() => handleApprove(selectedManager._id)}
                  className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Approve Manager
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
