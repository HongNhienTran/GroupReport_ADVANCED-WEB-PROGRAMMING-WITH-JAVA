package com.sweetlab.backend.controller;

import com.sweetlab.backend.dto.request.ProductRequest;
import com.sweetlab.backend.dto.response.ApiResponse;
import com.sweetlab.backend.dto.response.NutritionTagResponse;
import com.sweetlab.backend.dto.response.PageResponse;
import com.sweetlab.backend.dto.response.ProductDetailResponse;
import com.sweetlab.backend.dto.response.ProductSummaryResponse;
import com.sweetlab.backend.enums.Allergen;
import com.sweetlab.backend.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Product", description = "Tra cứu, lọc dinh dưỡng/dị ứng và quản lý sản phẩm")
public class ProductController {

    private final ProductService productService;

    @GetMapping("/products")
    @Operation(summary = "Danh sách, tìm kiếm và lọc sản phẩm theo danh mục, nhãn hàng, tag dinh dưỡng, loại trừ dị ứng và giá")
    public ResponseEntity<ApiResponse<PageResponse<ProductSummaryResponse>>> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) Set<Long> tagIds,
            @RequestParam(required = false) Set<Allergen> excludeAllergens,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = "asc".equalsIgnoreCase(sortDir)
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        PageResponse<ProductSummaryResponse> result = productService.searchProducts(
                keyword, categoryId, brandId, tagIds, excludeAllergens, minPrice, maxPrice, pageable
        );
        return ResponseEntity.ok(ApiResponse.ok(result, "Products fetched"));
    }

    @GetMapping("/products/{id}")
    @Operation(summary = "Chi tiết sản phẩm, biến thể, hình ảnh và NutritionFacts theo ID")
    public ResponseEntity<ApiResponse<ProductDetailResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getById(id), "Product detail fetched"));
    }

    @GetMapping("/products/slug/{slug}")
    @Operation(summary = "Chi tiết sản phẩm, biến thể, hình ảnh và NutritionFacts theo slug")
    public ResponseEntity<ApiResponse<ProductDetailResponse>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getBySlug(slug), "Product detail fetched"));
    }

    @GetMapping("/nutrition-tags")
    @Operation(summary = "Lấy danh sách các tag dinh dưỡng (Keto, Vegan, Sugar-Free...)")
    public ResponseEntity<ApiResponse<List<NutritionTagResponse>>> getAllNutritionTags() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getAllNutritionTags(), "Nutrition tags fetched"));
    }

    @PostMapping("/admin/products")
    @Operation(summary = "Tạo sản phẩm mới kèm biến thể, ảnh và NutritionFacts (Admin)")
    public ResponseEntity<ApiResponse<ProductDetailResponse>> create(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.created(productService.create(request), "Product created"));
    }

    @PutMapping("/admin/products/{id}")
    @Operation(summary = "Cập nhật sản phẩm (Admin)")
    public ResponseEntity<ApiResponse<ProductDetailResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(productService.update(id, request), "Product updated"));
    }

    @DeleteMapping("/admin/products/{id}")
    @Operation(summary = "Xóa sản phẩm (Admin)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Product deleted"));
    }
}
