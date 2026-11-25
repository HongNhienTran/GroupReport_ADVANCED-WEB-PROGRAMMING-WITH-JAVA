import MainLayout from '../layouts/MainLayout';

/**
 * [PHÂN CÔNG: QUANG - Nhánh feat/quang-order-payment-shipment]
 * Nhiệm vụ: Trang thanh toán (chọn địa chỉ UserAddress, chọn COD/BANKING, nhập Voucher, đặt hàng).
 */
function CheckoutPage() {
  return (
    <MainLayout>
      <div className="container" style={{ padding: '48px 24px' }}>
        <h1>Thanh Toán Đơn Hàng</h1>
        <p>TODO [Quang]: Kết nối API /api/v1/orders/checkout.</p>
      </div>
    </MainLayout>
  );
}

export default CheckoutPage;
