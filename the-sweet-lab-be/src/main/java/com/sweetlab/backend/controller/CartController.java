package com.sweetlab.backend.controller;

import com.sweetlab.backend.dto.request.CartItemRequest;
import com.sweetlab.backend.dto.request.UpdateCartItemRequest;
import com.sweetlab.backend.dto.response.ApiResponse;
import com.sweetlab.backend.dto.response.CartResponse;
import com.sweetlab.backend.security.CustomUserDetails;
import com.sweetlab.backend.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@Tag(name = "Shopping Cart", description = "Quản lý giỏ hàng cho cả khách vãng lai và thành viên")
public class CartController {

    private final CartService cartService;

    @GetMapping
    @Operation(summary = "Lấy giỏ hàng hiện tại (user hoặc khách vãng lai)")
    public ResponseEntity<ApiResponse<CartResponse>> getCart(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) String guestSessionId
    ) {
        Long accountId = userDetails != null ? userDetails.getAccountId() : null;
        return ResponseEntity.ok(ApiResponse.ok(cartService.getCart(accountId, guestSessionId), "Cart fetched"));
    }

    @PostMapping("/items")
    @Operation(summary = "Thêm sản phẩm/biến thể vào giỏ hàng")
    public ResponseEntity<ApiResponse<CartResponse>> addItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CartItemRequest request
    ) {
        Long accountId = userDetails != null ? userDetails.getAccountId() : null;
        return ResponseEntity.ok(ApiResponse.ok(cartService.addItem(accountId, request), "Added to cart"));
    }

    @PutMapping("/items/{variantId}")
    @Operation(summary = "Cập nhật số lượng sản phẩm trong giỏ hàng")
    public ResponseEntity<ApiResponse<CartResponse>> updateItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long variantId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        Long accountId = userDetails != null ? userDetails.getAccountId() : null;
        return ResponseEntity.ok(ApiResponse.ok(cartService.updateItemQuantity(accountId, variantId, request), "Cart updated"));
    }

    @DeleteMapping("/items/{variantId}")
    @Operation(summary = "Xóa sản phẩm khỏi giỏ hàng")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long variantId,
            @RequestParam(required = false) String guestSessionId
    ) {
        Long accountId = userDetails != null ? userDetails.getAccountId() : null;
        return ResponseEntity.ok(ApiResponse.ok(cartService.removeItem(accountId, variantId, guestSessionId), "Item removed"));
    }

    @DeleteMapping
    @Operation(summary = "Xóa toàn bộ giỏ hàng")
    public ResponseEntity<ApiResponse<CartResponse>> clearCart(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) String guestSessionId
    ) {
        Long accountId = userDetails != null ? userDetails.getAccountId() : null;
        return ResponseEntity.ok(ApiResponse.ok(cartService.clearCart(accountId, guestSessionId), "Cart cleared"));
    }

    @PostMapping("/merge")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Gộp giỏ hàng khách vãng lai vào tài khoản sau khi đăng nhập")
    public ResponseEntity<ApiResponse<CartResponse>> mergeCart(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam String guestSessionId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                cartService.mergeGuestCart(userDetails.getAccountId(), guestSessionId),
                "Guest cart merged"
        ));
    }
}
