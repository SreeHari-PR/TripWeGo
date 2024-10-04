import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, googleLogin } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading, error, isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  const handleGoogleSuccess = (response) => {
    const googleToken = response.credential;
    dispatch(googleLogin(googleToken));
  };

  const handleGoogleFailure = (error) => {
    console.error('Google Sign-In failed', error);
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
                  value={email}
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

                {/* Google Login Button */}
                <div className="mb-6 text-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                  />
                </div>

                <div className="flex items-center justify-between pb-6">
                  <p className="mb-0 mr-2">
                    Don't have an account?{' '}
                    <a href="/register" className="text-blue-800 underline">
                      Register
                    </a>
                  </p>
                </div>

                {/* Display error if any */}
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
