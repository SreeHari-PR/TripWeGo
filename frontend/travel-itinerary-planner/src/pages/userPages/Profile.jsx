import React, { useEffect, useState, useRef } from 'react';
import { FaHome, FaUser, FaBookOpen, FaSignOutAlt, FaCamera, FaEnvelope, FaLock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../redux/authSlice';
import StickyNavbar from '../../components/User/Navbar';
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
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
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
          handleSaveChanges(data.url);
        } else {
          toast.error('Image upload failed');
        }
      } catch (error) {
        toast.error('Image upload error');
      }
    }
  };

  const handleSaveChanges = async (imageUrl) => {
    try {
      const token = localStorage.getItem('token');
      const updatedProfileWithImage = {
        ...updatedProfile,
        profilePicture: imageUrl || profile.profilePicture,
      };

      await api.put('/users/profile', updatedProfileWithImage, {
        headers: {
          Authorization: ` ${token}`,
        },
      });
      setProfile(updatedProfileWithImage);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
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
      setResetPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setShowResetPasswordModal(false);
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen bg-[#0066FF] text-white">Loading...</div>;

  if (!profile) return <div className="flex justify-center items-center h-screen bg-[#0066FF] text-white">No profile data</div>;

  return (
    <div className="min-h-screen">
      <StickyNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
          <div className="bg-[#002233] shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Navigation</h2>
            <nav className="space-y-2">
              <Link to="/" className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white hover:bg-[#003355] rounded-md transition duration-150 ease-in-out">
                <FaHome className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link to="/profile" className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-[#003355] text-white rounded-md">
                <FaUser className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <Link to="/bookings" className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white hover:bg-[#003355] rounded-md transition duration-150 ease-in-out">
                <FaBookOpen className="h-5 w-5" />
                <span>Bookings</span>
              </Link>
              <button onClick={handleLogout} className="flex w-full items-center space-x-2 px-4 py-2 text-sm font-medium text-white hover:bg-[#003355] rounded-md transition duration-150 ease-in-out">
                <FaSignOutAlt className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-[#002233] h-32"></div>
              <div className="p-6 -mt-16">
                <div className="flex flex-col items-center">
                  <img
                    src={profile.profilePicture || '/placeholder.svg?height=128&width=128'}
                    alt="Profile picture"
                    className="h-32 w-32 rounded-full border-4 border-white object-cover"
                  />
                  <h2 className="mt-4 text-2xl font-bold text-[#002233]">{profile.name}</h2>
                  <p className="text-gray-600">{profile.email}</p>
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="mt-4 px-4 py-2 bg-[#002233] text-white rounded-md hover:bg-[#003355] transition duration-150 ease-in-out flex items-center"
                  >
                    <FaCamera className="mr-2" /> Change Photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
                {isEditing ? (
                  <form className="mt-6 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#002233]">Name</label>
                      <input
                        id="name"
                        type="text"
                        value={updatedProfile.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#002233] focus:ring focus:ring-[#002233] focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#002233]">Email</label>
                      <input
                        id="email"
                        type="email"
                        value={updatedProfile.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#002233] focus:ring focus:ring-[#002233] focus:ring-opacity-50"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleSaveChanges()}
                        className="px-4 py-2 bg-[#002233] text-white rounded-md hover:bg-[#003355] transition duration-150 ease-in-out"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gray-200 text-[#002233] rounded-md hover:bg-gray-300 transition duration-150 ease-in-out"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center space-x-2 text-[#002233]">
                      <FaEnvelope className="h-5 w-5" />
                      <span>{profile.email}</span>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-[#002233] text-white rounded-md hover:bg-[#003355] transition duration-150 ease-in-out"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-[#002233]">Security</h2>
              <button
                onClick={() => setShowResetPasswordModal(true)}
                className="px-4 py-2 bg-[#002233] text-white rounded-md hover:bg-[#003355] transition duration-150 ease-in-out flex items-center"
              >
                <FaLock className="mr-2" /> Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 bg-[#0066FF] bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-[#002233]">Reset Password</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-[#002233]">Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  value={resetPasswordData.currentPassword}
                  onChange={handleResetPasswordChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#002233] focus:ring focus:ring-[#002233] focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-[#002233]">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={resetPasswordData.newPassword}
                  onChange={handleResetPasswordChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#002233] focus:ring focus:ring-[#002233] focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-[#002233]">Confirm New Password</label>
                <input
                  id="confirmNewPassword"
                  type="password"
                  value={resetPasswordData.confirmNewPassword}
                  onChange={handleResetPasswordChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#002233] focus:ring focus:ring-[#002233] focus:ring-opacity-50"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setShowResetPasswordModal(false)}
                className="px-4 py-2 bg-gray-200 text-[#002233] rounded-md hover:bg-gray-300 transition duration-150 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 bg-[#002233] text-white rounded-md hover:bg-[#003355] transition duration-150 ease-in-out"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}