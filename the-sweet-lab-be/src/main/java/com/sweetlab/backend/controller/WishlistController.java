package com.sweetlab.backend.controller;

import com.sweetlab.backend.service.WishlistService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * [PHÂN CÔNG: QUÂN - Nhánh feat/quan-flashsale-voucher-wishlist]
 * Nhiệm vụ: API quản lý danh sách yêu thích (/api/v1/wishlist).
 */
@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
@Tag(name = "Wishlist", description = "Quản lý sản phẩm yêu thích [Quân]")
public class WishlistController {

    private final WishlistService wishlistService;

    // TODO [Quân]: Thêm GET, POST /{productId}, DELETE /{productId}
}
