package com.thesweetlabbe.repository;

import com.thesweetlabbe.entity.NutritionProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NutritionProfileRepository extends JpaRepository<NutritionProfile, UUID> {
}
