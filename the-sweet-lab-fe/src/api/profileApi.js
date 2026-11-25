import axiosClient from './axiosClient';

export const profileApi = {
  getProfile: () => axiosClient.get('/profile'),
  updateProfile: (payload) => axiosClient.put('/profile', payload),
  updateNutrition: (payload) => axiosClient.put('/profile/nutrition', payload),
  addAddress: (payload) => axiosClient.post('/profile/addresses', payload),
  deleteAddress: (addressId) => axiosClient.delete(`/profile/addresses/${addressId}`),
  changePassword: (payload) => axiosClient.post('/auth/change-password', payload),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/media/upload', formData, {
      params: { folder: 'the-sweet-lab/avatars' },
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
