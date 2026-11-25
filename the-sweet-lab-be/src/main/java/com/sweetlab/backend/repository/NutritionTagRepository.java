package com.sweetlab.backend.repository;

import com.sweetlab.backend.entity.NutritionTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NutritionTagRepository extends JpaRepository<NutritionTag, Long> {
    Optional<NutritionTag> findByName(String name);
}
