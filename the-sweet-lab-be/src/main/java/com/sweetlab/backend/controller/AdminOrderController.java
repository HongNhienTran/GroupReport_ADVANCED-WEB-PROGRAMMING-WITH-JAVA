package com.sweetlab.backend.controller;

import com.sweetlab.backend.service.OrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * [PHÂN CÔNG: QUANG - Nhánh feat/quang-order-payment-shipment]
 * Nhiệm vụ: API Admin duyệt đơn, cập nhật OrderStatus và ShipmentStatus (/api/v1/admin/orders).
 */
@RestController
@RequestMapping("/api/v1/admin/orders")
@RequiredArgsConstructor
@Tag(name = "Admin Order & Shipment", description = "Quản lý đơn hàng và vận chuyển [Quang]")
public class AdminOrderController {

    private final OrderService orderService;

    // TODO [Quang]: Thêm GET /, PUT /{id}/status, PUT /{id}/shipment
}
