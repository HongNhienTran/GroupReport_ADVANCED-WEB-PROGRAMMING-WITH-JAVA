package com.sweetlab.backend.repository;

import com.sweetlab.backend.entity.NutritionFacts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NutritionFactsRepository extends JpaRepository<NutritionFacts, Long> {
}
