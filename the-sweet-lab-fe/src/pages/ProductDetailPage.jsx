import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ChevronRight, Heart, ShieldAlert, ShoppingCart, Star } from 'lucide-react';
import { aiApi } from '../api/aiApi';
import { catalogApi } from '../api/catalogApi';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/common/ProductCard';
import NutritionFactsTable from '../components/product-detail/NutritionFactsTable';
import ProductGallery from '../components/product-detail/ProductGallery';
import ProductReviewsSection from '../components/product-detail/ProductReviewsSection';
import MainLayout from '../layouts/MainLayout';
import { formatCurrency } from '../utils/format';

function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedMsg, setAddedMsg] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      setQuantity(1);
      try {
        const res = await catalogApi.getProductBySlug(slug);
        const detail = res.data;
        setProduct(detail);
        setSelectedVariant(detail?.variants?.[0] || null);

        if (detail?.id) {
          aiApi.trackEvent({ productId: detail.id, actionType: 'VIEW' });
        }

        const [relRes, recRes, revRes] = await Promise.allSettled([
          detail?.category?.id
            ? catalogApi.getProducts({
                categoryId: detail.category.id,
                page: 0,
                size: 9,
                sortBy: 'id',
                sortDir: 'asc',
              })
            : Promise.resolve({ data: { content: [] } }),
          aiApi.getRecommendations({ limit: 9 }),
          detail?.id ? catalogApi.getProductReviews(detail.id) : Promise.resolve({ data: [] }),
        ]);

        if (relRes.status === 'fulfilled') {
          const items = (relRes.value.data?.content || [])
            .filter((item) => item.id !== detail.id)
            .slice(0, 8);
          setRelatedProducts(items);
        }

        if (recRes.status === 'fulfilled') {
          const recItems = (recRes.value.data || [])
            .filter((item) => item.id !== detail.id)
            .slice(0, 8);
          setRecommendedProducts(recItems);
        }

        if (revRes.status === 'fulfilled') {
          setReviews(revRes.value.data || []);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: '#64748b' }}>
          Đang tải thông tin sản phẩm...
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <h2>Không tìm thấy sản phẩm</h2>
          <Link to="/products" className="view-all-btn" style={{ marginTop: '12px' }}>
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </MainLayout>
    );
  }

  const activePrice = selectedVariant?.price ?? 0;
  const activeOriginal = selectedVariant?.originalPrice;

  return (
    <MainLayout>
      <div className="container detail-page-wrap">
        <nav className="breadcrumb-bar" aria-label="Breadcrumb">
          <Link to="/">Trang chủ</Link>
          <ChevronRight size={14} />
          <Link to={`/products?categoryId=${product.category?.id || ''}`}>
            {product.category?.name}
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--navy)', fontWeight: 600 }}>{product.name}</span>
        </nav>

        <div className="detail-main-grid">
          <ProductGallery
            images={product.images}
            productName={product.name}
            categoryName={product.category?.name}
          />

          <div>
            <div className="detail-badges">
              <span className="detail-brand-pill">{product.brand?.name}</span>
              <span className="detail-cat-pill">{product.category?.name}</span>
              {product.nutritionTags?.map((tag) => (
                <span key={tag.id} className="detail-cat-pill">
                  #{tag.name}
                </span>
              ))}
            </div>

            <h1 className="detail-title">{product.name}</h1>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px', fontSize: '13.5px', fontWeight: 700, color: 'var(--navy)' }}>
              <Star size={15} fill="#FACC15" color="#FACC15" />
              <span>{product.reviewCount > 0 ? product.averageRating.toFixed(1) : '0.0'}</span>
              <span style={{ color: 'var(--slate)', fontWeight: 500 }}>({product.reviewCount ?? 0} đánh giá)</span>
            </div>

            <div className="detail-price-row">
              <span className="detail-price">{formatCurrency(activePrice)}</span>
              {activeOriginal && activeOriginal > activePrice && (
                <span className="detail-original-price">{formatCurrency(activeOriginal)}</span>
              )}
            </div>

            {product.variants && product.variants.length > 0 && (
              <div>
                <p className="detail-section-label">
                  Quy cách / Biến thể ({selectedVariant?.weightGram}g • Còn{' '}
                  {selectedVariant?.stockQuantity} sản phẩm)
                </p>
                <div className="variant-list">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      className={`variant-btn ${selectedVariant?.id === variant.id ? 'active' : ''}`}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="detail-qty-actions">
              <div className="qty-control">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Giảm số lượng"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(selectedVariant?.stockQuantity || 99, q + 1)
                    )
                  }
                  aria-label="Tăng số lượng"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="detail-add-btn"
                onClick={async () => {
                  if (!selectedVariant) return;
                  await addToCart({ variantId: selectedVariant.id, quantity });
                  setAddedMsg('Đã thêm vào giỏ hàng!');
                  setTimeout(() => setAddedMsg(''), 2000);
                }}
              >
                <ShoppingCart size={18} />
                <span>{addedMsg || 'Thêm vào giỏ hàng'}</span>
              </button>

              <button
                type="button"
                className="icon-badge-btn"
                style={{ border: '1px solid var(--border)', width: '44px', height: '44px' }}
                aria-label="Lưu vào yêu thích"
              >
                <Heart size={18} />
              </button>
            </div>

            <div className="detail-info-card">
              <div>
                <strong>Mô tả:</strong> {product.description}
              </div>
              <div>
                <strong>Thành phần:</strong> {product.ingredients}
              </div>
              <div>
                <strong>Hạn sử dụng:</strong> {product.shelfLifeDays} ngày •{' '}
                <strong>Bảo quản:</strong> {product.storageInstruction}
              </div>
              {product.allergens && product.allergens.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b45309' }}>
                  <ShieldAlert size={16} />
                  <span>
                    <strong>Lưu ý dị ứng:</strong> {product.allergens.join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <NutritionFactsTable nutritionFacts={product.nutritionFacts} />

        <ProductReviewsSection
          reviews={reviews}
          averageRating={product.averageRating}
          reviewCount={product.reviewCount}
        />

        {relatedProducts.length > 0 && (
          <section className="related-section">
            <div className="related-header">
              <h2>Sản Phẩm Liên Quan</h2>
              <Link
                to={`/products?categoryId=${product.category?.id || ''}`}
                className="view-all-btn"
              >
                <span>Xem thêm</span>
                <ArrowRight size={15} />
              </Link>
            </div>
            <div className="product-grid-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}

        {recommendedProducts.length > 0 && (
          <section className="related-section">
            <div className="related-header">
              <h2>Gợi Ý Dành Riêng Cho Bạn</h2>
              <Link to="/products" className="view-all-btn">
                <span>Tất cả sản phẩm</span>
                <ArrowRight size={15} />
              </Link>
            </div>
            <div className="product-grid-4">
              {recommendedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}

export default ProductDetailPage;
