package com.sweetlab.backend.service;

import com.sweetlab.backend.dto.request.CheckoutRequest;
import com.sweetlab.backend.dto.request.UpdateOrderStatusRequest;
import com.sweetlab.backend.dto.request.UpdatePaymentStatusRequest;
import com.sweetlab.backend.dto.request.UpdateShipmentRequest;
import com.sweetlab.backend.dto.response.OrderResponse;
import com.sweetlab.backend.dto.response.PageResponse;
import com.sweetlab.backend.enums.OrderStatus;

import java.util.List;

/**
 * [PHÂN CÔNG: QUANG - Nhánh feat/quang-order-payment-shipment]
 * Nhiệm vụ: Định nghĩa nghiệp vụ Đặt hàng (checkout, xem đơn của tôi, hủy đơn, cập nhật trạng thái & vận chuyển).
 */
public interface OrderService {

    OrderResponse checkout(Long accountId, CheckoutRequest request);

    List<OrderResponse> getMyOrders(Long accountId);

    OrderResponse getOrderDetail(Long accountId, Long orderId);

    OrderResponse cancelOrder(Long accountId, Long orderId);

    PageResponse<OrderResponse> getAllOrders(OrderStatus status, int page, int size);

    OrderResponse getOrderByIdForAdmin(Long orderId);

    OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request);

    OrderResponse updateShipment(Long orderId, UpdateShipmentRequest request);

    OrderResponse updatePaymentStatus(Long orderId, UpdatePaymentStatusRequest request);
}
