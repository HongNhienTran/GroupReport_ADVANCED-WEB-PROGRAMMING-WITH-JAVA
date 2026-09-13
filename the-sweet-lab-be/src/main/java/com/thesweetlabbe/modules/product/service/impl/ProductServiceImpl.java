package com.thesweetlabbe.modules.product.service.impl;

import com.thesweetlabbe.common.enums.ErrorCode;
import com.thesweetlabbe.common.exception.AppException;
import com.thesweetlabbe.modules.product.dto.ProductNutritionResponse;
import com.thesweetlabbe.modules.product.dto.ProductResponse;
import com.thesweetlabbe.modules.product.entity.Product;
import com.thesweetlabbe.modules.product.entity.ProductImage;
import com.thesweetlabbe.modules.product.entity.ProductNutrition;
import com.thesweetlabbe.modules.product.enums.ProductStatus;
import com.thesweetlabbe.modules.product.repository.ProductRepository;
import com.thesweetlabbe.modules.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrueAndStatus(ProductStatus.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ProductResponse> getFlashSaleProducts() {
        return productRepository.findByIsFlashSaleTrueAndStatus(ProductStatus.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        return mapToResponse(product);
    }

    @Override
    public ProductResponse getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        return mapToResponse(product);
    }

    private ProductResponse mapToResponse(Product product) {
        ProductNutritionResponse nutritionResponse = null;
        if (product.getNutrition() != null) {
            ProductNutrition n = product.getNutrition();
            nutritionResponse = ProductNutritionResponse.builder()
                    .servingSize(n.getServingSize())
                    .calories(n.getCalories())
                    .proteinG(n.getProteinG())
                    .fatG(n.getFatG())
                    .saturatedFatG(n.getSaturatedFatG())
                    .carbsG(n.getCarbsG())
                    .sugarG(n.getSugarG())
                    .fiberG(n.getFiberG())
                    .sodiumMg(n.getSodiumMg())
                    .allergens(n.getAllergens())
                    .ingredients(n.getIngredients())
                    .build();
        }

        List<String> imageUrls = product.getImages().stream()
                .map(ProductImage::getImageUrl)
                .toList();

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .sku(product.getSku())
                .price(product.getPrice())
                .originalPrice(product.getOriginalPrice())
                .stockQuantity(product.getStockQuantity())
                .description(product.getDescription())
                .thumbnailUrl(product.getThumbnailUrl())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .categorySlug(product.getCategory() != null ? product.getCategory().getSlug() : null)
                .brand(product.getBrand())
                .origin(product.getOrigin())
                .cocoaPercentage(product.getCocoaPercentage())
                .dietaryTags(product.getDietaryTags())
                .isFeatured(product.isFeatured())
                .isFlashSale(product.isFlashSale())
                .rating(product.getRating())
                .status(product.getStatus())
                .nutrition(nutritionResponse)
                .images(imageUrls)
                .build();
    }
}
