import api from './axios';

export const getDashboard = () => api.get('/admin/dashboard');

export const getRevenueReport = (year, month) =>
  api.get('/admin/reports/revenue', { params: { year, month } });

export const getAdminUsers = (params) => api.get('/admin/users', { params });
