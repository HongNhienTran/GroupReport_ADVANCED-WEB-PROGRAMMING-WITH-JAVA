package com.thesweetlabbe.modules.user.repository;

import com.thesweetlabbe.modules.user.entity.NutritionProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NutritionProfileRepository extends JpaRepository<NutritionProfile, UUID> {
}
