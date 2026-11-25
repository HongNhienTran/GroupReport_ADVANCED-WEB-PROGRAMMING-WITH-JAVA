package com.sweetlab.backend.service.impl;

import com.sweetlab.backend.ai.ProductVectorService;
import com.sweetlab.backend.ai.SweetieTools;
import com.sweetlab.backend.dto.request.AiChatRequest;
import com.sweetlab.backend.dto.response.AiChatMessageResponse;
import com.sweetlab.backend.dto.response.AiChatResponse;
import com.sweetlab.backend.dto.response.ProductSummaryResponse;
import com.sweetlab.backend.entity.AiChatMessage;
import com.sweetlab.backend.entity.AiChatSession;
import com.sweetlab.backend.entity.Product;
import com.sweetlab.backend.entity.User;
import com.sweetlab.backend.enums.ChatSessionStatus;
import com.sweetlab.backend.enums.SenderType;
import com.sweetlab.backend.exception.ForbiddenException;
import com.sweetlab.backend.exception.ResourceNotFoundException;
import com.sweetlab.backend.exception.UnauthorizedException;
import com.sweetlab.backend.mapper.ProductMapper;
import com.sweetlab.backend.repository.AiChatMessageRepository;
import com.sweetlab.backend.repository.AiChatSessionRepository;
import com.sweetlab.backend.repository.ProductRepository;
import com.sweetlab.backend.repository.UserRepository;
import com.sweetlab.backend.service.AiChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AiChatServiceImpl implements AiChatService {

    private static final String SYSTEM_PROMPT = """
            Bạn là Sweetie — trợ lý tư vấn dinh dưỡng và bánh kẹo healthy của The Sweet Lab.
            Hãy trả lời thân thiện, ngắn gọn bằng tiếng Việt.
            Luôn dùng các tool được cung cấp để tra cứu sản phẩm thật, giá bán, thành phần, giá trị dinh dưỡng và hồ sơ người dùng.
            Tuyệt đối không tự bịa ra sản phẩm hoặc giá không có trong hệ thống.
            Khi gợi ý sản phẩm, hãy nêu rõ tên sản phẩm, điểm nổi bật dinh dưỡng và lưu ý dị ứng nếu có.
            """;

    private final ChatClient.Builder chatClientBuilder;
    private final SweetieTools sweetieTools;
    private final ProductVectorService productVectorService;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final UserRepository userRepository;
    private final AiChatSessionRepository sessionRepository;
    private final AiChatMessageRepository messageRepository;

    @Override
    @Transactional
    public AiChatResponse chat(Long accountId, AiChatRequest request) {
        if (accountId == null) {
            throw new UnauthorizedException("Authentication required to chat with Sweetie");
        }

        User user = userRepository.findByAccountId(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));

        AiChatSession session;
        List<Message> historyMessages = new ArrayList<>();

        if (request.getSessionId() != null) {
            session = sessionRepository.findById(request.getSessionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Chat session not found"));
            if (!session.getUser().getId().equals(user.getId())) {
                throw new ForbiddenException("Access denied to this chat session");
            }
        } else {
            session = sessionRepository.save(AiChatSession.builder()
                    .user(user)
                    .status(ChatSessionStatus.ACTIVE)
                    .build());
        }

        List<AiChatMessage> past = messageRepository.findBySessionIdOrderByCreatedAtAsc(session.getId());
        int start = Math.max(0, past.size() - 6);
        for (AiChatMessage msg : past.subList(start, past.size())) {
            if (msg.getSenderType() == SenderType.USER) {
                historyMessages.add(new UserMessage(msg.getContent()));
            } else if (msg.getSenderType() == SenderType.ASSISTANT) {
                historyMessages.add(new AssistantMessage(msg.getContent()));
            }
        }

        String contextHint = String.format("[Context: userId=%d] ", user.getId());

        String reply = chatClientBuilder.build()
                .prompt()
                .system(SYSTEM_PROMPT)
                .messages(historyMessages)
                .user(contextHint + request.getMessage().trim())
                .tools(sweetieTools)
                .call()
                .content();

        messageRepository.save(AiChatMessage.builder()
                .session(session)
                .senderType(SenderType.USER)
                .content(request.getMessage().trim())
                .build());
        messageRepository.save(AiChatMessage.builder()
                .session(session)
                .senderType(SenderType.ASSISTANT)
                .content(reply)
                .build());
        session.setLastMessageAt(LocalDateTime.now());
        sessionRepository.save(session);

        List<Long> matchedIds = productVectorService.searchSimilarProductIds(request.getMessage(), 3);
        List<ProductSummaryResponse> suggested = matchedIds.isEmpty()
                ? List.of()
                : productRepository.findAllById(matchedIds).stream()
                        .map(productMapper::toSummary)
                        .toList();

        return AiChatResponse.builder()
                .sessionId(session.getId())
                .reply(reply)
                .suggestedProducts(suggested)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AiChatMessageResponse> getSessionMessages(Long accountId, Long sessionId) {
        User user = userRepository.findByAccountId(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        AiChatSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat session not found"));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("Access denied to this chat session");
        }

        return messageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId).stream()
                .map(m -> AiChatMessageResponse.builder()
                        .id(m.getId())
                        .senderType(m.getSenderType())
                        .content(m.getContent())
                        .createdAt(m.getCreatedAt())
                        .build())
                .toList();
    }
}
