package com.sweetlab.backend.service;

import com.sweetlab.backend.dto.response.ProductSummaryResponse;

import java.util.List;

public interface RecommendationService {

    List<ProductSummaryResponse> getPersonalizedRecommendations(
            Long accountId,
            String guestSessionId,
            Long categoryId,
            int limit
    );
}
