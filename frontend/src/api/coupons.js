import api from './axios';

export const applyCoupon = (code, orderAmount) =>
  api.post('/coupons/validate', { code, orderAmount });

export const getCoupons = (params) => api.get('/coupons', { params });

export const createCoupon = (data) => api.post('/coupons', data);

export const updateCoupon = (id, data) => api.put(`/coupons/${id}`, data);

export const deleteCoupon = (id) => api.delete(`/coupons/${id}`);
