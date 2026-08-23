package com.thesweetlabbe.modules.auth.service.impl;

import com.thesweetlabbe.common.enums.ErrorCode;
import com.thesweetlabbe.common.exception.AppException;
import com.thesweetlabbe.common.security.JwtTokenProvider;
import com.thesweetlabbe.modules.auth.dto.*;
import com.thesweetlabbe.modules.auth.entity.VerificationToken;
import com.thesweetlabbe.modules.auth.enums.TokenType;
import com.thesweetlabbe.modules.auth.repository.VerificationTokenRepository;
import com.thesweetlabbe.modules.auth.service.AuthService;
import com.thesweetlabbe.modules.notification.service.MailService;
import com.thesweetlabbe.modules.user.dto.UserDTO;
import com.thesweetlabbe.modules.user.entity.NutritionProfile;
import com.thesweetlabbe.modules.user.entity.User;
import com.thesweetlabbe.modules.user.entity.UserProfile;
import com.thesweetlabbe.modules.user.enums.AccountStatus;
import com.thesweetlabbe.modules.user.enums.UserRole;
import com.thesweetlabbe.modules.user.repository.UserRepository;
import com.thesweetlabbe.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final VerificationTokenRepository tokenRepository;
    private final UserService userService;
    private final MailService mailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${app.mail.verification-token-expiration-minutes:15}")
    private int tokenExpirationMinutes;

    @Override
    @Transactional
    public String register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        // Tạo User mới
        User user = User.builder()
                .email(normalizedEmail)
                .fullName(request.getFullName().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.ROLE_CUSTOMER)
                .status(AccountStatus.PENDING_VERIFICATION)
                .build();

        // Tạo UserProfile rỗng 1-1
        UserProfile userProfile = UserProfile.builder()
                .user(user)
                .build();
        user.setProfile(userProfile);

        // Tạo NutritionProfile rỗng 1-1
        NutritionProfile nutritionProfile = NutritionProfile.builder()
                .user(user)
                .build();
        user.setNutritionProfile(nutritionProfile);

        User savedUser = userRepository.save(user);

        // Sinh Verification Token
        String tokenValue = UUID.randomUUID().toString();
        VerificationToken verificationToken = VerificationToken.builder()
                .token(tokenValue)
                .user(savedUser)
                .tokenType(TokenType.EMAIL_VERIFICATION)
                .expiryDate(Instant.now().plus(tokenExpirationMinutes, ChronoUnit.MINUTES))
                .isUsed(false)
                .build();

        tokenRepository.save(verificationToken);

        // Gửi email kích hoạt
        mailService.sendVerificationEmail(savedUser.getEmail(), savedUser.getFullName(), tokenValue);

        return "Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản của bạn.";
    }

    @Override
    @Transactional
    public String verifyEmail(VerifyEmailRequest request) {
        VerificationToken verificationToken = tokenRepository.findByTokenAndTokenType(
                request.getToken().trim(),
                TokenType.EMAIL_VERIFICATION
        ).orElseThrow(() -> new AppException(ErrorCode.INVALID_TOKEN, "Mã kích hoạt không hợp lệ hoặc không tồn tại"));

        if (verificationToken.isUsed()) {
            throw new AppException(ErrorCode.INVALID_TOKEN, "Mã kích hoạt này đã được sử dụng");
        }

        if (verificationToken.isExpired()) {
            throw new AppException(ErrorCode.TOKEN_EXPIRED, "Mã kích hoạt đã hết hạn. Vui lòng yêu cầu gửi lại mã mới");
        }

        // Cập nhật trạng thái User thành ACTIVE
        User user = verificationToken.getUser();
        user.setStatus(AccountStatus.ACTIVE);
        userRepository.save(user);

        // Đánh dấu Token đã sử dụng
        verificationToken.setUsed(true);
        tokenRepository.save(verificationToken);

        return "Xác thực tài khoản thành công! Bạn có thể đăng nhập vào The Sweet Lab ngay bây giờ.";
    }

    @Override
    @Transactional
    public String resendVerificationEmail(ResendVerificationRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (user.getStatus() == AccountStatus.ACTIVE) {
            return "Tài khoản của bạn đã được kích hoạt từ trước. Hãy đăng nhập trực tiếp.";
        }

        // Tạo token mới
        String tokenValue = UUID.randomUUID().toString();
        VerificationToken verificationToken = VerificationToken.builder()
                .token(tokenValue)
                .user(user)
                .tokenType(TokenType.EMAIL_VERIFICATION)
                .expiryDate(Instant.now().plus(tokenExpirationMinutes, ChronoUnit.MINUTES))
                .isUsed(false)
                .build();

        tokenRepository.save(verificationToken);

        // Gửi lại email
        mailService.sendVerificationEmail(user.getEmail(), user.getFullName(), tokenValue);

        return "Mã kích hoạt mới đã được gửi tới email của bạn.";
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        User user = userRepository.findWithProfilesByEmail(normalizedEmail)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        if (user.getStatus() == AccountStatus.PENDING_VERIFICATION) {
            throw new AppException(ErrorCode.ACCOUNT_NOT_VERIFIED);
        }

        if (user.getStatus() == AccountStatus.BLOCKED) {
            throw new AppException(ErrorCode.ACCOUNT_BLOCKED);
        }

        // Sinh JWT Tokens
        String accessToken = jwtTokenProvider.generateAccessTokenFromUser(user.getId(), user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId(), user.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(userService.mapToDTO(user))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new AppException(ErrorCode.INVALID_TOKEN, "RefreshToken không hợp lệ hoặc đã hết hạn");
        }

        UUID userId = jwtTokenProvider.getUserIdFromJWT(refreshToken);
        User user = userRepository.findWithProfilesById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (user.getStatus() != AccountStatus.ACTIVE) {
            throw new AppException(ErrorCode.ACCOUNT_BLOCKED);
        }

        String newAccessToken = jwtTokenProvider.generateAccessTokenFromUser(user.getId(), user.getEmail());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(userService.mapToDTO(user))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getCurrentUser(UUID userId) {
        return userService.getUserProfile(userId);
    }
}
