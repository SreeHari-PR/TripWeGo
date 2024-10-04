import React, { useState } from 'react';
import { FaEdit, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function ManagerProfileInfo({ manager = {}, error }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: manager?.name || '',
    email: manager?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleEditProfile = () => {
    setIsEditing(true);
  };
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const manager = JSON.parse(localStorage.getItem('managerData'));
      const managerId = manager?._id;
      const response = await api.put(`/manager/edit-profile?managerId=${managerId}`, formData, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });
      setLoading(false);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setLoading(false);
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Something went wrong!');
    }
  };
  const handleResetPassword = () => {
    navigate('/manager/reset-password');
  };
  const handleCancelEdit = () => {
    setFormData({
      name: manager?.name || '',
      email: manager?.email || '',
    });
    setIsEditing(false);
  };

  return (
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
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#002233]">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0066FF] focus:ring focus:ring-[#0066FF] focus:ring-opacity-50"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#002233]">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0066FF] focus:ring focus:ring-[#0066FF] focus:ring-opacity-50"
              disabled={loading}
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-[#0066FF] text-white px-4 py-2 rounded-md hover:bg-[#0055CC] transition duration-300"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-200 text-[#002233] px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex space-x-4">
            <button
              onClick={handleEditProfile}
              className="flex items-center bg-[#0066FF] text-white px-4 py-2 rounded-md hover:bg-[#0055CC] transition duration-300"
            >
              <FaEdit className="mr-2" /> Edit Profile
            </button>
            <button
              onClick={handleResetPassword}
              className="flex items-center bg-gray-200 text-[#002233] px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300"
            >
              <FaLock className="mr-2" /> Reset Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
