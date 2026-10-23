package com.thesweetlabbe.repository;

import com.thesweetlabbe.entity.VerificationToken;
import com.thesweetlabbe.enums.TokenType;
import com.thesweetlabbe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, UUID> {

    Optional<VerificationToken> findByTokenAndTokenType(String token, TokenType tokenType);

    Optional<VerificationToken> findTopByUserAndTokenTypeAndIsUsedFalseOrderByCreatedAtDesc(User user, TokenType tokenType);
}
