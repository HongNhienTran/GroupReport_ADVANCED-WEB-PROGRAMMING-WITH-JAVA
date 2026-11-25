package com.sweetlab.backend.controller;

import com.sweetlab.backend.service.FlashSaleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * [PHÂN CÔNG: QUÂN - Nhánh feat/quan-flashsale-voucher-wishlist]
 * Nhiệm vụ: API public /api/v1/flash-sales/active và Admin CRUD /api/v1/admin/flash-sales.
 */
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Flash Sale", description = "Quản lý và tra cứu chương trình Flash Sale [Quân]")
public class FlashSaleController {

    private final FlashSaleService flashSaleService;

    // TODO [Quân]: Thêm @GetMapping("/flash-sales/active") và các endpoint /admin/flash-sales
}
