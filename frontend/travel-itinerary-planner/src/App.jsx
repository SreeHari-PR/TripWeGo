import React from 'react';
import { useState,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Login from './pages/userPages/Login';
import Register from './pages/userPages/Register';
import UserProfile from './pages/userPages/Profile';
import AdminLogin from './pages/adminPages/adminLogin';
import AdminDashboard from './pages/adminPages/adminDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/userPages/Home';
import VerifyOtp from './pages/userPages/VerifyOtp';
import ManagerOtpPage from './pages/managerPages/ManagerOtpPage';
import RegisterPage from './pages/managerPages/ManagerRegisterPage';
import LoginPage from './pages/managerPages/LoginPage';
import ManagerProfilePage from './pages/managerPages/ManagerProfilePage';
import ForgotPassword from './pages/userPages/Forgotpassword';
import ManagerDetails from './pages/adminPages/Managerdetails';
import ManagerDashboard from './pages/managerPages/ManagerDashboard';
import CategoriesAdmin from './pages/adminPages/Categories';
import UserList from './pages/adminPages/userList';
import AdminManagerList from './pages/adminPages/ManagerList';
import Services from './pages/adminPages/Services';
import AdminHotelsPage from './pages/managerPages/Hotels';
import HotelDetails from './pages/userPages/HotelDetails';
import PrivateRoute from './components/PrivateRoute';
import HotelListing from './pages/userPages/HotelListing';
import Loader from './components/Loader';
const App = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000); 

    return () => clearTimeout(timer); 
  }, []);
  return (
    <Provider store={store}>
      <Router>
      <Loader isLoading={isLoading}>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/profile" element={<PrivateRoute element={UserProfile} />} />
          <Route path="/hotels" element={<HotelListing />} />
          <Route path="/hotels/:id" element={<HotelDetails />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<PrivateRoute element={AdminDashboard} />} />
          <Route path="/admin/categories" element={<PrivateRoute element={CategoriesAdmin} />} />
          <Route path="/admin/services" element={<PrivateRoute element={Services} />} />
          <Route path="/admin/users" element={<PrivateRoute element={UserList} />} />
          <Route path="/admin/managers" element={<PrivateRoute element={AdminManagerList} />} />
          <Route path="/admin/managers/:id" element={<PrivateRoute element={ManagerDetails} />} />
          <Route path="/admin/managers/:id/approve" element={<PrivateRoute element={ManagerDetails} />} />
          <Route path="/manager/register" element={<RegisterPage />} />
          <Route path="/manager/login" element={<LoginPage />} />
          <Route path="/manager/hotels" element={<PrivateRoute element={AdminHotelsPage} />} />
          <Route path="/manager/dashboard" element={<PrivateRoute element={ManagerDashboard} />} />
          <Route path="/manager/manager-otp" element={<ManagerOtpPage />} />
          <Route path="/manager/manager-profile" element={<PrivateRoute element={ManagerProfilePage} />} />
          <Route path="/manager/edit-profile" element={<PrivateRoute element={ManagerProfilePage} />} />
          <Route path="/manager/reset-password" element={<PrivateRoute element={ManagerProfilePage} />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<PrivateRoute element={UserProfile} />} />
        </Routes>
        </Loader>
      </Router>
    </Provider>
  );
};

export default App;
