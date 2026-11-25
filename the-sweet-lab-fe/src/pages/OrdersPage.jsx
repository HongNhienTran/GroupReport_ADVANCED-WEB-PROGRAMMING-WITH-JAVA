import MainLayout from '../layouts/MainLayout';

/**
 * [PHÂN CÔNG: QUANG - Nhánh feat/quang-order-payment-shipment]
 * Nhiệm vụ: Trang lịch sử đơn hàng, theo dõi trạng thái vận chuyển và hủy đơn.
 */
function OrdersPage() {
  return (
    <MainLayout>
      <div className="container" style={{ padding: '48px 24px' }}>
        <h1>Đơn Hàng Của Tôi</h1>
        <p>TODO [Quang]: Kết nối API /api/v1/orders/my-orders.</p>
      </div>
    </MainLayout>
  );
}

export default OrdersPage;
