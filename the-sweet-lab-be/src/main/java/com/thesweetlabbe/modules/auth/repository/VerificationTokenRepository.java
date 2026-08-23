package com.thesweetlabbe.modules.auth.repository;

import com.thesweetlabbe.modules.auth.entity.VerificationToken;
import com.thesweetlabbe.modules.auth.enums.TokenType;
import com.thesweetlabbe.modules.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, UUID> {

    Optional<VerificationToken> findByTokenAndTokenType(String token, TokenType tokenType);

    Optional<VerificationToken> findTopByUserAndTokenTypeAndIsUsedFalseOrderByCreatedAtDesc(User user, TokenType tokenType);
}
