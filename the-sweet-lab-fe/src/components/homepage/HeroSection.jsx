import { useState } from 'react';
import { ArrowRight, Search, Tag } from 'lucide-react';

const SUGGESTION_TAGS = [
  { label: '#Socola đen 85%', keyword: '85%' },
  { label: '#Biscotti không đường', keyword: 'Biscotti' },
  { label: '#Kẹo dẻo Vegan', keyword: 'Kẹo dẻo' },
  { label: '#Nama cốt dừa', keyword: 'Nama' },
  { label: '#Bánh ngói Keto', keyword: 'Bánh ngói' },
  { label: '#Hộp quà Healthy', keyword: 'Hộp quà' },
];

function HeroSection({ categories = [], onSearch }) {
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        keyword: keyword.trim(),
        categoryId: categoryId ? Number(categoryId) : null,
      });
      document.getElementById('recommendations')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSuggestion = (kw) => {
    setKeyword(kw);
    if (onSearch) {
      onSearch({ keyword: kw, categoryId: categoryId ? Number(categoryId) : null });
      document.getElementById('recommendations')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-grid">
          <div>
            <h1 className="hero-title">
              Nuông Chiều
              <span className="highlight">Cơn Thèm Ngọt</span>
              Một Cách Lành Mạnh
            </h1>
            <p className="hero-subtitle">
              Bật công tắc ngọt lành, xua tan ngày mệt mỏi. Ăn vặt thuần tự nhiên, nuông chiều cơ
              thể đúng cách.
            </p>
            <a href="#recommendations" className="hero-cta-btn">
              <span>Khám Phá Ngay</span>
            </a>
          </div>

          <div className="hero-visual">
            <div className="hero-emerald-backdrop">
              <div className="hero-white-circle">
                <img
                  src="/Hero_Img.png"
                  alt="Sweetie The Sweet Lab"
                  className="hero-mascot-img"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="search-wrapper">
          <form className="search-bar-outer" onSubmit={handleSubmit}>
            <div className="search-bar-inner">
              <div className="search-input-group">
                <Search size={18} color="#00875A" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm kiếm bánh quy, socola đen, kẹo dẻo healthy, hộp quà..."
                />
              </div>

              <div className="search-divider" />

              <select
                className="search-category-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                aria-label="Chọn danh mục bánh kẹo"
              >
                <option value="">Tất cả danh mục bánh kẹo</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <button type="submit" className="search-submit-btn">
                <span>Tìm Kiếm</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>

          <div className="search-suggestions">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Tag size={13} color="#00875A" />
              Gợi ý:
            </span>
            {SUGGESTION_TAGS.map((tag) => (
              <button
                key={tag.label}
                type="button"
                className="suggestion-chip"
                onClick={() => handleSuggestion(tag.keyword)}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
