package com.sweetlab.backend.controller;

import com.sweetlab.backend.service.ReportService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * [PHÂN CÔNG: BẢO - Nhánh feat/bao-admin-report-users]
 * Nhiệm vụ: API thống kê cho Admin (/api/v1/admin/reports).
 */
@RestController
@RequestMapping("/api/v1/admin/reports")
@RequiredArgsConstructor
@Tag(name = "Admin Report", description = "Báo cáo doanh thu và thống kê hệ thống [Bảo]")
public class ReportController {

    private final ReportService reportService;

    // TODO [Bảo]: Thêm GET /overview, GET /top-products
}
