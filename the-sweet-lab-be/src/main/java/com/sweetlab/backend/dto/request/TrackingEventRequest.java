package com.sweetlab.backend.dto.request;

import com.sweetlab.backend.enums.BehaviorActionType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrackingEventRequest {

    private String guestSessionId;

    private Long productId;

    @NotNull(message = "Action type is required")
    private BehaviorActionType actionType;

    private String keyword;
}
