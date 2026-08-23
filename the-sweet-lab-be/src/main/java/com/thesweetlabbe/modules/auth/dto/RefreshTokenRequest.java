package com.thesweetlabbe.modules.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu cấp lại Access Token từ Refresh Token")
public class RefreshTokenRequest {

    @NotBlank(message = "RefreshToken không được để trống")
    @Schema(description = "Refresh token đã nhận khi đăng nhập")
    private String refreshToken;
}
