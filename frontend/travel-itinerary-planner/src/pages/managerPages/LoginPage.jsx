import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/manager/login', { email, password });
      console.log('response', response.data)
      console.log(response.data.data.manager, 'respomse login')
      console.log(response.data.data.token,'token');
      
      localStorage.setItem('authToken', response.data.data.token);
      localStorage.setItem('managerData', JSON.stringify(response.data.data.manager))
      navigate('/manager/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(/src/assets/blob-scene-haikei.svg)` }}
    >
      <div className="container h-full p-10">
        <div className="flex h-full items-center justify-center text-neutral-800">
          <div className="w-full max-w-md">
            <div
              className="bg-white bg-opacity-50 shadow-lg rounded-lg p-8"
              style={{ backdropFilter: 'blur(100px)' }}
            >
              <div className="text-center">
                <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold">Manager Login</h4>
              </div>

              <form onSubmit={handleLogin}>
                <p className="mb-4">Please login to your account</p>

                <h3>Email</h3>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-4 px-4 py-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <h3>Password</h3>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mb-4 px-4 py-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                  <a href="#!" className="text-blue-600 hover:underline">Forgot password?</a>
                </div>
                <div className="flex items-center justify-between pb-6">
                    <p className="mb-0 mr-2">Don't have an account? <a href='/manager/register'className='text-blue-800  underline' >Register</a></p>
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

export default LoginPage;
