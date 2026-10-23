package com.thesweetlabbe.repository;

import com.thesweetlabbe.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    Optional<Product> findBySlug(String slug);

    Optional<Product> findBySku(String sku);

    boolean existsBySlug(String slug);

    boolean existsBySku(String sku);

    long countByCategoryId(UUID categoryId);

    java.util.List<Product> findByIsFeaturedTrueAndStatus(com.thesweetlabbe.enums.ProductStatus status);

    java.util.List<Product> findByIsFlashSaleTrueAndStatus(com.thesweetlabbe.enums.ProductStatus status);
}
