package com.sweetlab.backend.dto.request;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCartItemRequest {

    private String guestSessionId;

    @Min(value = 0, message = "Quantity cannot be negative")
    private int quantity;
}
