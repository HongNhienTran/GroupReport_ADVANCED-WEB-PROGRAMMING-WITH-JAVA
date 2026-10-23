package com.thesweetlabbe.dto;

import com.thesweetlabbe.enums.ActivityLevel;
import com.thesweetlabbe.enums.DietaryPreference;
import com.thesweetlabbe.enums.NutritionGoal;
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
