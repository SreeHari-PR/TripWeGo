import React from 'react';
import { Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import Home from '../pages/userPages/Home';
import Login from '../pages/userPages/Login';
import Register from '../pages/userPages/Register';
import VerifyOtp from '../pages/userPages/VerifyOtp';
import UserProfile from '../pages/userPages/Profile';
import HotelListing from '../pages/userPages/HotelListing';
import HotelDetails from '../pages/userPages/HotelDetails';
import ForgotPassword from '../pages/userPages/Forgotpassword';

const UserRoutes = () => {
  return (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/profile" element={<PrivateRoute element={UserProfile} />} />
      <Route path="/hotels" element={<HotelListing />} />
      <Route path="/hotels/:id" element={<HotelDetails />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/resetpassword" element={<PrivateRoute element={UserProfile} />} />
    </>
  );
};

export default UserRoutes;
