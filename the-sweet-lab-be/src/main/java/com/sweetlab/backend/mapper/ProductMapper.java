package com.sweetlab.backend.mapper;

import com.sweetlab.backend.dto.response.NutritionTagResponse;
import com.sweetlab.backend.dto.response.ProductDetailResponse;
import com.sweetlab.backend.dto.response.ProductSummaryResponse;
import com.sweetlab.backend.entity.*;
import com.sweetlab.backend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductMapper {

    private final CategoryMapper categoryMapper;
    private final BrandMapper brandMapper;
    private final ReviewRepository reviewRepository;

    public ProductSummaryResponse toSummary(Product product) {
        String thumbnail = product.getImages().stream()
                .filter(ProductImage::isThumbnail)
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElseGet(() -> product.getImages().stream()
                        .min(Comparator.comparingInt(ProductImage::getDisplayOrder))
                        .map(ProductImage::getImageUrl)
                        .orElse(null));

        List<BigDecimal> prices = product.getVariants().stream()
                .filter(ProductVariant::isActive)
                .map(ProductVariant::getPrice)
                .sorted()
                .toList();

        BigDecimal minPrice = prices.isEmpty() ? null : prices.get(0);
        BigDecimal maxPrice = prices.isEmpty() ? null : prices.get(prices.size() - 1);

        Set<String> tagNames = product.getNutritionTags().stream()
                .map(NutritionTag::getName)
                .collect(Collectors.toSet());

        int reviewCount = (int) reviewRepository.countByProductId(product.getId());
        double avgRating = reviewCount > 0
                ? Math.round(reviewRepository.findAverageRatingByProductId(product.getId()) * 10.0) / 10.0
                : 0.0;

        return ProductSummaryResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .thumbnailUrl(thumbnail)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .categoryName(product.getCategory().getName())
                .brandName(product.getBrand().getName())
                .status(product.getStatus())
                .averageRating(avgRating)
                .reviewCount(reviewCount)
                .allergens(new HashSet<>(product.getAllergens()))
                .nutritionTags(tagNames)
                .build();
    }

    public ProductDetailResponse toDetail(Product product) {
        int reviewCount = (int) reviewRepository.countByProductId(product.getId());
        double avgRating = reviewCount > 0
                ? Math.round(reviewRepository.findAverageRatingByProductId(product.getId()) * 10.0) / 10.0
                : 0.0;

        return ProductDetailResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .ingredients(product.getIngredients())
                .shelfLifeDays(product.getShelfLifeDays())
                .storageInstruction(product.getStorageInstruction())
                .status(product.getStatus())
                .averageRating(avgRating)
                .reviewCount(reviewCount)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .category(categoryMapper.toResponse(product.getCategory()))
                .brand(brandMapper.toResponse(product.getBrand()))
                .allergens(new HashSet<>(product.getAllergens()))
                .nutritionTags(product.getNutritionTags().stream()
                        .map(this::toTagResponse)
                        .collect(Collectors.toSet()))
                .variants(product.getVariants().stream()
                        .map(this::toVariantResponse)
                        .toList())
                .images(product.getImages().stream()
                        .sorted(Comparator.comparingInt(ProductImage::getDisplayOrder))
                        .map(this::toImageResponse)
                        .toList())
                .nutritionFacts(toNutritionFactsResponse(product.getNutritionFacts()))
                .build();
    }

    public NutritionTagResponse toTagResponse(NutritionTag tag) {
        return NutritionTagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .description(tag.getDescription())
                .build();
    }

    private ProductDetailResponse.VariantResponse toVariantResponse(ProductVariant variant) {
        return ProductDetailResponse.VariantResponse.builder()
                .id(variant.getId())
                .sku(variant.getSku())
                .name(variant.getName())
                .price(variant.getPrice())
                .originalPrice(variant.getOriginalPrice())
                .stockQuantity(variant.getStockQuantity())
                .weightGram(variant.getWeightGram())
                .isActive(variant.isActive())
                .build();
    }

    private ProductDetailResponse.ImageResponse toImageResponse(ProductImage image) {
        return ProductDetailResponse.ImageResponse.builder()
                .id(image.getId())
                .imageUrl(image.getImageUrl())
                .displayOrder(image.getDisplayOrder())
                .isThumbnail(image.isThumbnail())
                .build();
    }

    private ProductDetailResponse.NutritionFactsResponse toNutritionFactsResponse(NutritionFacts facts) {
        if (facts == null) {
            return null;
        }
        return ProductDetailResponse.NutritionFactsResponse.builder()
                .perAmountG(facts.getPerAmountG())
                .calories(facts.getCalories())
                .proteinG(facts.getProteinG())
                .carbG(facts.getCarbG())
                .sugarG(facts.getSugarG())
                .fiberG(facts.getFiberG())
                .fatG(facts.getFatG())
                .sodiumMg(facts.getSodiumMg())
                .build();
    }
}
