// src/services/api.js
import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});
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
