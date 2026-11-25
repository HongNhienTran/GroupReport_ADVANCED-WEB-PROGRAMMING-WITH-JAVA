package com.sweetlab.backend.service.impl;

import com.sweetlab.backend.dto.request.ProductRequest;
import com.sweetlab.backend.dto.response.NutritionTagResponse;
import com.sweetlab.backend.dto.response.PageResponse;
import com.sweetlab.backend.dto.response.ProductDetailResponse;
import com.sweetlab.backend.dto.response.ProductSummaryResponse;
import com.sweetlab.backend.entity.*;
import com.sweetlab.backend.enums.Allergen;
import com.sweetlab.backend.enums.ProductStatus;
import com.sweetlab.backend.exception.BadRequestException;
import com.sweetlab.backend.exception.ResourceNotFoundException;
import com.sweetlab.backend.mapper.ProductMapper;
import com.sweetlab.backend.repository.BrandRepository;
import com.sweetlab.backend.repository.CategoryRepository;
import com.sweetlab.backend.repository.NutritionTagRepository;
import com.sweetlab.backend.repository.ProductRepository;
import com.sweetlab.backend.service.ProductService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final NutritionTagRepository nutritionTagRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductSummaryResponse> searchProducts(
            String keyword,
            Long categoryId,
            Long brandId,
            Set<Long> tagIds,
            Set<Allergen> excludeAllergens,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    ) {
        Specification<Product> spec = (root, query, cb) -> {
            query.distinct(true);
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("status"), ProductStatus.ACTIVE));

            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern),
                        cb.like(cb.lower(root.get("ingredients")), pattern)
                ));
            }

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (brandId != null) {
                predicates.add(cb.equal(root.get("brand").get("id"), brandId));
            }

            if (tagIds != null && !tagIds.isEmpty()) {
                Join<Product, NutritionTag> tagJoin = root.join("nutritionTags");
                predicates.add(tagJoin.get("id").in(tagIds));
            }

            if (excludeAllergens != null && !excludeAllergens.isEmpty()) {
                Subquery<Long> subquery = query.subquery(Long.class);
                Root<Product> subRoot = subquery.from(Product.class);
                Join<Product, Allergen> allergenJoin = subRoot.join("allergens");
                subquery.select(subRoot.get("id"))
                        .where(cb.and(
                                cb.equal(subRoot.get("id"), root.get("id")),
                                allergenJoin.in(excludeAllergens)
                        ));
                predicates.add(cb.not(cb.exists(subquery)));
            }

            if (minPrice != null || maxPrice != null) {
                Join<Product, ProductVariant> variantJoin = root.join("variants");
                predicates.add(cb.isTrue(variantJoin.get("isActive")));
                if (minPrice != null) {
                    predicates.add(cb.greaterThanOrEqualTo(variantJoin.get("price"), minPrice));
                }
                if (maxPrice != null) {
                    predicates.add(cb.lessThanOrEqualTo(variantJoin.get("price"), maxPrice));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<ProductSummaryResponse> page = productRepository.findAll(spec, pageable)
                .map(productMapper::toSummary);
        return PageResponse.from(page);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDetailResponse getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return productMapper.toDetail(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDetailResponse getBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return productMapper.toDetail(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NutritionTagResponse> getAllNutritionTags() {
        return nutritionTagRepository.findAll().stream()
                .map(productMapper::toTagResponse)
                .toList();
    }

    @Override
    @Transactional
    public ProductDetailResponse create(ProductRequest request) {
        String slug = request.getSlug().trim().toLowerCase();
        if (productRepository.existsBySlug(slug)) {
            throw new BadRequestException("Product slug already exists: " + slug);
        }

        Product product = new Product();
        applyRequest(product, request);
        return productMapper.toDetail(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductDetailResponse update(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        String newSlug = request.getSlug().trim().toLowerCase();
        if (!product.getSlug().equals(newSlug) && productRepository.existsBySlug(newSlug)) {
            throw new BadRequestException("Product slug already exists: " + newSlug);
        }

        applyRequest(product, request);
        return productMapper.toDetail(productRepository.save(product));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    private void applyRequest(Product product, ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + request.getBrandId()));

        product.setCategory(category);
        product.setBrand(brand);
        product.setName(request.getName().trim());
        product.setSlug(request.getSlug().trim().toLowerCase());
        product.setDescription(request.getDescription());
        product.setIngredients(request.getIngredients());
        product.setShelfLifeDays(request.getShelfLifeDays());
        product.setStorageInstruction(request.getStorageInstruction());
        product.setStatus(request.getStatus());

        product.getAllergens().clear();
        if (request.getAllergens() != null) {
            product.getAllergens().addAll(request.getAllergens());
        }

        product.getNutritionTags().clear();
        if (request.getNutritionTagIds() != null && !request.getNutritionTagIds().isEmpty()) {
            Set<NutritionTag> tags = new HashSet<>(nutritionTagRepository.findAllById(request.getNutritionTagIds()));
            product.getNutritionTags().addAll(tags);
        }

        product.getVariants().clear();
        for (ProductRequest.VariantRequest vr : request.getVariants()) {
            product.getVariants().add(ProductVariant.builder()
                    .product(product)
                    .sku(vr.getSku().trim())
                    .name(vr.getName().trim())
                    .price(vr.getPrice())
                    .originalPrice(vr.getOriginalPrice())
                    .stockQuantity(vr.getStockQuantity())
                    .weightGram(vr.getWeightGram())
                    .isActive(vr.isActive())
                    .build());
        }

        product.getImages().clear();
        if (request.getImages() != null) {
            for (ProductRequest.ImageRequest ir : request.getImages()) {
                product.getImages().add(ProductImage.builder()
                        .product(product)
                        .imageUrl(ir.getImageUrl().trim())
                        .displayOrder(ir.getDisplayOrder())
                        .isThumbnail(ir.isThumbnail())
                        .build());
            }
        }

        if (request.getNutritionFacts() != null) {
            ProductRequest.NutritionFactsRequest nfr = request.getNutritionFacts();
            NutritionFacts facts = product.getNutritionFacts();
            if (facts == null) {
                facts = new NutritionFacts();
                facts.setProduct(product);
                product.setNutritionFacts(facts);
            }
            facts.setPerAmountG(nfr.getPerAmountG());
            facts.setCalories(nfr.getCalories());
            facts.setProteinG(nfr.getProteinG());
            facts.setCarbG(nfr.getCarbG());
            facts.setSugarG(nfr.getSugarG());
            facts.setFiberG(nfr.getFiberG());
            facts.setFatG(nfr.getFatG());
            facts.setSodiumMg(nfr.getSodiumMg());
        }
    }
}
