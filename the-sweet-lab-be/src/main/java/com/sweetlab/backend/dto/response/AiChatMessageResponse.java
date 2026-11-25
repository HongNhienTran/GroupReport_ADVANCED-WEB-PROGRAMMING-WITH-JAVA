package com.sweetlab.backend.dto.response;

import com.sweetlab.backend.enums.SenderType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChatMessageResponse {
    private Long id;
    private SenderType senderType;
    private String content;
    private LocalDateTime createdAt;
}
