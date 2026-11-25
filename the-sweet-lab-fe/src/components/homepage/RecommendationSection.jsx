import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCategoryImage } from '../../utils/format';
import ProductCard from '../common/ProductCard';

function RecommendationSection({
  categories = [],
  products = [],
  activeCategoryId,
  onSelectCategory,
  loading = false,
}) {
  const [startIndex, setStartIndex] = useState(0);

  const visibleCount = 8;
  const maxStart = Math.max(0, products.length - visibleCount);
  const safeStart = Math.min(startIndex, maxStart);
  const visibleProducts = products.slice(safeStart, safeStart + visibleCount);

  const handleCategoryClick = (catId) => {
    setStartIndex(0);
    onSelectCategory(catId);
  };

  return (
    <section id="recommendations" className="section-block">
      <div className="container">
        <h2 className="section-heading">Gợi Ý Dành Riêng Cho Bạn</h2>

        <div className="category-tabs">
          <button
            type="button"
            className={`category-tab-btn ${activeCategoryId === null ? 'active' : ''}`}
            onClick={() => handleCategoryClick(null)}
          >
            <div className="category-tab-icon">
              <img src="/categories/All.png" alt="Tất cả Sản Phẩm" />
            </div>
            <span>Tất Cả Sản Phẩm</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`category-tab-btn ${activeCategoryId === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              <div className="category-tab-icon">
                <img src={getCategoryImage(cat.name)} alt={cat.name} />
              </div>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
            Đang tải sản phẩm từ hệ thống...
          </div>
        ) : visibleProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
            Không tìm thấy sản phẩm phù hợp.
          </div>
        ) : (
          <div className="carousel-shell">
            {products.length > visibleCount && (
              <>
                <button
                  type="button"
                  className="carousel-arrow prev"
                  onClick={() => setStartIndex((prev) => Math.max(0, prev - 1))}
                  disabled={safeStart === 0}
                  aria-label="Sản phẩm trước"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  className="carousel-arrow next"
                  onClick={() => setStartIndex((prev) => Math.min(maxStart, prev + 1))}
                  disabled={safeStart >= maxStart}
                  aria-label="Sản phẩm tiếp theo"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            <div className="product-grid-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        <div className="section-action-right">
          <Link to="/products" className="view-all-btn">
            <span>Xem Tất Cả Sản Phẩm</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default RecommendationSection;
