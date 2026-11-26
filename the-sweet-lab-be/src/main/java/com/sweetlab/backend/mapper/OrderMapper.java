package com.sweetlab.backend.mapper;

import com.sweetlab.backend.dto.response.OrderItemResponse;
import com.sweetlab.backend.dto.response.OrderResponse;
import com.sweetlab.backend.dto.response.PaymentResponse;
import com.sweetlab.backend.dto.response.ShipmentResponse;
import com.sweetlab.backend.entity.*;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

/**
 * Maps {@link Order}, {@link OrderItem}, {@link Payment}, and {@link Shipment} entities
 * to API response DTOs, dynamically computing derived {@code subtotal} and {@code totalAmount}.
 */
@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems() == null
                ? List.of()
                : order.getItems().stream()
                        .map(this::toItemResponse)
                        .toList();

        int totalQuantity = itemResponses.stream()
                .mapToInt(OrderItemResponse::getQuantity)
                .sum();

        BigDecimal subtotal = itemResponses.stream()
                .map(OrderItemResponse::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal shippingFee = order.getShippingFee() != null ? order.getShippingFee() : BigDecimal.ZERO;
        BigDecimal discountAmount = order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO;
        BigDecimal totalAmount = subtotal.subtract(discountAmount)
                .max(BigDecimal.ZERO)
                .add(shippingFee);

        User user = order.getUser();
        String customerName = user != null ? user.getFullName() : null;
        String customerEmail = (user != null && user.getAccount() != null) ? user.getAccount().getEmail() : null;
        String voucherCode = order.getVoucher() != null ? order.getVoucher().getCode() : null;

        return OrderResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .userId(user != null ? user.getId() : null)
                .customerName(customerName)
                .customerEmail(customerEmail)
                .status(order.getStatus())
                .note(order.getNote())
                .voucherCode(voucherCode)
                .shippingRecipientName(order.getShippingRecipientName())
                .shippingPhone(order.getShippingPhone())
                .shippingAddress(order.getShippingAddress())
                .totalQuantity(totalQuantity)
                .subtotal(subtotal)
                .shippingFee(shippingFee)
                .discountAmount(discountAmount)
                .totalAmount(totalAmount)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(itemResponses)
                .payment(toPaymentResponse(order.getPayment()))
                .shipment(toShipmentResponse(order.getShipment()))
                .build();
    }

    public OrderItemResponse toItemResponse(OrderItem item) {
        ProductVariant variant = item.getProductVariant();
        Product product = variant != null ? variant.getProduct() : null;

        String thumbnail = null;
        if (product != null && product.getImages() != null) {
            thumbnail = product.getImages().stream()
                    .filter(ProductImage::isThumbnail)
                    .map(ProductImage::getImageUrl)
                    .findFirst()
                    .orElseGet(() -> product.getImages().stream()
                            .min(Comparator.comparingInt(ProductImage::getDisplayOrder))
                            .map(ProductImage::getImageUrl)
                            .orElse(null));
        }

        BigDecimal unitPrice = item.getUnitPrice() != null ? item.getUnitPrice() : BigDecimal.ZERO;
        BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));

        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(product != null ? product.getId() : null)
                .productSlug(product != null ? product.getSlug() : null)
                .thumbnailUrl(thumbnail)
                .variantId(variant != null ? variant.getId() : null)
                .sku(variant != null ? variant.getSku() : null)
                .productName(item.getProductName())
                .variantName(item.getVariantName())
                .unitPrice(unitPrice)
                .quantity(item.getQuantity())
                .lineTotal(lineTotal)
                .build();
    }

    public PaymentResponse toPaymentResponse(Payment payment) {
        if (payment == null) {
            return null;
        }
        return PaymentResponse.builder()
                .id(payment.getId())
                .transactionCode(payment.getTransactionCode())
                .method(payment.getMethod())
                .status(payment.getStatus())
                .amount(payment.getAmount())
                .paidAt(payment.getPaidAt())
                .build();
    }

    public ShipmentResponse toShipmentResponse(Shipment shipment) {
        if (shipment == null) {
            return null;
        }
        return ShipmentResponse.builder()
                .id(shipment.getId())
                .trackingCode(shipment.getTrackingCode())
                .carrier(shipment.getCarrier())
                .status(shipment.getStatus())
                .estimatedDeliveryAt(shipment.getEstimatedDeliveryAt())
                .shippedAt(shipment.getShippedAt())
                .deliveredAt(shipment.getDeliveredAt())
                .build();
    }
}
