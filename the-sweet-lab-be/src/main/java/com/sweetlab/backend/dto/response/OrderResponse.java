package com.sweetlab.backend.dto.response;

import com.sweetlab.backend.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long id;
    private String orderCode;
    private Long userId;
    private String customerName;
    private String customerEmail;
    private OrderStatus status;
    private String note;
    private String voucherCode;
    private String shippingRecipientName;
    private String shippingPhone;
    private String shippingAddress;
    private int totalQuantity;
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OrderItemResponse> items;
    private PaymentResponse payment;
    private ShipmentResponse shipment;
}
