package com.sweetlab.backend.service;

import com.sweetlab.backend.dto.request.ProductRequest;
import com.sweetlab.backend.dto.response.NutritionTagResponse;
import com.sweetlab.backend.dto.response.PageResponse;
import com.sweetlab.backend.dto.response.ProductDetailResponse;
import com.sweetlab.backend.dto.response.ProductSummaryResponse;
import com.sweetlab.backend.enums.Allergen;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

public interface ProductService {

    PageResponse<ProductSummaryResponse> searchProducts(
            String keyword,
            Long categoryId,
            Long brandId,
            Set<Long> tagIds,
            Set<Allergen> excludeAllergens,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    );

    ProductDetailResponse getById(Long id);

    ProductDetailResponse getBySlug(String slug);

    List<NutritionTagResponse> getAllNutritionTags();

    ProductDetailResponse create(ProductRequest request);

    ProductDetailResponse update(Long id, ProductRequest request);

    void delete(Long id);
}
