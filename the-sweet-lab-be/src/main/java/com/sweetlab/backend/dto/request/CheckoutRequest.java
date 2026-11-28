package com.sweetlab.backend.dto.request;

import com.sweetlab.backend.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * Request payload for placing an order from the authenticated user's cart.
 * Supports either selecting a saved {@code addressId} or providing explicit shipping details.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutRequest {

    private Long addressId;

    @Size(max = 150, message = "Tên người nhận tối đa 150 ký tự")
    private String shippingRecipientName;

    @Size(max = 20, message = "Số điện thoại tối đa 20 ký tự")
    private String shippingPhone;

    @Size(max = 500, message = "Địa chỉ giao hàng tối đa 500 ký tự")
    private String shippingAddress;

    @NotNull(message = "Phương thức thanh toán là bắt buộc")
    private PaymentMethod paymentMethod;

    @Size(max = 50, message = "Mã giảm giá tối đa 50 ký tự")
    private String voucherCode;

    @Size(max = 1000, message = "Ghi chú đơn hàng tối đa 1000 ký tự")
    private String note;
}
