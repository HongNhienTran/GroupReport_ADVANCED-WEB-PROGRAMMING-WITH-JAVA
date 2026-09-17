package com.thesweetlabbe.modules.product.dto;

import com.thesweetlabbe.modules.product.enums.DietaryTag;
import com.thesweetlabbe.modules.product.enums.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private UUID id;
    private String name;
    private String slug;
    private String sku;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer stockQuantity;
    private String description;
    private String thumbnailUrl;
    private UUID categoryId;
    private String categoryName;
    private String categorySlug;
    private String brand;
    private BrandResponse brandDetail;
    private String origin;
    private Integer cocoaPercentage;
    private Set<DietaryTag> dietaryTags;
    private boolean isFeatured;
    private boolean isFlashSale;
    private Double rating;
    private ProductStatus status;
    private ProductNutritionResponse nutrition;
    @Builder.Default
    private List<String> images = new ArrayList<>();
    @Builder.Default
    private List<ProductVariantResponse> variants = new ArrayList<>();
}
