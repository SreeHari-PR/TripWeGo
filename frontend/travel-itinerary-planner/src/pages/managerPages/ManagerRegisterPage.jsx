import { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import uploadImageToCloudinary from '../../utils/cloudinary'; 
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
  const [managerData, setManagerData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [license, setLicense] = useState(null); 
  const [kyc, setKyc] = useState(null); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setManagerData({
      ...managerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLicenseChange = (e) => {
    setLicense(e.target.files[0]);
  };

  const handleKycChange = (e) => {
    setKyc(e.target.files[0]);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const licenseData = await uploadImageToCloudinary(license); // returns the URL
      const kycData = await uploadImageToCloudinary(kyc); // returns the URL
  
      const formData = {
        name: managerData.name,
        email: managerData.email,
        password: managerData.password,
        license: licenseData.url, // pass the URL from Cloudinary
        kyc: kycData.url // pass the URL from Cloudinary
      };
      console.log(formData,'kjkjhj');
      
  
      const response = await api.post('/manager/register', formData);
      toast.success(response.data.message);
      navigate('/manager/manager-otp', { state: { email: managerData.email } });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    }
  };
  

  return (
    <section
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(/src/assets/circle-scatter-haikei.svg)` }}
    >
      <div className="container h-full p-10">
        <div className="flex h-full items-center justify-center text-neutral-800">
          <div className="w-full max-w-2xl">
            <div
              className="bg-white bg-opacity-50 shadow-lg rounded-lg p-8"
              style={{ backdropFilter: 'blur(100px)' }}
            >
              <div className="text-center">
                <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold">REGISTER MANAGER</h4>
              </div>

              <form onSubmit={handleRegister}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={managerData.name}
                    onChange={handleChange}
                    required
                    className="mb-4 px-4 py-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={managerData.email}
                    onChange={handleChange}
                    required
                    className="mb-4 px-4 py-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={managerData.password}
                    onChange={handleChange}
                    required
                    className="mb-4 px-4 py-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="license" className="block text-gray-700">Upload License</label>
                  <input
                    type="file"
                    name="license"
                    onChange={handleLicenseChange}
                    required
                    className="mb-4 px-4 py-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="kyc" className="block text-gray-700">Upload KYC</label>
                  <input
                    type="file"
                    name="kyc"
                    onChange={handleKycChange}
                    required
                    className="mb-4 px-4 py-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-12 text-center">
                  <button
                    type="submit"
                    className="mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out"
                    style={{ backgroundColor: '#0066FF' }}
                  >
                    Register
                  </button>
                </div>
              </form>

              <div className="flex items-center justify-between pb-6">
                <p className="mb-0 mr-2">Already have an account?  <a href='/manager/login'className='text-blue-800  underline' >Login</a> </p>
                
                
               
  
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default RegisterPage;
