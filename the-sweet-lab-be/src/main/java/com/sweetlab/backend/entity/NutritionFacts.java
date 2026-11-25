package com.sweetlab.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "nutrition_facts")
public class NutritionFacts {

    @Id
    @Column(name = "product_id")
    private Long productId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "per_amount_g", nullable = false)
    private double perAmountG;

    private double calories;

    @Column(name = "protein_g")
    private double proteinG;

    @Column(name = "carb_g")
    private double carbG;

    @Column(name = "sugar_g")
    private double sugarG;

    @Column(name = "fiber_g")
    private double fiberG;

    @Column(name = "fat_g")
    private double fatG;

    @Column(name = "sodium_mg")
    private double sodiumMg;
}
