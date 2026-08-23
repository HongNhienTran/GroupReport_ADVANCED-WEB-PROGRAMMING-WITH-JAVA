package com.thesweetlabbe.modules.auth.dto;

import com.thesweetlabbe.modules.user.dto.UserDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Kết quả xác thực trả về")
public class AuthResponse {

    @Schema(description = "Access Token dùng để gọi các API bảo mật")
    private String accessToken;

    @Schema(description = "Refresh Token dùng để làm mới Access Token")
    private String refreshToken;

    @Builder.Default
    @Schema(description = "Loại Token", example = "Bearer")
    private String tokenType = "Bearer";

    @Schema(description = "Thông tin tài khoản đăng nhập")
    private UserDTO user;
}
