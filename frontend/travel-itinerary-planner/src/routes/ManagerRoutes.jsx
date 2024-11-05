// src/routes/ManagerRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import RegisterPage from '../pages/managerPages/ManagerRegisterPage';
import LoginPage from '../pages/managerPages/LoginPage';
import ManagerOtpPage from '../pages/managerPages/ManagerOtpPage';
import ManagerProfilePage from '../pages/managerPages/ManagerProfilePage';
import ManagerDashboard from '../pages/managerPages/ManagerDashboard';
import AdminHotelsPage from '../pages/managerPages/Hotels';
import EditHotelForm from '../components/Manager/EditHotelForm';
import ManagerWallet from '../pages/managerPages/ManagerWallet';
import ManagerBookingsPage from '../pages/managerPages/ManagerBookingPage';

const ManagerRoutes = () => (
  <Routes>
    <Route path="/manager/register" element={<RegisterPage />} />
    <Route path="/manager/login" element={<LoginPage />} />
    <Route path="/manager/manager-otp" element={<ManagerOtpPage />} />
    <Route path="/manager/dashboard" element={<PrivateRoute element={ManagerDashboard} />} />
    <Route path="/manager/hotels" element={<PrivateRoute element={AdminHotelsPage} />} />
    <Route path="/manager/manager-profile" element={<PrivateRoute element={ManagerProfilePage} />} />
    <Route path="/manager/edit-profile" element={<PrivateRoute element={ManagerProfilePage} />} />
    <Route path="/manager/reset-password" element={<PrivateRoute element={ManagerProfilePage} />} />
    <Route path="/manager/hotels/edit/:id" element={<EditHotelForm />} />
    <Route path="/manager/wallet" element={<ManagerWallet />} />
    <Route path="/manager/bookings" element={<ManagerBookingsPage />} />
  </Routes>
);

export default ManagerRoutes;
