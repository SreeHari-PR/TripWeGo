// src/services/api.js
import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance
const api = axios.create({
  baseURL:  import.meta.env.VITE_API_URL,
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
api.interceptors.response.use(
  (response) => response,
  async (error) => {
      if (error.response.status === 401 && error.response.data.message === 'Access token expired, please refresh your token') {
          try {
              const refreshToken = localStorage.getItem('refreshToken');
              const { data } = await api.post('/users/refresh-token', { refreshToken });
              localStorage.setItem('token', data.token);

              error.config.headers['Authorization'] = `${data.token}`;
              return axios(error.config);
          } catch (refreshError) {
              console.error('Failed to refresh token', refreshError);
              // Handle token refresh failure (e.g., logout the user)
          }
      }
      return Promise.reject(error);
  }
);

export default api;
