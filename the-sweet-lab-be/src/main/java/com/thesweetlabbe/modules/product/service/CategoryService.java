package com.thesweetlabbe.modules.product.service;

import com.thesweetlabbe.modules.product.dto.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getRootCategories();
    CategoryResponse getCategoryBySlug(String slug);
}
