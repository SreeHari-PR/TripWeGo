import React from 'react';
import { Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import RegisterPage from '../pages/managerPages/ManagerRegisterPage';
import LoginPage from '../pages/managerPages/LoginPage';
import ManagerDashboard from '../pages/managerPages/ManagerDashboard';
import ManagerOtpPage from '../pages/managerPages/ManagerOtpPage';
import ManagerProfilePage from '../pages/managerPages/ManagerProfilePage';
import AdminHotelsPage from '../pages/managerPages/Hotels';

const ManagerRoutes = () => {
  return (
    <>
      <Route path="/manager/register" element={<RegisterPage />} />
      <Route path="/manager/login" element={<LoginPage />} />
      <Route path="/manager/hotels" element={<PrivateRoute element={AdminHotelsPage} />} />
      <Route path="/manager/dashboard" element={<PrivateRoute element={ManagerDashboard} />} />
      <Route path="/manager/manager-otp" element={<ManagerOtpPage />} />
      <Route path="/manager/manager-profile" element={<PrivateRoute element={ManagerProfilePage} />} />
      <Route path="/manager/edit-profile" element={<PrivateRoute element={ManagerProfilePage} />} />
      <Route path="/manager/reset-password" element={<PrivateRoute element={ManagerProfilePage} />} />
    </>
  );
};

export default ManagerRoutes;
