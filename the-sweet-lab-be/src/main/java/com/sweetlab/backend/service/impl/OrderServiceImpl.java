package com.sweetlab.backend.service.impl;

import com.sweetlab.backend.repository.*;
import com.sweetlab.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * [PHÂN CÔNG: QUANG - Nhánh feat/quang-order-payment-shipment]
 * Nhiệm vụ: Triển khai checkout, trừ tồn kho ProductVariant, áp Voucher, tạo Payment & Shipment, ghi tracking PURCHASE.
 */
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductVariantRepository variantRepository;
    private final VoucherRepository voucherRepository;
    private final PaymentRepository paymentRepository;
    private final ShipmentRepository shipmentRepository;
    private final UserBehaviorLogRepository behaviorLogRepository;

    // TODO [Quang]: Implement quy trình đặt hàng và quản lý đơn hàng
}
