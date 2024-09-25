// src/services/authService.js
import axios from 'axios';
import api from './api';

const login = async (email, password) => {
  const response = await axios.post('/users/login', { email, password });
  return response.data;
};

const register = async (userData) => {
  try {
    const response = await axios.post('/users/register', userData);
    return response.data;

  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};
const getProfile = async (token) => {
  const response = await api.get('/users/profile', {
    headers: { Authorization: token },
  });
  return response.data;
};

export default{ login, register, getProfile };
