import api from '../api'; 

// Send email for password reset
export const sendResetPasswordEmail = async (email) => {
  return api.post('/users/forgot-password', { email });
};

// Verify OTP
export const verifyOtp = async (email, otp) => {
  return api.post('/users/verify-otp-password-reset', { email, otp });
};

// Reset Password
export const resetPassword = async (email, newPassword) => {
  return api.post('/users/reset-password', { email, newPassword });
};
