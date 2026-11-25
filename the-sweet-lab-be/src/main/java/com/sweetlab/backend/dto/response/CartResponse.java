package com.sweetlab.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {

    private Long cartId;
    private int totalQuantity;
    private BigDecimal subtotal;
    private List<CartItemResponse> items;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemResponse {
        private Long productId;
        private String productSlug;
        private String productName;
        private String categoryName;
        private Long variantId;
        private String variantName;
        private String sku;
        private double weightGram;
        private String thumbnailUrl;
        private BigDecimal unitPrice;
        private int quantity;
        private BigDecimal lineTotal;
        private int stockQuantity;
    }
}
