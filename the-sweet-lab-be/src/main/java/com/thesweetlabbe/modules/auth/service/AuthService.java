package com.thesweetlabbe.modules.auth.service;

import com.thesweetlabbe.modules.auth.dto.*;
import com.thesweetlabbe.modules.user.dto.UserDTO;

import java.util.UUID;

public interface AuthService {

    String register(RegisterRequest request);

    String verifyEmail(VerifyEmailRequest request);

    String resendVerificationEmail(ResendVerificationRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    UserDTO getCurrentUser(UUID userId);
}
