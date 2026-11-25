package com.sweetlab.backend.service;

import com.sweetlab.backend.dto.request.ChangePasswordRequest;
import com.sweetlab.backend.dto.request.ForgotPasswordRequest;
import com.sweetlab.backend.dto.request.LoginRequest;
import com.sweetlab.backend.dto.request.RefreshTokenRequest;
import com.sweetlab.backend.dto.request.RegisterRequest;
import com.sweetlab.backend.dto.request.ResetPasswordRequest;
import com.sweetlab.backend.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void logout(RefreshTokenRequest request);

    void changePassword(String email, ChangePasswordRequest request);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);
}
