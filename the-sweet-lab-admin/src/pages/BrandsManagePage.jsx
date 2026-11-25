import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, Upload, X } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import AdminLayout from '../layouts/AdminLayout';

const EMPTY_BRAND = { id: null, name: '', slug: '', logoUrl: '', country: 'Việt Nam' };

function BrandsManagePage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_BRAND);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadBrands = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getBrands();
      setBrands(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await adminApi.uploadImage(file, 'the-sweet-lab/brands');
      setForm((prev) => ({ ...prev, logoUrl: res.data.url }));
    } catch (err) {
      setError(err.response?.data?.message || 'Upload logo thất bại');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        logoUrl: form.logoUrl,
        country: form.country,
      };
      if (form.id) {
        await adminApi.updateBrand(form.id, payload);
      } else {
        await adminApi.createBrand(payload);
      }
      setModalOpen(false);
      loadBrands();
    } catch (err) {
      setError(err.response?.data?.message || 'Lưu nhãn hàng thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (brand) => {
    if (!window.confirm(`Xác nhận xóa nhãn hàng "${brand.name}"?`)) return;
    try {
      await adminApi.deleteBrand(brand.id);
      loadBrands();
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể xóa nhãn hàng đang có sản phẩm');
    }
  };

  return (
    <AdminLayout title="Quản lý nhãn hàng">
      <div className="panel-card">
        <div className="panel-header">
          <h2>Nhãn hàng đối tác ({brands.length})</h2>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setError('');
              setForm(EMPTY_BRAND);
              setModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>Thêm nhãn hàng</span>
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--slate)' }}>
            Đang tải dữ liệu...
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nhãn hàng</th>
                <th>Slug</th>
                <th>Quốc gia</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td style={{ fontWeight: 700 }}>{b.name}</td>
                  <td style={{ color: 'var(--slate)' }}>{b.slug}</td>
                  <td>{b.country}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="icon-action-btn"
                        onClick={() => {
                          setError('');
                          setForm(b);
                          setModalOpen(true);
                        }}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        className="icon-action-btn danger"
                        onClick={() => handleDelete(b)}
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
      </div>

      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3>{form.id ? 'Cập nhật nhãn hàng' : 'Thêm nhãn hàng'}</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ border: 'none', background: 'transparent' }}
              >
                <X size={20} />
              </button>
            </div>
            {error && <div className="error-banner">{error}</div>}
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label>Tên nhãn hàng</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Logo URL (Cloudinary hoặc đường dẫn)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    style={{ flex: 1 }}
                    value={form.logoUrl || ''}
                    onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                  />
                  <label className="btn-secondary" style={{ cursor: 'pointer' }}>
                    <Upload size={15} />
                    <span>{uploading ? 'Đang tải...' : 'Upload'}</span>
                    <input type="file" accept="image/*" hidden onChange={handleLogoUpload} />
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Quốc gia</label>
                <input
                  value={form.country || ''}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary" disabled={saving || uploading}>
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default BrandsManagePage;
