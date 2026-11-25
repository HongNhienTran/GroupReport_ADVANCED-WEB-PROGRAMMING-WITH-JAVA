import axiosClient from './axiosClient';

export const authApi = {
  login: (payload) => axiosClient.post('/auth/login', payload),
  logout: (refreshToken) => axiosClient.post('/auth/logout', { refreshToken }),
};
