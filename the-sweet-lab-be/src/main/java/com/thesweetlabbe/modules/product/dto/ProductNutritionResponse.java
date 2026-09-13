package com.thesweetlabbe.modules.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductNutritionResponse {
    private String servingSize;
    private Double calories;
    private Double proteinG;
    private Double fatG;
    private Double saturatedFatG;
    private Double carbsG;
    private Double sugarG;
    private Double fiberG;
    private Double sodiumMg;
    private String allergens;
    private String ingredients;
}
