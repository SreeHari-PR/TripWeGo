import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/Profile';
import AdminLogin from './pages/adminPages/adminLogin';
import AdminDashboard from './pages/adminPages/adminDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import VerifyOtp from './pages/VerifyOtp';
import ManagerOtpPage from './pages/managerPages/ManagerOtpPage';
import RegisterPage from './pages/managerPages/ManagerRegisterPage';
import LoginPage from './pages/managerPages/LoginPage';
import ManagerProfilePage from './pages/managerPages/ManagerProfilePage';
import ForgotPassword from './pages/Forgotpassword';
import ManagerDetails from './pages/adminPages/Managerdetails';
import ManagerDashboard from './pages/managerPages/ManagerDashboard';
const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <ToastContainer />
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/managers/:id" element={<ManagerDetails />} />
          <Route path="/admin/managers/:id/approve" element={<ManagerDetails />} />
          <Route path="/manager/register" element={<RegisterPage />} />
          <Route path="/manager/login" element={<LoginPage />} />
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/manager-otp" element={<ManagerOtpPage />} />
          <Route path="manager/manager-profile" element={<ManagerProfilePage />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<UserProfile />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
