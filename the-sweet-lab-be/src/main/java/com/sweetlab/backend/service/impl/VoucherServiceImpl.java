package com.sweetlab.backend.service.impl;

import com.sweetlab.backend.repository.VoucherRepository;
import com.sweetlab.backend.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * [PHÂN CÔNG: QUÂN - Nhánh feat/quan-flashsale-voucher-wishlist]
 * Nhiệm vụ: Triển khai nghiệp vụ Voucher từ VoucherRepository.
 */
@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;

    // TODO [Quân]: Implement kiểm tra hạn dùng, usageLimit, minOrderAmount và tính discount
}
