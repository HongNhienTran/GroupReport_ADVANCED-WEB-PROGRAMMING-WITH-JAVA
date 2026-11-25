package com.sweetlab.backend.service;

import com.sweetlab.backend.dto.response.ReviewResponse;

import java.util.List;

public interface ReviewService {
    List<ReviewResponse> getReviewsByProductId(Long productId);
}
