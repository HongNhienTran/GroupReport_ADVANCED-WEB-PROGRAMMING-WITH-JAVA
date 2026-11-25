import axiosClient from './axiosClient';

export const adminApi = {
  // Public Read
  getCategories: () => axiosClient.get('/categories'),
  getBrands: () => axiosClient.get('/brands'),
  getNutritionTags: () => axiosClient.get('/nutrition-tags'),
  getProducts: (params) => axiosClient.get('/products', { params }),
  getProductById: (id) => axiosClient.get(`/products/${id}`),

  // Admin Categories
  createCategory: (payload) => axiosClient.post('/admin/categories', payload),
  updateCategory: (id, payload) => axiosClient.put(`/admin/categories/${id}`, payload),
  deleteCategory: (id) => axiosClient.delete(`/admin/categories/${id}`),

  // Admin Brands
  createBrand: (payload) => axiosClient.post('/admin/brands', payload),
  updateBrand: (id, payload) => axiosClient.put(`/admin/brands/${id}`, payload),
  deleteBrand: (id) => axiosClient.delete(`/admin/brands/${id}`),

  // Admin Products
  createProduct: (payload) => axiosClient.post('/admin/products', payload),
  updateProduct: (id, payload) => axiosClient.put(`/admin/products/${id}`, payload),
  deleteProduct: (id) => axiosClient.delete(`/admin/products/${id}`),

  // Cloudinary Media Upload
  uploadImage: (file, folder = 'the-sweet-lab/products') => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/media/upload', formData, {
      params: { folder },
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
