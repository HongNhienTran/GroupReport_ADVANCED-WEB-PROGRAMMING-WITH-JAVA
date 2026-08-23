package com.thesweetlabbe.modules.auth.entity;

import com.thesweetlabbe.common.entity.BaseEntity;
import com.thesweetlabbe.modules.auth.enums.TokenType;
import com.thesweetlabbe.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "verification_tokens", indexes = {
        @Index(name = "idx_token_value", columnList = "token", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationToken extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "token", nullable = false, unique = true, length = 100)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "token_type", nullable = false, length = 30)
    @Builder.Default
    private TokenType tokenType = TokenType.EMAIL_VERIFICATION;

    @Column(name = "expiry_date", nullable = false)
    private Instant expiryDate;

    @Column(name = "is_used", nullable = false)
    @Builder.Default
    private boolean isUsed = false;

    public boolean isExpired() {
        return Instant.now().isAfter(this.expiryDate);
    }
}
