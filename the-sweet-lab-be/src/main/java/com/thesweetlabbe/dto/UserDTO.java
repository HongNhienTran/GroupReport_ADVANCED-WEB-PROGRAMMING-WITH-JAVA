package com.thesweetlabbe.dto;

import com.thesweetlabbe.enums.AccountStatus;
import com.thesweetlabbe.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private UUID id;
    private String email;
    private String fullName;
    private UserRole role;
    private AccountStatus status;
    private Instant createdAt;
    private Instant updatedAt;
    private UserProfileDTO profile;
    private NutritionProfileDTO nutritionProfile;
    private java.util.List<UserAddressDTO> addresses;
}
