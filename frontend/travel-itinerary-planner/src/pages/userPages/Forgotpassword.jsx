import React, { useState } from 'react';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import {
  sendResetPasswordEmail,
  verifyOtp,
  resetPassword,
} from '../../services/authService';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // Handle email submission
  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await sendResetPasswordEmail(email);
      toast.success(res.data.message);
      setStep(2); // Move to OTP step
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyOtp(email, otp);
      toast.success(res.data.message);
      setStep(3); // Move to password reset step
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to verify OTP');
    }
  };

  // Handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const res = await resetPassword(email, newPassword);
      toast.success(res.data.message);
      setStep(1); 
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {step === 1 && (
          <form onSubmit={handleSubmitEmail}>
            <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition"
            >
              Verify OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
