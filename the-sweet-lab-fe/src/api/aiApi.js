import axiosClient from './axiosClient';
import { getGuestSessionId } from '../utils/guestSession';

export const aiApi = {
  trackEvent: ({ productId = null, actionType, keyword = null }) =>
    axiosClient
      .post('/tracking/events', {
        guestSessionId: getGuestSessionId(),
        productId,
        actionType,
        keyword,
      })
      .catch(() => {
        // Tracking errors should never disrupt user navigation
      }),

  getRecommendations: ({ categoryId = null, limit = 8 } = {}) =>
    axiosClient.get('/recommendations', {
      params: {
        guestSessionId: getGuestSessionId(),
        ...(categoryId ? { categoryId } : {}),
        limit,
      },
    }),

  sendChat: ({ sessionId = null, message }) =>
    axiosClient.post('/ai/chat', {
      sessionId,
      guestSessionId: getGuestSessionId(),
      message,
    }),
};
