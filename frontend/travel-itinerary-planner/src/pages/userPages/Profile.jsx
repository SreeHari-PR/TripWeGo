import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Camera, Edit2, Key, LogOut } from 'lucide-react';
import api from '../../services/api';
import { logout } from '../../redux/authSlice';
import uploadImageToCloudinary from '../../utils/cloudinary';
import toast from 'react-hot-toast';
import Navigation from '../../components/User/Navigation';
import StickyNavbar from '../../components/User/Navbar';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    profilePicture: '/placeholder.svg?height=128&width=128'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/users/profile', {
        headers: {
          Authorization: `${token}`,
        },
      });
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load profile');
      setLoading(false);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.id]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.id]: e.target.value });
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.put('/users/profile', profile, {
        headers: {
          Authorization: `${token}`,
        },
      });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleChangePassword = async () => {
    try {
      const { currentPassword, newPassword, confirmPassword } = passwordData;

      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error('All fields are required');
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }

      const token = localStorage.getItem('token');
      await api.post('/users/resetpassword', { currentPassword, newPassword }, {
        headers: {
          Authorization: `${token}`,
        },
      });

      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const data = await uploadImageToCloudinary(file);
        if (data?.url) {
          const updatedProfile = { ...profile, profilePicture: data.url };
          setProfile(updatedProfile);
          handleSaveChanges();
        } else {
          toast.error('Image upload failed');
        }
      } catch (error) {
        toast.error('Image upload error');
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#CADCFC] to-[#00246B]">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#00246B]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#CADCFC] to-[#00246B]">
      <StickyNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Navigation onLogout={handleLogout} />
          </div>
          <div className="md:col-span-3">
            <div className="bg-[#CADCFC] rounded-lg shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <img
                      src={profile.profilePicture}
                      alt="Profile"
                      className="h-32 w-32 rounded-full object-cover border-4 border-[#00246B]"
                    />
                    <button 
                      className="absolute bottom-0 right-0 bg-[#00246B] text-white p-2 rounded-full hover:bg-[#CADCFC] transition duration-300"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <Camera className="h-5 w-5" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </div>
                  <h1 className="text-3xl font-bold text-[#00246B]">{profile.name}</h1>
                  <p className="text-[#00246B]">{profile.email}</p>
                </div>
              </div>
              
              <div className="border-b border-[#00246B]">
                <nav className="flex">
                  {['profile', 'security'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-4 px-1 text-center font-medium text-sm ${
                        activeTab === tab
                          ? 'border-b-2 border-[#00246B] text-[#00246B]'
                          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab === 'profile' ? (
                        <div className="flex items-center justify-center">
                          <Edit2 className="h-5 w-5 mr-2" />
                          Profile
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Key className="h-5 w-5 mr-2" />
                          Security
                        </div>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-[#00246B]">Profile Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[#00246B]">Name</label>
                        <input
                          id="name"
                          type="text"
                          value={profile.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00246B] focus:ring focus:ring-[#CADCFC] focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#00246B]">Email</label>
                        <input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00246B] focus:ring focus:ring-[#CADCFC] focus:ring-opacity-50"
                        />
                      </div>
                    </div>
                    {isEditing ? (
                      <div className="flex space-x-3">
                        <button
                          onClick={handleSaveChanges}
                          className="px-4 py-2 bg-[#00246B] text-white rounded-md hover:bg-[#CADCFC] focus:outline-none focus:ring-2 focus:ring-[#00246B] focus:ring-offset-2 transition duration-300"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-[#00246B] text-white rounded-md hover:bg-[#CADCFC] focus:outline-none focus:ring-2 focus:ring-[#00246B] focus:ring-offset-2 transition duration-300"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                )}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-[#00246B]">Change Password</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-[#00246B]">Current Password</label>
                        <input
                          id="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00246B] focus:ring focus:ring-[#CADCFC] focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-[#00246B]">New Password</label>
                        <input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00246B] focus:ring focus:ring-[#CADCFC] focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#00246B]">Confirm New Password</label>
                        <input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00246B] focus:ring focus:ring-[#CADCFC] focus:ring-opacity-50"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleChangePassword}
                      className="px-4 py-2 bg-[#00246B] text-white rounded-md hover:bg-[#CADCFC] focus:outline-none focus:ring-2 focus:ring-[#00246B] focus:ring-offset-2 transition duration-300"
                    >
                      Change Password
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
