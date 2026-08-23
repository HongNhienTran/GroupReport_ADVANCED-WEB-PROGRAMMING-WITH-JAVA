package com.thesweetlabbe.modules.user.dto;

import com.thesweetlabbe.modules.user.enums.ActivityLevel;
import com.thesweetlabbe.modules.user.enums.DietaryPreference;
import com.thesweetlabbe.modules.user.enums.NutritionGoal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NutritionProfileDTO {
    private Double height;
    private Double weight;
    private ActivityLevel activityLevel;
    private NutritionGoal goal;
    private DietaryPreference dietaryPreference;
}
