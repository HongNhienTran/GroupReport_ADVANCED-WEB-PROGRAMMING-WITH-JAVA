package com.sweetlab.backend.mapper;

import com.sweetlab.backend.dto.response.AuthResponse;
import com.sweetlab.backend.entity.Account;
import com.sweetlab.backend.entity.User;
import org.springframework.stereotype.Component;

/**
 * Maps {@link Account} and {@link User} entities to authentication response DTOs.
 */
@Component
public class AuthMapper {

    public AuthResponse.UserSummary toUserSummary(Account account, User user) {
        return AuthResponse.UserSummary.builder()
                .accountId(account.getId())
                .userId(user.getId())
                .email(account.getEmail())
                .phone(account.getPhone())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .role(account.getRole())
                .status(account.getStatus())
                .build();
    }
}
