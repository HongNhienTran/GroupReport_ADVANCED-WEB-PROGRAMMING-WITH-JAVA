import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, FolderTree, Package, Tag } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import AdminLayout from '../layouts/AdminLayout';

function formatCurrency(amount) {
  if (amount == null) return '0đ';
  return `${new Intl.NumberFormat('vi-VN').format(Math.round(amount))}đ`;
}

function DashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    brands: 0,
    tags: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [prodRes, catRes, brandRes, tagRes] = await Promise.allSettled([
          adminApi.getProducts({ page: 0, size: 8, sortBy: 'id', sortDir: 'desc' }),
          adminApi.getCategories(),
          adminApi.getBrands(),
          adminApi.getNutritionTags(),
        ]);

        const prodData = prodRes.status === 'fulfilled' ? prodRes.value.data : null;
        setStats({
          products: prodData?.totalElements ?? 0,
          categories: catRes.status === 'fulfilled' ? (catRes.value.data || []).length : 0,
          brands: brandRes.status === 'fulfilled' ? (brandRes.value.data || []).length : 0,
          tags: tagRes.status === 'fulfilled' ? (tagRes.value.data || []).length : 0,
        });
        setRecentProducts(prodData?.content || []);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  return (
    <AdminLayout title="Tổng quan hệ thống">
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-label">Tổng sản phẩm</div>
            <div className="stat-value">{stats.products}</div>
          </div>
          <div className="stat-icon">
            <Package size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Danh mục</div>
            <div className="stat-value">{stats.categories}</div>
          </div>
          <div className="stat-icon">
            <FolderTree size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Nhãn hàng đối tác</div>
            <div className="stat-value">{stats.brands}</div>
          </div>
          <div className="stat-icon">
            <Award size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Nhãn dinh dưỡng</div>
            <div className="stat-value">{stats.tags}</div>
          </div>
          <div className="stat-icon">
            <Tag size={22} />
          </div>
        </div>
      </div>

      <div className="panel-card">
        <div className="panel-header">
          <h2>Sản phẩm mới nhất</h2>
          <Link to="/products" className="btn-primary">
            Quản lý sản phẩm
          </Link>
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
                <th>Giá từ</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((p) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

export default DashboardPage;
