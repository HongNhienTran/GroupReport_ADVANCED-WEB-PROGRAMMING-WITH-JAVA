package com.thesweetlabbe.service.impl;

import com.thesweetlabbe.enums.ErrorCode;
import com.thesweetlabbe.exception.AppException;
import com.thesweetlabbe.dto.CategoryResponse;
import com.thesweetlabbe.entity.Category;
import com.thesweetlabbe.repository.CategoryRepository;
import com.thesweetlabbe.repository.ProductRepository;
import com.thesweetlabbe.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public List<CategoryResponse> getRootCategories() {
        List<Category> rootCategories = categoryRepository.findByParentIsNullOrderByDisplayOrderAsc();
        return rootCategories.stream()
                .filter(Category::isActive)
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CategoryResponse getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        return mapToResponse(category);
    }

    private CategoryResponse mapToResponse(Category category) {
        List<CategoryResponse> childResponses = category.getChildren().stream()
                .filter(Category::isActive)
                .map(this::mapChildToResponse)
                .toList();

        long selfCount = productRepository.countByCategoryId(category.getId());
        long childrenCount = childResponses.stream().mapToLong(CategoryResponse::getProductCount).sum();

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .bannerUrl(category.getBannerUrl())
                .displayOrder(category.getDisplayOrder())
                .productCount(selfCount + childrenCount)
                .children(childResponses)
                .build();
    }

    private CategoryResponse mapChildToResponse(Category child) {
        long count = productRepository.countByCategoryId(child.getId());
        return CategoryResponse.builder()
                .id(child.getId())
                .name(child.getName())
                .slug(child.getSlug())
                .description(child.getDescription())
                .imageUrl(child.getImageUrl())
                .bannerUrl(child.getBannerUrl())
                .displayOrder(child.getDisplayOrder())
                .productCount(count)
                .build();
    }
}
