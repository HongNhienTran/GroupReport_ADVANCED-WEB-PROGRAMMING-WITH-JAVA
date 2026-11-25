package com.sweetlab.backend.service.impl;

import com.sweetlab.backend.repository.AccountRepository;
import com.sweetlab.backend.repository.UserRepository;
import com.sweetlab.backend.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * [PHÂN CÔNG: BẢO - Nhánh feat/bao-admin-report-users]
 * Nhiệm vụ: Triển khai quản lý người dùng từ AccountRepository & UserRepository.
 */
@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    // TODO [Bảo]: Implement danh sách user và khóa/mở khóa tài khoản (BLOCKED / ACTIVE)
}
