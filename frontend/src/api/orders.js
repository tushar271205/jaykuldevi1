import api from './axios';

export const createRazorpayOrder = (payload) =>
  api.post('/orders/create-razorpay-order', payload);

export const verifyPayment = (payload) =>
  api.post('/orders/verify-payment', payload);

export const placeCODOrder = (payload) =>
  api.post('/orders/cod', payload);

export const getMyOrders = (params) =>
  api.get('/orders/my-orders', { params });

export const getOrderById = (id) => api.get(`/orders/${id}`);

export const downloadBill = (id) =>
  api.get(`/orders/${id}/bill`, { responseType: 'blob' });

export const cancelOrder = (id, data) => api.put(`/orders/${id}/cancel`, data);

export const requestReplacement = (id, data) => api.put(`/orders/${id}/request-replacement`, data);

export const approveRefund = (id) => api.put(`/orders/${id}/approve-refund`);


// Admin
export const getAllOrders = (params) => api.get('/orders', { params });

export const updateOrderStatus = (id, data) =>
  api.put(`/orders/${id}/status`, data);
