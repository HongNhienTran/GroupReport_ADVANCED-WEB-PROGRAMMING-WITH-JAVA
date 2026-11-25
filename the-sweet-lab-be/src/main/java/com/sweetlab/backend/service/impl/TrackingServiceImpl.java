package com.sweetlab.backend.service.impl;

import com.sweetlab.backend.dto.request.TrackingEventRequest;
import com.sweetlab.backend.entity.Product;
import com.sweetlab.backend.entity.User;
import com.sweetlab.backend.entity.UserBehaviorLog;
import com.sweetlab.backend.exception.BadRequestException;
import com.sweetlab.backend.repository.ProductRepository;
import com.sweetlab.backend.repository.UserBehaviorLogRepository;
import com.sweetlab.backend.repository.UserRepository;
import com.sweetlab.backend.service.TrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TrackingServiceImpl implements TrackingService {

    private final UserBehaviorLogRepository behaviorLogRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public void trackEvent(Long accountId, TrackingEventRequest request) {
        User user = null;
        if (accountId != null) {
            user = userRepository.findByAccountId(accountId).orElse(null);
        }

        String guestSessionId = request.getGuestSessionId();
        if (user == null && (guestSessionId == null || guestSessionId.isBlank())) {
            throw new BadRequestException("guestSessionId is required for anonymous tracking");
        }

        Product product = null;
        if (request.getProductId() != null) {
            product = productRepository.findById(request.getProductId()).orElse(null);
        }

        UserBehaviorLog log = UserBehaviorLog.builder()
                .user(user)
                .guestSessionId(guestSessionId != null ? guestSessionId.trim() : null)
                .product(product)
                .actionType(request.getActionType())
                .keyword(request.getKeyword() != null ? request.getKeyword().trim() : null)
                .weight(request.getActionType().getWeight())
                .build();

        behaviorLogRepository.save(log);
    }
}
