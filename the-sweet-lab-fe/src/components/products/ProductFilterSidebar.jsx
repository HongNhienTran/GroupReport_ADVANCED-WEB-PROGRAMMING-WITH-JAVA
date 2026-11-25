import { SlidersHorizontal, Sparkles, Star } from 'lucide-react';

const RATING_OPTIONS = [
  { label: 'Từ 4.8 sao trở lên', value: 4.8 },
  { label: 'Từ 4.5 sao trở lên', value: 4.5 },
  { label: 'Từ 4 sao trở lên', value: 4.0 },
];

function ProductFilterSidebar({
  categories = [],
  nutritionTags = [],
  selectedCategoryId,
  selectedTagIds = [],
  maxPrice,
  minPrice,
  minRating,
  onSelectCategory,
  onToggleTag,
  onChangePrice,
  onSelectRating,
  onReset,
}) {
  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={16} color="#00875A" />
          BỘ LỌC TÌM KIẾM
        </span>
        <button type="button" className="filter-reset-btn" onClick={onReset}>
          Đặt lại
        </button>
      </div>

      <div>
        <h3 className="filter-group-title">DANH MỤC</h3>
        <div className="filter-cat-list">
          <button
            type="button"
            className={`filter-cat-btn ${selectedCategoryId === null ? 'active' : ''}`}
            onClick={() => onSelectCategory(null)}
          >
            <span>Tất cả danh mục</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-cat-btn ${selectedCategoryId === cat.id ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="filter-group-title">
          CHẾ ĐỘ DINH DƯỠNG <Sparkles size={14} color="#F59E0B" />
        </h3>
        <div className="filter-check-list">
          {nutritionTags.map((tag) => {
            const checked = selectedTagIds.includes(tag.id);
            return (
              <label key={tag.id} className={`filter-check-item ${checked ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleTag(tag.id)}
                />
                <span>{tag.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="filter-group-title">MỨC GIÁ</h3>
        <input
          type="range"
          min={0}
          max={900000}
          step={10000}
          value={maxPrice}
          onChange={(e) => onChangePrice(minPrice, Number(e.target.value))}
          className="price-range-slider"
        />
        <div className="price-inputs-row">
          <input
            type="number"
            min={0}
            step={10000}
            value={minPrice}
            onChange={(e) => onChangePrice(Number(e.target.value) || 0, maxPrice)}
            className="price-input-box"
            aria-label="Giá tối thiểu"
          />
          <input
            type="number"
            min={0}
            step={10000}
            value={maxPrice}
            onChange={(e) => onChangePrice(minPrice, Number(e.target.value) || 0)}
            className="price-input-box"
            aria-label="Giá tối đa"
          />
        </div>
      </div>

      <div>
        <h3 className="filter-group-title">ĐÁNH GIÁ SẢN PHẨM</h3>
        <div className="filter-check-list">
          {RATING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`rating-filter-btn ${minRating === opt.value ? 'active' : ''}`}
              onClick={() => onSelectRating(minRating === opt.value ? null : opt.value)}
            >
              <Star size={14} fill="#FACC15" color="#FACC15" />
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default ProductFilterSidebar;
