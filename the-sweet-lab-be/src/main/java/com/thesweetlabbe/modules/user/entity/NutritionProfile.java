package com.thesweetlabbe.modules.user.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.thesweetlabbe.modules.user.enums.ActivityLevel;
import com.thesweetlabbe.modules.user.enums.DietaryPreference;
import com.thesweetlabbe.modules.user.enums.NutritionGoal;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "nutrition_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NutritionProfile {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "height")
    private Double height; // cm (height > 0)

    @Column(name = "weight")
    private Double weight; // kg (weight > 0)

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_level", length = 30)
    private ActivityLevel activityLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "goal", length = 30)
    private NutritionGoal goal;

    @Enumerated(EnumType.STRING)
    @Column(name = "dietary_preference", length = 30)
    private DietaryPreference dietaryPreference;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
}
