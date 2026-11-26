import axiosClient from './axiosClient';

/**
 * [PHÂN CÔNG: QUANG - Nhánh feat/quang-order-payment-shipment]
 * Client API riêng cho quản lý Đơn hàng, Thanh toán và Vận chuyển tại Admin Portal.
 * Tách riêng khỏi adminApi.js để tránh xung đột Git khi làm việc nhóm.
 */
export const orderAdminApi = {
  /**
   * Lấy danh sách tất cả đơn hàng (hỗ trợ phân trang & lọc theo trạng thái).
   * @param {{ status?: string, keyword?: string, page?: number, size?: number }} params
   */
  getOrders: (params = {}) => axiosClient.get('/admin/orders', { params }),

  /**
   * Xem chi tiết một đơn hàng theo ID.
   * @param {number | string} id
   */
  getOrderById: (id) => axiosClient.get(`/admin/orders/${id}`),

  /**
   * Cập nhật trạng thái đơn hàng (OrderStatus).
   * @param {number | string} id
   * @param {{ status: string, note?: string }} payload
   */
  updateOrderStatus: (id, payload) => axiosClient.put(`/admin/orders/${id}/status`, payload),

  /**
   * Cập nhật thông tin vận đơn và trạng thái giao hàng (ShipmentStatus).
   * @param {number | string} id
   * @param {{ carrier?: string, trackingCode?: string, status: string, estimatedDeliveryAt?: string | null }} payload
   */
  updateShipment: (id, payload) => axiosClient.put(`/admin/orders/${id}/shipment`, payload),

  /**
   * Cập nhật trạng thái thanh toán của đơn hàng (PaymentStatus).
   * @param {number | string} id
   * @param {{ status: string, transactionCode?: string }} payload
   */
  updatePaymentStatus: (id, payload) => axiosClient.put(`/admin/orders/${id}/payment`, payload),
};
