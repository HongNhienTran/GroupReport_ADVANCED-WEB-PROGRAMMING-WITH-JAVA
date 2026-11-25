import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Heart, Plus, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency, getCategoryImage } from '../../utils/format';

function ProductCard({ product, badgeLabel, discountPercent }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = async () => {
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    } catch {
      // Ignore if out of stock
    }
  };
  const fallbackImg = getCategoryImage(product.categoryName);
  const imageSrc = product.thumbnailUrl || fallbackImg;
  const primaryTag =
    badgeLabel || (product.nutritionTags && product.nutritionTags[0]) || product.categoryName;

  const displayPrice = product.minPrice ?? 0;
  const computedOriginal =
    discountPercent && displayPrice > 0
      ? Math.round((displayPrice / (1 - discountPercent / 100)) / 1000) * 1000
      : null;

  return (
    <article className="product-card">
      <div className="product-card-media">
        <Link to={`/products/${product.slug}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          <img
            src={imageSrc}
            alt={product.name}
            onError={(e) => {
              if (e.currentTarget.src !== window.location.origin + fallbackImg) {
                e.currentTarget.src = fallbackImg;
              }
            }}
          />
        </Link>
        {discountPercent ? <span className="discount-badge">-{discountPercent}%</span> : null}
        <button type="button" className="wishlist-btn" aria-label="Thêm vào yêu thích">
          <Heart size={15} />
        </button>
        {primaryTag && <span className="card-tag-pill">{primaryTag}</span>}
      </div>

      <div className="product-meta-row">
        <span className="rating-wrap">
          <Star size={13} fill="#FACC15" color="#FACC15" />
          {product.reviewCount > 0 ? product.averageRating.toFixed(1) : '0.0'}{' '}
          <span>({product.reviewCount ?? 0})</span>
        </span>
        <span>{product.brandName}</span>
      </div>

      <Link to={`/products/${product.slug}`} className="product-title" title={product.name}>
        {product.name}
      </Link>

      <div className="product-nutrition-line">
        <span className="kcal-pill">{product.categoryName}</span>
        {product.allergens && product.allergens.length > 0 ? (
          <span>Dị ứng: {product.allergens.join(', ')}</span>
        ) : (
          <span>Không chứa chất gây dị ứng phổ biến</span>
        )}
      </div>

      <div className="product-card-footer">
        <div>
          <div className="price-current">{formatCurrency(displayPrice)}</div>
          {computedOriginal && (
            <div className="price-original">{formatCurrency(computedOriginal)}</div>
          )}
        </div>
        <button
          type="button"
          className="add-cart-btn"
          onClick={handleQuickAdd}
          aria-label={`Thêm ${product.name} vào giỏ`}
        >
          {added ? <Check size={18} /> : <Plus size={18} />}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
