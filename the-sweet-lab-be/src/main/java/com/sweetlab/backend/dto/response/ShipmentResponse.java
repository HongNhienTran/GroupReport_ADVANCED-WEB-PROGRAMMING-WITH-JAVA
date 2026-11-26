package com.sweetlab.backend.dto.response;

import com.sweetlab.backend.enums.ShipmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentResponse {

    private Long id;
    private String trackingCode;
    private String carrier;
    private ShipmentStatus status;
    private LocalDateTime estimatedDeliveryAt;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
}
