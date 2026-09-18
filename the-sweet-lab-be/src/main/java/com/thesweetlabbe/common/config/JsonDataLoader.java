package com.thesweetlabbe.common.config;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.thesweetlabbe.modules.product.entity.*;
import com.thesweetlabbe.modules.product.enums.DietaryTag;
import com.thesweetlabbe.modules.product.enums.ProductStatus;
import com.thesweetlabbe.modules.product.repository.BrandRepository;
import com.thesweetlabbe.modules.product.repository.CategoryRepository;
import com.thesweetlabbe.modules.product.repository.ProductRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
@Transactional
public class JsonDataLoader {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final ObjectMapper objectMapper;

    /**
     * Quét tất cả các file JSON trong thư mục classpath:data/**\/*.json
     * và nạp dữ liệu vào cơ sở dữ liệu PostgreSQL.
     */
    public int loadAllJsonData() {
        int totalLoaded = 0;
        try {
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource[] resources = resolver.getResources("classpath*:data/**/*.json");

            log.info("Tìm thấy {} file dữ liệu mẫu JSON trong resources/data/...", resources.length);

            // 1. Quét và nạp trước danh sách Thương hiệu (Brands)
            for (Resource resource : resources) {
                if (resource.getFilename() != null && resource.getFilename().contains("brands")) {
                    log.info("Đang đọc và nạp danh mục Thương hiệu từ: {}", resource.getFilename());
                    try (InputStream is = resource.getInputStream()) {
                        List<BrandJson> brandList = objectMapper.readValue(is, new com.fasterxml.jackson.core.type.TypeReference<List<BrandJson>>() {});
                        if (brandList != null) {
                            for (BrandJson b : brandList) {
                                Brand brand = brandRepository.findBySlug(b.getSlug())
                                        .orElseGet(() -> Brand.builder().slug(b.getSlug()).build());
                                brand.setName(b.getName());
                                brand.setLogoUrl(b.getLogoUrl());
                                brand.setDescription(b.getDescription());
                                brand.setOriginCountry(b.getOriginCountry());
                                brand.setWebsiteUrl(b.getWebsiteUrl());
                                brand.setDisplayOrder(b.getDisplayOrder() != null ? b.getDisplayOrder() : 0);
                                brand.setActive(b.getIsActive() == null || b.getIsActive());
                                brandRepository.save(brand);
                            }
                            log.info("Đã nạp thành công {} thương hiệu vào cơ sở dữ liệu.", brandList.size());
                        }
                    } catch (Exception e) {
                        log.error("Lỗi khi nạp file brands {}: {}", resource.getFilename(), e.getMessage(), e);
                    }
                }
            }

            // 2. Quét và nạp Categories cùng Products
            for (Resource resource : resources) {
                if (resource.getFilename() != null && resource.getFilename().contains("brands")) {
                    continue;
                }
                log.info("Đang đọc và nạp dữ liệu từ file: {}", resource.getFilename());
                try (InputStream is = resource.getInputStream()) {
                    CategoryDataWrapper wrapper = objectMapper.readValue(is, CategoryDataWrapper.class);
                    if (wrapper != null && wrapper.getCategory() != null) {
                        saveCategoryAndProducts(wrapper);
                        totalLoaded += (wrapper.getProducts() != null ? wrapper.getProducts().size() : 0);
                    }
                } catch (Exception e) {
                    log.error("Lỗi khi nạp file {}: {}", resource.getFilename(), e.getMessage(), e);
                }
            }

            log.info("Hoàn tất nạp dữ liệu JSON! Đã nạp/cập nhật {} sản phẩm.", totalLoaded);
        } catch (Exception e) {
            log.error("Lỗi quét thư mục data JSON: {}", e.getMessage(), e);
        }
        return totalLoaded;
    }

    @Transactional
    public void saveCategoryAndProducts(CategoryDataWrapper wrapper) {
        CategoryJson catJson = wrapper.getCategory();

        // 1. Tìm hoặc tạo mới Category
        Category category = categoryRepository.findBySlug(catJson.getSlug())
                .orElseGet(() -> Category.builder()
                        .slug(catJson.getSlug())
                        .build());

        category.setName(catJson.getName());
        category.setDescription(catJson.getDescription());
        if (catJson.getImageUrl() != null) category.setImageUrl(catJson.getImageUrl());
        if (catJson.getBannerUrl() != null) category.setBannerUrl(catJson.getBannerUrl());
        category.setDisplayOrder(catJson.getDisplayOrder() != null ? catJson.getDisplayOrder() : 0);
        category.setActive(true);
        category = categoryRepository.save(category);

        // 2. Thêm hoặc cập nhật từng Product
        if (wrapper.getProducts() != null) {
            for (ProductJson pJson : wrapper.getProducts()) {
                // Xử lý Brand
                Brand brand = findOrCreateBrand(pJson.getBrand(), pJson.getOrigin());

                Product product = productRepository.findBySku(pJson.getSku())
                        .or(() -> productRepository.findBySlug(pJson.getSlug()))
                        .orElseGet(() -> Product.builder()
                                .slug(pJson.getSlug())
                                .sku(pJson.getSku())
                                .build());

                product.setName(pJson.getName());
                product.setSlug(pJson.getSlug());
                product.setSku(pJson.getSku());
                product.setPrice(pJson.getPrice());
                product.setOriginalPrice(pJson.getOriginalPrice());
                product.setStockQuantity(pJson.getStockQuantity() != null ? pJson.getStockQuantity() : 100);
                product.setDescription(pJson.getDescription());
                product.setThumbnailUrl(pJson.getThumbnailUrl());
                product.setCategory(category);
                product.setBrand(brand);
                product.setBrandName(pJson.getBrand());
                product.setOrigin(pJson.getOrigin());
                product.setCocoaPercentage(pJson.getCocoaPercentage());
                product.setDietaryTags(pJson.getDietaryTags());
                product.setFeatured(Boolean.TRUE.equals(pJson.getIsFeatured()));
                product.setFlashSale(Boolean.TRUE.equals(pJson.getIsFlashSale()));
                product.setRating(pJson.getRating() != null ? pJson.getRating() : 5.0);
                product.setStatus(ProductStatus.ACTIVE);

                // Dinh dưỡng
                if (pJson.getNutrition() != null) {
                    NutritionJson nJson = pJson.getNutrition();
                    ProductNutrition nutrition = product.getNutrition();
                    if (nutrition == null) {
                        nutrition = ProductNutrition.builder().product(product).build();
                    }
                    nutrition.setServingSize(nJson.getServingSize());
                    nutrition.setCalories(nJson.getCalories());
                    nutrition.setProteinG(nJson.getProteinG());
                    nutrition.setFatG(nJson.getFatG());
                    nutrition.setSaturatedFatG(nJson.getSaturatedFatG());
                    nutrition.setCarbsG(nJson.getCarbsG());
                    nutrition.setSugarG(nJson.getSugarG());
                    nutrition.setFiberG(nJson.getFiberG());
                    nutrition.setSodiumMg(nJson.getSodiumMg());
                    nutrition.setAllergens(nJson.getAllergens());
                    nutrition.setIngredients(nJson.getIngredients());
                    product.setNutrition(nutrition);
                }

                // Hình ảnh phụ (Gallery)
                if (product.getImages() != null) {
                    product.getImages().clear();
                } else {
                    product.setImages(new ArrayList<>());
                }
                if (pJson.getImages() != null) {
                    for (ImageJson imgJson : pJson.getImages()) {
                        product.getImages().add(ProductImage.builder()
                                .product(product)
                                .imageUrl(imgJson.getImageUrl())
                                .altText(imgJson.getAltText())
                                .displayOrder(imgJson.getDisplayOrder() != null ? imgJson.getDisplayOrder() : 0)
                                .build());
                    }
                }

                // Biến thể sản phẩm (Product Variants)
                if (product.getVariants() == null) {
                    product.setVariants(new ArrayList<>());
                }
                if (pJson.getVariants() != null && !pJson.getVariants().isEmpty()) {
                    int order = 1;
                    for (VariantJson vJson : pJson.getVariants()) {
                        String variantSku = (vJson.getSku() != null && !vJson.getSku().isBlank())
                                ? vJson.getSku()
                                : pJson.getSku() + "-V" + order;

                        ProductVariant variant = product.getVariants().stream()
                                .filter(v -> variantSku.equals(v.getSku()))
                                .findFirst()
                                .orElse(null);

                        if (variant == null) {
                            variant = ProductVariant.builder()
                                    .product(product)
                                    .sku(variantSku)
                                    .build();
                            product.getVariants().add(variant);
                        }

                        variant.setName(vJson.getName());
                        variant.setPrice(vJson.getPrice() != null ? vJson.getPrice() : pJson.getPrice());
                        variant.setOriginalPrice(vJson.getOriginalPrice() != null ? vJson.getOriginalPrice() : pJson.getOriginalPrice());
                        variant.setStockQuantity(vJson.getStockQuantity() != null ? vJson.getStockQuantity() : 50);
                        variant.setImageUrl(vJson.getImageUrl() != null ? vJson.getImageUrl() : pJson.getThumbnailUrl());
                        variant.setDisplayOrder(vJson.getDisplayOrder() != null ? vJson.getDisplayOrder() : order);
                        variant.setActive(true);
                        order++;
                    }
                }

                productRepository.save(product);
                log.info("Đã lưu/cập nhật sản phẩm: {} (kèm {} biến thể)", product.getName(), product.getVariants().size());
            }
        }
    }

    private Brand findOrCreateBrand(String brandName, String origin) {
        if (brandName == null || brandName.isBlank()) {
            return null;
        }

        String slug = brandName.trim().toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");

        return brandRepository.findBySlug(slug)
                .orElseGet(() -> brandRepository.findByName(brandName.trim())
                        .orElseGet(() -> brandRepository.save(Brand.builder()
                                .name(brandName.trim())
                                .slug(slug)
                                .originCountry(origin != null ? origin.trim() : "Việt Nam")
                                .description("Thương hiệu " + brandName.trim() + " tuyển chọn tại The Sweet Lab.")
                                .isActive(true)
                                .build())));
    }

    // =========================================================================
    // DTO Wrapper dùng để đọc JSON
    // =========================================================================
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CategoryDataWrapper {
        private CategoryJson category;
        private List<ProductJson> products;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CategoryJson {
        private String name;
        private String slug;
        private String description;
        private String imageUrl;
        private String bannerUrl;
        private Integer displayOrder;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ProductJson {
        private String name;
        private String slug;
        private String sku;
        private BigDecimal price;
        private BigDecimal originalPrice;
        private Integer stockQuantity;
        private String description;
        private String thumbnailUrl;
        private String brand;
        private String origin;
        private Integer cocoaPercentage;
        private Set<DietaryTag> dietaryTags;
        private Boolean isFeatured;
        private Boolean isFlashSale;
        private Double rating;
        private List<ImageJson> images;
        private List<VariantJson> variants;
        private NutritionJson nutrition;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VariantJson {
        private String name;
        private String sku;
        private BigDecimal price;
        private BigDecimal originalPrice;
        private Integer stockQuantity;
        private String imageUrl;
        private Integer displayOrder;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ImageJson {
        private String imageUrl;
        private String altText;
        private Integer displayOrder;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class NutritionJson {
        private String servingSize;
        private Double calories;
        private Double proteinG;
        private Double fatG;
        private Double saturatedFatG;
        private Double carbsG;
        private Double sugarG;
        private Double fiberG;
        private Double sodiumMg;
        private String allergens;
        private String ingredients;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class BrandJson {
        private String name;
        private String slug;
        private String logoUrl;
        private String description;
        private String originCountry;
        private String websiteUrl;
        private Integer displayOrder;
        private Boolean isActive;
    }
}
