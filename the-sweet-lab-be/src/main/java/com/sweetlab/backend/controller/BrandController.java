package com.sweetlab.backend.controller;

import com.sweetlab.backend.dto.request.BrandRequest;
import com.sweetlab.backend.dto.response.ApiResponse;
import com.sweetlab.backend.dto.response.BrandResponse;
import com.sweetlab.backend.service.BrandService;
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
@Tag(name = "Brand", description = "Quản lý và tra cứu nhãn hàng")
public class BrandController {

    private final BrandService brandService;

    @GetMapping("/brands")
    @Operation(summary = "Lấy danh sách tất cả nhãn hàng")
    public ResponseEntity<ApiResponse<List<BrandResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(brandService.getAll(), "Brands fetched"));
    }

    @GetMapping("/brands/{id}")
    @Operation(summary = "Lấy chi tiết nhãn hàng theo ID")
    public ResponseEntity<ApiResponse<BrandResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(brandService.getById(id), "Brand fetched"));
    }

    @GetMapping("/brands/slug/{slug}")
    @Operation(summary = "Lấy chi tiết nhãn hàng theo slug")
    public ResponseEntity<ApiResponse<BrandResponse>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(brandService.getBySlug(slug), "Brand fetched"));
    }

    @PostMapping("/admin/brands")
    @Operation(summary = "Tạo nhãn hàng mới (Admin)")
    public ResponseEntity<ApiResponse<BrandResponse>> create(@Valid @RequestBody BrandRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.created(brandService.create(request), "Brand created"));
    }

    @PutMapping("/admin/brands/{id}")
    @Operation(summary = "Cập nhật nhãn hàng (Admin)")
    public ResponseEntity<ApiResponse<BrandResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody BrandRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(brandService.update(id, request), "Brand updated"));
    }

    @DeleteMapping("/admin/brands/{id}")
    @Operation(summary = "Xóa nhãn hàng (Admin)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        brandService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Brand deleted"));
    }
}
