package com.thesweetlabbe.modules.product.repository;

import com.thesweetlabbe.modules.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    Optional<Product> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySku(String sku);

    long countByCategoryId(UUID categoryId);

    java.util.List<Product> findByIsFeaturedTrueAndStatus(com.thesweetlabbe.modules.product.enums.ProductStatus status);

    java.util.List<Product> findByIsFlashSaleTrueAndStatus(com.thesweetlabbe.modules.product.enums.ProductStatus status);
}
