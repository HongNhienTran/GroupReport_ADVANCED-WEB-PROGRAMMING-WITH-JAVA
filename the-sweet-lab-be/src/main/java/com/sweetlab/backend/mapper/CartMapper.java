package com.sweetlab.backend.mapper;

import com.sweetlab.backend.dto.response.CartResponse;
import com.sweetlab.backend.entity.Cart;
import com.sweetlab.backend.entity.CartItem;
import com.sweetlab.backend.entity.Product;
import com.sweetlab.backend.entity.ProductImage;
import com.sweetlab.backend.entity.ProductVariant;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Component
public class CartMapper {

    public CartResponse toResponse(Cart cart) {
        List<CartResponse.CartItemResponse> itemResponses = cart.getItems().stream()
                .map(this::toItemResponse)
                .toList();

        int totalQty = itemResponses.stream()
                .mapToInt(CartResponse.CartItemResponse::getQuantity)
                .sum();

        BigDecimal subtotal = itemResponses.stream()
                .map(CartResponse.CartItemResponse::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .cartId(cart.getId())
                .totalQuantity(totalQty)
                .subtotal(subtotal)
                .items(itemResponses)
                .build();
    }

    private CartResponse.CartItemResponse toItemResponse(CartItem item) {
        ProductVariant variant = item.getProductVariant();
        Product product = variant.getProduct();

        String thumbnail = product.getImages().stream()
                .filter(ProductImage::isThumbnail)
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElseGet(() -> product.getImages().stream()
                        .min(Comparator.comparingInt(ProductImage::getDisplayOrder))
                        .map(ProductImage::getImageUrl)
                        .orElse(null));

        BigDecimal lineTotal = variant.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

        return CartResponse.CartItemResponse.builder()
                .productId(product.getId())
                .productSlug(product.getSlug())
                .productName(product.getName())
                .categoryName(product.getCategory().getName())
                .variantId(variant.getId())
                .variantName(variant.getName())
                .sku(variant.getSku())
                .weightGram(variant.getWeightGram())
                .thumbnailUrl(thumbnail)
                .unitPrice(variant.getPrice())
                .quantity(item.getQuantity())
                .lineTotal(lineTotal)
                .stockQuantity(variant.getStockQuantity())
                .build();
    }
}
