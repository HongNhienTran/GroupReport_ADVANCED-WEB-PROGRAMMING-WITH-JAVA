package com.sweetlab.backend.service.impl;

import com.sweetlab.backend.repository.PaymentRepository;
import com.sweetlab.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * [PHÂN CÔNG: QUANG - Nhánh feat/quang-order-payment-shipment]
 * Nhiệm vụ: Triển khai nghiệp vụ thanh toán từ PaymentRepository.
 */
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    // TODO [Quang]: Implement xử lý thanh toán COD / BANKING
}
