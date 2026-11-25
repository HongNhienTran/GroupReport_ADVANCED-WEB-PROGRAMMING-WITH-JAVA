package com.sweetlab.backend.controller;

import com.sweetlab.backend.dto.request.AddressRequest;
import com.sweetlab.backend.dto.request.UpdateNutritionProfileRequest;
import com.sweetlab.backend.dto.request.UpdateProfileRequest;
import com.sweetlab.backend.dto.response.ApiResponse;
import com.sweetlab.backend.dto.response.UserProfileResponse;
import com.sweetlab.backend.security.CustomUserDetails;
import com.sweetlab.backend.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
@Tag(name = "User Profile", description = "Quản lý thông tin cá nhân, hồ sơ dinh dưỡng và địa chỉ")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    @Operation(summary = "Lấy thông tin trang cá nhân của người dùng hiện tại")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.ok(profileService.getProfile(userDetails.getAccountId()), "Profile fetched"));
    }

    @PutMapping
    @Operation(summary = "Cập nhật thông tin cá nhân")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                profileService.updateProfile(userDetails.getAccountId(), request),
                "Profile updated"
        ));
    }

    @PutMapping("/nutrition")
    @Operation(summary = "Cập nhật hồ sơ dinh dưỡng & dị ứng")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateNutrition(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UpdateNutritionProfileRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                profileService.updateNutritionProfile(userDetails.getAccountId(), request),
                "Nutrition profile updated"
        ));
    }

    @PostMapping("/addresses")
    @Operation(summary = "Thêm địa chỉ giao hàng mới")
    public ResponseEntity<ApiResponse<UserProfileResponse>> addAddress(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody AddressRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                profileService.addAddress(userDetails.getAccountId(), request),
                "Address added"
        ));
    }

    @DeleteMapping("/addresses/{addressId}")
    @Operation(summary = "Xóa địa chỉ giao hàng")
    public ResponseEntity<ApiResponse<UserProfileResponse>> deleteAddress(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long addressId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                profileService.deleteAddress(userDetails.getAccountId(), addressId),
                "Address deleted"
        ));
    }
}
