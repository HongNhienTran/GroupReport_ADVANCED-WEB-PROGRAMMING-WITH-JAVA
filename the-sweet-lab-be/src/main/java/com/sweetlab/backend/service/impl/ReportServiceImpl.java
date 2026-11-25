package com.sweetlab.backend.service.impl;

import com.sweetlab.backend.repository.OrderItemRepository;
import com.sweetlab.backend.repository.OrderRepository;
import com.sweetlab.backend.repository.UserRepository;
import com.sweetlab.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * [PHÂN CÔNG: BẢO - Nhánh feat/bao-admin-report-users]
 * Nhiệm vụ: Triển khai thống kê doanh thu và đơn hàng từ OrderRepository & OrderItemRepository.
 */
@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;

    // TODO [Bảo]: Implement các truy vấn thống kê doanh thu, top sản phẩm bán chạy
}
