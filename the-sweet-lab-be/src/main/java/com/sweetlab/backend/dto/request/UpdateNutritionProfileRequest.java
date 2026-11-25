package com.sweetlab.backend.dto.request;

import com.sweetlab.backend.enums.ActivityLevel;
import com.sweetlab.backend.enums.Allergen;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class UpdateNutritionProfileRequest {

    @Positive(message = "Height must be positive")
    private double heightCm;

    @Positive(message = "Weight must be positive")
    private double weightKg;

    @NotNull(message = "Activity level is required")
    private ActivityLevel activityLevel;

    private Set<Allergen> allergens;
}
