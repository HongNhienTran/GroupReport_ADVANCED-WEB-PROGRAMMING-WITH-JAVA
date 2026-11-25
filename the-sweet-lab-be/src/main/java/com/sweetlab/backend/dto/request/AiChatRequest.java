package com.sweetlab.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiChatRequest {

    private Long sessionId;

    private String guestSessionId;

    @NotBlank(message = "Message must not be blank")
    private String message;
}
