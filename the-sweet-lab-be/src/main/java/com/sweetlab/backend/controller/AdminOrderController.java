package com.sweetlab.backend.controller;

import com.sweetlab.backend.dto.request.UpdateOrderStatusRequest;
import com.sweetlab.backend.dto.request.UpdatePaymentStatusRequest;
import com.sweetlab.backend.dto.request.UpdateShipmentRequest;
import com.sweetlab.backend.dto.response.ApiResponse;
import com.sweetlab.backend.dto.response.OrderResponse;
import com.sweetlab.backend.dto.response.PageResponse;
import com.sweetlab.backend.enums.OrderStatus;
import com.sweetlab.backend.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * [PHÂN CÔNG: QUANG - Nhánh feat/quang-order-payment-shipment]
 * Nhiệm vụ: API Admin duyệt đơn, cập nhật OrderStatus, ShipmentStatus và PaymentStatus (/api/v1/admin/orders).
 */
@RestController
@RequestMapping("/api/v1/admin/orders")
@RequiredArgsConstructor
@Tag(name = "Admin Order & Shipment", description = "Quản lý đơn hàng, thanh toán và vận chuyển [Quang]")
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả đơn hàng (có phân trang và lọc theo trạng thái)")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                orderService.getAllOrders(status, page, size),
                "Lấy danh sách đơn hàng thành công"
        ));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết đơn hàng dành cho Admin")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(
                orderService.getOrderByIdForAdmin(id),
                "Lấy chi tiết đơn hàng thành công"
        ));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Cập nhật trạng thái đơn hàng (OrderStatus)")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                orderService.updateOrderStatus(id, request),
                "Cập nhật trạng thái đơn hàng thành công"
        ));
    }

    @PutMapping("/{id}/shipment")
    @Operation(summary = "Cập nhật thông tin vận đơn và trạng thái giao hàng (ShipmentStatus)")
    public ResponseEntity<ApiResponse<OrderResponse>> updateShipment(
            @PathVariable Long id,
            @Valid @RequestBody UpdateShipmentRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                orderService.updateShipment(id, request),
                "Cập nhật thông tin vận chuyển thành công"
        ));
    }

    @PutMapping("/{id}/payment")
    @Operation(summary = "Cập nhật trạng thái thanh toán của đơn hàng (PaymentStatus)")
    public ResponseEntity<ApiResponse<OrderResponse>> updatePaymentStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePaymentStatusRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                orderService.updatePaymentStatus(id, request),
                "Cập nhật trạng thái thanh toán thành công"
        ));
    }
}
