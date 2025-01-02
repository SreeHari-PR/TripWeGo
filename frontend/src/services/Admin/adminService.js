// src/services/adminService.js

import api from '../api';


export const adminLogin = async (email, password) => {
  try {
    const response = await api.post('/admin/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};
export const getDashboardData = async () => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch dashboard data');
  }
};
