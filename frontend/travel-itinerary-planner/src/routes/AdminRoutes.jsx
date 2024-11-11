import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import AdminLogin from '../pages/adminPages/adminLogin';
import AdminDashboard from '../pages/adminPages/adminDashboard';
import CategoriesAdmin from '../pages/adminPages/Categories';
import UserList from '../pages/adminPages/userList';
import AdminManagerList from '../pages/adminPages/ManagerList';
import Services from '../pages/adminPages/Services';
import ManagerDetails from '../pages/adminPages/Managerdetails';
import AdminWallet from '../pages/adminPages/AdminWallet';
import AdminHotelList from '../pages/adminPages/AdminHotelList';
import AdminBookingList from '../pages/adminPages/AdminBookingList';

const AdminRoutes = () => (
  <Routes>
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin/dashboard" element={<PrivateRoute element={<AdminDashboard />} />} />
    <Route path="/admin/categories" element={<PrivateRoute element={<CategoriesAdmin />} />} />
    <Route path="/admin/services" element={<PrivateRoute element={<Services />} />} />
    <Route path="/admin/users" element={<PrivateRoute element={<UserList />} />} />
    <Route path="/admin/managers" element={<PrivateRoute element={<AdminManagerList />} />} />
    <Route path="/admin/managers/:id" element={<PrivateRoute element={<ManagerDetails />} />} />
    <Route path="/admin/wallet" element={<PrivateRoute element={<AdminWallet />} />} />
    <Route path="/admin/hotels" element={<PrivateRoute element={<AdminHotelList />} />} />
    <Route path="/admin/bookings" element={<PrivateRoute element={<AdminBookingList />} />} />
  </Routes>
);

export default AdminRoutes;
