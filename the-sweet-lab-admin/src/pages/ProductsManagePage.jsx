import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import AdminLayout from '../layouts/AdminLayout';

function formatCurrency(amount) {
  if (amount == null) return '0đ';
  return `${new Intl.NumberFormat('vi-VN').format(Math.round(amount))}đ`;
}

function ProductsManagePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getCategories().then((res) => setCategories(res.data || [])).catch(() => {});
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = { page, size: 10, sortBy: 'id', sortDir: 'desc' };
      if (keyword.trim()) params.keyword = keyword.trim();
      if (categoryId) params.categoryId = Number(categoryId);
      const res = await adminApi.getProducts(params);
      const data = res.data || {};
      setProducts(data.content || []);
      setPageInfo({
        page: data.page ?? 0,
        totalPages: data.totalPages ?? 0,
        totalElements: data.totalElements ?? 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, keyword, categoryId]);

  const handleDelete = async (product) => {
    if (!window.confirm(`Xác nhận xóa sản phẩm "${product.name}"?`)) return;
    try {
      await adminApi.deleteProduct(product.id);
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể xóa sản phẩm');
    }
  };

  return (
    <AdminLayout title="Quản lý sản phẩm">
      <div className="panel-card">
        <div className="panel-header">
          <h2>Danh sách sản phẩm ({pageInfo.totalElements})</h2>
          <div className="toolbar-group">
            <input
              type="text"
              className="search-input"
              placeholder="Tìm tên, thành phần..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(0);
              }}
            />
            <select
              className="select-input"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setPage(0);
              }}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Link to="/products/new" className="btn-primary">
              <Plus size={16} />
              <span>Thêm sản phẩm</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--slate)' }}>
            Đang tải dữ liệu...
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Danh mục</th>
                <th>Nhãn hàng</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={p.thumbnailUrl} alt={p.name} className="thumb-sm" />
                      <div>
                        <div style={{ fontWeight: 700 }}>{p.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--slate)' }}>{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>{p.categoryName}</td>
                  <td>{p.brandName}</td>
                  <td style={{ fontWeight: 700 }}>{formatCurrency(p.minPrice)}</td>
                  <td>
                    <span className="status-pill">{p.status}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="icon-action-btn"
                        onClick={() => navigate(`/products/${p.id}/edit`)}
                        aria-label="Sửa"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        className="icon-action-btn danger"
                        onClick={() => handleDelete(p)}
                        aria-label="Xóa"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {pageInfo.totalPages > 1 && (
          <div
            style={{
              padding: '14px 20px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              borderTop: '1px solid var(--border)',
            }}
          >
            <button
              type="button"
              className="btn-secondary"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Trước
            </button>
            <span style={{ alignSelf: 'center', fontSize: '13px', fontWeight: 600 }}>
              Trang {pageInfo.page + 1} / {pageInfo.totalPages}
            </span>
            <button
              type="button"
              className="btn-secondary"
              disabled={page >= pageInfo.totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default ProductsManagePage;
