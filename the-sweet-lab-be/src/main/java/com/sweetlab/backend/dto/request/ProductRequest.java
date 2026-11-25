package com.sweetlab.backend.dto.request;

import com.sweetlab.backend.enums.Allergen;
import com.sweetlab.backend.enums.ProductStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Getter
@Setter
public class ProductRequest {

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "Brand ID is required")
    private Long brandId;

    @NotBlank(message = "Product name is required")
    @Size(max = 200, message = "Product name must not exceed 200 characters")
    private String name;

    @NotBlank(message = "Product slug is required")
    @Size(max = 220, message = "Product slug must not exceed 220 characters")
    private String slug;

    private String description;
    private String ingredients;

    @Min(value = 1, message = "Shelf life days must be at least 1")
    private int shelfLifeDays;

    private String storageInstruction;

    @NotNull(message = "Product status is required")
    private ProductStatus status;

    private Set<Allergen> allergens;
    private Set<Long> nutritionTagIds;

    @Valid
    @NotEmpty(message = "At least one product variant is required")
    private List<VariantRequest> variants;

    @Valid
    private List<ImageRequest> images;

    @Valid
    private NutritionFactsRequest nutritionFacts;

    @Getter
    @Setter
    public static class VariantRequest {
        @NotBlank(message = "SKU is required")
        private String sku;

        @NotBlank(message = "Variant name is required")
        private String name;

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Price must be positive")
        private BigDecimal price;

        private BigDecimal originalPrice;

        @Min(value = 0, message = "Stock quantity cannot be negative")
        private int stockQuantity;

        @Positive(message = "Weight gram must be positive")
        private double weightGram;

        private boolean isActive = true;
    }

    @Getter
    @Setter
    public static class ImageRequest {
        @NotBlank(message = "Image URL is required")
        private String imageUrl;

        private int displayOrder;
        private boolean isThumbnail;
    }

    @Getter
    @Setter
    public static class NutritionFactsRequest {
        @Positive(message = "perAmountG must be positive")
        private double perAmountG = 100.0;

        private double calories;
        private double proteinG;
        private double carbG;
        private double sugarG;
        private double fiberG;
        private double fatG;
        private double sodiumMg;
    }
}
