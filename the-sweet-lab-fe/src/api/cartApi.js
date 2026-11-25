import axiosClient from './axiosClient';
import { getGuestSessionId } from '../utils/guestSession';

export const cartApi = {
  getCart: () =>
    axiosClient.get('/cart', {
      params: { guestSessionId: getGuestSessionId() },
    }),

  addItem: ({ productId = null, variantId = null, quantity = 1 }) =>
    axiosClient.post('/cart/items', {
      guestSessionId: getGuestSessionId(),
      productId,
      variantId,
      quantity,
    }),

  updateItem: (variantId, quantity) =>
    axiosClient.put(`/cart/items/${variantId}`, {
      guestSessionId: getGuestSessionId(),
      quantity,
    }),

  removeItem: (variantId) =>
    axiosClient.delete(`/cart/items/${variantId}`, {
      params: { guestSessionId: getGuestSessionId() },
    }),

  clearCart: () =>
    axiosClient.delete('/cart', {
      params: { guestSessionId: getGuestSessionId() },
    }),

  mergeGuestCart: () =>
    axiosClient.post('/cart/merge', null, {
      params: { guestSessionId: getGuestSessionId() },
    }),
};
