package com.sweetlab.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long orderId;
    private Long productId;
    private Long userId;
    private String userFullName;
    private String userAvatarUrl;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
}
