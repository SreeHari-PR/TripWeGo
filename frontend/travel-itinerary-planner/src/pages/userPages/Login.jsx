import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, googleLogin } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Loader } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(/src/assets/wave-haikei.svg)` }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container h-full p-10"
      >
        <div className="flex h-full items-center justify-center text-neutral-800">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white bg-opacity-50 shadow-lg rounded-lg p-8"
              style={{ backdropFilter: 'blur(100px)' }}
            >
              <div className="text-center">
                <motion.h4
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-12 mt-1 pb-1 text-xl font-semibold"
                >
                  LOG IN
                </motion.h4>
              </div>

              <form onSubmit={handleSubmit}>
                <p className="mb-4">Please login to your account</p>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      className="pl-10 pr-4 py-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder='Enter Your Email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className="pl-10 pr-10 py-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder='Enter Your Password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="mb-12 pb-1 pt-1 text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="mb-3 inline-block w-full rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out"
                    style={{ backgroundColor: '#0066FF' }}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                        Logging in...
                      </span>
                    ) : (
                      'Login'
                    )}
                  </motion.button>

                  <motion.a
                    href="/forgotpassword"
                    whileHover={{ scale: 1.05 }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </motion.a>
                </div>

                <div className="mb-6 text-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                    render={(renderProps) => (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                        className="w-full bg-white text-gray-700 font-bold py-2 px-4 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Sign in with Google
                      </motion.button>
                    )}
                  />
                </div>

                <div className="flex items-center justify-between pb-6">
                  <p className="mb-0 mr-2">
                    Don't have an account?{' '}
                    <motion.a
                      href="/register"
                      className="text-blue-800 underline"
                      whileHover={{ scale: 1.05 }}
                    >
                      Register
                    </motion.a>
                  </p>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 text-center text-red-500"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Login;