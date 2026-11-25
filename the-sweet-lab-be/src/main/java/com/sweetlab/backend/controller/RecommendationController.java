package com.sweetlab.backend.controller;

import com.sweetlab.backend.dto.response.ApiResponse;
import com.sweetlab.backend.dto.response.ProductSummaryResponse;
import com.sweetlab.backend.security.CustomUserDetails;
import com.sweetlab.backend.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendations")
@RequiredArgsConstructor
@Tag(name = "AI Recommendation", description = "Gợi ý sản phẩm cá nhân hóa dựa trên User Tracking & Vector Embedding")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping
    @Operation(summary = "Lấy danh sách sản phẩm gợi ý cá nhân hóa")
    public ResponseEntity<ApiResponse<List<ProductSummaryResponse>>> getRecommendations(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) String guestSessionId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "8") int limit
    ) {
        Long accountId = userDetails != null ? userDetails.getAccountId() : null;
        List<ProductSummaryResponse> result = recommendationService.getPersonalizedRecommendations(
                accountId, guestSessionId, categoryId, limit
        );
        return ResponseEntity.ok(ApiResponse.ok(result, "Personalized recommendations fetched"));
    }
}
