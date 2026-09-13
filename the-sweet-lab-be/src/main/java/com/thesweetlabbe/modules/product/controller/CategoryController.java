package com.thesweetlabbe.modules.product.controller;

import com.thesweetlabbe.common.dto.ApiResponse;
import com.thesweetlabbe.modules.product.dto.CategoryResponse;
import com.thesweetlabbe.modules.product.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Tag(name = "Category", description = "API Danh mục Bánh kẹo & Socola Healthy")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Lấy danh sách cây danh mục gốc (kèm danh mục con và số lượng sản phẩm)")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategories() {
        List<CategoryResponse> categories = categoryService.getRootCategories();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh mục thành công", categories));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Lấy chi tiết danh mục theo slug")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryBySlug(@PathVariable String slug) {
        CategoryResponse category = categoryService.getCategoryBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin danh mục thành công", category));
    }
}
