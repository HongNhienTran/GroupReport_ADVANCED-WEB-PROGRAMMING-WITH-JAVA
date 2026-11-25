package com.sweetlab.backend.entity;

import com.sweetlab.backend.enums.ActivityLevel;
import com.sweetlab.backend.enums.Allergen;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "nutrition_profiles")
public class NutritionProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "height_cm", nullable = false)
    private double heightCm;

    @Column(name = "weight_kg", nullable = false)
    private double weightKg;

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_level", nullable = false)
    private ActivityLevel activityLevel;

    @Builder.Default
    @ElementCollection(targetClass = Allergen.class)
    @CollectionTable(name = "nutrition_profile_allergens", joinColumns = @JoinColumn(name = "nutrition_profile_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "allergen", nullable = false)
    private Set<Allergen> allergens = new HashSet<>();
}
