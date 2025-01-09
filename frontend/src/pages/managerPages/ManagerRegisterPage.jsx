import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import uploadImageToCloudinary from '../../utils/cloudinary'; 

const RegisterPage = () => {
  const [license, setLicense] = useState(null);
  const [kyc, setKyc] = useState(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      license: Yup.mixed()
        .required('License is required')
        .test('fileType', 'Only image files are allowed (jpg, jpeg, png)', value => {
          return value && ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type);
        }),
      kyc: Yup.mixed()
        .required('KYC is required')
        .test('fileType', 'Only image files are allowed (jpg, jpeg, png)', value => {
          return value && ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type);
        }),
    }),
    onSubmit: async (values) => {
      try {
        const licenseData = await uploadImageToCloudinary(license);
        const kycData = await uploadImageToCloudinary(kyc);

        const formData = {
          name: values.name,
          email: values.email,
          password: values.password,
          license: licenseData.url,
          kyc: kycData.url
        };

        const response = await api.post('/manager/register', formData);
        toast.success(response.data.message);
        navigate('/manager/manager-otp', { state: { email: values.email } });
      } catch (error) {
        toast.error(error.response?.data?.error || 'Registration failed');
        console.log(error);
        
      }
    }
  });

  const handleLicenseChange = (e) => {
    const file = e.target.files[0];
    setLicense(file);
    formik.setFieldValue('license', file);
  };

  const handleKycChange = (e) => {
    const file = e.target.files[0];
    setKyc(file);
    formik.setFieldValue('kyc', file);
  };

  return (
    <section
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(/circle-scatter-haikei.svg)` }}
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

              <form onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`mb-4 px-4 py-2 block w-full border rounded-md ${formik.touched.name && formik.errors.name ? 'border-red-500' : ''}`}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="text-red-500 text-sm">{formik.errors.name}</div>
                  ) : null}
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`mb-4 px-4 py-2 block w-full border rounded-md ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500 text-sm">{formik.errors.email}</div>
                  ) : null}
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`mb-4 px-4 py-2 block w-full border rounded-md ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-500 text-sm">{formik.errors.password}</div>
                  ) : null}
                </div>

                <div className="mb-4">
                  <label htmlFor="license" className="block text-gray-700">Upload License</label>
                  <input
                    type="file"
                    name="license"
                    onChange={handleLicenseChange}
                    className={`mb-4 px-4 py-2 block w-full border rounded-md ${formik.touched.license && formik.errors.license ? 'border-red-500' : ''}`}
                  />
                  {formik.touched.license && formik.errors.license ? (
                    <div className="text-red-500 text-sm">{formik.errors.license}</div>
                  ) : null}
                </div>

                <div className="mb-4">
                  <label htmlFor="kyc" className="block text-gray-700">Upload KYC</label>
                  <input
                    type="file"
                    name="kyc"
                    onChange={handleKycChange}
                    className={`mb-4 px-4 py-2 block w-full border rounded-md ${formik.touched.kyc && formik.errors.kyc ? 'border-red-500' : ''}`}
                  />
                  {formik.touched.kyc && formik.errors.kyc ? (
                    <div className="text-red-500 text-sm">{formik.errors.kyc}</div>
                  ) : null}
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
    </section>
  );
};

export default RegisterPage;
