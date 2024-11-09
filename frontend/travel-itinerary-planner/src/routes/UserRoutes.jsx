// src/routes/UserRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import NotFound from '../components/Unauthorised';

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: {
    duration: 0.6,
    ease: "easeInOut"
  }
};

const UserRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <motion.div {...pageTransition}>
          <Home />
        </motion.div>
      }
    />
    <Route
      path="/login"
      element={
        <motion.div {...pageTransition}>
          <Login />
        </motion.div>
      }
    />
    <Route
      path="/register"
      element={
        <motion.div {...pageTransition}>
          <Register />
        </motion.div>
      }
    />
    <Route
      path="/verify-otp"
      element={
        <motion.div {...pageTransition}>
          <VerifyOtp />
        </motion.div>
      }
    />
    <Route
      path="/profile"
      element={
        <PrivateRoute element={<motion.div {...pageTransition}><UserProfile /></motion.div>} />
      }
    />
    <Route
      path="/hotels"
      element={
        <motion.div {...pageTransition}>
          <HotelListing />
        </motion.div>
      }
    />
    <Route
      path="/hotels/:id"
      element={
        <motion.div {...pageTransition}>
          <HotelDetails />
        </motion.div>
      }
    />
    <Route
      path="/bookings"
      element={
        <motion.div {...pageTransition}>
          <BookingsPage />
        </motion.div>
      }
    />
    <Route
      path="/wallet"
      element={
        <motion.div {...pageTransition}>
          <WalletPage />
        </motion.div>
      }
    />
    <Route
      path="/forgotpassword"
      element={
        <motion.div {...pageTransition}>
          <ForgotPassword />
        </motion.div>
      }
    />
    {/* <Route
      path="*"
      element={
        <motion.div {...pageTransition}>
          <NotFound />
        </motion.div>
      }
    /> */}
  </Routes>
);

export default UserRoutes;
