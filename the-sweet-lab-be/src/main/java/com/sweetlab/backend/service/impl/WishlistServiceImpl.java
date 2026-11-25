package com.sweetlab.backend.service.impl;

import com.sweetlab.backend.repository.ProductRepository;
import com.sweetlab.backend.repository.UserRepository;
import com.sweetlab.backend.repository.WishItemRepository;
import com.sweetlab.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * [PHÂN CÔNG: QUÂN - Nhánh feat/quan-flashsale-voucher-wishlist]
 * Nhiệm vụ: Triển khai nghiệp vụ Wishlist từ WishItemRepository.
 */
@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishItemRepository wishItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // TODO [Quân]: Implement thêm/xóa/lấy danh sách yêu thích & ghi tracking WISHLIST
}
