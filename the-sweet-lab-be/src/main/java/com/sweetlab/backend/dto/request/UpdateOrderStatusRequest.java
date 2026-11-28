package com.sweetlab.backend.dto.request;

import com.sweetlab.backend.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * Admin request payload for updating an order's lifecycle status.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateOrderStatusRequest {

    @NotNull(message = "Trạng thái đơn hàng không được để trống")
    private OrderStatus status;

    @Size(max = 500, message = "Ghi chú tối đa 500 ký tự")
    private String note;
}
