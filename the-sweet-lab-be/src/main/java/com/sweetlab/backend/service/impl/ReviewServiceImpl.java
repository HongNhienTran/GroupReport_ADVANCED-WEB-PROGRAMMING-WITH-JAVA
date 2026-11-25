package com.sweetlab.backend.service.impl;

import com.sweetlab.backend.dto.response.ReviewResponse;
import com.sweetlab.backend.repository.ReviewRepository;
import com.sweetlab.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(r -> ReviewResponse.builder()
                        .orderId(r.getId().getOrderId())
                        .productId(r.getId().getProductId())
                        .userId(r.getUser().getId())
                        .userFullName(r.getUser().getFullName())
                        .userAvatarUrl(r.getUser().getAvatarUrl())
                        .rating(r.getRating())
                        .comment(r.getComment())
                        .createdAt(r.getCreatedAt())
                        .build())
                .toList();
    }
}
