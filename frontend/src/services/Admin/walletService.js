import api from '../api';

export const fetchAdminWallet = async () => {
  try {
    const response = await api.get('/admin/wallet-transactions');
    return response.data.data; // Return only the necessary data
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch wallet data';
  }
};
