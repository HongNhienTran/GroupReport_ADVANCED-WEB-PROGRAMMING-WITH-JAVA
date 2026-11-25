package com.sweetlab.backend.controller;

import com.sweetlab.backend.dto.response.ApiResponse;
import com.sweetlab.backend.dto.response.ReviewResponse;
import com.sweetlab.backend.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Product Review", description = "Xem đánh giá và bình luận của khách hàng theo sản phẩm")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/{productId}/reviews")
    @Operation(summary = "Lấy danh sách đánh giá & bình luận của sản phẩm")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.ok(reviewService.getReviewsByProductId(productId), "Reviews fetched"));
    }
}
