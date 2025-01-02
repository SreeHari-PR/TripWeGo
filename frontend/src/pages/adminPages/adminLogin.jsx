import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaLock, FaHotel, FaSpinner } from 'react-icons/fa';
import {  toast } from 'react-hot-toast';
import { adminLogin } from '../../services/Admin/adminService';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

export default function AdminLogin() {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const data = await adminLogin(values.username, values.password);
      localStorage.setItem('token', data.token);
      toast.success('Login successful!');
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 2000);
    } catch (err) {
      toast.error(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#002233] p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <FaHotel className="text-6xl text-[#0066FF]" />
        </div>
        <h2 className="text-3xl font-bold text-center text-[#002233] mb-8">Admin Login</h2>
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-[#002233] mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-[#0066FF]" />
                  </div>
                  <Field
                    type="text"
                    name="username"
                    id="username"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF] sm:text-sm"
                    placeholder="Enter your username"
                  />
                </div>
                <ErrorMessage name="username" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#002233] mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-[#0066FF]" />
                  </div>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF] sm:text-sm"
                    placeholder="Enter your password"
                  />
                </div>
                <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0066FF] hover:bg-[#0055DD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066FF] transition duration-150 ease-in-out disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <FaSpinner className="animate-spin h-5 w-5 text-white" />
                  ) : (
                    'Log in'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
