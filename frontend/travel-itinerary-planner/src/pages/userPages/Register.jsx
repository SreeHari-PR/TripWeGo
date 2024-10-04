import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { register } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, status, email } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .min(3, 'Name must be at least 3 characters')
      .max(50, 'Name must be 50 characters or less')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid email format'
      )
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    agreeTerms: Yup.bool()
      .oneOf([true], 'You must accept the terms and conditions'),
  });
  

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(register({ name: values.name, email: values.email, password: values.password }));
    setSubmitting(false);
  };

  useEffect(() => {
    if (status === 'success' && email) {
      toast.success('an otp has sent to email')
      navigate('/verify-otp', { state: { email } });
    }
  }, [status, navigate, email]);

  return (
    <section
      className="min-h-screen  bg-cover bg-center flex items-center justify-center"
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
                <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold">REGISTER</h4>
              </div>

              <Formik
                initialValues={{
                  name: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-gray-700">Your Name</label>
                      <Field
                        type="text"
                        name="name"
                        className="mb-4 px-4 py-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="email" className="block text-gray-700">Your Email</label>
                      <Field
                        type="email"
                        name="email"
                        className="mb-4 px-4 py-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="password" className="block text-gray-700">Password</label>
                      <Field
                        type="password"
                        name="password"
                        className="mb-4 px-4 py-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
                      <Field
                        type="password"
                        name="confirmPassword"
                        className="mb-4 px-4 py-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="mb-12 text-center">
                      <button
                        type="submit"
                        className="mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out"
                        style={{ backgroundColor: '#0066FF' }}
                        disabled={isSubmitting || loading}
                      >
                        {loading ? 'Registering...' : 'Register'}
                      </button>
                    </div>

                    {error && <p className="mt-4 text-center text-red-500">{error}</p>}
                  </Form>
                )}
              </Formik>

              <div className="flex items-center justify-between pb-6">
                <p className="mb-0 mr-2">Already have an account?  <a href='/login'className='text-blue-800  underline' >Login</a> </p>
                
                
               
  
              </div>


            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Register;
