import axiosClient from './axiosClient';

export const orderApi = {
  /**
   * Đặt hàng từ giỏ hàng của người dùng hiện tại.
   * @param {{
   *   addressId?: number | null,
   *   shippingRecipientName?: string,
   *   shippingPhone?: string,
   *   shippingAddress?: string,
   *   paymentMethod: 'COD' | 'BANKING',
   *   voucherCode?: string,
   *   note?: string
   * }} payload
   */
  checkout: (payload) => axiosClient.post('/orders/checkout', payload),

  /**
   * Lấy danh sách toàn bộ đơn hàng của người dùng đang đăng nhập (mới nhất trước).
   */
  getMyOrders: () => axiosClient.get('/orders/my-orders'),

  /**
   * Xem chi tiết một đơn hàng theo ID.
   * @param {number | string} orderId
   */
  getOrderDetail: (orderId) => axiosClient.get(`/orders/${orderId}`),

  /**
   * Hủy đơn hàng đang ở trạng thái PENDING.
   * @param {number | string} orderId
   */
  cancelOrder: (orderId) => axiosClient.put(`/orders/${orderId}/cancel`),

  /**
   * Kiểm tra trước mã giảm giá (API do Quân phụ trách: POST /vouchers/validate).
   * Nếu endpoint chưa được merge hoặc lỗi mạng, CheckoutPage vẫn cho phép gửi mã kèm checkout.
   * @param {{ code: string, orderAmount: number }} payload
   */
  validateVoucher: (payload) => axiosClient.post('/vouchers/validate', payload),
};
