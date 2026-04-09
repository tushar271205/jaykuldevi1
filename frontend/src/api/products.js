import api from './axios';

export const getProducts = (params) => api.get('/products', { params });

export const getProduct = (id) => api.get(`/products/${id}`);

export const getSearchSuggestions = (q) =>
  api.get('/products/search-suggestions', { params: { q } });

// Admin
export const createProduct = (formData) =>
  api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const updateProduct = (id, data) => {
  const isFormData = data instanceof FormData;
  return api.put(`/products/${id}`, data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
};

export const setDiscount = (id, data) =>
  api.put(`/products/${id}/discount`, data);

export const deleteProduct = (id) => api.delete(`/products/${id}`);
