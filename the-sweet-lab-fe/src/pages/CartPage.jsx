import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import MainLayout from '../layouts/MainLayout';
import { formatCurrency, getCategoryImage } from '../utils/format';

function CartPage() {
  const { isAuthenticated } = useAuth();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const items = cart?.items || [];

  return (
    <MainLayout>
      <div className="container" style={{ padding: '36px 24px 72px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800 }}>
            Giỏ Hàng Của Bạn ({cart?.totalQuantity || 0})
          </h1>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              style={{
                border: '1px solid #fecaca',
                background: '#fef2f2',
                color: '#dc2626',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              Xóa tất cả
            </button>
          )}
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
            <h2 style={{ margin: '0 0 8px', fontSize: '20px' }}>Giỏ hàng đang trống</h2>
            <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: '14px' }}>
              Hãy chọn những món bánh kẹo lành mạnh yêu thích của bạn nhé!
            </p>
            <Link to="/products" className="view-all-btn">
              <span>Khám phá sản phẩm</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.8fr', gap: '28px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {items.map((item) => {
                const fallbackImg = getCategoryImage(item.categoryName);
                return (
                  <div
                    key={item.variantId}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '88px 1fr auto auto',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '14px',
                      background: '#ffffff',
                      border: '1px solid #eef2f6',
                      borderRadius: '14px',
                    }}
                  >
                    <Link to={`/products/${item.productSlug}`}>
                      <img
                        src={item.thumbnailUrl || fallbackImg}
                        alt={item.productName}
                        onError={(e) => {
                          if (e.currentTarget.src !== window.location.origin + fallbackImg) {
                            e.currentTarget.src = fallbackImg;
                          }
                        }}
                        style={{ width: '88px', height: '88px', objectFit: 'cover', borderRadius: '10px' }}
                      />
                    </Link>

                    <div>
                      <Link
                        to={`/products/${item.productSlug}`}
                        style={{ fontWeight: 700, fontSize: '15px', color: 'var(--navy)' }}
                      >
                        {item.productName}
                      </Link>
                      <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
                        {item.variantName} ({item.weightGram}g) • {formatCurrency(item.unitPrice)}
                      </div>
                    </div>

                    <div className="qty-control">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        aria-label="Giảm số lượng"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.variantId,
                            Math.min(item.stockQuantity, item.quantity + 1)
                          )
                        }
                        aria-label="Tăng số lượng"
                      >
                        +
                      </button>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <strong style={{ fontSize: '15.5px', color: 'var(--emerald)' }}>
                        {formatCurrency(item.lineTotal)}
                      </strong>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.variantId)}
                        style={{ border: 'none', background: 'transparent', color: '#94a3b8' }}
                        aria-label="Xóa sản phẩm"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside
              style={{
                background: '#ffffff',
                border: '1px solid #eef2f6',
                borderRadius: '16px',
                padding: '22px',
              }}
            >
              <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 800 }}>Tóm Tắt Đơn Hàng</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                <span style={{ color: '#64748b' }}>Tạm tính ({cart.totalQuantity} món)</span>
                <strong>{formatCurrency(cart.subtotal)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px', fontSize: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                <strong>Tổng cộng</strong>
                <strong style={{ color: 'var(--emerald)', fontSize: '20px' }}>
                  {formatCurrency(cart.subtotal)}
                </strong>
              </div>
              <button
                type="button"
                className="auth-submit-btn"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');
                  } else {
                    alert('Chức năng Thanh toán & Đặt hàng sẽ được triển khai ở Đợt 2!');
                  }
                }}
              >
                {isAuthenticated ? 'Tiến Hành Đặt Hàng' : 'Đăng Nhập Để Đặt Hàng'}
              </button>
            </aside>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default CartPage;
