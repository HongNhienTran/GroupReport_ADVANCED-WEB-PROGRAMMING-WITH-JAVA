package com.sweetlab.backend.controller;

import com.sweetlab.backend.service.VoucherService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * [PHÂN CÔNG: QUÂN - Nhánh feat/quan-flashsale-voucher-wishlist]
 * Nhiệm vụ: API kiểm tra voucher (/api/v1/vouchers/**) và Admin CRUD (/api/v1/admin/vouchers).
 */
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Voucher", description = "Quản lý và áp dụng mã giảm giá [Quân]")
public class VoucherController {

    private final VoucherService voucherService;

    // TODO [Quân]: Thêm endpoint validate voucher và Admin CRUD
}
