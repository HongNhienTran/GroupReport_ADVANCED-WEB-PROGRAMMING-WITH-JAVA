import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  RefreshCw,
  ShoppingBag,
  Truck,
  XCircle,
} from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import { formatCurrency, getCategoryImage } from '../utils/format';

const ORDER_TABS = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'PENDING', label: 'Chờ xác nhận' },
  { key: 'CONFIRMED', label: 'Đã xác nhận' },
  { key: 'SHIPPING', label: 'Đang giao' },
  { key: 'DELIVERED', label: 'Đã giao' },
  { key: 'CANCELLED', label: 'Đã hủy' },
  { key: 'RETURNED', label: 'Hoàn trả' },
];

const ORDER_STATUS_META = {
  PENDING: { label: 'Chờ xác nhận', bg: '#fef3c7', color: '#b45309' },
  CONFIRMED: { label: 'Đã xác nhận', bg: '#dbeafe', color: '#1d4ed8' },
  SHIPPING: { label: 'Đang giao hàng', bg: '#e0e7ff', color: '#4338ca' },
  DELIVERED: { label: 'Giao thành công', bg: '#dcfce7', color: '#15803d' },
  CANCELLED: { label: 'Đã hủy', bg: '#fee2e2', color: '#dc2626' },
  RETURNED: { label: 'Đã hoàn trả', bg: '#f1f5f9', color: '#475569' },
};

const PAYMENT_STATUS_META = {
  PENDING: { label: 'Chờ thanh toán', bg: '#fef3c7', color: '#b45309' },
  SUCCESS: { label: 'Đã thanh toán', bg: '#dcfce7', color: '#15803d' },
  FAILED: { label: 'Đã hủy / Thất bại', bg: '#fee2e2', color: '#dc2626' },
  REFUNDED: { label: 'Đã hoàn tiền', bg: '#e0f2fe', color: '#0369a1' },
};

const SHIPMENT_STATUS_META = {
  PREPARING: { label: 'Đang chuẩn bị hàng', bg: '#f1f5f9', color: '#334155' },
  IN_TRANSIT: { label: 'Đang vận chuyển', bg: '#e0e7ff', color: '#4338ca' },
  DELIVERED: { label: 'Đã giao hàng', bg: '#dcfce7', color: '#15803d' },
  FAILED: { label: 'Giao không thành công / Đã hủy', bg: '#fee2e2', color: '#dc2626' },
  RETURNED: { label: 'Đã hoàn kho', bg: '#fef3c7', color: '#b45309' },
};

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

function StatusBadge({ meta }) {
  if (!meta) return null;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 700,
        background: meta.bg,
        color: meta.color,
      }}
    >
      {meta.label}
    </span>
  );
}

/**
 * [PHÂN CÔNG: QUANG - Nhánh feat/quang-order-payment-shipment]
 * Nhiệm vụ: Trang lịch sử đơn hàng, theo dõi trạng thái vận chuyển và hủy đơn.
 */
function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [error, setError] = useState('');
  const [bannerMsg, setBannerMsg] = useState(() =>
    location.state?.justCreatedOrderCode
      ? `Đặt hàng thành công! Mã đơn hàng của bạn là ${location.state.justCreatedOrderCode}.`
      : ''
  );

  const [confirmCancelOrder, setConfirmCancelOrder] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await orderApi.getMyOrders();
      setOrders(res?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể tải danh sách đơn hàng của bạn.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    orderApi
      .getMyOrders()
      .then((res) => {
        if (active) setOrders(res?.data || []);
      })
      .catch((err) => {
        if (active) {
          setError(err?.response?.data?.message || 'Không thể tải danh sách đơn hàng của bạn.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const countsByStatus = useMemo(() => {
    const counts = { ALL: orders.length };
    for (const order of orders) {
      counts[order.status] = (counts[order.status] || 0) + 1;
    }
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'ALL') return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleConfirmCancel = async () => {
    if (!confirmCancelOrder) return;
    const targetId = confirmCancelOrder.id;
    setCancellingId(targetId);
    setError('');
    try {
      const res = await orderApi.cancelOrder(targetId);
      const updated = res?.data;
      setOrders((prev) => prev.map((o) => (o.id === targetId ? updated || o : o)));
      setBannerMsg(`Đã hủy thành công đơn hàng ${confirmCancelOrder.orderCode}.`);
      setConfirmCancelOrder(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể hủy đơn hàng này.');
      setConfirmCancelOrder(null);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <MainLayout>
      <div className="container" style={{ padding: '32px 24px 72px', textAlign: 'left' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: 'var(--navy)' }}>
              Đơn Hàng Của Tôi
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '14px', color: 'var(--slate)' }}>
              Theo dõi tiến độ xử lý đơn, trạng thái thanh toán và hành trình giao hàng.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            disabled={loading}
            className="btn-outline-pill"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '999px',
              border: '1px solid var(--border)',
              background: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--navy)',
            }}
          >
            <RefreshCw size={15} />
            <span>Làm mới</span>
          </button>
        </div>

        {bannerMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              background: 'var(--mint-bg)',
              color: 'var(--emerald-dark)',
              border: '1px solid #bbf7d0',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '18px',
              fontSize: '13.5px',
              fontWeight: 600,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} />
              <span>{bannerMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setBannerMsg('')}
              style={{ border: 'none', background: 'transparent', color: 'var(--emerald-dark)', fontWeight: 700 }}
            >
              Đóng
            </button>
          </div>
        )}

        {error && <div className="auth-error" style={{ marginBottom: '18px' }}>{error}</div>}

        {/* Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '22px',
          }}
        >
          {ORDER_TABS.map((tab) => {
            const active = activeTab === tab.key;
            const count = countsByStatus[tab.key] || 0;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: '999px',
                  border: `1px solid ${active ? 'var(--emerald)' : '#e2e8f0'}`,
                  background: active ? 'var(--emerald)' : '#ffffff',
                  color: active ? '#ffffff' : '#334155',
                  fontSize: '13px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    padding: '1px 7px',
                    borderRadius: '999px',
                    fontSize: '11.5px',
                    background: active ? 'rgba(255,255,255,0.22)' : '#f1f5f9',
                    color: active ? '#ffffff' : '#475569',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--slate)' }}>
            Đang tải danh sách đơn hàng...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '64px 24px',
              background: '#f8fafc',
              borderRadius: '18px',
              border: '1px solid #eef2f6',
            }}
          >
            <ShoppingBag size={44} color="#00875A" style={{ marginBottom: '12px' }} />
            <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 800 }}>
              Chưa có đơn hàng nào
            </h2>
            <p style={{ margin: '0 0 20px', color: 'var(--slate)', fontSize: '14px' }}>
              {activeTab === 'ALL'
                ? 'Bạn chưa có đơn hàng nào tại The Sweet Lab. Khám phá ngay các món bánh kẹo lành mạnh!'
                : 'Không có đơn hàng nào ở trạng thái này.'}
            </p>
            <Link to="/products" className="view-all-btn">
              <span>Mua sắm ngay</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredOrders.map((order) => {
              const statusMeta = ORDER_STATUS_META[order.status] || {
                label: order.status,
                bg: '#f1f5f9',
                color: '#334155',
              };
              const payment = order.payment;
              const shipment = order.shipment;
              const paymentMeta = payment
                ? PAYMENT_STATUS_META[payment.status] || {
                    label: payment.status,
                    bg: '#f1f5f9',
                    color: '#334155',
                  }
                : null;
              const shipmentMeta = shipment
                ? SHIPMENT_STATUS_META[shipment.status] || {
                    label: shipment.status,
                    bg: '#f1f5f9',
                    color: '#334155',
                  }
                : null;

              return (
                <article
                  key={order.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '18px',
                    overflow: 'hidden',
                  }}
                >
                  {/* Card Top Bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                      padding: '16px 22px',
                      background: '#f8fafc',
                      borderBottom: '1px solid #eef2f6',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Package size={17} color="var(--emerald)" />
                        <strong style={{ fontSize: '15px', color: 'var(--navy)' }}>
                          {order.orderCode}
                        </strong>
                      </div>
                      <span style={{ color: '#cbd5e1' }}>|</span>
                      <span style={{ fontSize: '13px', color: 'var(--slate)' }}>
                        Đặt lúc: {formatDateTime(order.createdAt)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StatusBadge meta={statusMeta} />
                    </div>
                  </div>

                  {/* Items List */}
                  <div style={{ padding: '18px 22px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(order.items || []).map((item) => {
                        const fallbackImg = getCategoryImage(item.productName);
                        return (
                          <div
                            key={item.id}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '68px 1fr auto',
                              alignItems: 'center',
                              gap: '14px',
                              paddingBottom: '12px',
                              borderBottom: '1px dashed #f1f5f9',
                            }}
                          >
                            {item.productSlug ? (
                              <Link to={`/products/${item.productSlug}`}>
                                <img
                                  src={item.thumbnailUrl || fallbackImg}
                                  alt={item.productName}
                                  onError={(e) => {
                                    if (e.currentTarget.src !== window.location.origin + fallbackImg) {
                                      e.currentTarget.src = fallbackImg;
                                    }
                                  }}
                                  style={{
                                    width: '68px',
                                    height: '68px',
                                    borderRadius: '10px',
                                    objectFit: 'cover',
                                    border: '1px solid #f1f5f9',
                                  }}
                                />
                              </Link>
                            ) : (
                              <img
                                src={item.thumbnailUrl || fallbackImg}
                                alt={item.productName}
                                style={{
                                  width: '68px',
                                  height: '68px',
                                  borderRadius: '10px',
                                  objectFit: 'cover',
                                  border: '1px solid #f1f5f9',
                                }}
                              />
                            )}

                            <div>
                              {item.productSlug ? (
                                <Link
                                  to={`/products/${item.productSlug}`}
                                  style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--navy)' }}
                                >
                                  {item.productName}
                                </Link>
                              ) : (
                                <div style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--navy)' }}>
                                  {item.productName}
                                </div>
                              )}
                              <div style={{ fontSize: '12.5px', color: 'var(--slate)', marginTop: '3px' }}>
                                Phân loại: {item.variantName}
                                {item.sku ? ` (${item.sku})` : ''} • Đơn giá:{' '}
                                {formatCurrency(item.unitPrice)} × {item.quantity}
                              </div>
                            </div>

                            <strong style={{ fontSize: '14.5px', color: 'var(--navy)' }}>
                              {formatCurrency(item.lineTotal)}
                            </strong>
                          </div>
                        );
                      })}
                    </div>

                    {/* Grid thông tin Giao hàng + Thanh toán + Tổng kết */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '16px',
                        marginTop: '16px',
                      }}
                    >
                      {/* Địa chỉ & Vận chuyển */}
                      <div
                        style={{
                          padding: '14px',
                          borderRadius: '12px',
                          background: '#f8fafc',
                          border: '1px solid #eef2f6',
                          fontSize: '13px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px',
                            marginBottom: '8px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                            <Truck size={15} color="var(--emerald)" />
                            <span>Vận chuyển &amp; Nhận hàng</span>
                          </div>
                          {shipmentMeta && <StatusBadge meta={shipmentMeta} />}
                        </div>

                        <div style={{ color: 'var(--navy)', fontWeight: 600 }}>
                          {order.shippingRecipientName} • {order.shippingPhone}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '4px',
                            color: 'var(--slate)',
                            marginTop: '4px',
                          }}
                        >
                          <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{order.shippingAddress}</span>
                        </div>

                        {shipment && (
                          <div
                            style={{
                              marginTop: '8px',
                              paddingTop: '8px',
                              borderTop: '1px solid #e2e8f0',
                              color: '#475569',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '3px',
                            }}
                          >
                            <div>
                              Đơn vị VC:{' '}
                              <strong>{shipment.carrier || 'Đang điều phối'}</strong>
                            </div>
                            <div>
                              Mã vận đơn:{' '}
                              <strong>{shipment.trackingCode || 'Chưa cấp mã'}</strong>
                            </div>
                            {shipment.estimatedDeliveryAt && order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                              <div>Dự kiến giao: {formatDateTime(shipment.estimatedDeliveryAt)}</div>
                            )}
                            {shipment.shippedAt && (
                              <div>Bàn giao VC: {formatDateTime(shipment.shippedAt)}</div>
                            )}
                            {shipment.deliveredAt && (
                              <div>Đã giao lúc: {formatDateTime(shipment.deliveredAt)}</div>
                            )}
                          </div>
                        )}

                        {order.note && (
                          <div style={{ marginTop: '6px', fontStyle: 'italic', color: 'var(--slate)' }}>
                            Ghi chú: &ldquo;{order.note}&rdquo;
                          </div>
                        )}
                      </div>

                      {/* Thanh toán */}
                      <div
                        style={{
                          padding: '14px',
                          borderRadius: '12px',
                          background: '#f8fafc',
                          border: '1px solid #eef2f6',
                          fontSize: '13px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px',
                            marginBottom: '8px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                            <CreditCard size={15} color="var(--emerald)" />
                            <span>Thanh toán</span>
                          </div>
                          {paymentMeta && <StatusBadge meta={paymentMeta} />}
                        </div>

                        {payment ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: '#475569' }}>
                            <div>
                              Phương thức:{' '}
                              <strong style={{ color: 'var(--navy)' }}>
                                {payment.method === 'BANKING'
                                  ? 'Chuyển khoản ngân hàng'
                                  : 'Thanh toán khi nhận hàng (COD)'}
                              </strong>
                            </div>
                            {payment.transactionCode && (
                              <div>
                                Mã giao dịch: <strong>{payment.transactionCode}</strong>
                              </div>
                            )}
                            {payment.paidAt && (
                              <div>Thanh toán lúc: {formatDateTime(payment.paidAt)}</div>
                            )}
                          </div>
                        ) : (
                          <div style={{ color: 'var(--slate)' }}>Chưa có thông tin thanh toán</div>
                        )}

                        {/* Chi tiết tiền */}
                        <div
                          style={{
                            marginTop: '10px',
                            paddingTop: '10px',
                            borderTop: '1px solid #e2e8f0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--slate)' }}>
                              Tạm tính ({order.totalQuantity} món)
                            </span>
                            <span>{formatCurrency(order.subtotal)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--slate)' }}>Phí vận chuyển</span>
                            <span>{formatCurrency(order.shippingFee)}</span>
                          </div>
                          {Number(order.discountAmount) > 0 && (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                color: 'var(--emerald)',
                              }}
                            >
                              <span>
                                Giảm giá {order.voucherCode ? `(${order.voucherCode})` : ''}
                              </span>
                              <span>-{formatCurrency(order.discountAmount)}</span>
                            </div>
                          )}
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'baseline',
                              marginTop: '4px',
                              paddingTop: '6px',
                              borderTop: '1px dashed #cbd5e1',
                            }}
                          >
                            <strong style={{ color: 'var(--navy)' }}>Tổng cộng</strong>
                            <strong style={{ fontSize: '18px', color: 'var(--emerald)' }}>
                              {formatCurrency(order.totalAmount)}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Action: Hủy đơn chỉ khi PENDING */}
                    {order.status === 'PENDING' && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          marginTop: '16px',
                          paddingTop: '14px',
                          borderTop: '1px solid #f1f5f9',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setConfirmCancelOrder(order)}
                          disabled={cancellingId === order.id}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '9px 18px',
                            borderRadius: '999px',
                            border: '1px solid #fecaca',
                            background: '#fef2f2',
                            color: '#dc2626',
                            fontSize: '13px',
                            fontWeight: 700,
                          }}
                        >
                          <XCircle size={15} />
                          <span>
                            {cancellingId === order.id ? 'Đang hủy đơn...' : 'Hủy Đơn Hàng'}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Modal xác nhận Hủy đơn */}
        {confirmCancelOrder && (
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'rgba(15, 23, 42, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '420px',
                background: '#ffffff',
                borderRadius: '18px',
                padding: '24px',
                boxShadow: '0 20px 50px rgba(15, 23, 42, 0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <AlertTriangle size={22} color="#dc2626" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--navy)' }}>
                  Xác nhận hủy đơn hàng?
                </h3>
              </div>
              <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#475569', lineHeight: 1.55 }}>
                Bạn có chắc chắn muốn hủy đơn hàng{' '}
                <strong style={{ color: 'var(--navy)' }}>{confirmCancelOrder.orderCode}</strong> (
                {formatCurrency(confirmCancelOrder.totalAmount)}) không? Thao tác này không thể hoàn
                tác.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setConfirmCancelOrder(null)}
                  disabled={cancellingId != null}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '999px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#334155',
                    fontSize: '13.5px',
                    fontWeight: 600,
                  }}
                >
                  Giữ lại đơn
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={cancellingId != null}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '999px',
                    border: 'none',
                    background: '#dc2626',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: 700,
                  }}
                >
                  {cancellingId != null ? 'Đang hủy...' : 'Đồng ý hủy đơn'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default OrdersPage;
