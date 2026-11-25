package com.sweetlab.backend.service;

import com.sweetlab.backend.dto.request.CartItemRequest;
import com.sweetlab.backend.dto.request.UpdateCartItemRequest;
import com.sweetlab.backend.dto.response.CartResponse;

public interface CartService {

    CartResponse getCart(Long accountId, String guestSessionId);

    CartResponse addItem(Long accountId, CartItemRequest request);

    CartResponse updateItemQuantity(Long accountId, Long variantId, UpdateCartItemRequest request);

    CartResponse removeItem(Long accountId, Long variantId, String guestSessionId);

    CartResponse clearCart(Long accountId, String guestSessionId);

    CartResponse mergeGuestCart(Long accountId, String guestSessionId);
}
