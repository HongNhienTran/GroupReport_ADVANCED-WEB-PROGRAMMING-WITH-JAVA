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
@Schema(description = "Yêu cầu kích hoạt / xác thực email")
public class VerifyEmailRequest {

    @NotBlank(message = "Token hoặc mã xác thực không được để trống")
    @Schema(description = "Mã token hoặc OTP xác thực", example = "SWEET-98a76b5c")
    private String token;
}
