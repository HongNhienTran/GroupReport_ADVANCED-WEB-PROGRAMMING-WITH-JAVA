import { Star } from 'lucide-react';

function ProductReviewsSection({ reviews = [], averageRating = 0, reviewCount = 0 }) {
  return (
    <section className="nutrition-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
          Đánh Giá Từ Khách Hàng ({reviewCount})
        </h2>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--mint-bg)', color: 'var(--emerald-dark)', padding: '6px 14px', borderRadius: '999px', fontWeight: 700, fontSize: '14px' }}>
          <Star size={16} fill="#FACC15" color="#FACC15" />
          <span>{reviewCount > 0 ? averageRating.toFixed(1) : '0.0'} / 5.0</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div style={{ color: 'var(--slate)', fontSize: '13.5px', padding: '12px 0' }}>
          Sản phẩm này chưa có đánh giá nào.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {reviews.map((rev) => {
            const initial = rev.userFullName ? rev.userFullName.trim().charAt(0).toUpperCase() : 'K';
            const dateStr = rev.createdAt
              ? new Date(rev.createdAt).toLocaleDateString('vi-VN')
              : '';
            return (
              <div
                key={`${rev.orderId}-${rev.productId}`}
                style={{
                  border: '1px solid #eef2f6',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  background: '#f8fafc',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="user-avatar-circle" style={{ width: '32px', height: '32px', fontSize: '13px' }}>
                      {initial}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--navy)' }}>
                        {rev.userFullName}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--slate)' }}>{dateStr}</div>
                    </div>
                  </div>

                  <div style={{ display: 'inline-flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        fill={s <= rev.rating ? '#FACC15' : 'none'}
                        color={s <= rev.rating ? '#FACC15' : '#CBD5E1'}
                      />
                    ))}
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '13.5px', color: '#334155', lineHeight: 1.55 }}>
                  {rev.comment}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ProductReviewsSection;
