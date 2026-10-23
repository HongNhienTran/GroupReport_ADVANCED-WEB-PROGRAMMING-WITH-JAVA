package com.thesweetlabbe.service;

import com.thesweetlabbe.dto.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getRootCategories();
    CategoryResponse getCategoryBySlug(String slug);
}
