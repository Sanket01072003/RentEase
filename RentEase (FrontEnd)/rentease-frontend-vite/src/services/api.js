import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { getToken, clearAuth } from '../utils/auth';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── AUTH
export const loginApi          = data => api.post('/auth/login', data);
export const forgotPasswordApi = data => api.post('/auth/forgot-password', data);
export const resetPasswordApi  = data => api.post('/auth/reset-password', data);

// ── OWNER
export const registerOwnerApi  = data      => api.post('/owners/register', data);
export const getOwnerApi       = id        => api.get(`/owners/${id}`);
export const updateOwnerApi    = (id, data)=> api.put(`/owners/${id}`, data);
export const deleteOwnerApi    = id        => api.delete(`/owners/${id}`);

// ── RENTER
export const registerRenterApi = data      => api.post('/renters/register', data);
export const getRenterApi      = id        => api.get(`/renters/${id}`);
export const updateRenterApi   = (id, data)=> api.put(`/renters/${id}`, data);
export const deleteRenterApi   = id        => api.delete(`/renters/${id}`);

// ── CATEGORY
export const getAllCategoriesApi  = ()   => api.get('/categories/all');
export const getCategoryApi       = id  => api.get(`/categories/${id}`);
export const addCategoryApi       = data=> api.post('/categories/add', data);
export const deleteCategoryApi    = id  => api.delete(`/categories/${id}`);

// ── PRODUCT
export const getAllProductsApi        = ()  => api.get('/products/all');
export const getAvailableProductsApi  = ()  => api.get('/products/available');
export const getProductApi            = id  => api.get(`/products/${id}`);
export const getProductsByCategoryApi = id  => api.get(`/products/category/${id}`);
export const getProductsByOwnerApi    = id  => api.get(`/products/owner/${id}`);
export const addProductApi            = data=> api.post('/products/add', data);
export const updateProductApi    = (id, data)=> api.put(`/products/${id}`, data);
export const deleteProductApi         = id  => api.delete(`/products/${id}`);

// ── RENTAL
export const createRentalApi       = data=> api.post('/rentals/create', data);
export const getRentalApi          = id  => api.get(`/rentals/${id}`);
export const getRentalsByRenterApi = id  => api.get(`/rentals/renter/${id}`);
export const getRentalsByProductApi= id  => api.get(`/rentals/product/${id}`);
export const confirmReturnApi      = id  => api.put(`/rentals/${id}/return`);
export const cancelRentalApi       = id  => api.put(`/rentals/${id}/cancel`);

// ── PAYMENT
export const createOrderApi   = rentalId => api.get(`/payments/create-order/${rentalId}`);
export const verifyPaymentApi = data     => api.post('/payments/verify', data);
export const getPaymentApi    = id       => api.get(`/payments/${id}`);

// ── REVIEW
export const addReviewApi            = data=> api.post('/reviews/add', data);
export const getReviewsByProductApi  = id  => api.get(`/reviews/product/${id}`);
export const getReviewsByRenterApi   = id  => api.get(`/reviews/renter/${id}`);

export default api;
