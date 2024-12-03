import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { toast } from 'react-hot-toast';
import api from '../services/api';

// Thunk for login
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/users/login', credentials);
    console.log(response,'user')
    return response.data;
  } catch (error) {
    if (error.response) {
      return rejectWithValue(error.response.data.message);
    } else if (error.request) {
      return rejectWithValue('No response from server');
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// Thunk for registration
export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/users/register', userData);
    return { ...response.data, email: userData.email };
  } catch (error) {
    if (error.response) {
      return rejectWithValue(error.response.data.message);
    } else if (error.request) {
      return rejectWithValue('No response from server');
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// Thunk for email verification
export const verifyOtp = createAsyncThunk(
  'auth/verify-otp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/verify-otp', { email, otp });
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      } else if (error.request) {
        return rejectWithValue('No response from server');
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
)
export const resendOtp = createAsyncThunk(
  'auth/resend-otp',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/resend-otp', { email });
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      } else if (error.request) {
        return rejectWithValue('No response from server');
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
export const googleLogin = createAsyncThunk('auth/googleLogin', async (token, { rejectWithValue }) => {
  console.log('dfgdgfd');
  
  try {
    const response = await api.post('/auth/google-login', { token });
    console.log(response,'hgdfjkhkdj')
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Google login failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    loading: false,
    error: null,
    verificationStatus: null,
    verificationMessage: '',
    isLoggedIn: false,
    user: null
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      toast.success('Logout successful!');
      window.location.href = '/login';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isLoggedIn = true;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('refreshToken',action.payload.user.refreshToken)
        toast.success('Login successful!');
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        toast.error(action.payload || action.error.message || 'Login failed.');
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status='loading'
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload.email;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.status='success'
        localStorage.setItem('token', action.payload.token);
        toast.success('Registration successful! Please verify your email.');
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.status='reject'
        state.error = action.payload || action.error.message;
        toast.error(action.payload || action.error.message || 'Registration failed.');
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.verificationStatus = 'pending';
        state.verificationMessage = '';
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.verificationStatus = 'succeeded';
        state.verificationMessage = action.payload.message;
        toast.success('Otp verified successfully!');
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.verificationStatus = 'failed';
        state.verificationMessage = action.payload || action.error.message;
        toast.error(action.payload || action.error.message || 'Otp verification failed.');
      })
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpResent = false;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpResent = true;
        toast.success('A new OTP has been sent to your email.');
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        toast.error(action.payload || action.error.message || 'Failed to resend OTP.');
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        localStorage.setItem('token', action.payload.token);
        toast.success('Google login successful!');
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Google login failed');
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;