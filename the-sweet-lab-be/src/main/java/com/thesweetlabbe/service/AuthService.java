package com.thesweetlabbe.service;

import com.thesweetlabbe.dto.*;
import com.thesweetlabbe.dto.UserDTO;

import java.util.UUID;

public interface AuthService {

    String register(RegisterRequest request);

    String verifyEmail(VerifyEmailRequest request);

    String resendVerificationEmail(ResendVerificationRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    UserDTO getCurrentUser(UUID userId);
}
