package com.sweetlab.backend.service;

import com.sweetlab.backend.dto.response.PaymentResponse;
import com.sweetlab.backend.entity.Order;
import com.sweetlab.backend.entity.Payment;
import com.sweetlab.backend.enums.PaymentMethod;
import com.sweetlab.backend.enums.PaymentStatus;

import java.math.BigDecimal;

/**
 * [PHÂN CÔNG: QUANG - Nhánh feat/quang-order-payment-shipment]
 * Nhiệm vụ: Định nghĩa nghiệp vụ Thanh toán (COD / BANKING) & cập nhật PaymentStatus.
 */
public interface PaymentService {

    Payment createPayment(Order order, PaymentMethod method, BigDecimal amount);

    PaymentResponse confirmPayment(Long orderId, String transactionCode);

    PaymentResponse handlePaymentCallback(Long orderId, PaymentStatus status, String transactionCode);

    void syncPaymentOnOrderDelivered(Order order);

    void syncPaymentOnOrderCancelledOrReturned(Order order, boolean isCancelled);
}
