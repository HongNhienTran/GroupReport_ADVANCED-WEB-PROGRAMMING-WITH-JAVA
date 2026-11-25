package com.sweetlab.backend.repository;

import com.sweetlab.backend.entity.AuthToken;
import com.sweetlab.backend.enums.TokenType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthTokenRepository extends JpaRepository<AuthToken, Long> {
    Optional<AuthToken> findByTokenValue(String tokenValue);
    Optional<AuthToken> findByTokenValueAndType(String tokenValue, TokenType type);
}
