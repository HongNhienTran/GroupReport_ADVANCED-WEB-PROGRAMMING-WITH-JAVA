package com.sweetlab.backend.controller;

import com.sweetlab.backend.dto.request.AiChatRequest;
import com.sweetlab.backend.dto.response.AiChatMessageResponse;
import com.sweetlab.backend.dto.response.AiChatResponse;
import com.sweetlab.backend.dto.response.ApiResponse;
import com.sweetlab.backend.exception.UnauthorizedException;
import com.sweetlab.backend.security.CustomUserDetails;
import com.sweetlab.backend.service.AiChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(name = "AI Chatbot", description = "Trợ lý tư vấn Sweetie (Spring AI + Groq + Tool Calling + Vector RAG)")
public class AiChatController {

    private final AiChatService aiChatService;

    @PostMapping("/chat")
    @Operation(summary = "Gửi tin nhắn tới trợ lý AI Sweetie (yêu cầu đăng nhập)")
    public ResponseEntity<ApiResponse<AiChatResponse>> chat(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody AiChatRequest request
    ) {
        if (userDetails == null) {
            throw new UnauthorizedException("Vui lòng đăng nhập để sử dụng trợ lý AI Sweetie");
        }
        return ResponseEntity.ok(ApiResponse.ok(
                aiChatService.chat(userDetails.getAccountId(), request),
                "AI response generated"
        ));
    }

    @GetMapping("/sessions/{sessionId}/messages")
    @Operation(summary = "Lấy lịch sử tin nhắn của phiên chat")
    public ResponseEntity<ApiResponse<List<AiChatMessageResponse>>> getSessionMessages(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long sessionId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                aiChatService.getSessionMessages(userDetails.getAccountId(), sessionId),
                "Messages fetched"
        ));
    }
}
