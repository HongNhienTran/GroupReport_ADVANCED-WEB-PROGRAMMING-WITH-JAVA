package com.sweetlab.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChatResponse {
    private Long sessionId;
    private String reply;
    private List<ProductSummaryResponse> suggestedProducts;
}
