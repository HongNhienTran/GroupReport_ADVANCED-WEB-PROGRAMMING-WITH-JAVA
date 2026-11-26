package com.sweetlab.backend.dto.request;

import com.sweetlab.backend.enums.ShipmentStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Admin request payload for updating order shipment tracking details and status.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateShipmentRequest {

    @Size(max = 100, message = "Tên đơn vị vận chuyển tối đa 100 ký tự")
    private String carrier;

    @Size(max = 100, message = "Mã vận đơn tối đa 100 ký tự")
    private String trackingCode;

    @NotNull(message = "Trạng thái vận chuyển không được để trống")
    private ShipmentStatus status;

    private LocalDateTime estimatedDeliveryAt;
}
