package com.thesweetlabbe.modules.product.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "product_nutritions", indexes = {
        @Index(name = "idx_nutrition_calories", columnList = "calories"),
        @Index(name = "idx_nutrition_sugar", columnList = "sugar_g")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductNutrition {

    @Id
    @Column(name = "product_id")
    private UUID productId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;

    @Column(name = "serving_size", length = 50)
    private String servingSize;

    @Column(name = "calories")
    private Double calories;

    @Column(name = "protein_g")
    private Double proteinG;

    @Column(name = "fat_g")
    private Double fatG;

    @Column(name = "saturated_fat_g")
    private Double saturatedFatG;

    @Column(name = "carbs_g")
    private Double carbsG;

    @Column(name = "sugar_g")
    private Double sugarG;

    @Column(name = "fiber_g")
    private Double fiberG;

    @Column(name = "sodium_mg")
    private Double sodiumMg;

    @Column(name = "allergens", length = 255)
    private String allergens;

    @Column(name = "ingredients", columnDefinition = "TEXT")
    private String ingredients;
}
