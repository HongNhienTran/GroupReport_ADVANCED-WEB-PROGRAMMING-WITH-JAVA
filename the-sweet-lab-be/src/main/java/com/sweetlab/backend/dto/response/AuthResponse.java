package com.sweetlab.backend.dto.response;

import com.sweetlab.backend.enums.AccountStatus;
import com.sweetlab.backend.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private long expiresInMs;
    private UserSummary user;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummary {
        private Long accountId;
        private Long userId;
        private String email;
        private String phone;
        private String fullName;
        private String avatarUrl;
        private UserRole role;
        private AccountStatus status;
    }
}
