package com.thesweetlabbe.modules.user.dto;

import com.thesweetlabbe.modules.user.enums.AccountStatus;
import com.thesweetlabbe.modules.user.enums.UserRole;
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
}
