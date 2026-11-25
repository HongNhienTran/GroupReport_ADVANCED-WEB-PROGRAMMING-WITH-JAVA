package com.sweetlab.backend.service.impl;

import com.sweetlab.backend.ai.ProductVectorService;
import com.sweetlab.backend.dto.response.ProductSummaryResponse;
import com.sweetlab.backend.entity.NutritionTag;
import com.sweetlab.backend.entity.Product;
import com.sweetlab.backend.entity.User;
import com.sweetlab.backend.entity.UserBehaviorLog;
import com.sweetlab.backend.enums.Allergen;
import com.sweetlab.backend.enums.ProductStatus;
import com.sweetlab.backend.mapper.ProductMapper;
import com.sweetlab.backend.repository.NutritionProfileRepository;
import com.sweetlab.backend.repository.ProductRepository;
import com.sweetlab.backend.repository.UserBehaviorLogRepository;
import com.sweetlab.backend.repository.UserRepository;
import com.sweetlab.backend.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final UserRepository userRepository;
    private final NutritionProfileRepository nutritionProfileRepository;
    private final UserBehaviorLogRepository behaviorLogRepository;
    private final ProductRepository productRepository;
    private final ProductVectorService productVectorService;
    private final ProductMapper productMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ProductSummaryResponse> getPersonalizedRecommendations(
            Long accountId,
            String guestSessionId,
            Long categoryId,
            int limit
    ) {
        int safeLimit = Math.max(1, Math.min(limit, 24));
        Set<Allergen> excludedAllergens = new HashSet<>();
        List<UserBehaviorLog> recentLogs = List.of();

        if (accountId != null) {
            User user = userRepository.findByAccountId(accountId).orElse(null);
            if (user != null) {
                nutritionProfileRepository.findByUserId(user.getId())
                        .ifPresent(profile -> excludedAllergens.addAll(profile.getAllergens()));
                recentLogs = behaviorLogRepository.findByUserIdOrderByCreatedAtDesc(
                        user.getId(), PageRequest.of(0, 10));
            }
        } else if (guestSessionId != null && !guestSessionId.isBlank()) {
            recentLogs = behaviorLogRepository.findByGuestSessionIdOrderByCreatedAtDesc(
                    guestSessionId.trim(), PageRequest.of(0, 10));
        }

        List<Long> candidateIds = new ArrayList<>();

        // 1. Semantic Vector Search based on user's recent tracking logs
        if (!recentLogs.isEmpty()) {
            String profileQuery = buildSemanticQueryFromLogs(recentLogs);
            if (!profileQuery.isBlank()) {
                candidateIds.addAll(productVectorService.searchSimilarProductIds(profileQuery, safeLimit * 3));
            }
        }

        // 2. Popular interacted products from real tracking logs
        if (candidateIds.size() < safeLimit) {
            List<Long> popularIds = behaviorLogRepository.findTopInteractedProductIds(PageRequest.of(0, safeLimit * 2));
            for (Long id : popularIds) {
                if (!candidateIds.contains(id)) {
                    candidateIds.add(id);
                }
            }
        }

        // Map candidates preserving order and applying category + allergen safety filters
        Map<Long, Product> productMap = productRepository.findAllById(candidateIds).stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        List<ProductSummaryResponse> results = new ArrayList<>();
        Set<Long> addedIds = new HashSet<>();

        for (Long id : candidateIds) {
            Product product = productMap.get(id);
            if (isEligible(product, categoryId, excludedAllergens) && addedIds.add(product.getId())) {
                results.add(productMapper.toSummary(product));
                if (results.size() >= safeLimit) {
                    return results;
                }
            }
        }

        // 3. Cold-start fallback from active catalog in MariaDB
        List<Product> fallbackProducts = productRepository.findAll(PageRequest.of(0, safeLimit * 3)).getContent();
        for (Product product : fallbackProducts) {
            if (isEligible(product, categoryId, excludedAllergens) && addedIds.add(product.getId())) {
                results.add(productMapper.toSummary(product));
                if (results.size() >= safeLimit) {
                    break;
                }
            }
        }

        return results;
    }

    private String buildSemanticQueryFromLogs(List<UserBehaviorLog> logs) {
        StringBuilder sb = new StringBuilder();
        for (UserBehaviorLog log : logs) {
            if (log.getKeyword() != null && !log.getKeyword().isBlank()) {
                sb.append(log.getKeyword()).append(' ');
            }
            if (log.getProduct() != null) {
                Product p = log.getProduct();
                sb.append(p.getName()).append(' ')
                  .append(p.getCategory().getName()).append(' ');
                p.getNutritionTags().stream()
                        .map(NutritionTag::getName)
                        .forEach(tag -> sb.append(tag).append(' '));
            }
        }
        return sb.toString().trim();
    }

    private boolean isEligible(Product product, Long categoryId, Set<Allergen> excludedAllergens) {
        if (product == null || product.getStatus() != ProductStatus.ACTIVE) {
            return false;
        }
        if (categoryId != null && !product.getCategory().getId().equals(categoryId)) {
            return false;
        }
        if (!excludedAllergens.isEmpty()) {
            for (Allergen allergen : product.getAllergens()) {
                if (excludedAllergens.contains(allergen)) {
                    return false;
                }
            }
        }
        return true;
    }
}
