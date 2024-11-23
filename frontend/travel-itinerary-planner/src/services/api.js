// src/services/api.js
import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `${token}`; 
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
  
      toast.error(`Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`);
    } else {
    
      toast.error('Error: Network Error');
    }
    return Promise.reject(error);
  }
);

export default api;
