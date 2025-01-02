import React, { useEffect, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import uploadImageToCloudinary from '../../utils/cloudinary'; 
import api from '../../services/api';

export default function ManagerProfilePicture() {
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState('/placeholder.svg?height=192&width=192');

  useEffect(() => {
    const fetchManagerProfile = async () => {
      try {
        const managerData = localStorage.getItem('managerData');
        if (managerData) {
          const { token, _id } = JSON.parse(managerData);
          const res = await api.get(`/manager/manager-profile?managerId=${_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.data.profilePicture) {
            setProfileImage(res.data.profilePicture);
          }
        }
      } catch (error) {
        console.error('Error fetching manager profile:', error);
      }
    };
    fetchManagerProfile();
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true); 
      const data = await uploadImageToCloudinary(file);
      if (data.secure_url) {
        setProfileImage(data.secure_url); 
        await saveImageToBackend(data.secure_url);
      } else {
        console.error('Upload failed:', data);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false); 
    }
  };

  const saveImageToBackend = async (imageUrl) => {
    try {
      const managerData = localStorage.getItem('managerData');
      if (!managerData) {
        throw new Error('Manager data not found');
      }

      const { token, _id } = JSON.parse(managerData);

      const res = await api.post(
        '/manager/profile-image',
        {
          imageUrl, 
          managerId: _id, 
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error('Error updating profile image:', error);
      throw error;
    }
  };

  return (
    <div className="md:flex-shrink-0">
      <div className="h-48 w-full md:w-48 relative">
        {/* Profile image or placeholder */}
        <img
          className="h-full w-full object-cover md:h-full md:w-48"
          src={profileImage} 
          alt="Profile"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload} 
          className="hidden"
          id="profile-image-upload"
        />
        <label
          htmlFor="profile-image-upload"
          className="absolute bottom-2 right-2 bg-[#0066FF] text-white p-2 rounded-full hover:bg-[#0055CC] transition duration-300 cursor-pointer"
        >
          {uploading ? (
            <span className="loader">Uploading...</span> 
          ) : (
            <FaCamera className="h-5 w-5" />
          )}
        </label>
      </div>
    </div>
  );
}
