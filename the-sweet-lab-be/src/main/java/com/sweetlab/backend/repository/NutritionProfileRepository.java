package com.sweetlab.backend.repository;

import com.sweetlab.backend.entity.NutritionProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NutritionProfileRepository extends JpaRepository<NutritionProfile, Long> {
    Optional<NutritionProfile> findByUserId(Long userId);
}
