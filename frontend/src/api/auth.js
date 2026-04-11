import api from './axios';

export const sendOTP = (email, purpose = 'register') =>
  api.post('/auth/send-otp', { email, purpose });

export const verifyOTP = (email, otp, purpose = 'register') =>
  api.post('/auth/verify-otp', { email, otp, purpose });

export const register = (data) => api.post('/auth/register', data);

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const logout = () => api.post('/auth/logout');

export const getMe = () => api.get('/auth/me');

export const refreshToken = (token) =>
  api.post('/auth/refresh-token', { refreshToken: token });

export const resetPassword = (data) => api.post('/auth/reset-password', data);
