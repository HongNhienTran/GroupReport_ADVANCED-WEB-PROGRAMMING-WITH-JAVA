package com.sweetlab.backend.controller;

import com.sweetlab.backend.dto.request.CategoryRequest;
import com.sweetlab.backend.dto.response.ApiResponse;
import com.sweetlab.backend.dto.response.CategoryResponse;
import com.sweetlab.backend.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Category", description = "Quản lý và tra cứu danh mục sản phẩm")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/categories")
    @Operation(summary = "Lấy danh sách tất cả danh mục")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(categoryService.getAll(), "Categories fetched"));
    }

    @GetMapping("/categories/{id}")
    @Operation(summary = "Lấy chi tiết danh mục theo ID")
    public ResponseEntity<ApiResponse<CategoryResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(categoryService.getById(id), "Category fetched"));
    }

    @GetMapping("/categories/slug/{slug}")
    @Operation(summary = "Lấy chi tiết danh mục theo slug")
    public ResponseEntity<ApiResponse<CategoryResponse>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(categoryService.getBySlug(slug), "Category fetched"));
    }

    @PostMapping("/admin/categories")
    @Operation(summary = "Tạo danh mục mới (Admin)")
    public ResponseEntity<ApiResponse<CategoryResponse>> create(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.created(categoryService.create(request), "Category created"));
    }

    @PutMapping("/admin/categories/{id}")
    @Operation(summary = "Cập nhật danh mục (Admin)")
    public ResponseEntity<ApiResponse<CategoryResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(categoryService.update(id, request), "Category updated"));
    }

    @DeleteMapping("/admin/categories/{id}")
    @Operation(summary = "Xóa danh mục (Admin)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Category deleted"));
    }
}
