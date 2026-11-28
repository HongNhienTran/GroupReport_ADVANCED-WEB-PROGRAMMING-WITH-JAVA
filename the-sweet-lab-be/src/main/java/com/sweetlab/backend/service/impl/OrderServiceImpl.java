package com.sweetlab.backend.service.impl;

import com.sweetlab.backend.dto.request.CheckoutRequest;
import com.sweetlab.backend.dto.request.UpdateOrderStatusRequest;
import com.sweetlab.backend.dto.request.UpdatePaymentStatusRequest;
import com.sweetlab.backend.dto.request.UpdateShipmentRequest;
import com.sweetlab.backend.dto.response.OrderResponse;
import com.sweetlab.backend.dto.response.PageResponse;
import com.sweetlab.backend.entity.*;
import com.sweetlab.backend.enums.*;
import com.sweetlab.backend.exception.BadRequestException;
import com.sweetlab.backend.exception.ForbiddenException;
import com.sweetlab.backend.exception.ResourceNotFoundException;
import com.sweetlab.backend.exception.UnauthorizedException;
import com.sweetlab.backend.mapper.OrderMapper;
import com.sweetlab.backend.repository.*;
import com.sweetlab.backend.service.OrderService;
import com.sweetlab.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.*;

/**
 * [PHÂN CÔNG: QUANG - Nhánh feat/quang-order-payment-shipment]
 * Nhiệm vụ: Triển khai checkout, trừ tồn kho ProductVariant, áp Voucher, tạo Payment & Shipment, ghi tracking PURCHASE.
 */
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private static final BigDecimal SHIPPING_FEE_HCM = new BigDecimal("25000.00");
    private static final BigDecimal SHIPPING_FEE_DEFAULT = new BigDecimal("30000.00");

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductVariantRepository variantRepository;
    private final VoucherRepository voucherRepository;
    private final ShipmentRepository shipmentRepository;
    private final UserBehaviorLogRepository behaviorLogRepository;
    private final UserRepository userRepository;
    private final UserAddressRepository userAddressRepository;
    private final PaymentService paymentService;
    private final OrderMapper orderMapper;

    @Override
    @Transactional
    public OrderResponse checkout(Long accountId, CheckoutRequest request) {
        User user = resolveAuthenticatedUser(accountId);

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Giỏ hàng của bạn đang trống"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Giỏ hàng của bạn đang trống");
        }

        ShippingSnapshot shippingSnapshot = resolveShippingSnapshot(user, request);

        List<OrderItem> orderItems = new ArrayList<>();
        Map<Long, Product> purchasedProducts = new LinkedHashMap<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            if (cartItem.getQuantity() <= 0) {
                throw new BadRequestException("Số lượng sản phẩm trong giỏ hàng không hợp lệ");
            }

            Long variantId = cartItem.getProductVariant().getId();
            ProductVariant variant = variantRepository.findById(variantId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy biến thể sản phẩm #" + variantId));

            Product product = variant.getProduct();
            if (!variant.isActive() || product == null || product.getStatus() != ProductStatus.ACTIVE) {
                throw new BadRequestException("Sản phẩm \"" + (product != null ? product.getName() : variant.getName()) + "\" hiện đã ngừng kinh doanh");
            }

            if (cartItem.getQuantity() > variant.getStockQuantity()) {
                throw new BadRequestException(String.format(
                        "Sản phẩm \"%s - %s\" không đủ tồn kho (còn %d, yêu cầu %d)",
                        product.getName(),
                        variant.getName(),
                        variant.getStockQuantity(),
                        cartItem.getQuantity()
                ));
            }

            variant.setStockQuantity(variant.getStockQuantity() - cartItem.getQuantity());
            variantRepository.save(variant);

            BigDecimal unitPrice = variant.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            subtotal = subtotal.add(lineTotal);

            orderItems.add(OrderItem.builder()
                    .productVariant(variant)
                    .productName(product.getName())
                    .variantName(variant.getName())
                    .unitPrice(unitPrice)
                    .quantity(cartItem.getQuantity())
                    .build());

            purchasedProducts.putIfAbsent(product.getId(), product);
        }

        Voucher appliedVoucher = null;
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.getVoucherCode() != null && !request.getVoucherCode().isBlank()) {
            appliedVoucher = resolveAndValidateVoucher(request.getVoucherCode(), subtotal);
            discountAmount = calculateDiscountAmount(appliedVoucher, subtotal);
            appliedVoucher.setUsedCount(appliedVoucher.getUsedCount() + 1);
            voucherRepository.save(appliedVoucher);
        }

        boolean isHcm = isHoChiMinhAddress(shippingSnapshot.fullAddress());
        BigDecimal shippingFee = isHcm ? SHIPPING_FEE_HCM : SHIPPING_FEE_DEFAULT;
        BigDecimal totalAmount = subtotal.subtract(discountAmount)
                .max(BigDecimal.ZERO)
                .add(shippingFee);

        Order order = Order.builder()
                .orderCode(generateUniqueOrderCode())
                .user(user)
                .voucher(appliedVoucher)
                .status(OrderStatus.PENDING)
                .note(request.getNote() != null ? request.getNote().trim() : null)
                .shippingRecipientName(shippingSnapshot.recipientName())
                .shippingPhone(shippingSnapshot.phone())
                .shippingAddress(shippingSnapshot.fullAddress())
                .shippingFee(shippingFee)
                .discountAmount(discountAmount)
                .build();

        for (OrderItem item : orderItems) {
            item.setOrder(order);
            order.getItems().add(item);
        }

        Order savedOrder = orderRepository.save(order);

        Payment createdPayment = paymentService.createPayment(savedOrder, request.getPaymentMethod(), totalAmount);
        if (createdPayment != null) {
            savedOrder.setPayment(createdPayment);
        }

        Shipment shipment = Shipment.builder()
                .order(savedOrder)
                .status(ShipmentStatus.PREPARING)
                .estimatedDeliveryAt(LocalDateTime.now().plusDays(isHcm ? 2 : 4))
                .build();
        Shipment savedShipment = shipmentRepository.save(shipment);
        savedOrder.setShipment(savedShipment);

        cart.getItems().clear();
        cartRepository.save(cart);

        for (Product purchasedProduct : purchasedProducts.values()) {
            behaviorLogRepository.save(UserBehaviorLog.builder()
                    .user(user)
                    .product(purchasedProduct)
                    .actionType(BehaviorActionType.PURCHASE)
                    .weight(BehaviorActionType.PURCHASE.getWeight())
                    .build());
        }

        return orderMapper.toResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(Long accountId) {
        User user = resolveAuthenticatedUser(accountId);
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderDetail(Long accountId, Long orderId) {
        User user = resolveAuthenticatedUser(accountId);
        Order order = findOrderOrThrow(orderId);
        if (!order.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("Bạn không có quyền truy cập đơn hàng này");
        }
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(Long accountId, Long orderId) {
        User user = resolveAuthenticatedUser(accountId);
        Order order = findOrderOrThrow(orderId);

        if (!order.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("Bạn không có quyền hủy đơn hàng này");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BadRequestException("Chỉ có thể hủy đơn hàng khi đang ở trạng thái chờ xác nhận (PENDING)");
        }

        restoreInventoryAndVoucher(order, true);
        order.setStatus(OrderStatus.CANCELLED);

        Shipment shipment = resolveShipment(order);
        if (shipment != null) {
            shipment.setStatus(ShipmentStatus.FAILED);
            shipmentRepository.save(shipment);
        }

        paymentService.syncPaymentOnOrderCancelledOrReturned(order, true);

        Order saved = orderRepository.save(order);
        return orderMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getAllOrders(OrderStatus status, int page, int size) {
        int safePage = Math.max(0, page);
        int safeSize = Math.min(Math.max(1, size), 100);
        Pageable pageable = PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Order> orderPage;
        if (status != null) {
            Order probe = new Order();
            probe.setStatus(status);
            probe.setItems(null);
            orderPage = orderRepository.findAll(Example.of(probe), pageable);
        } else {
            orderPage = orderRepository.findAll(pageable);
        }

        return PageResponse.from(orderPage.map(orderMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderByIdForAdmin(Long orderId) {
        Order order = findOrderOrThrow(orderId);
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = findOrderOrThrow(orderId);
        OrderStatus currentStatus = order.getStatus();
        OrderStatus targetStatus = request.getStatus();

        if (currentStatus == targetStatus) {
            if (request.getNote() != null && !request.getNote().isBlank()) {
                order.setNote(request.getNote().trim());
                orderRepository.save(order);
            }
            return orderMapper.toResponse(order);
        }

        validateOrderStatusTransition(currentStatus, targetStatus);

        LocalDateTime now = LocalDateTime.now();
        Shipment shipment = ensureShipmentExists(order);

        switch (targetStatus) {
            case CONFIRMED -> {
                if (shipment.getStatus() == null) {
                    shipment.setStatus(ShipmentStatus.PREPARING);
                    shipmentRepository.save(shipment);
                }
            }
            case SHIPPING -> {
                shipment.setStatus(ShipmentStatus.IN_TRANSIT);
                if (shipment.getShippedAt() == null) {
                    shipment.setShippedAt(now);
                }
                shipmentRepository.save(shipment);
            }
            case DELIVERED -> {
                shipment.setStatus(ShipmentStatus.DELIVERED);
                if (shipment.getShippedAt() == null) {
                    shipment.setShippedAt(now);
                }
                if (shipment.getDeliveredAt() == null) {
                    shipment.setDeliveredAt(now);
                }
                shipmentRepository.save(shipment);
                paymentService.syncPaymentOnOrderDelivered(order);
            }
            case CANCELLED -> {
                restoreInventoryAndVoucher(order, true);
                shipment.setStatus(ShipmentStatus.FAILED);
                shipmentRepository.save(shipment);
                paymentService.syncPaymentOnOrderCancelledOrReturned(order, true);
            }
            case RETURNED -> {
                restoreInventoryAndVoucher(order, false);
                shipment.setStatus(ShipmentStatus.RETURNED);
                shipmentRepository.save(shipment);
                paymentService.syncPaymentOnOrderCancelledOrReturned(order, false);
            }
            default -> {
                // PENDING is initial state only
            }
        }

        if (request.getNote() != null && !request.getNote().isBlank()) {
            order.setNote(request.getNote().trim());
        }
        order.setStatus(targetStatus);

        Order saved = orderRepository.save(order);
        return orderMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public OrderResponse updateShipment(Long orderId, UpdateShipmentRequest request) {
        Order order = findOrderOrThrow(orderId);
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Không thể cập nhật vận chuyển cho đơn hàng đã hủy");
        }
        if (order.getStatus() == OrderStatus.RETURNED && request.getStatus() != ShipmentStatus.RETURNED) {
            throw new BadRequestException("Đơn hàng đã hoàn trả không thể chuyển sang trạng thái vận chuyển khác");
        }

        Shipment shipment = ensureShipmentExists(order);

        if (request.getCarrier() != null) {
            shipment.setCarrier(request.getCarrier().trim());
        }
        if (request.getTrackingCode() != null) {
            shipment.setTrackingCode(request.getTrackingCode().trim());
        }
        if (request.getEstimatedDeliveryAt() != null) {
            shipment.setEstimatedDeliveryAt(request.getEstimatedDeliveryAt());
        }

        ShipmentStatus targetShipmentStatus = request.getStatus();
        LocalDateTime now = LocalDateTime.now();
        shipment.setStatus(targetShipmentStatus);

        switch (targetShipmentStatus) {
            case PREPARING -> {
                if (order.getStatus() == OrderStatus.DELIVERED) {
                    throw new BadRequestException("Đơn hàng đã giao thành công không thể quay về trạng thái chuẩn bị hàng");
                }
            }
            case IN_TRANSIT -> {
                if (order.getStatus() == OrderStatus.DELIVERED) {
                    throw new BadRequestException("Đơn hàng đã giao thành công không thể quay về trạng thái đang giao");
                }
                if (shipment.getShippedAt() == null) {
                    shipment.setShippedAt(now);
                }
                if (order.getStatus() == OrderStatus.PENDING || order.getStatus() == OrderStatus.CONFIRMED) {
                    order.setStatus(OrderStatus.SHIPPING);
                }
            }
            case DELIVERED -> {
                if (shipment.getShippedAt() == null) {
                    shipment.setShippedAt(now);
                }
                if (shipment.getDeliveredAt() == null) {
                    shipment.setDeliveredAt(now);
                }
                order.setStatus(OrderStatus.DELIVERED);
                paymentService.syncPaymentOnOrderDelivered(order);
            }
            case RETURNED -> {
                if (order.getStatus() != OrderStatus.SHIPPING
                        && order.getStatus() != OrderStatus.DELIVERED
                        && order.getStatus() != OrderStatus.RETURNED) {
                    throw new BadRequestException("Chỉ có thể chuyển vận đơn sang hoàn trả (RETURNED) khi đơn đang giao hoặc đã giao");
                }
                if (order.getStatus() != OrderStatus.RETURNED) {
                    restoreInventoryAndVoucher(order, false);
                    order.setStatus(OrderStatus.RETURNED);
                    paymentService.syncPaymentOnOrderCancelledOrReturned(order, false);
                }
            }
            case FAILED -> {
                if (order.getStatus() == OrderStatus.DELIVERED) {
                    throw new BadRequestException("Đơn hàng đã giao thành công không thể đánh dấu giao thất bại");
                }
            }
        }

        shipmentRepository.save(shipment);
        Order savedOrder = orderRepository.save(order);
        return orderMapper.toResponse(savedOrder);
    }

    @Override
    @Transactional
    public OrderResponse updatePaymentStatus(Long orderId, UpdatePaymentStatusRequest request) {
        Order order = findOrderOrThrow(orderId);
        paymentService.handlePaymentCallback(order.getId(), request.getStatus(), request.getTransactionCode());
        return orderMapper.toResponse(order);
    }

    private User resolveAuthenticatedUser(Long accountId) {
        if (accountId == null) {
            throw new UnauthorizedException("Vui lòng đăng nhập để thực hiện thao tác này");
        }
        return userRepository.findByAccountId(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hồ sơ người dùng"));
    }

    private Order findOrderOrThrow(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng #" + orderId));
    }

    private ShippingSnapshot resolveShippingSnapshot(User user, CheckoutRequest request) {
        String recipientName = trimToNull(request.getShippingRecipientName());
        String phone = trimToNull(request.getShippingPhone());
        String addressText = trimToNull(request.getShippingAddress());

        if (request.getAddressId() != null) {
            UserAddress savedAddress = userAddressRepository.findById(request.getAddressId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy địa chỉ nhận hàng đã chọn"));
            if (!savedAddress.getUser().getId().equals(user.getId())) {
                throw new ForbiddenException("Địa chỉ nhận hàng không thuộc tài khoản của bạn");
            }
            if (recipientName == null) {
                recipientName = savedAddress.getRecipientName();
            }
            if (phone == null) {
                phone = savedAddress.getPhone();
            }
            if (addressText == null) {
                addressText = String.format("%s, %s, %s, %s",
                        savedAddress.getDetailAddress(),
                        savedAddress.getWard(),
                        savedAddress.getDistrict(),
                        savedAddress.getProvince());
            }
        }

        if (recipientName == null || phone == null || addressText == null) {
            throw new BadRequestException("Vui lòng chọn địa chỉ giao hàng hoặc nhập đầy đủ tên người nhận, số điện thoại và địa chỉ");
        }

        return new ShippingSnapshot(recipientName, phone, addressText);
    }

    private Voucher resolveAndValidateVoucher(String rawCode, BigDecimal subtotal) {
        String trimmed = rawCode.trim();
        Voucher voucher = voucherRepository.findByCode(trimmed)
                .or(() -> voucherRepository.findByCode(trimmed.toUpperCase(Locale.ROOT)))
                .orElseThrow(() -> new BadRequestException("Mã giảm giá \"" + trimmed + "\" không tồn tại"));

        LocalDateTime now = LocalDateTime.now();
        if (voucher.getStartDate() != null && now.isBefore(voucher.getStartDate())) {
            throw new BadRequestException("Mã giảm giá \"" + voucher.getCode() + "\" chưa đến thời gian áp dụng");
        }
        if (voucher.getEndDate() != null && now.isAfter(voucher.getEndDate())) {
            throw new BadRequestException("Mã giảm giá \"" + voucher.getCode() + "\" đã hết hạn sử dụng");
        }
        if (voucher.getUsedCount() >= voucher.getUsageLimit()) {
            throw new BadRequestException("Mã giảm giá \"" + voucher.getCode() + "\" đã hết lượt sử dụng");
        }
        if (voucher.getMinOrderAmount() != null && subtotal.compareTo(voucher.getMinOrderAmount()) < 0) {
            throw new BadRequestException("Đơn hàng chưa đạt giá trị tối thiểu ("
                    + voucher.getMinOrderAmount().stripTrailingZeros().toPlainString()
                    + " VNĐ) để áp dụng mã \"" + voucher.getCode() + "\"");
        }
        return voucher;
    }

    private BigDecimal calculateDiscountAmount(Voucher voucher, BigDecimal subtotal) {
        BigDecimal discount;
        if (voucher.getDiscountType() == DiscountType.PERCENTAGE) {
            discount = subtotal.multiply(voucher.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (voucher.getMaxDiscountAmount() != null
                    && voucher.getMaxDiscountAmount().compareTo(BigDecimal.ZERO) > 0
                    && discount.compareTo(voucher.getMaxDiscountAmount()) > 0) {
                discount = voucher.getMaxDiscountAmount();
            }
        } else {
            discount = voucher.getDiscountValue();
        }

        if (discount == null || discount.compareTo(BigDecimal.ZERO) < 0) {
            return BigDecimal.ZERO;
        }
        return discount.min(subtotal);
    }

    private void validateOrderStatusTransition(OrderStatus current, OrderStatus target) {
        boolean valid = switch (current) {
            case PENDING -> target == OrderStatus.CONFIRMED || target == OrderStatus.CANCELLED;
            case CONFIRMED -> target == OrderStatus.SHIPPING || target == OrderStatus.CANCELLED;
            case SHIPPING -> target == OrderStatus.DELIVERED || target == OrderStatus.RETURNED;
            case DELIVERED -> target == OrderStatus.RETURNED;
            case CANCELLED, RETURNED -> false;
        };

        if (!valid) {
            throw new BadRequestException(String.format(
                    "Không thể chuyển trạng thái đơn hàng từ %s sang %s", current, target
            ));
        }
    }

    private void restoreInventoryAndVoucher(Order order, boolean restoreVoucher) {
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                ProductVariant variant = item.getProductVariant();
                if (variant != null) {
                    variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
                    variantRepository.save(variant);
                }
            }
        }

        if (restoreVoucher && order.getVoucher() != null) {
            Voucher voucher = order.getVoucher();
            if (voucher.getUsedCount() > 0) {
                voucher.setUsedCount(voucher.getUsedCount() - 1);
                voucherRepository.save(voucher);
            }
        }
    }

    private Shipment resolveShipment(Order order) {
        if (order.getShipment() != null) {
            return order.getShipment();
        }
        return order.getId() != null ? shipmentRepository.findByOrderId(order.getId()).orElse(null) : null;
    }

    private Shipment ensureShipmentExists(Order order) {
        Shipment existing = resolveShipment(order);
        if (existing != null) {
            return existing;
        }
        Shipment created = shipmentRepository.save(Shipment.builder()
                .order(order)
                .status(ShipmentStatus.PREPARING)
                .build());
        order.setShipment(created);
        return created;
    }

    private boolean isHoChiMinhAddress(String fullAddress) {
        if (fullAddress == null) {
            return false;
        }
        String normalized = Normalizer.normalize(fullAddress, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .replace('đ', 'd')
                .replace('Đ', 'D')
                .toLowerCase(Locale.ROOT);
        return normalized.contains("ho chi minh")
                || normalized.contains("tp.hcm")
                || normalized.contains("tphcm")
                || normalized.contains("tp hcm");
    }

    private String generateUniqueOrderCode() {
        int year = Year.now().getValue();
        for (int attempt = 0; attempt < 5; attempt++) {
            String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase(Locale.ROOT);
            String code = "TSL-" + year + "-" + suffix;
            if (orderRepository.findByOrderCode(code).isEmpty()) {
                return code;
            }
        }
        return "TSL-" + year + "-" + System.currentTimeMillis();
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private record ShippingSnapshot(String recipientName, String phone, String fullAddress) {
    }
}
