package com.sweetlab.backend.security;

import com.sweetlab.backend.entity.Account;
import com.sweetlab.backend.enums.AccountStatus;
import com.sweetlab.backend.enums.UserRole;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Spring Security {@link UserDetails} adapter backed by {@link Account}.
 */
@Getter
public class CustomUserDetails implements UserDetails {

    private final Long accountId;
    private final String email;
    private final String passwordHash;
    private final UserRole role;
    private final AccountStatus status;

    public CustomUserDetails(Account account) {
        this.accountId = account.getId();
        this.email = account.getEmail();
        this.passwordHash = account.getPasswordHash();
        this.role = account.getRole();
        this.status = account.getStatus();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status != AccountStatus.BLOCKED;
    }

    @Override
    public boolean isEnabled() {
        return status == AccountStatus.ACTIVE;
    }
}
