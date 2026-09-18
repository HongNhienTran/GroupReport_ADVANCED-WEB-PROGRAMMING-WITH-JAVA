package com.thesweetlabbe.modules.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantResponse {
    private UUID id;
    private String name;
    private String sku;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer stockQuantity;
    private String imageUrl;
    private Integer displayOrder;
    private boolean inStock;
}
