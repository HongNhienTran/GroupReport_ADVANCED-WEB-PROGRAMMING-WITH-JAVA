package com.sweetlab.backend.service.impl;

import com.sweetlab.backend.dto.request.CartItemRequest;
import com.sweetlab.backend.dto.request.UpdateCartItemRequest;
import com.sweetlab.backend.dto.response.CartResponse;
import com.sweetlab.backend.entity.*;
import com.sweetlab.backend.enums.BehaviorActionType;
import com.sweetlab.backend.exception.BadRequestException;
import com.sweetlab.backend.exception.ResourceNotFoundException;
import com.sweetlab.backend.mapper.CartMapper;
import com.sweetlab.backend.repository.*;
import com.sweetlab.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final UserBehaviorLogRepository behaviorLogRepository;
    private final CartMapper cartMapper;

    @Override
    @Transactional
    public CartResponse getCart(Long accountId, String guestSessionId) {
        Cart cart = resolveOrCreateCart(accountId, guestSessionId);
        return cartMapper.toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addItem(Long accountId, CartItemRequest request) {
        Cart cart = resolveOrCreateCart(accountId, request.getGuestSessionId());
        ProductVariant variant = resolveVariant(request);

        if (!variant.isActive()) {
            throw new BadRequestException("Product variant is no longer active");
        }

        CartItem existingItem = cart.getItems().stream()
                .filter(i -> i.getProductVariant().getId().equals(variant.getId()))
                .findFirst()
                .orElse(null);

        int newQty = (existingItem != null ? existingItem.getQuantity() : 0) + request.getQuantity();
        if (newQty > variant.getStockQuantity()) {
            throw new BadRequestException("Requested quantity exceeds available stock (" + variant.getStockQuantity() + ")");
        }

        if (existingItem != null) {
            existingItem.setQuantity(newQty);
        } else {
            CartItem newItem = CartItem.builder()
                    .id(new CartItemId(cart.getId(), variant.getId()))
                    .cart(cart)
                    .productVariant(variant)
                    .quantity(newQty)
                    .build();
            cart.getItems().add(newItem);
        }

        Cart saved = cartRepository.save(cart);

        behaviorLogRepository.save(UserBehaviorLog.builder()
                .user(cart.getUser())
                .guestSessionId(cart.getGuestSessionId())
                .product(variant.getProduct())
                .actionType(BehaviorActionType.ADD_TO_CART)
                .weight(BehaviorActionType.ADD_TO_CART.getWeight())
                .build());

        return cartMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public CartResponse updateItemQuantity(Long accountId, Long variantId, UpdateCartItemRequest request) {
        Cart cart = resolveOrCreateCart(accountId, request.getGuestSessionId());

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProductVariant().getId().equals(variantId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Item not found in cart"));

        if (request.getQuantity() <= 0) {
            cart.getItems().remove(item);
        } else {
            int stock = item.getProductVariant().getStockQuantity();
            if (request.getQuantity() > stock) {
                throw new BadRequestException("Requested quantity exceeds available stock (" + stock + ")");
            }
            item.setQuantity(request.getQuantity());
        }

        return cartMapper.toResponse(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public CartResponse removeItem(Long accountId, Long variantId, String guestSessionId) {
        Cart cart = resolveOrCreateCart(accountId, guestSessionId);
        cart.getItems().removeIf(i -> i.getProductVariant().getId().equals(variantId));
        return cartMapper.toResponse(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public CartResponse clearCart(Long accountId, String guestSessionId) {
        Cart cart = resolveOrCreateCart(accountId, guestSessionId);
        cart.getItems().clear();
        return cartMapper.toResponse(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public CartResponse mergeGuestCart(Long accountId, String guestSessionId) {
        Cart userCart = resolveOrCreateCart(accountId, null);
        if (guestSessionId == null || guestSessionId.isBlank()) {
            return cartMapper.toResponse(userCart);
        }

        cartRepository.findByGuestSessionId(guestSessionId.trim()).ifPresent(guestCart -> {
            for (CartItem guestItem : guestCart.getItems()) {
                ProductVariant variant = guestItem.getProductVariant();
                CartItem target = userCart.getItems().stream()
                        .filter(i -> i.getProductVariant().getId().equals(variant.getId()))
                        .findFirst()
                        .orElse(null);
                int mergedQty = Math.min(
                        variant.getStockQuantity(),
                        (target != null ? target.getQuantity() : 0) + guestItem.getQuantity()
                );
                if (mergedQty <= 0) continue;

                if (target != null) {
                    target.setQuantity(mergedQty);
                } else {
                    userCart.getItems().add(CartItem.builder()
                            .id(new CartItemId(userCart.getId(), variant.getId()))
                            .cart(userCart)
                            .productVariant(variant)
                            .quantity(mergedQty)
                            .build());
                }
            }
            cartRepository.delete(guestCart);
        });

        return cartMapper.toResponse(cartRepository.save(userCart));
    }

    private Cart resolveOrCreateCart(Long accountId, String guestSessionId) {
        if (accountId != null) {
            User user = userRepository.findByAccountId(accountId)
                    .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));
            return cartRepository.findByUserId(user.getId())
                    .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
        }

        if (guestSessionId == null || guestSessionId.isBlank()) {
            throw new BadRequestException("guestSessionId is required for guest cart");
        }

        String normalizedGuest = guestSessionId.trim();
        return cartRepository.findByGuestSessionId(normalizedGuest)
                .orElseGet(() -> cartRepository.save(Cart.builder().guestSessionId(normalizedGuest).build()));
    }

    private ProductVariant resolveVariant(CartItemRequest request) {
        if (request.getVariantId() != null) {
            return variantRepository.findById(request.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product variant not found"));
        }
        if (request.getProductId() != null) {
            Product product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            return product.getVariants().stream()
                    .filter(ProductVariant::isActive)
                    .findFirst()
                    .orElseThrow(() -> new BadRequestException("Product has no active variants"));
        }
        throw new BadRequestException("variantId or productId is required");
    }
}
