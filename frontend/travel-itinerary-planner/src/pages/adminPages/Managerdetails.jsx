import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const ManagerDetails = () => {
  const { id } = useParams();
  const [manager, setManager] = useState(null);

  useEffect(() => {
    const fetchManagerDetails = async () => {
      try {
        const response = await api.get(`/admin/managers/${id}`);
        console.log('manger details',response)
        setManager(response.data);
      } catch (error) {
        console.error('Error fetching manager details:', error);
      }
    };
    fetchManagerDetails();
  }, [id]);

  if (!manager) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Manager Details</h1>
      <p><strong>Name:</strong> {manager.name}</p>
      <p><strong>Email:</strong> {manager.email}</p>
      <p><strong>Verified:</strong> {manager.verified ? 'Yes' : 'No'}</p>
      <p><strong>License:</strong>{manager.license}</p>
      <p><strong>KYC:</strong> {manager.kyc}</p>
      <button 
        className="mt-6 bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => api.post(`/admin/managers/${id}/approve`)}
      >
        Approve Manager
      </button>
    </div>
  );
};

export default ManagerDetails;
