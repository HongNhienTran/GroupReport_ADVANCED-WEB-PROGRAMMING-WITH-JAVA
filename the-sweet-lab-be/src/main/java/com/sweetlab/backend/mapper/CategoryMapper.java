package com.sweetlab.backend.mapper;

import com.sweetlab.backend.dto.request.CategoryRequest;
import com.sweetlab.backend.dto.response.CategoryResponse;
import com.sweetlab.backend.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .build();
    }

    public Category toEntity(CategoryRequest request) {
        return Category.builder()
                .name(request.getName().trim())
                .slug(request.getSlug().trim().toLowerCase())
                .description(request.getDescription())
                .build();
    }

    public void updateEntity(Category category, CategoryRequest request) {
        category.setName(request.getName().trim());
        category.setSlug(request.getSlug().trim().toLowerCase());
        category.setDescription(request.getDescription());
    }
}
