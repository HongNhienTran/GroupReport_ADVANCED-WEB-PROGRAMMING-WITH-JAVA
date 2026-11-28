package com.sweetlab.backend.service.impl;

import com.sweetlab.backend.dto.response.PaymentResponse;
import com.sweetlab.backend.entity.Order;
import com.sweetlab.backend.entity.Payment;
import com.sweetlab.backend.enums.OrderStatus;
import com.sweetlab.backend.enums.PaymentMethod;
import com.sweetlab.backend.enums.PaymentStatus;
import com.sweetlab.backend.exception.BadRequestException;
import com.sweetlab.backend.exception.ResourceNotFoundException;
import com.sweetlab.backend.mapper.OrderMapper;
import com.sweetlab.backend.repository.PaymentRepository;
import com.sweetlab.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * [PHÂN CÔNG: QUANG - Nhánh feat/quang-order-payment-shipment]
 * Nhiệm vụ: Triển khai nghiệp vụ thanh toán COD / BANKING và đồng bộ trạng thái giao dịch.
 */
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private static final DateTimeFormatter TXN_TIME_FMT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private final PaymentRepository paymentRepository;
    private final OrderMapper orderMapper;

    @Override
    @Transactional
    public Payment createPayment(Order order, PaymentMethod method, BigDecimal amount) {
        if (order == null || order.getId() == null) {
            throw new BadRequestException("Đơn hàng chưa được khởi tạo hợp lệ để tạo thanh toán");
        }
        if (method == null) {
            throw new BadRequestException("Phương thức thanh toán không được để trống");
        }

        String txCode = generateTransactionCode();
        Payment payment = Payment.builder()
                .order(order)
                .transactionCode(txCode)
                .method(method)
                .status(PaymentStatus.PENDING)
                .amount(amount != null ? amount : BigDecimal.ZERO)
                .build();

        Payment saved = paymentRepository.save(payment);
        order.setPayment(saved);
        return saved;
    }

    @Override
    @Transactional
    public PaymentResponse confirmPayment(Long orderId, String transactionCode) {
        return handlePaymentCallback(orderId, PaymentStatus.SUCCESS, transactionCode);
    }

    @Override
    @Transactional
    public PaymentResponse handlePaymentCallback(Long orderId, PaymentStatus newStatus, String transactionCode) {
        if (newStatus == null) {
            throw new BadRequestException("Trạng thái thanh toán không hợp lệ");
        }

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin thanh toán của đơn hàng #" + orderId));

        Order order = payment.getOrder();
        PaymentStatus currentStatus = payment.getStatus();

        if (currentStatus == PaymentStatus.REFUNDED && newStatus != PaymentStatus.REFUNDED) {
            throw new BadRequestException("Giao dịch đã hoàn tiền không thể chuyển sang trạng thái khác");
        }

        if (newStatus == PaymentStatus.SUCCESS && order != null && order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Không thể xác nhận thanh toán cho đơn hàng đã hủy");
        }

        if (newStatus == PaymentStatus.REFUNDED && currentStatus != PaymentStatus.SUCCESS && currentStatus != PaymentStatus.REFUNDED) {
            throw new BadRequestException("Chỉ có thể hoàn tiền cho giao dịch đã thanh toán thành công");
        }

        if (transactionCode != null && !transactionCode.isBlank()) {
            payment.setTransactionCode(transactionCode.trim());
        }

        payment.setStatus(newStatus);
        if (newStatus == PaymentStatus.SUCCESS && payment.getPaidAt() == null) {
            payment.setPaidAt(LocalDateTime.now());
        }

        Payment saved = paymentRepository.save(payment);
        return orderMapper.toPaymentResponse(saved);
    }

    @Override
    @Transactional
    public void syncPaymentOnOrderDelivered(Order order) {
        Payment payment = resolvePayment(order);
        if (payment == null) {
            return;
        }
        if (payment.getStatus() == PaymentStatus.PENDING) {
            payment.setStatus(PaymentStatus.SUCCESS);
            if (payment.getPaidAt() == null) {
                payment.setPaidAt(LocalDateTime.now());
            }
            paymentRepository.save(payment);
        }
    }

    @Override
    @Transactional
    public void syncPaymentOnOrderCancelledOrReturned(Order order, boolean isCancelled) {
        Payment payment = resolvePayment(order);
        if (payment == null) {
            return;
        }
        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            payment.setStatus(PaymentStatus.REFUNDED);
            paymentRepository.save(payment);
        } else if (isCancelled && payment.getStatus() == PaymentStatus.PENDING) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
        }
    }

    private Payment resolvePayment(Order order) {
        if (order == null) {
            return null;
        }
        if (order.getPayment() != null) {
            return order.getPayment();
        }
        return order.getId() != null ? paymentRepository.findByOrderId(order.getId()).orElse(null) : null;
    }

    private String generateTransactionCode() {
        String randomSuffix = UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase();
        return "TXN-" + LocalDateTime.now().format(TXN_TIME_FMT) + "-" + randomSuffix;
    }
}
