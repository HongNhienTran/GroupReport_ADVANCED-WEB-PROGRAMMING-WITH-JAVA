import axiosClient from './axiosClient';

export const catalogApi = {
  getCategories: () => axiosClient.get('/categories'),
  getBrands: () => axiosClient.get('/brands'),
  getNutritionTags: () => axiosClient.get('/nutrition-tags'),
  getProducts: (params) => axiosClient.get('/products', { params }),
  getProductById: (id) => axiosClient.get(`/products/${id}`),
  getProductBySlug: (slug) => axiosClient.get(`/products/slug/${slug}`),
  getProductReviews: (productId) => axiosClient.get(`/products/${productId}/reviews`),
};
