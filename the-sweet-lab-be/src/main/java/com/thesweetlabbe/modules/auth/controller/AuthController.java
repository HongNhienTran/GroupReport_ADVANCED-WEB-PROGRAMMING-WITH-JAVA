package com.thesweetlabbe.modules.auth.controller;

import com.thesweetlabbe.common.dto.ApiResponse;
import com.thesweetlabbe.common.security.UserPrincipal;
import com.thesweetlabbe.modules.auth.dto.*;
import com.thesweetlabbe.modules.auth.service.AuthService;
import com.thesweetlabbe.modules.user.dto.UserDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication Module", description = "Các API đăng ký, xác thực kích hoạt email, đăng nhập JWT và quản lý phiên")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản người dùng mới (Customer)", description = "Hệ thống kiểm tra email không trùng lặp, lưu dữ liệu và gửi email HTML xác thực kích hoạt.")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
        String result = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(result, null));
    }

    @PostMapping("/verify-email")
    @Operation(summary = "Kích hoạt tài khoản bằng mã Token / OTP gửi qua Email", description = "Xác nhận mã kích hoạt, chuyển trạng thái tài khoản sang ACTIVE để có thể đăng nhập.")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        String result = authService.verifyEmail(request);
        return ResponseEntity.ok(ApiResponse.success(result, null));
    }

    @PostMapping("/resend-verification")
    @Operation(summary = "Gửi lại mã/email kích hoạt tài khoản", description = "Dành cho trường hợp token hết hạn hoặc chưa nhận được email.")
    public ResponseEntity<ApiResponse<String>> resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        String result = authService.resendVerificationEmail(request);
        return ResponseEntity.ok(ApiResponse.success(result, null));
    }

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập hệ thống", description = "Xác thực email và mật khẩu, kiểm tra tài khoản đã kích hoạt chưa và trả về Access Token JWT cùng Refresh Token.")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", response));
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Cấp lại Access Token từ Refresh Token", description = "Sử dụng Refresh Token hợp lệ để lấy Access Token mới mà không cần đăng nhập lại.")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Cấp mới token thành công", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Lấy thông tin tài khoản hiện tại", description = "Yêu cầu Bearer JWT Token ở header Authorization.", security = @SecurityRequirement(name = "BearerAuth"))
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserDTO userDTO = authService.getCurrentUser(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(userDTO));
    }
}
