package com.sweetlab.backend.controller;

import com.sweetlab.backend.dto.request.TrackingEventRequest;
import com.sweetlab.backend.dto.response.ApiResponse;
import com.sweetlab.backend.security.CustomUserDetails;
import com.sweetlab.backend.service.TrackingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/tracking")
@RequiredArgsConstructor
@Tag(name = "User Tracking", description = "Ghi nhận hành vi người dùng phục vụ AI gợi ý")
public class TrackingController {

    private final TrackingService trackingService;

    @PostMapping("/events")
    @Operation(summary = "Ghi nhận sự kiện xem, tìm kiếm, yêu thích, thêm giỏ hàng")
    public ResponseEntity<ApiResponse<Void>> trackEvent(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody TrackingEventRequest request
    ) {
        Long accountId = userDetails != null ? userDetails.getAccountId() : null;
        trackingService.trackEvent(accountId, request);
        return ResponseEntity.ok(ApiResponse.ok(null, "Event tracked"));
    }
}
