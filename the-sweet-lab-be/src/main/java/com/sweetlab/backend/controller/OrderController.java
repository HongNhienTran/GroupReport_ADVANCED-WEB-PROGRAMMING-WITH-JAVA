package com.sweetlab.backend.controller;

import com.sweetlab.backend.dto.request.CheckoutRequest;
import com.sweetlab.backend.dto.response.ApiResponse;
import com.sweetlab.backend.dto.response.OrderResponse;
import com.sweetlab.backend.security.CustomUserDetails;
import com.sweetlab.backend.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping("/checkout")
    @Operation(summary = "Đặt hàng từ giỏ hàng của người dùng hiện tại")
    public ResponseEntity<ApiResponse<OrderResponse>> checkout(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CheckoutRequest request
    ) {
        Long accountId = userDetails != null ? userDetails.getAccountId() : null;
        OrderResponse response = orderService.checkout(accountId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, "Đặt hàng thành công"));
    }

    @GetMapping("/my-orders")
    @Operation(summary = "Lấy danh sách đơn hàng của người dùng hiện tại")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long accountId = userDetails != null ? userDetails.getAccountId() : null;
        return ResponseEntity.ok(ApiResponse.ok(
                orderService.getMyOrders(accountId),
                "Lấy danh sách đơn hàng thành công"
        ));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết một đơn hàng của người dùng hiện tại")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderDetail(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id
    ) {
        Long accountId = userDetails != null ? userDetails.getAccountId() : null;
        return ResponseEntity.ok(ApiResponse.ok(
                orderService.getOrderDetail(accountId, id),
                "Lấy chi tiết đơn hàng thành công"
        ));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Hủy đơn hàng đang ở trạng thái chờ xác nhận (PENDING)")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id
    ) {
        Long accountId = userDetails != null ? userDetails.getAccountId() : null;
        return ResponseEntity.ok(ApiResponse.ok(
                orderService.cancelOrder(accountId, id),
                "Hủy đơn hàng thành công"
        ));
    }
}
