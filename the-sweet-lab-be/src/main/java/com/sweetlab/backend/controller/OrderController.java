package com.sweetlab.backend.controller;

import com.sweetlab.backend.service.OrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * [PHÂN CÔNG: QUANG - Nhánh feat/quang-order-payment-shipment]
 * Nhiệm vụ: API đặt hàng và theo dõi đơn hàng cho khách hàng (/api/v1/orders).
 */
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Order", description = "Đặt hàng, xem lịch sử đơn và hủy đơn [Quang]")
public class OrderController {

    private final OrderService orderService;

    // TODO [Quang]: Thêm POST /checkout, GET /my-orders, GET /{id}, PUT /{id}/cancel
}
