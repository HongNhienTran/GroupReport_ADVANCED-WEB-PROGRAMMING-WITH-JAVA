package com.sweetlab.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {

    private Long id;
    private Long productId;
    private String productSlug;
    private String thumbnailUrl;
    private Long variantId;
    private String sku;
    private String productName;
    private String variantName;
    private BigDecimal unitPrice;
    private int quantity;
    private BigDecimal lineTotal;
}
