package com.sweetlab.backend.controller;

import com.sweetlab.backend.service.AdminUserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * [PHÂN CÔNG: BẢO - Nhánh feat/bao-admin-report-users]
 * Nhiệm vụ: API Admin quản lý tài khoản khách hàng (/api/v1/admin/users).
 */
@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@Tag(name = "Admin User Management", description = "Quản lý danh sách và trạng thái người dùng [Bảo]")
public class AdminUserController {

    private final AdminUserService adminUserService;

    // TODO [Bảo]: Thêm GET /, PUT /{accountId}/status
}
