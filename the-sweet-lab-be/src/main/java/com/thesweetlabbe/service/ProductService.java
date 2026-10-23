package com.thesweetlabbe.service;

import com.thesweetlabbe.dto.ProductResponse;

import java.util.List;
import java.util.UUID;

public interface ProductService {
    List<ProductResponse> getAllProducts();
    List<ProductResponse> getFeaturedProducts();
    List<ProductResponse> getFlashSaleProducts();
    ProductResponse getProductBySlug(String slug);
    ProductResponse getProductById(UUID id);
}
