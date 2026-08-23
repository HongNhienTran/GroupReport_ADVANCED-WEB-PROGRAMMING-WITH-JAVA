package com.thesweetlabbe.modules.user.repository;

import com.thesweetlabbe.modules.user.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @EntityGraph(attributePaths = {"profile", "nutritionProfile"})
    Optional<User> findWithProfilesById(UUID id);

    @EntityGraph(attributePaths = {"profile", "nutritionProfile"})
    Optional<User> findWithProfilesByEmail(String email);
}
