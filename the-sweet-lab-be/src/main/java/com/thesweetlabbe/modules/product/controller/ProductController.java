package com.thesweetlabbe.modules.product.controller;

import com.thesweetlabbe.common.dto.ApiResponse;
import com.thesweetlabbe.modules.product.dto.ProductResponse;
import com.thesweetlabbe.modules.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Product", description = "API Sản phẩm & Dinh dưỡng Healthy")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Lấy toàn bộ danh sách sản phẩm")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts() {
        List<ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách tất cả sản phẩm thành công", products));
    }

    @GetMapping("/featured")
    @Operation(summary = "Lấy danh sách sản phẩm nổi bật hiển thị ở Trang chủ")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getFeaturedProducts() {
        List<ProductResponse> products = productService.getFeaturedProducts();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sản phẩm nổi bật thành công", products));
    }

    @GetMapping("/flash-sale")
    @Operation(summary = "Lấy danh sách sản phẩm Flash Sale")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getFlashSaleProducts() {
        List<ProductResponse> products = productService.getFlashSaleProducts();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sản phẩm Flash Sale thành công", products));
    }

    @GetMapping("/{idOrSlug}")
    @Operation(summary = "Lấy chi tiết sản phẩm theo ID (UUID) hoặc Slug")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductByIdOrSlug(@PathVariable String idOrSlug) {
        ProductResponse product;
        try {
            UUID id = UUID.fromString(idOrSlug);
            product = productService.getProductById(id);
        } catch (IllegalArgumentException e) {
            product = productService.getProductBySlug(idOrSlug);
        }
        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết sản phẩm thành công", product));
    }
}
