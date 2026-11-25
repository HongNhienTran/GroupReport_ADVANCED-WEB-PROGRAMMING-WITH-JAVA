package com.sweetlab.backend.service.impl;

import com.sweetlab.backend.dto.request.ChangePasswordRequest;
import com.sweetlab.backend.dto.request.ForgotPasswordRequest;
import com.sweetlab.backend.dto.request.LoginRequest;
import com.sweetlab.backend.dto.request.RefreshTokenRequest;
import com.sweetlab.backend.dto.request.RegisterRequest;
import com.sweetlab.backend.dto.request.ResetPasswordRequest;
import com.sweetlab.backend.dto.response.AuthResponse;
import com.sweetlab.backend.entity.Account;
import com.sweetlab.backend.entity.AuthToken;
import com.sweetlab.backend.entity.Cart;
import com.sweetlab.backend.entity.User;
import com.sweetlab.backend.enums.AccountStatus;
import com.sweetlab.backend.enums.TokenType;
import com.sweetlab.backend.enums.UserRole;
import com.sweetlab.backend.exception.BadRequestException;
import com.sweetlab.backend.exception.ForbiddenException;
import com.sweetlab.backend.exception.ResourceNotFoundException;
import com.sweetlab.backend.exception.UnauthorizedException;
import com.sweetlab.backend.mapper.AuthMapper;
import com.sweetlab.backend.repository.AccountRepository;
import com.sweetlab.backend.repository.AuthTokenRepository;
import com.sweetlab.backend.repository.CartRepository;
import com.sweetlab.backend.repository.UserRepository;
import com.sweetlab.backend.security.CustomUserDetails;
import com.sweetlab.backend.security.JwtService;
import com.sweetlab.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final AuthTokenRepository authTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AuthMapper authMapper;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (accountRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }
        if (accountRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone number is already registered");
        }

        Account account = Account.builder()
                .email(request.getEmail().trim().toLowerCase())
                .phone(request.getPhone().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.CUSTOMER)
                .status(AccountStatus.ACTIVE)
                .build();
        account = accountRepository.save(account);

        User user = User.builder()
                .account(account)
                .fullName(request.getFullName().trim())
                .build();
        user = userRepository.save(user);

        Cart cart = Cart.builder()
                .user(user)
                .build();
        cartRepository.save(cart);

        return issueAuthTokens(account, user);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        account.setLastLoginAt(LocalDateTime.now());
        accountRepository.save(account);

        User user = userRepository.findByAccountId(account.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));

        return issueAuthTokens(account, user);
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        AuthToken storedToken = authTokenRepository
                .findByTokenValueAndType(request.getRefreshToken(), TokenType.REFRESH_TOKEN)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (storedToken.isUsed() || storedToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new UnauthorizedException("Refresh token is expired or already used");
        }

        Account account = storedToken.getAccount();
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new ForbiddenException("Account is not active");
        }

        storedToken.setUsed(true);
        authTokenRepository.save(storedToken);

        User user = userRepository.findByAccountId(account.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));

        return issueAuthTokens(account, user);
    }

    @Override
    @Transactional
    public void logout(RefreshTokenRequest request) {
        authTokenRepository
                .findByTokenValueAndType(request.getRefreshToken(), TokenType.REFRESH_TOKEN)
                .ifPresent(token -> {
                    token.setUsed(true);
                    authTokenRepository.save(token);
                });
    }

    @Override
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), account.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }

        account.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        accountRepository.save(account);
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with email: " + email));

        AuthToken resetToken = AuthToken.builder()
                .account(account)
                .type(TokenType.PASSWORD_RESET)
                .tokenValue(UUID.randomUUID().toString())
                .expiredAt(LocalDateTime.now().plusMinutes(15))
                .isUsed(false)
                .build();
        authTokenRepository.save(resetToken);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        AuthToken storedToken = authTokenRepository
                .findByTokenValueAndType(request.getToken(), TokenType.PASSWORD_RESET)
                .orElseThrow(() -> new BadRequestException("Invalid password reset token"));

        if (storedToken.isUsed() || storedToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Password reset token is expired or already used");
        }

        Account account = storedToken.getAccount();
        account.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        accountRepository.save(account);

        storedToken.setUsed(true);
        authTokenRepository.save(storedToken);
    }

    private AuthResponse issueAuthTokens(Account account, User user) {
        CustomUserDetails userDetails = new CustomUserDetails(account);
        String accessToken = jwtService.generateToken(
                Map.of("role", account.getRole().name(), "accountId", account.getId()),
                userDetails
        );

        String refreshTokenValue = UUID.randomUUID().toString();
        AuthToken refreshToken = AuthToken.builder()
                .account(account)
                .type(TokenType.REFRESH_TOKEN)
                .tokenValue(refreshTokenValue)
                .expiredAt(LocalDateTime.now().plus(jwtService.getRefreshExpirationMs(), ChronoUnit.MILLIS))
                .isUsed(false)
                .build();
        authTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue)
                .tokenType("Bearer")
                .expiresInMs(jwtService.getExpirationMs())
                .user(authMapper.toUserSummary(account, user))
                .build();
    }
}
