import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import AdminLayout from '../layouts/AdminLayout';

const EMPTY_CATEGORY = { id: null, name: '', slug: '', description: '' };

function CategoriesManagePage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_CATEGORY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCategories();
      setCategories(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { name: form.name, slug: form.slug, description: form.description };
      if (form.id) {
        await adminApi.updateCategory(form.id, payload);
      } else {
        await adminApi.createCategory(payload);
      }
      setModalOpen(false);
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Lưu danh mục thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Xác nhận xóa danh mục "${cat.name}"?`)) return;
    try {
      await adminApi.deleteCategory(cat.id);
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể xóa danh mục đang có sản phẩm');
    }
  };

  return (
    <AdminLayout title="Quản lý danh mục">
      <div className="panel-card">
        <div className="panel-header">
          <h2>Danh mục sản phẩm ({categories.length})</h2>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setError('');
              setForm(EMPTY_CATEGORY);
              setModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>Thêm danh mục</span>
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
                <th>Tên danh mục</th>
                <th>Slug</th>
                <th>Mô tả</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td style={{ fontWeight: 700 }}>{c.name}</td>
                  <td style={{ color: 'var(--slate)' }}>{c.slug}</td>
                  <td style={{ maxWidth: '380px', color: 'var(--slate)' }}>{c.description}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="icon-action-btn"
                        onClick={() => {
                          setError('');
                          setForm(c);
                          setModalOpen(true);
                        }}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        className="icon-action-btn danger"
                        onClick={() => handleDelete(c)}
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
              <h3>{form.id ? 'Cập nhật danh mục' : 'Thêm danh mục'}</h3>
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
                <label>Tên danh mục</label>
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
                <label>Mô tả</label>
                <textarea
                  rows={3}
                  value={form.description || ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
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

export default CategoriesManagePage;
