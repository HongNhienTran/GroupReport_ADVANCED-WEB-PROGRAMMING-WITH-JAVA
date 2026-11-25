package com.sweetlab.backend.dto.response;

import com.sweetlab.backend.enums.Allergen;
import com.sweetlab.backend.enums.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String ingredients;
    private int shelfLifeDays;
    private String storageInstruction;
    private ProductStatus status;
    private double averageRating;
    private int reviewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private CategoryResponse category;
    private BrandResponse brand;
    private Set<Allergen> allergens;
    private Set<NutritionTagResponse> nutritionTags;
    private List<VariantResponse> variants;
    private List<ImageResponse> images;
    private NutritionFactsResponse nutritionFacts;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VariantResponse {
        private Long id;
        private String sku;
        private String name;
        private BigDecimal price;
        private BigDecimal originalPrice;
        private int stockQuantity;
        private double weightGram;
        private boolean isActive;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageResponse {
        private Long id;
        private String imageUrl;
        private int displayOrder;
        private boolean isThumbnail;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NutritionFactsResponse {
        private double perAmountG;
        private double calories;
        private double proteinG;
        private double carbG;
        private double sugarG;
        private double fiberG;
        private double fatG;
        private double sodiumMg;
    }
}
