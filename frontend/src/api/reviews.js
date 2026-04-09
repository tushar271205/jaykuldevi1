import api from './axios';

export const addReview = (productId, formData) =>
  api.post(`/reviews/${productId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getProductReviews = (productId, params) =>
  api.get(`/reviews/${productId}`, { params });
