// src/routes/UserRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import Home from '../pages/userPages/Home';
import Login from '../pages/userPages/Login';
import Register from '../pages/userPages/Register';
import UserProfile from '../pages/userPages/Profile';
import VerifyOtp from '../pages/userPages/VerifyOtp';
import HotelListing from '../pages/userPages/HotelListing';
import HotelDetails from '../pages/userPages/HotelDetails';
import BookingsPage from '../pages/userPages/BookingsPage';
import WalletPage from '../pages/userPages/WalletPage';
import ForgotPassword from '../pages/userPages/Forgotpassword';

const UserRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/verify-otp" element={<VerifyOtp />} />
    <Route path="/profile" element={<PrivateRoute element={UserProfile} />} />
    <Route path="/hotels" element={<HotelListing />} />
    <Route path="/hotels/:id" element={<HotelDetails />} />
    <Route path="/bookings" element={<BookingsPage />} />
    <Route path="/wallet" element={<WalletPage />} />
    <Route path="/forgotpassword" element={<ForgotPassword />} />
  </Routes>
);

export default UserRoutes;
