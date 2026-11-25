package com.sweetlab.backend.service;

import com.sweetlab.backend.dto.request.AiChatRequest;
import com.sweetlab.backend.dto.response.AiChatMessageResponse;
import com.sweetlab.backend.dto.response.AiChatResponse;

import java.util.List;

public interface AiChatService {

    AiChatResponse chat(Long accountId, AiChatRequest request);

    List<AiChatMessageResponse> getSessionMessages(Long accountId, Long sessionId);
}
