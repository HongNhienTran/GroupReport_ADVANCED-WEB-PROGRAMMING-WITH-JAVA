import AdminLayout from '../layouts/AdminLayout';

/**
 * [PHÂN CÔNG: QUANG - Nhánh feat/quang-order-payment-shipment]
 * Nhiệm vụ: Trang Admin quản lý đơn hàng và cập nhật trạng thái giao hàng.
 */
function OrdersManagePage() {
  return (
    <AdminLayout title="Quản lý đơn hàng">
      <div className="panel-card" style={{ padding: '24px' }}>
        <p>TODO [Quang]: Kết nối API /api/v1/admin/orders.</p>
      </div>
    </AdminLayout>
  );
}

export default OrdersManagePage;
