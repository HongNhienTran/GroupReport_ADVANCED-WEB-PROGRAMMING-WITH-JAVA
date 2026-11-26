package com.sweetlab.backend.dto.request;

import com.sweetlab.backend.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * Admin / callback request payload for updating payment status.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdatePaymentStatusRequest {

    @NotNull(message = "Trạng thái thanh toán không được để trống")
    private PaymentStatus status;

    @Size(max = 100, message = "Mã giao dịch tối đa 100 ký tự")
    private String transactionCode;
}
