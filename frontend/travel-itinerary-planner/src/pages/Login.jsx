import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, googleLogin } from '../redux/authSlice';  
import { useNavigate } from 'react-router-dom';
import {  GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
    navigate('/');
  };

  // Google login success handler
  const handleGoogleSuccess = (response) => {
    console.log('gdgfdd');
    
    const googleToken = response.credential;  
    dispatch(googleLogin(googleToken));
    navigate('/')
  };

  const handleGoogleFailure = (error) => {
    console.log('hjghjgghj');
    
    console.log('Google Sign-In failed', error);
  };

  return (
    
      <section
        className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(/src/assets/wave-haikei.svg)` }}
      >
        <div className="container h-full p-10">
          <div className="flex h-full items-center justify-center text-neutral-800">
            <div className="w-full max-w-md">
              <div
                className="bg-white bg-opacity-50 shadow-lg rounded-lg p-8"
                style={{ backdropFilter: 'blur(100px)' }}
              >
                <div className="text-center">
                  <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold">LOG IN</h4>
                </div>

                <form onSubmit={handleSubmit}>
                  <p className="mb-4">Please login to your account</p>

                  <h3>Email</h3>
                  <input
                    type="email"
                    className="mb-4 px-4 py-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <h3>Password</h3>
                  <input
                    type="password"
                    className="mb-4 px-4 py-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <div className="mb-12 pb-1 pt-1 text-center">
                    <button
                      type="submit"
                      className="mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out"
                      style={{ backgroundColor: '#0066FF' }}
                      disabled={loading}
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <a href="/forgotpassword">Forgot password?</a>
                  </div>

                  {/* Google Sign-In Button */}
                  <div className="mb-6 text-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleFailure}
                      useOneTap
                      render={({ onClick }) => (
                        <button
                          type="button"
                          onClick={onClick}
                          className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-100 transition duration-150 ease-in-out"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" x="5px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                          </svg>
                          <span className="ml-2 text-xl font-medium">Log in with Google</span>
                        </button>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between pb-6">
                    <p className="mb-0 mr-2">Don't have an account? <a href='/register'className='text-blue-800  underline' >Register</a></p>
                  </div>

                  {error && <p className="mt-4 text-center text-red-500">{error}</p>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default Login;
