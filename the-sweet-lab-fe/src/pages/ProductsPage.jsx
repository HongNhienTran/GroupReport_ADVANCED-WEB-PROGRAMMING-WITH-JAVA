import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpDown, Search } from 'lucide-react';
import { catalogApi } from '../api/catalogApi';
import ProductCard from '../components/common/ProductCard';
import FlashSaleSection from '../components/homepage/FlashSaleSection';
import Pagination from '../components/products/Pagination';
import ProductFilterSidebar from '../components/products/ProductFilterSidebar';
import MainLayout from '../layouts/MainLayout';

const PAGE_SIZE = 8;

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [nutritionTags, setNutritionTags] = useState([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);

  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(() => {
    const raw = searchParams.get('categoryId');
    return raw ? Number(raw) : null;
  });
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(900000);
  const [minRating, setMinRating] = useState(null);
  const [sortOption, setSortOption] = useState('id_asc');
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const loadMetadata = async () => {
      const [catRes, tagRes, flashRes] = await Promise.allSettled([
        catalogApi.getCategories(),
        catalogApi.getNutritionTags(),
        catalogApi.getProducts({ page: 0, size: 8, sortBy: 'id', sortDir: 'asc' }),
      ]);
      if (catRes.status === 'fulfilled') setCategories(catRes.value.data || []);
      if (tagRes.status === 'fulfilled') setNutritionTags(tagRes.value.data || []);
      if (flashRes.status === 'fulfilled') setFlashSaleProducts(flashRes.value.data?.content || []);
    };
    loadMetadata();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const [sortBy, sortDir] = sortOption.split('_');
        const params = {
          page: currentPage,
          size: PAGE_SIZE,
          sortBy,
          sortDir,
        };
        if (keyword.trim()) params.keyword = keyword.trim();
        if (selectedCategoryId) params.categoryId = selectedCategoryId;
        if (selectedTagIds.length > 0) params.tagIds = selectedTagIds.join(',');
        if (minPrice > 0) params.minPrice = minPrice;
        if (maxPrice < 900000) params.maxPrice = maxPrice;

        const res = await catalogApi.getProducts(params);
        const data = res.data || {};
        setProducts(data.content || []);
        setPageInfo({
          page: data.page ?? 0,
          totalPages: data.totalPages ?? 0,
          totalElements: data.totalElements ?? 0,
        });
      } catch (err) {
        console.error('Failed to load products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, keyword, selectedCategoryId, selectedTagIds, minPrice, maxPrice, sortOption]);

  const handleSelectCategory = (catId) => {
    setSelectedCategoryId(catId);
    setCurrentPage(0);
    if (catId) {
      setSearchParams({ categoryId: String(catId) });
    } else {
      setSearchParams({});
    }
  };

  const handleToggleTag = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
    setCurrentPage(0);
  };

  const handleChangePrice = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(0);
  };

  const handleReset = () => {
    setKeyword('');
    setSelectedCategoryId(null);
    setSelectedTagIds([]);
    setMinPrice(0);
    setMaxPrice(900000);
    setMinRating(null);
    setSortOption('id_asc');
    setCurrentPage(0);
    setSearchParams({});
  };

  return (
    <MainLayout>
      <div className="products-page-wrap">
        <FlashSaleSection products={flashSaleProducts} />

        <div className="container-wide">
          <div className="catalog-header-bar">
            <div>
              <div className="catalog-title-row">
                <h1>TẤT CẢ SẢN PHẨM</h1>
              </div>
            </div>

            <div className="catalog-controls">
              <div className="catalog-search-box">
                <Search size={16} color="#64748B" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    setCurrentPage(0);
                  }}
                  placeholder="Tìm tên bánh, kẹo, thương hiệu..."
                />
              </div>

              <div className="catalog-sort-box">
                <ArrowUpDown size={15} />
                <span>Sắp xếp:</span>
                <select
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    setCurrentPage(0);
                  }}
                  aria-label="Sắp xếp sản phẩm"
                >
                  <option value="id_asc">Mặc định</option>
                  <option value="createdAt_desc">Mới nhất</option>
                  <option value="name_asc">Tên A - Z</option>
                  <option value="name_desc">Tên Z - A</option>
                </select>
              </div>
            </div>
          </div>

          <div className="catalog-layout">
            <ProductFilterSidebar
              categories={categories}
              nutritionTags={nutritionTags}
              selectedCategoryId={selectedCategoryId}
              selectedTagIds={selectedTagIds}
              minPrice={minPrice}
              maxPrice={maxPrice}
              minRating={minRating}
              onSelectCategory={handleSelectCategory}
              onToggleTag={handleToggleTag}
              onChangePrice={handleChangePrice}
              onSelectRating={setMinRating}
              onReset={handleReset}
            />

            <div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
                  Đang tải danh sách sản phẩm...
                </div>
              ) : products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
                  Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.
                </div>
              ) : (
                <>
                  <div className="product-grid-3">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  <Pagination
                    currentPage={pageInfo.page}
                    totalPages={pageInfo.totalPages}
                    onPageChange={(p) => {
                      setCurrentPage(p);
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ProductsPage;
