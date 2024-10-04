import React, { useEffect, useState, useRef } from 'react';
import { FaBookOpen, FaSignOutAlt, FaUser, FaHotel } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import uploadImageToCloudinary from '../../utils/cloudinary';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    name: '',
    email: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };


  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/users/profile', {
        headers: {
          Authorization: ` ${token}`, 
        },
      });
      setProfile(response.data);
      setUpdatedProfile({
        name: response.data.name,
        email: response.data.email,
      });
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load profile');
      setLoading(false);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUpdatedProfile({
      ...updatedProfile,
      [id]: value,
    });
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const data = await uploadImageToCloudinary(file);
        if (data?.url) {
          setSelectedFile(data.url);
          toast.success('Image uploaded successfully');
        } else {
          toast.error('Image upload failed');
        }
      } catch (error) {
        toast.error('Image upload error');
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      const updatedProfileWithImage = {
        ...updatedProfile,
        profilePicture: selectedFile || profile.profilePicture,
      };

      await api.put('/users/profile', updatedProfileWithImage, {
        headers: {
          Authorization: ` ${token}`,
        },
      });
      toast.success('Profile updated successfully');
      setProfile(updatedProfileWithImage); 
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedProfile({
      name: profile.name,
      email: profile.email,
    });
  };

  const handleResetPasswordChange = (e) => {
    const { id, value } = e.target;
    setResetPasswordData({
      ...resetPasswordData,
      [id]: value,
    });
  };

  const handleResetPassword = async () => {
    try {
      const { currentPassword, newPassword, confirmNewPassword } = resetPasswordData;

      if (!currentPassword || !newPassword || !confirmNewPassword) {
        toast.error('All fields are required');
        return;
      }

      if (newPassword !== confirmNewPassword) {
        toast.error('New passwords do not match');
        return;
      }

      const token = localStorage.getItem('token');
      await api.post('/users/resetpassword', { currentPassword, newPassword }, {
        headers: {
          Authorization: ` ${token}`,
        },
      });

      toast.success('Password reset successfully');
      setShowResetPassword(false);
      setResetPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!profile) return <div>No profile data</div>;

  return (
    <div className="flex h-screen bg-[#002233]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0066FF] shadow-md">
        <nav className="p-4 space-y-2">
          <button className="flex items-center space-x-2 p-2 bg-[#004466] rounded text-white" onClick={() => navigate('/')}>
            <FaHotel className="h-5 w-5" />
            <span>Home</span>
          </button>
          <a href="#" className="flex items-center space-x-2 p-2 bg-[#004466] rounded text-white">
            <FaUser className="h-5 w-5" />
            <span>Profile</span>
          </a>
          <a href="#" className="flex items-center space-x-2 p-2 hover:bg-[#004466] rounded text-white">
            <FaBookOpen className="h-5 w-5" />
            <span>Bookings</span>
          </a>
          <a href="#" className="flex items-center space-x-2 p-2 hover:bg-[#004466] rounded text-white" onClick={handleLogout}>
            <FaSignOutAlt className="h-5 w-5" />
            <span>Logout</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b">
            <h2 className="text-2xl font-bold text-[#002233]">Profile</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-24 w-24 bg-gray-300 rounded-full flex items-center justify-center">
                <img
                  src={profile.profilePicture || '/placeholder.svg?height=96&width=96'}
                  alt="Profile picture"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <button className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100" onClick={() => fileInputRef.current.click()}>
                Add Photo
              </button>
              <input
                ref={fileInputRef}
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>

            {/* Editing form */}
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-gray-700">Name</label>
                  <input
                    id="name"
                    value={updatedProfile.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-gray-700">Email</label>
                  <input
                    id="email"
                    value={updatedProfile.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="space-x-2 mt-4">
                  <button className="px-4 py-2 bg-[#0066FF] text-white rounded" onClick={handleSaveChanges}>Save Changes</button>
                  <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded" onClick={handleCancel}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{profile.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{profile.email}</span>
                  </div>
                </div>
                <div className="mt-4 space-x-2">
                  <button className="px-4 py-2 bg-[#0066FF] text-white rounded" onClick={handleEditClick}>Edit</button>
                </div>
              </>
            )}

            {/* Reset Password Modal */}
            {showResetPassword && (
              <div className="bg-white border rounded p-4 shadow-lg space-y-2">
                <h3 className="text-lg font-semibold">Reset Password</h3>
                <div className="space-y-2">
                  <label htmlFor="currentPassword" className="block text-gray-700">Current Password</label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={resetPasswordData.currentPassword}
                    onChange={handleResetPasswordChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={resetPasswordData.newPassword}
                    onChange={handleResetPasswordChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmNewPassword" className="block text-gray-700">Confirm New Password</label>
                  <input
                    id="confirmNewPassword"
                    type="password"
                    value={resetPasswordData.confirmNewPassword}
                    onChange={handleResetPasswordChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="space-x-2 mt-4">
                  <button className="px-4 py-2 bg-[#0066FF] text-white rounded" onClick={handleResetPassword}>Reset Password</button>
                  <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded" onClick={() => setShowResetPassword(false)}>Cancel</button>
                </div>
              </div>
            )}

            {!showResetPassword && (
              <div className="mt-4">
                <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={() => setShowResetPassword(true)}>
                  Reset Password
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}

