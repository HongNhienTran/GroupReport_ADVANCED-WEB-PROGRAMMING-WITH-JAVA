package com.sweetlab.backend.dto.response;

import com.sweetlab.backend.enums.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private Long accountId;
    private Long userId;
    private String email;
    private String phone;
    private String fullName;
    private String avatarUrl;
    private LocalDate dateOfBirth;
    private Gender gender;
    private UserRole role;
    private AccountStatus status;
    private LocalDateTime createdAt;
    private NutritionProfileDto nutritionProfile;
    private List<AddressDto> addresses;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NutritionProfileDto {
        private double heightCm;
        private double weightKg;
        private ActivityLevel activityLevel;
        private Set<Allergen> allergens;
        private double bmi;
        private int dailyCalorieTarget;
        private double dailySugarLimit;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddressDto {
        private Long id;
        private String recipientName;
        private String phone;
        private String province;
        private String district;
        private String ward;
        private String detailAddress;
        private AddressType type;
        private boolean isDefault;
    }
}
