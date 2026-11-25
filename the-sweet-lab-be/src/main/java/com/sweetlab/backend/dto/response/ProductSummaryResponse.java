package com.sweetlab.backend.dto.response;

import com.sweetlab.backend.enums.Allergen;
import com.sweetlab.backend.enums.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummaryResponse {
    private Long id;
    private String name;
    private String slug;
    private String thumbnailUrl;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String categoryName;
    private String brandName;
    private ProductStatus status;
    private double averageRating;
    private int reviewCount;
    private Set<Allergen> allergens;
    private Set<String> nutritionTags;
}
