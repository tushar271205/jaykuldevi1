import api from './axios';

export const getDashboard = () => api.get('/admin/dashboard');

export const getRevenueReport = (year, month) =>
  api.get('/admin/reports/revenue', { params: { year, month } });

export const getAdminUsers = (params) => api.get('/admin/users', { params });
export const deleteAdminUser = (id) => api.delete(`/admin/users/${id}`);
export const updateAdminUserRole = (id, role) => api.put(`/admin/users/${id}/role`, { role });
