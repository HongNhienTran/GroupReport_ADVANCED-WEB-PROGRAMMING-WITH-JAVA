import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  CreditCard,
  Eye,
  MapPin,
  Package,
  RefreshCw,
  Truck,
  X,
} from 'lucide-react';
import { orderAdminApi } from '../api/orderAdminApi';
import AdminLayout from '../layouts/AdminLayout';

const ORDER_STATUS_META = {
  PENDING: { label: 'Chờ xác nhận', bg: '#fef3c7', color: '#b45309' },
  CONFIRMED: { label: 'Đã xác nhận', bg: '#dbeafe', color: '#1d4ed8' },
  SHIPPING: { label: 'Đang giao hàng', bg: '#e0e7ff', color: '#4338ca' },
  DELIVERED: { label: 'Đã giao hàng', bg: '#dcfce7', color: '#15803d' },
  CANCELLED: { label: 'Đã hủy', bg: '#fee2e2', color: '#dc2626' },
  RETURNED: { label: 'Đã hoàn trả', bg: '#f1f5f9', color: '#475569' },
};

const PAYMENT_STATUS_META = {
  PENDING: { label: 'Chờ thanh toán', bg: '#fef3c7', color: '#b45309' },
  SUCCESS: { label: 'Đã thanh toán', bg: '#dcfce7', color: '#15803d' },
  FAILED: { label: 'Thất bại / Đã hủy', bg: '#fee2e2', color: '#dc2626' },
  REFUNDED: { label: 'Đã hoàn tiền', bg: '#e0f2fe', color: '#0369a1' },
};

const SHIPMENT_STATUS_META = {
  PREPARING: { label: 'Chuẩn bị hàng', bg: '#f1f5f9', color: '#334155' },
  IN_TRANSIT: { label: 'Đang vận chuyển', bg: '#e0e7ff', color: '#4338ca' },
  DELIVERED: { label: 'Đã giao hàng', bg: '#dcfce7', color: '#15803d' },
  FAILED: { label: 'Giao thất bại', bg: '#fee2e2', color: '#dc2626' },
  RETURNED: { label: 'Đã hoàn kho', bg: '#fef3c7', color: '#b45309' },
};

function formatCurrency(amount) {
  if (amount == null) return '0đ';
  return `${new Intl.NumberFormat('vi-VN').format(Math.round(Number(amount)))}đ`;
}

function formatDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function toDatetimeLocalValue(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Chỉ trả về các trạng thái chuyển tiếp hợp lệ đúng theo state machine ở OrderServiceImpl.
 */
function getAllowedOrderStatuses(currentStatus) {
  switch (currentStatus) {
    case 'PENDING':
      return ['PENDING', 'CONFIRMED', 'CANCELLED'];
    case 'CONFIRMED':
      return ['CONFIRMED', 'SHIPPING', 'CANCELLED'];
    case 'SHIPPING':
      return ['SHIPPING', 'DELIVERED', 'RETURNED'];
    case 'DELIVERED':
      return ['DELIVERED', 'RETURNED'];
    case 'CANCELLED':
      return ['CANCELLED'];
    case 'RETURNED':
      return ['RETURNED'];
    default:
      return ['PENDING'];
  }
}

/**
 * Các trạng thái vận đơn hợp lệ dựa trên trạng thái hiện tại của đơn hàng ở Backend.
 */
function getAllowedShipmentStatuses(orderStatus) {
  switch (orderStatus) {
    case 'CANCELLED':
      return ['FAILED'];
    case 'RETURNED':
      return ['RETURNED'];
    case 'DELIVERED':
      return ['DELIVERED', 'RETURNED'];
    case 'SHIPPING':
      return ['PREPARING', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'RETURNED'];
    default:
      return ['PREPARING', 'IN_TRANSIT', 'DELIVERED', 'FAILED'];
  }
}

/**
 * Các trạng thái thanh toán hợp lệ khớp PaymentServiceImpl.handlePaymentCallback().
 */
function getAllowedPaymentStatuses(orderStatus, currentPaymentStatus) {
  if (currentPaymentStatus === 'REFUNDED') {
    return ['REFUNDED'];
  }
  if (orderStatus === 'CANCELLED') {
    return currentPaymentStatus === 'SUCCESS' ? ['SUCCESS', 'REFUNDED'] : ['PENDING', 'FAILED'];
  }
  if (currentPaymentStatus === 'SUCCESS') {
    return ['SUCCESS', 'REFUNDED'];
  }
  return ['PENDING', 'SUCCESS', 'FAILED'];
}

function Badge({ meta, fallback }) {
  const m = meta || { label: fallback || '—', bg: '#f1f5f9', color: '#334155' };
  return (
    <span
      className="status-pill"
      style={{
        background: m.bg,
        color: m.color,
        whiteSpace: 'nowrap',
      }}
    >
      {m.label}
    </span>
  );
}

/**
 * [PHÂN CÔNG: QUANG - Nhánh feat/quang-order-payment-shipment]
 * Nhiệm vụ: Trang Admin quản lý đơn hàng, thanh toán và cập nhật trạng thái giao hàng.
 */
function OrdersManagePage() {
  const [orders, setOrders] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [reloadTick, setReloadTick] = useState(0);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');

  // Modal chi tiết đơn hàng
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  // Form trạng thái đơn
  const [statusForm, setStatusForm] = useState({ status: 'PENDING', note: '' });
  const [savingStatus, setSavingStatus] = useState(false);

  // Form vận đơn
  const [shipmentForm, setShipmentForm] = useState({
    carrier: '',
    trackingCode: '',
    status: 'PREPARING',
    estimatedDeliveryAt: '',
  });
  const [savingShipment, setSavingShipment] = useState(false);

  // Form thanh toán
  const [paymentForm, setPaymentForm] = useState({
    status: 'PENDING',
    transactionCode: '',
  });
  const [savingPayment, setSavingPayment] = useState(false);

  const syncFormsFromOrder = (order) => {
    if (!order) return;
    setStatusForm({
      status: order.status || 'PENDING',
      note: order.note || '',
    });
    setShipmentForm({
      carrier: order.shipment?.carrier || '',
      trackingCode: order.shipment?.trackingCode || '',
      status: order.shipment?.status || 'PREPARING',
      estimatedDeliveryAt: toDatetimeLocalValue(order.shipment?.estimatedDeliveryAt),
    });
    setPaymentForm({
      status: order.payment?.status || 'PENDING',
      transactionCode: order.payment?.transactionCode || '',
    });
  };

  useEffect(() => {
    let active = true;
    const params = { page, size: 10 };
    if (statusFilter) {
      params.status = statusFilter;
    }
    if (keyword.trim()) {
      params.keyword = keyword.trim();
    }

    orderAdminApi
      .getOrders(params)
      .then((res) => {
        if (!active) return;
        const data = res?.data || {};
        setOrders(data.content || []);
        setPageInfo({
          page: data.page ?? 0,
          totalPages: data.totalPages ?? 0,
          totalElements: data.totalElements ?? 0,
        });
        setListError('');
      })
      .catch((err) => {
        if (!active) return;
        setListError(err?.response?.data?.message || 'Không thể tải danh sách đơn hàng.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, statusFilter, keyword, reloadTick]);

  // Lọc tức thì trên dữ liệu trang hiện tại theo mã đơn / tên khách / SĐT
  const displayedOrders = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) => {
      const code = (o.orderCode || '').toLowerCase();
      const cust = (o.customerName || '').toLowerCase();
      const email = (o.customerEmail || '').toLowerCase();
      const recipient = (o.shippingRecipientName || '').toLowerCase();
      const phone = (o.shippingPhone || '').toLowerCase();
      return (
        code.includes(q) ||
        cust.includes(q) ||
        email.includes(q) ||
        recipient.includes(q) ||
        phone.includes(q)
      );
    });
  }, [orders, keyword]);

  const handleRefreshList = () => {
    setLoading(true);
    setReloadTick((t) => t + 1);
  };

  const handleOpenDetail = async (order) => {
    setModalError('');
    setModalSuccess('');
    setSelectedOrder(order);
    syncFormsFromOrder(order);
    setDetailLoading(true);

    try {
      const res = await orderAdminApi.getOrderById(order.id);
      if (res?.data) {
        setSelectedOrder(res.data);
        syncFormsFromOrder(res.data);
      }
    } catch (err) {
      setModalError(err?.response?.data?.message || 'Không thể tải chi tiết mới nhất của đơn hàng.');
    } finally {
      setDetailLoading(false);
    }
  };

  const applyUpdatedOrder = (updatedOrder, successMessage) => {
    setSelectedOrder(updatedOrder);
    syncFormsFromOrder(updatedOrder);
    setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    setModalError('');
    setModalSuccess(successMessage);
  };

  const handleUpdateOrderStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setSavingStatus(true);
    setModalError('');
    setModalSuccess('');
    try {
      const res = await orderAdminApi.updateOrderStatus(selectedOrder.id, {
        status: statusForm.status,
        note: statusForm.note.trim() || undefined,
      });
      if (res?.data) {
        applyUpdatedOrder(res.data, 'Đã cập nhật trạng thái đơn hàng thành công.');
      }
    } catch (err) {
      setModalError(err?.response?.data?.message || 'Cập nhật trạng thái đơn hàng thất bại.');
    } finally {
      setSavingStatus(false);
    }
  };

  const handleUpdateShipment = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setSavingShipment(true);
    setModalError('');
    setModalSuccess('');
    try {
      const payload = {
        carrier: shipmentForm.carrier.trim() || undefined,
        trackingCode: shipmentForm.trackingCode.trim() || undefined,
        status: shipmentForm.status,
        estimatedDeliveryAt: shipmentForm.estimatedDeliveryAt
          ? `${shipmentForm.estimatedDeliveryAt}:00`.slice(0, 19)
          : null,
      };
      const res = await orderAdminApi.updateShipment(selectedOrder.id, payload);
      if (res?.data) {
        applyUpdatedOrder(res.data, 'Đã cập nhật thông tin vận đơn thành công.');
      }
    } catch (err) {
      setModalError(err?.response?.data?.message || 'Cập nhật vận đơn thất bại.');
    } finally {
      setSavingShipment(false);
    }
  };

  const submitPaymentUpdate = async (nextStatus, nextTxCode) => {
    if (!selectedOrder) return;
    setSavingPayment(true);
    setModalError('');
    setModalSuccess('');
    try {
      const res = await orderAdminApi.updatePaymentStatus(selectedOrder.id, {
        status: nextStatus,
        transactionCode: nextTxCode?.trim() || undefined,
      });
      if (res?.data) {
        applyUpdatedOrder(res.data, 'Đã cập nhật trạng thái thanh toán thành công.');
      }
    } catch (err) {
      setModalError(err?.response?.data?.message || 'Cập nhật trạng thái thanh toán thất bại.');
    } finally {
      setSavingPayment(false);
    }
  };

  const handleUpdatePaymentForm = (e) => {
    e.preventDefault();
    submitPaymentUpdate(paymentForm.status, paymentForm.transactionCode);
  };

  const allowedOrderStatuses = selectedOrder
    ? getAllowedOrderStatuses(selectedOrder.status)
    : [];
  const isTerminalOrder =
    selectedOrder?.status === 'CANCELLED' || selectedOrder?.status === 'RETURNED';

  const allowedShipmentStatuses = selectedOrder
    ? getAllowedShipmentStatuses(selectedOrder.status)
    : [];

  const allowedPaymentStatuses = selectedOrder
    ? getAllowedPaymentStatuses(selectedOrder.status, selectedOrder.payment?.status)
    : [];

  return (
    <AdminLayout title="Quản lý đơn hàng">
      <div className="panel-card">
        <div className="panel-header">
          <h2>Danh sách đơn hàng ({pageInfo.totalElements})</h2>

          <div className="toolbar-group">
            <input
              type="text"
              className="search-input"
              placeholder="Tìm mã đơn, tên khách, SĐT..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
            />

            <select
              className="select-input"
              value={statusFilter}
              onChange={(e) => {
                setLoading(true);
                setStatusFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="">Tất cả trạng thái</option>
              {Object.entries(ORDER_STATUS_META).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label} ({key})
                </option>
              ))}
            </select>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleRefreshList}
              disabled={loading}
            >
              <RefreshCw size={15} />
              <span>Làm mới</span>
            </button>
          </div>
        </div>

        {listError && (
          <div style={{ padding: '16px 22px 0' }}>
            <div className="error-banner">{listError}</div>
          </div>
        )}

        {loading ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--slate)' }}>
            Đang tải danh sách đơn hàng...
          </div>
        ) : displayedOrders.length === 0 ? (
          <div style={{ padding: '44px 24px', textAlign: 'center', color: 'var(--slate)' }}>
            Không tìm thấy đơn hàng nào phù hợp.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Thanh toán</th>
                  <th>Vận chuyển</th>
                  <th>Trạng thái đơn</th>
                  <th>Ngày đặt</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {displayedOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--navy)' }}>{order.orderCode}</div>
                      <div style={{ fontSize: '12px', color: 'var(--slate)' }}>
                        {order.totalQuantity || 0} sản phẩm
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>
                        {order.customerName || order.shippingRecipientName}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--slate)' }}>
                        {order.shippingPhone}
                        {order.customerEmail ? ` • ${order.customerEmail}` : ''}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--emerald)' }}>
                        {formatCurrency(order.totalAmount)}
                      </div>
                      {order.voucherCode && (
                        <div style={{ fontSize: '11.5px', color: 'var(--slate)' }}>
                          Mã: {order.voucherCode}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                        {order.payment?.method === 'BANKING' ? 'BANKING' : 'COD'}
                      </div>
                      <Badge
                        meta={PAYMENT_STATUS_META[order.payment?.status]}
                        fallback={order.payment?.status}
                      />
                    </td>
                    <td>
                      <Badge
                        meta={SHIPMENT_STATUS_META[order.shipment?.status]}
                        fallback={order.shipment?.status}
                      />
                      {order.shipment?.trackingCode && (
                        <div style={{ fontSize: '11.5px', color: 'var(--slate)', marginTop: '3px' }}>
                          {order.shipment.trackingCode}
                        </div>
                      )}
                    </td>
                    <td>
                      <Badge meta={ORDER_STATUS_META[order.status]} fallback={order.status} />
                    </td>
                    <td style={{ fontSize: '12.5px', color: 'var(--slate)', whiteSpace: 'nowrap' }}>
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12.5px' }}
                        onClick={() => handleOpenDetail(order)}
                      >
                        <Eye size={14} />
                        <span>Xử lý</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pageInfo.totalPages > 1 && (
          <div
            style={{
              padding: '14px 20px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              borderTop: '1px solid var(--border)',
            }}
          >
            <button
              type="button"
              className="btn-secondary"
              disabled={page === 0}
              onClick={() => {
                setLoading(true);
                setPage((p) => Math.max(0, p - 1));
              }}
            >
              Trước
            </button>
            <span style={{ alignSelf: 'center', fontSize: '13px', fontWeight: 600 }}>
              Trang {pageInfo.page + 1} / {pageInfo.totalPages}
            </span>
            <button
              type="button"
              className="btn-secondary"
              disabled={page >= pageInfo.totalPages - 1}
              onClick={() => {
                setLoading(true);
                setPage((p) => p + 1);
              }}
            >
              Sau
            </button>
          </div>
        )}
      </div>

      {/* Modal Chi tiết & Xử lý Đơn hàng */}
      {selectedOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div
            className="modal-card"
            style={{ maxWidth: '900px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h3>Đơn hàng {selectedOrder.orderCode}</h3>
                  <Badge
                    meta={ORDER_STATUS_META[selectedOrder.status]}
                    fallback={selectedOrder.status}
                  />
                  {detailLoading && (
                    <span style={{ fontSize: '12px', color: 'var(--slate)' }}>
                      (Đang đồng bộ...)
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--slate)', marginTop: '4px' }}>
                  Đặt lúc: {formatDateTime(selectedOrder.createdAt)} • Cập nhật:{' '}
                  {formatDateTime(selectedOrder.updatedAt)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{ border: 'none', background: 'transparent', color: 'var(--slate)' }}
                aria-label="Đóng"
              >
                <X size={20} />
              </button>
            </div>

            {modalError && <div className="error-banner">{modalError}</div>}
            {modalSuccess && (
              <div
                style={{
                  background: 'var(--mint-bg)',
                  border: '1px solid #bbf7d0',
                  color: 'var(--emerald-dark)',
                  padding: '10px 12px',
                  borderRadius: '9px',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CheckCircle2 size={16} />
                <span>{modalSuccess}</span>
              </div>
            )}

            {/* Khối 1: Thông tin người nhận & Sản phẩm */}
            <div className="form-section-card" style={{ padding: '16px 18px', marginBottom: '16px' }}>
              <div className="form-section-title" style={{ marginBottom: '10px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="var(--emerald)" />
                  Thông tin giao nhận &amp; Khách hàng
                </span>
              </div>
              <div className="form-grid" style={{ fontSize: '13.5px' }}>
                <div>
                  <div style={{ color: 'var(--slate)', fontSize: '12px' }}>Người nhận</div>
                  <div style={{ fontWeight: 700 }}>
                    {selectedOrder.shippingRecipientName} • {selectedOrder.shippingPhone}
                  </div>
                  <div style={{ color: '#334155', marginTop: '2px' }}>
                    {selectedOrder.shippingAddress}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--slate)', fontSize: '12px' }}>Tài khoản đặt hàng</div>
                  <div style={{ fontWeight: 700 }}>
                    {selectedOrder.customerName || 'Khách thành viên'}
                  </div>
                  <div style={{ color: '#334155', marginTop: '2px' }}>
                    {selectedOrder.customerEmail || `User ID #${selectedOrder.userId}`}
                  </div>
                </div>
                {selectedOrder.note && (
                  <div className="form-group full">
                    <div
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        border: '1px solid var(--border)',
                        fontSize: '13px',
                        color: '#475569',
                      }}
                    >
                      <strong>Ghi chú:</strong> {selectedOrder.note}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bảng chi tiết sản phẩm */}
            <div className="form-section-card" style={{ padding: '16px 18px', marginBottom: '16px' }}>
              <div className="form-section-title" style={{ marginBottom: '12px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={16} color="var(--emerald)" />
                  Sản phẩm trong đơn ({selectedOrder.totalQuantity || 0})
                </span>
              </div>

              <table className="data-table" style={{ marginBottom: '12px' }}>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Phân loại</th>
                    <th>Đơn giá</th>
                    <th>SL</th>
                    <th style={{ textAlign: 'right' }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedOrder.items || []).map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {item.thumbnailUrl ? (
                            <img
                              src={item.thumbnailUrl}
                              alt={item.productName}
                              className="thumb-sm"
                            />
                          ) : (
                            <div
                              className="thumb-sm"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--slate)',
                                fontSize: '11px',
                              }}
                            >
                              SP
                            </div>
                          )}
                          <span style={{ fontWeight: 700 }}>{item.productName}</span>
                        </div>
                      </td>
                      <td>
                        <div>{item.variantName}</div>
                        {item.sku && (
                          <div style={{ fontSize: '11.5px', color: 'var(--slate)' }}>{item.sku}</div>
                        )}
                      </td>
                      <td>{formatCurrency(item.unitPrice)}</td>
                      <td style={{ fontWeight: 700 }}>×{item.quantity}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>
                        {formatCurrency(item.lineTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '4px',
                  fontSize: '13.5px',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border)',
                }}
              >
                <div>
                  <span style={{ color: 'var(--slate)', marginRight: '16px' }}>Tạm tính:</span>
                  <strong>{formatCurrency(selectedOrder.subtotal)}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--slate)', marginRight: '16px' }}>Phí vận chuyển:</span>
                  <strong>{formatCurrency(selectedOrder.shippingFee)}</strong>
                </div>
                {Number(selectedOrder.discountAmount) > 0 && (
                  <div style={{ color: 'var(--emerald)' }}>
                    <span style={{ marginRight: '16px' }}>
                      Giảm giá {selectedOrder.voucherCode ? `(${selectedOrder.voucherCode})` : ''}:
                    </span>
                    <strong>-{formatCurrency(selectedOrder.discountAmount)}</strong>
                  </div>
                )}
                <div style={{ fontSize: '16px', marginTop: '4px' }}>
                  <strong style={{ marginRight: '16px' }}>Tổng thanh toán:</strong>
                  <strong style={{ color: 'var(--emerald)', fontSize: '18px' }}>
                    {formatCurrency(selectedOrder.totalAmount)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Grid 2 cột: Cập nhật OrderStatus & PaymentStatus */}
            <div className="form-grid" style={{ marginBottom: '16px' }}>
              {/* Cập nhật OrderStatus */}
              <form
                onSubmit={handleUpdateOrderStatus}
                className="form-section-card"
                style={{ padding: '16px 18px', marginBottom: 0 }}
              >
                <div className="form-section-title" style={{ marginBottom: '12px' }}>
                  <span>1. Trạng thái đơn hàng</span>
                  <Badge
                    meta={ORDER_STATUS_META[selectedOrder.status]}
                    fallback={selectedOrder.status}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="form-group">
                    <label>Chuyển trạng thái hợp lệ</label>
                    <select
                      value={statusForm.status}
                      disabled={isTerminalOrder}
                      onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                    >
                      {allowedOrderStatuses.map((st) => (
                        <option key={st} value={st}>
                          {ORDER_STATUS_META[st]?.label || st} ({st})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Ghi chú đơn hàng</label>
                    <input
                      placeholder="Ghi chú nội bộ / lý do cập nhật..."
                      value={statusForm.note}
                      onChange={(e) => setStatusForm({ ...statusForm, note: e.target.value })}
                    />
                  </div>

                  {isTerminalOrder ? (
                    <div style={{ fontSize: '12px', color: 'var(--slate)' }}>
                      Đơn hàng đang ở trạng thái cuối ({selectedOrder.status}), không thể chuyển tiếp.
                    </div>
                  ) : (
                    <button type="submit" className="btn-primary" disabled={savingStatus}>
                      {savingStatus ? 'Đang lưu...' : 'Cập nhật trạng thái đơn'}
                    </button>
                  )}
                </div>
              </form>

              {/* Cập nhật PaymentStatus */}
              <form
                onSubmit={handleUpdatePaymentForm}
                className="form-section-card"
                style={{ padding: '16px 18px', marginBottom: 0 }}
              >
                <div className="form-section-title" style={{ marginBottom: '12px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <CreditCard size={16} color="var(--emerald)" />
                    2. Thanh toán ({selectedOrder.payment?.method || 'COD'})
                  </span>
                  <Badge
                    meta={PAYMENT_STATUS_META[selectedOrder.payment?.status]}
                    fallback={selectedOrder.payment?.status}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedOrder.payment?.method === 'BANKING' &&
                    selectedOrder.payment?.status === 'PENDING' &&
                    selectedOrder.status !== 'CANCELLED' && (
                      <button
                        type="button"
                        className="btn-primary"
                        disabled={savingPayment}
                        onClick={() =>
                          submitPaymentUpdate('SUCCESS', paymentForm.transactionCode)
                        }
                        style={{ justifyContent: 'center' }}
                      >
                        <CheckCircle2 size={15} />
                        <span>Xác nhận đã nhận tiền chuyển khoản</span>
                      </button>
                    )}

                  <div className="form-group">
                    <label>Trạng thái thanh toán</label>
                    <select
                      value={paymentForm.status}
                      disabled={selectedOrder.payment?.status === 'REFUNDED'}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, status: e.target.value })
                      }
                    >
                      {allowedPaymentStatuses.map((ps) => (
                        <option key={ps} value={ps}>
                          {PAYMENT_STATUS_META[ps]?.label || ps} ({ps})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Mã giao dịch (Transaction Code)</label>
                    <input
                      placeholder="VD: VCB-99887766"
                      value={paymentForm.transactionCode}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, transactionCode: e.target.value })
                      }
                    />
                  </div>

                  {selectedOrder.payment?.paidAt && (
                    <div style={{ fontSize: '12px', color: 'var(--slate)' }}>
                      Thanh toán lúc: {formatDateTime(selectedOrder.payment.paidAt)}
                    </div>
                  )}

                  {selectedOrder.payment?.status !== 'REFUNDED' && (
                    <button type="submit" className="btn-secondary" disabled={savingPayment}>
                      {savingPayment ? 'Đang cập nhật...' : 'Lưu thông tin thanh toán'}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Khối 3: Cập nhật Vận đơn Shipment */}
            <form
              onSubmit={handleUpdateShipment}
              className="form-section-card"
              style={{ padding: '16px 18px', marginBottom: 0 }}
            >
              <div className="form-section-title" style={{ marginBottom: '12px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={16} color="var(--emerald)" />
                  3. Quản lý vận đơn (Shipment)
                </span>
                <Badge
                  meta={SHIPMENT_STATUS_META[selectedOrder.shipment?.status]}
                  fallback={selectedOrder.shipment?.status}
                />
              </div>

              {selectedOrder.status === 'CANCELLED' ? (
                <div style={{ fontSize: '13px', color: 'var(--slate)' }}>
                  Đơn hàng đã hủy nên không thể cập nhật vận đơn.
                </div>
              ) : (
                <>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Đơn vị vận chuyển (Carrier)</label>
                      <input
                        list="carrier-options"
                        placeholder="VD: Giao Hàng Nhanh"
                        value={shipmentForm.carrier}
                        onChange={(e) =>
                          setShipmentForm({ ...shipmentForm, carrier: e.target.value })
                        }
                      />
                      <datalist id="carrier-options">
                        <option value="Giao Hàng Nhanh" />
                        <option value="Giao Hàng Tiết Kiệm" />
                        <option value="Viettel Post" />
                        <option value="Ahamove Hỏa Tốc" />
                      </datalist>
                    </div>

                    <div className="form-group">
                      <label>Mã vận đơn (Tracking Code)</label>
                      <input
                        placeholder="VD: GHN-10025"
                        value={shipmentForm.trackingCode}
                        onChange={(e) =>
                          setShipmentForm({ ...shipmentForm, trackingCode: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Trạng thái giao hàng</label>
                      <select
                        value={shipmentForm.status}
                        onChange={(e) =>
                          setShipmentForm({ ...shipmentForm, status: e.target.value })
                        }
                      >
                        {allowedShipmentStatuses.map((ss) => (
                          <option key={ss} value={ss}>
                            {SHIPMENT_STATUS_META[ss]?.label || ss} ({ss})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Dự kiến giao hàng</label>
                      <input
                        type="datetime-local"
                        value={shipmentForm.estimatedDeliveryAt}
                        onChange={(e) =>
                          setShipmentForm({
                            ...shipmentForm,
                            estimatedDeliveryAt: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {(selectedOrder.shipment?.shippedAt || selectedOrder.shipment?.deliveredAt) && (
                    <div
                      style={{
                        display: 'flex',
                        gap: '20px',
                        flexWrap: 'wrap',
                        fontSize: '12px',
                        color: 'var(--slate)',
                        marginTop: '10px',
                      }}
                    >
                      {selectedOrder.shipment.shippedAt && (
                        <span>
                          Bàn giao VC: <strong>{formatDateTime(selectedOrder.shipment.shippedAt)}</strong>
                        </span>
                      )}
                      {selectedOrder.shipment.deliveredAt && (
                        <span>
                          Giao thành công:{' '}
                          <strong>{formatDateTime(selectedOrder.shipment.deliveredAt)}</strong>
                        </span>
                      )}
                    </div>
                  )}

                  <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn-primary" disabled={savingShipment}>
                      {savingShipment ? 'Đang cập nhật vận đơn...' : 'Lưu & Đồng bộ vận đơn'}
                    </button>
                  </div>
                </>
              )}
            </form>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedOrder(null)}
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default OrdersManagePage;
