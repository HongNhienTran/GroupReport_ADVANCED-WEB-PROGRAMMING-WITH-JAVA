package com.sweetlab.backend.service.impl;

import com.sweetlab.backend.repository.FlashSaleItemRepository;
import com.sweetlab.backend.repository.FlashSaleRepository;
import com.sweetlab.backend.service.FlashSaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * [PHÂN CÔNG: QUÂN - Nhánh feat/quan-flashsale-voucher-wishlist]
 * Nhiệm vụ: Triển khai nghiệp vụ FlashSale từ FlashSaleRepository & FlashSaleItemRepository.
 */
@Service
@RequiredArgsConstructor
public class FlashSaleServiceImpl implements FlashSaleService {

    private final FlashSaleRepository flashSaleRepository;
    private final FlashSaleItemRepository flashSaleItemRepository;

    // TODO [Quân]: Implement các phương thức của FlashSaleService
}
