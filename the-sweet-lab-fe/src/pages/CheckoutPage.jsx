import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  CreditCard,
  MapPin,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Ticket,
  Truck,
  X,
} from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { profileApi } from '../api/profileApi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import MainLayout from '../layouts/MainLayout';
import { formatCurrency, getCategoryImage } from '../utils/format';

const SHIPPING_FEE_HCM = 25000;
const SHIPPING_FEE_DEFAULT = 30000;

const ADDRESS_TYPE_LABELS = {
  HOME: 'Nhà riêng',
  OFFICE: 'Văn phòng',
  OTHER: 'Khác',
};

function isHoChiMinhAddress(text = '') {
  if (!text) return false;
  const normalized = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
  return (
    normalized.includes('ho chi minh') ||
    normalized.includes('tp.hcm') ||
    normalized.includes('tphcm') ||
    normalized.includes('tp hcm')
  );
}

function computeVoucherPreviewDiscount(voucherData, subtotal) {
  if (!voucherData || subtotal <= 0) return null;
  if (typeof voucherData.discountAmount === 'number') {
    return Math.min(Math.max(0, voucherData.discountAmount), subtotal);
  }
  if (voucherData.discountType && voucherData.discountValue != null) {
    const val = Number(voucherData.discountValue) || 0;
    let discount = 0;
    if (voucherData.discountType === 'PERCENTAGE') {
      discount = Math.round((subtotal * val) / 100);
      if (voucherData.maxDiscountAmount != null && Number(voucherData.maxDiscountAmount) > 0) {
        discount = Math.min(discount, Number(voucherData.maxDiscountAmount));
      }
    } else {
      discount = val;
    }
    return Math.min(Math.max(0, discount), subtotal);
  }
  return null;
}

/**
 * [PHÂN CÔNG: QUANG - Nhánh feat/quang-order-payment-shipment]
 * Nhiệm vụ: Trang thanh toán (chọn địa chỉ UserAddress, chọn COD/BANKING, nhập Voucher, đặt hàng).
 */
function CheckoutPage() {
  const { isAuthenticated } = useAuth();
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [addressMode, setAddressMode] = useState('saved'); // 'saved' | 'custom'
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [customAddress, setCustomAddress] = useState({
    recipientName: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    detailAddress: '',
    type: 'HOME',
  });
  const [saveToAddressBook, setSaveToAddressBook] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [note, setNote] = useState('');

  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucherCode, setAppliedVoucherCode] = useState('');
  const [voucherPreviewDiscount, setVoucherPreviewDiscount] = useState(null);
  const [voucherStatus, setVoucherStatus] = useState({ type: '', message: '' });
  const [checkingVoucher, setCheckingVoucher] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const items = cart?.items || [];
  const subtotal = Number(cart?.subtotal || 0);

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    profileApi
      .getProfile()
      .then((res) => {
        if (!active) return;
        const data = res?.data || {};
        const savedList = data.addresses || [];
        setAddresses(savedList);

        setCustomAddress((prev) => ({
          ...prev,
          recipientName: data.fullName || '',
          phone: data.phone || '',
        }));

        if (savedList.length > 0) {
          const defaultAddr = savedList.find((a) => a.isDefault) || savedList[0];
          setSelectedAddressId(defaultAddr.id);
          setAddressMode('saved');
        } else {
          setAddressMode('custom');
        }
      })
      .catch(() => {
        if (active) {
          setAddressMode('custom');
        }
      })
      .finally(() => {
        if (active) setLoadingProfile(false);
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const selectedSavedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedAddressId) || null,
    [addresses, selectedAddressId]
  );

  const resolvedAddressText = useMemo(() => {
    if (addressMode === 'saved' && selectedSavedAddress) {
      return `${selectedSavedAddress.detailAddress}, ${selectedSavedAddress.ward}, ${selectedSavedAddress.district}, ${selectedSavedAddress.province}`;
    }
    const parts = [
      customAddress.detailAddress.trim(),
      customAddress.ward.trim(),
      customAddress.district.trim(),
      customAddress.province.trim(),
    ].filter(Boolean);
    return parts.join(', ');
  }, [addressMode, selectedSavedAddress, customAddress]);

  const isHcm = useMemo(() => isHoChiMinhAddress(resolvedAddressText), [resolvedAddressText]);

  const shippingFee = useMemo(() => {
    if (items.length === 0) return 0;
    if (!resolvedAddressText) return SHIPPING_FEE_DEFAULT;
    return isHcm ? SHIPPING_FEE_HCM : SHIPPING_FEE_DEFAULT;
  }, [items.length, resolvedAddressText, isHcm]);

  const discountAmount = useMemo(() => {
    if (voucherPreviewDiscount == null) return 0;
    return Math.min(voucherPreviewDiscount, subtotal);
  }, [voucherPreviewDiscount, subtotal]);

  const totalAmount = useMemo(
    () => Math.max(0, subtotal - discountAmount) + shippingFee,
    [subtotal, discountAmount, shippingFee]
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleApplyVoucher = async () => {
    const code = voucherInput.trim();
    if (!code) {
      setVoucherStatus({ type: 'error', message: 'Vui lòng nhập mã giảm giá.' });
      return;
    }

    setCheckingVoucher(true);
    setVoucherStatus({ type: '', message: '' });

    try {
      const res = await orderApi.validateVoucher({
        code,
        orderAmount: subtotal,
      });
      const data = res?.data;
      if (data && data.valid === false) {
        setAppliedVoucherCode(code);
        setVoucherPreviewDiscount(null);
        setVoucherStatus({
          type: 'warning',
          message:
            data.message ||
            'Không thể xác nhận trước điều kiện mã; mã vẫn sẽ được gửi kèm để kiểm tra khi Đặt hàng.',
        });
        return;
      }

      const preview = computeVoucherPreviewDiscount(data, subtotal);
      setAppliedVoucherCode(code);
      setVoucherPreviewDiscount(preview);
      setVoucherStatus({
        type: 'success',
        message:
          preview != null
            ? `Đã áp dụng mã "${code.toUpperCase()}" (-${formatCurrency(preview)}).`
            : `Đã ghi nhận mã "${code.toUpperCase()}". Hệ thống sẽ tính giảm giá khi Đặt hàng.`,
      });
    } catch (err) {
      const status = err?.response?.status;
      const backendMsg = err?.response?.data?.message;

      // Vẫn cho phép gửi kèm mã trong checkout theo đặc tả phối hợp nhóm
      setAppliedVoucherCode(code);
      setVoucherPreviewDiscount(null);

      if (status === 400 && backendMsg) {
        setVoucherStatus({
          type: 'warning',
          message: `${backendMsg} (Nếu bạn vẫn giữ mã "${code}", hệ thống sẽ kiểm tra lại khi Đặt hàng).`,
        });
      } else {
        setVoucherStatus({
          type: 'info',
          message: `Đã đính kèm mã "${code.toUpperCase()}". Hệ thống sẽ kiểm tra và trừ tiền trực tiếp khi Đặt hàng.`,
        });
      }
    } finally {
      setCheckingVoucher(false);
    }
  };

  const handleClearVoucher = () => {
    setVoucherInput('');
    setAppliedVoucherCode('');
    setVoucherPreviewDiscount(null);
    setVoucherStatus({ type: '', message: '' });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (items.length === 0) {
      setError('Giỏ hàng của bạn đang trống, không thể đặt hàng.');
      return;
    }

    let payload = {
      paymentMethod,
      note: note.trim() || undefined,
    };

    const finalVoucher = (appliedVoucherCode || voucherInput).trim();
    if (finalVoucher) {
      payload.voucherCode = finalVoucher;
    }

    if (addressMode === 'saved') {
      if (!selectedAddressId) {
        setError('Vui lòng chọn một địa chỉ nhận hàng hoặc chuyển sang nhập địa chỉ mới.');
        return;
      }
      payload.addressId = selectedAddressId;
    } else {
      const recipientName = customAddress.recipientName.trim();
      const phone = customAddress.phone.trim();
      const province = customAddress.province.trim();
      const district = customAddress.district.trim();
      const ward = customAddress.ward.trim();
      const detailAddress = customAddress.detailAddress.trim();

      if (!recipientName || !phone || !province || !district || !ward || !detailAddress) {
        setError('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ giao hàng.');
        return;
      }

      if (saveToAddressBook) {
        try {
          await profileApi.addAddress({
            recipientName,
            phone,
            province,
            district,
            ward,
            detailAddress,
            type: customAddress.type || 'HOME',
            isDefault: addresses.length === 0,
          });
        } catch {
          // Vẫn tiếp tục đặt hàng với thông tin địa chỉ trực tiếp nếu lưu sổ địa chỉ thất bại
        }
      }

      payload.shippingRecipientName = recipientName;
      payload.shippingPhone = phone;
      payload.shippingAddress = `${detailAddress}, ${ward}, ${district}, ${province}`;
    }

    setSubmitting(true);
    try {
      const res = await orderApi.checkout(payload);
      await refreshCart();
      navigate('/orders', {
        state: {
          justCreatedOrderCode: res?.data?.orderCode,
        },
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Đặt hàng không thành công. Vui lòng kiểm tra lại thông tin hoặc tồn kho sản phẩm.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container" style={{ padding: '32px 24px 72px', textAlign: 'left' }}>
        <div style={{ marginBottom: '22px' }}>
          <Link
            to="/cart"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13.5px',
              fontWeight: 600,
              color: 'var(--emerald)',
              marginBottom: '10px',
            }}
          >
            <ArrowLeft size={16} />
            <span>Quay lại giỏ hàng</span>
          </Link>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: 'var(--navy)' }}>
            Thanh Toán Đơn Hàng
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '14px', color: 'var(--slate)' }}>
            Kiểm tra địa chỉ nhận hàng, chọn phương thức thanh toán và hoàn tất đơn hàng của bạn.
          </p>
        </div>

        {items.length === 0 ? (
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
              Giỏ hàng của bạn đang trống
            </h2>
            <p style={{ margin: '0 0 20px', color: 'var(--slate)', fontSize: '14px' }}>
              Vui lòng thêm sản phẩm vào giỏ hàng trước khi tiến hành thanh toán.
            </p>
            <Link to="/products" className="view-all-btn">
              <span>Tiếp tục mua sắm</span>
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handlePlaceOrder}
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.45fr) minmax(320px, 0.9fr)',
              gap: '28px',
              alignItems: 'start',
            }}
          >
            {/* Cột trái: Địa chỉ, Thanh toán, Ghi chú */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {error && <div className="auth-error">{error}</div>}

              {/* 1. Địa chỉ giao hàng */}
              <section
                style={{
                  background: '#ffffff',
                  border: '1px solid #eef2f6',
                  borderRadius: '18px',
                  padding: '24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '18px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin size={20} color="var(--emerald)" />
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                      Địa Chỉ Nhận Hàng
                    </h2>
                  </div>

                  {addresses.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setAddressMode('saved')}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '999px',
                          border: `1px solid ${addressMode === 'saved' ? 'var(--emerald)' : 'var(--border)'}`,
                          background: addressMode === 'saved' ? 'var(--mint-bg)' : '#ffffff',
                          color: addressMode === 'saved' ? 'var(--emerald-dark)' : '#475569',
                          fontSize: '12.5px',
                          fontWeight: 700,
                        }}
                      >
                        Sổ địa chỉ ({addresses.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddressMode('custom')}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '7px 14px',
                          borderRadius: '999px',
                          border: `1px solid ${addressMode === 'custom' ? 'var(--emerald)' : 'var(--border)'}`,
                          background: addressMode === 'custom' ? 'var(--mint-bg)' : '#ffffff',
                          color: addressMode === 'custom' ? 'var(--emerald-dark)' : '#475569',
                          fontSize: '12.5px',
                          fontWeight: 700,
                        }}
                      >
                        <Plus size={14} />
                        <span>Nhập địa chỉ mới</span>
                      </button>
                    </div>
                  )}
                </div>

                {loadingProfile ? (
                  <p style={{ fontSize: '13.5px', color: 'var(--slate)' }}>
                    Đang tải sổ địa chỉ...
                  </p>
                ) : addressMode === 'saved' && addresses.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {addresses.map((addr) => {
                      const selected = addr.id === selectedAddressId;
                      return (
                        <label
                          key={addr.id}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            padding: '14px 16px',
                            borderRadius: '14px',
                            border: `1.5px solid ${selected ? 'var(--emerald)' : '#e2e8f0'}`,
                            background: selected ? 'var(--mint-soft)' : '#ffffff',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                        >
                          <input
                            type="radio"
                            name="savedAddress"
                            checked={selected}
                            onChange={() => setSelectedAddressId(addr.id)}
                            style={{ marginTop: '4px', accentColor: 'var(--emerald)' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '8px',
                                fontWeight: 700,
                                fontSize: '14.5px',
                                color: 'var(--navy)',
                              }}
                            >
                              <span>{addr.recipientName}</span>
                              <span style={{ color: '#94a3b8' }}>•</span>
                              <span>{addr.phone}</span>
                              {addr.type && (
                                <span
                                  style={{
                                    fontSize: '11.5px',
                                    fontWeight: 600,
                                    padding: '2px 8px',
                                    borderRadius: '999px',
                                    background: '#f1f5f9',
                                    color: '#475569',
                                  }}
                                >
                                  {ADDRESS_TYPE_LABELS[addr.type] || addr.type}
                                </span>
                              )}
                              {addr.isDefault && (
                                <span className="kcal-pill" style={{ fontSize: '11.5px' }}>
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '13.5px', color: 'var(--slate)', marginTop: '4px' }}>
                              {addr.detailAddress}, {addr.ward}, {addr.district}, {addr.province}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="auth-form">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-field">
                        <label>Họ và tên người nhận *</label>
                        <div className="input-box">
                          <input
                            placeholder="Nguyễn Văn A"
                            value={customAddress.recipientName}
                            onChange={(e) =>
                              setCustomAddress({ ...customAddress, recipientName: e.target.value })
                            }
                            required={addressMode === 'custom'}
                          />
                        </div>
                      </div>
                      <div className="form-field">
                        <label>Số điện thoại *</label>
                        <div className="input-box">
                          <input
                            placeholder="0901234567"
                            value={customAddress.phone}
                            onChange={(e) =>
                              setCustomAddress({ ...customAddress, phone: e.target.value })
                            }
                            required={addressMode === 'custom'}
                          />
                        </div>
                      </div>
                      <div className="form-field">
                        <label>Tỉnh / Thành phố *</label>
                        <div className="input-box">
                          <input
                            placeholder="TP. Hồ Chí Minh"
                            value={customAddress.province}
                            onChange={(e) =>
                              setCustomAddress({ ...customAddress, province: e.target.value })
                            }
                            required={addressMode === 'custom'}
                          />
                        </div>
                      </div>
                      <div className="form-field">
                        <label>Quận / Huyện *</label>
                        <div className="input-box">
                          <input
                            placeholder="Quận 1"
                            value={customAddress.district}
                            onChange={(e) =>
                              setCustomAddress({ ...customAddress, district: e.target.value })
                            }
                            required={addressMode === 'custom'}
                          />
                        </div>
                      </div>
                      <div className="form-field">
                        <label>Phường / Xã *</label>
                        <div className="input-box">
                          <input
                            placeholder="Phường Bến Nghé"
                            value={customAddress.ward}
                            onChange={(e) =>
                              setCustomAddress({ ...customAddress, ward: e.target.value })
                            }
                            required={addressMode === 'custom'}
                          />
                        </div>
                      </div>
                      <div className="form-field">
                        <label>Loại địa chỉ</label>
                        <div className="input-box">
                          <select
                            value={customAddress.type}
                            onChange={(e) =>
                              setCustomAddress({ ...customAddress, type: e.target.value })
                            }
                            style={{
                              width: '100%',
                              border: 'none',
                              outline: 'none',
                              fontFamily: 'inherit',
                              fontSize: '14px',
                              color: 'var(--navy)',
                              background: 'transparent',
                            }}
                          >
                            <option value="HOME">Nhà riêng</option>
                            <option value="OFFICE">Văn phòng</option>
                            <option value="OTHER">Khác</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="form-field">
                      <label>Số nhà, tên đường *</label>
                      <div className="input-box">
                        <input
                          placeholder="Ví dụ: 12 Nguyễn Huệ"
                          value={customAddress.detailAddress}
                          onChange={(e) =>
                            setCustomAddress({ ...customAddress, detailAddress: e.target.value })
                          }
                          required={addressMode === 'custom'}
                        />
                      </div>
                    </div>

                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13.5px',
                        color: '#475569',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={saveToAddressBook}
                        onChange={(e) => setSaveToAddressBook(e.target.checked)}
                        style={{ accentColor: 'var(--emerald)' }}
                      />
                      <span>Lưu địa chỉ này vào Sổ địa chỉ cá nhân</span>
                    </label>
                  </div>
                )}

                <div
                  style={{
                    marginTop: '14px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '1px solid #eef2f6',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    color: '#475569',
                  }}
                >
                  <Truck size={16} color="var(--emerald)" />
                  <span>
                    Phí vận chuyển áp dụng:{' '}
                    <strong style={{ color: 'var(--navy)' }}>
                      {isHcm
                        ? '25.000đ (Nội thành TP. Hồ Chí Minh - dự kiến 2 ngày)'
                        : '30.000đ (Tỉnh / Thành phố khác - dự kiến 4 ngày)'}
                    </strong>
                  </span>
                </div>
              </section>

              {/* 2. Phương thức thanh toán */}
              <section
                style={{
                  background: '#ffffff',
                  border: '1px solid #eef2f6',
                  borderRadius: '18px',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <CreditCard size={20} color="var(--emerald)" />
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                    Phương Thức Thanh Toán
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    {
                      value: 'COD',
                      title: 'Thanh toán khi nhận hàng (COD)',
                      desc: 'Kiểm tra hàng và thanh toán tiền mặt trực tiếp cho shipper.',
                      Icon: Banknote,
                    },
                    {
                      value: 'BANKING',
                      title: 'Chuyển khoản ngân hàng',
                      desc: 'Thanh toán nhanh qua VietQR / Internet Banking.',
                      Icon: CreditCard,
                    },
                  ].map(({ value, title, desc, Icon }) => {
                    const active = paymentMethod === value;
                    return (
                      <label
                        key={value}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          padding: '16px',
                          borderRadius: '14px',
                          border: `1.5px solid ${active ? 'var(--emerald)' : '#e2e8f0'}`,
                          background: active ? 'var(--mint-soft)' : '#ffffff',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={value}
                            checked={active}
                            onChange={() => setPaymentMethod(value)}
                            style={{ accentColor: 'var(--emerald)' }}
                          />
                          <Icon size={18} color="var(--emerald)" />
                          <strong style={{ fontSize: '14px', color: 'var(--navy)' }}>{title}</strong>
                        </div>
                        <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--slate)', paddingLeft: '26px' }}>
                          {desc}
                        </p>
                      </label>
                    );
                  })}
                </div>

                {paymentMethod === 'BANKING' && (
                  <div
                    style={{
                      marginTop: '14px',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      background: 'var(--mint-bg)',
                      border: '1px solid #bbf7d0',
                      fontSize: '13px',
                      color: 'var(--emerald-deep)',
                      lineHeight: 1.6,
                    }}
                  >
                    <strong>Thông tin chuyển khoản The Sweet Lab:</strong>
                    <div>• Ngân hàng: Vietcombank — STK: <strong>1029384756</strong> — Chủ TK: <strong>THE SWEET LAB</strong></div>
                    <div>• Nội dung chuyển khoản: <strong>Mã đơn hàng + Số điện thoại</strong> (hiển thị ngay sau khi đặt hàng).</div>
                  </div>
                )}
              </section>

              {/* 3. Ghi chú đơn hàng */}
              <section
                style={{
                  background: '#ffffff',
                  border: '1px solid #eef2f6',
                  borderRadius: '18px',
                  padding: '24px',
                }}
              >
                <div className="form-field">
                  <label style={{ fontSize: '15px', fontWeight: 800, marginBottom: '10px' }}>
                    Ghi Chú Đơn Hàng (Tùy chọn)
                  </label>
                  <div className="input-box">
                    <textarea
                      rows={3}
                      maxLength={1000}
                      placeholder="Ví dụ: Giao giờ hành chính, thêm túi đá khô giữ lạnh cho Nama Socola..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        fontSize: '14px',
                        color: 'var(--navy)',
                      }}
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Cột phải: Tóm tắt đơn hàng & Voucher */}
            <aside
              style={{
                background: '#ffffff',
                border: '1px solid #eef2f6',
                borderRadius: '18px',
                padding: '24px',
                position: 'sticky',
                top: '96px',
              }}
            >
              <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 800 }}>
                Đơn Hàng ({cart?.totalQuantity || 0} sản phẩm)
              </h2>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  maxHeight: '290px',
                  overflowY: 'auto',
                  paddingRight: '4px',
                  marginBottom: '18px',
                }}
              >
                {items.map((item) => {
                  const fallbackImg = getCategoryImage(item.categoryName);
                  return (
                    <div
                      key={item.variantId}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '56px 1fr auto',
                        gap: '12px',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src={item.thumbnailUrl || fallbackImg}
                        alt={item.productName}
                        onError={(e) => {
                          if (e.currentTarget.src !== window.location.origin + fallbackImg) {
                            e.currentTarget.src = fallbackImg;
                          }
                        }}
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '10px',
                          objectFit: 'cover',
                          border: '1px solid #f1f5f9',
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '13.5px',
                            fontWeight: 700,
                            color: 'var(--navy)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.productName}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--slate)', marginTop: '2px' }}>
                          {item.variantName} × {item.quantity}
                        </div>
                      </div>
                      <strong style={{ fontSize: '13.5px', color: 'var(--navy)' }}>
                        {formatCurrency(item.lineTotal)}
                      </strong>
                    </div>
                  );
                })}
              </div>

              {/* Mã giảm giá */}
              <div
                style={{
                  borderTop: '1px solid #f1f5f9',
                  borderBottom: '1px solid #f1f5f9',
                  padding: '16px 0',
                  marginBottom: '16px',
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--navy)',
                    marginBottom: '8px',
                  }}
                >
                  <Ticket size={15} color="var(--emerald)" />
                  <span>Mã giảm giá (Voucher)</span>
                </label>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <div className="input-box" style={{ flex: 1, padding: '8px 12px' }}>
                    <input
                      placeholder="Nhập mã voucher..."
                      value={voucherInput}
                      onChange={(e) => {
                        setVoucherInput(e.target.value);
                        if (appliedVoucherCode && e.target.value.trim() !== appliedVoucherCode) {
                          setAppliedVoucherCode('');
                          setVoucherPreviewDiscount(null);
                        }
                      }}
                    />
                    {(voucherInput || appliedVoucherCode) && (
                      <button
                        type="button"
                        onClick={handleClearVoucher}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: '#94a3b8',
                          padding: 0,
                          display: 'flex',
                        }}
                        aria-label="Xóa mã giảm giá"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    disabled={checkingVoucher}
                    style={{
                      padding: '0 16px',
                      borderRadius: '12px',
                      border: '1px solid var(--emerald)',
                      background: 'var(--mint-bg)',
                      color: 'var(--emerald-dark)',
                      fontWeight: 700,
                      fontSize: '13px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {checkingVoucher ? 'Đang kiểm tra...' : 'Áp dụng'}
                  </button>
                </div>

                {voucherStatus.message && (
                  <div
                    style={{
                      marginTop: '8px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background:
                        voucherStatus.type === 'error'
                          ? '#fef2f2'
                          : voucherStatus.type === 'warning'
                            ? '#fffbeb'
                            : 'var(--mint-bg)',
                      color:
                        voucherStatus.type === 'error'
                          ? '#dc2626'
                          : voucherStatus.type === 'warning'
                            ? '#b45309'
                            : 'var(--emerald-dark)',
                    }}
                  >
                    {voucherStatus.message}
                  </div>
                )}
              </div>

              {/* Chi tiết thanh toán */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate)' }}>Tạm tính</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate)' }}>
                    Phí vận chuyển ({isHcm ? 'TP.HCM' : 'Tỉnh khác'})
                  </span>
                  <strong>{formatCurrency(shippingFee)}</strong>
                </div>
                {(discountAmount > 0 || (appliedVoucherCode || voucherInput.trim())) && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--emerald)' }}>
                    <span>
                      Giảm giá{' '}
                      {(appliedVoucherCode || voucherInput.trim()) &&
                        `(${(appliedVoucherCode || voucherInput.trim()).toUpperCase()})`}
                    </span>
                    <strong>
                      {discountAmount > 0 ? `-${formatCurrency(discountAmount)}` : 'Tính khi đặt hàng'}
                    </strong>
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '14px',
                    marginTop: '4px',
                  }}
                >
                  <strong style={{ fontSize: '16px' }}>Tổng thanh toán</strong>
                  <strong style={{ fontSize: '22px', color: 'var(--emerald)' }}>
                    {formatCurrency(totalAmount)}
                  </strong>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="auth-submit-btn"
                style={{
                  marginTop: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <CheckCircle2 size={18} />
                <span>{submitting ? 'Đang xử lý đơn hàng...' : 'Xác Nhận Đặt Hàng'}</span>
              </button>

              <div
                style={{
                  marginTop: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: 'var(--slate)',
                }}
              >
                <ShieldCheck size={15} color="var(--emerald)" />
                <span>Đảm bảo vệ sinh ATTP &amp; cam kết chính hãng The Sweet Lab</span>
              </div>
            </aside>
          </form>
        )}
      </div>
    </MainLayout>
  );
}

export default CheckoutPage;
