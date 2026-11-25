import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Plus, Star, Trash2, Upload } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import AdminLayout from '../layouts/AdminLayout';

const ALLERGEN_OPTIONS = ['MILK', 'EGG', 'PEANUT', 'TREE_NUT', 'SOY', 'GLUTEN', 'SESAME', 'SULFITE'];

const createEmptyVariant = (index = 1) => ({
  sku: `TSL-${Date.now().toString().slice(-5)}-V${index}`,
  name: index === 1 ? 'Gói tiêu chuẩn 100g' : '',
  price: 120000,
  originalPrice: '',
  stockQuantity: 50,
  weightGram: 100,
  isActive: true,
});

function toSlug(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [nutritionTags, setNutritionTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    categoryId: '',
    brandId: '',
    name: '',
    slug: '',
    description: '',
    ingredients: '',
    shelfLifeDays: 180,
    storageInstruction: 'Bảo quản nơi khô ráo, thoáng mát dưới 25°C',
    status: 'ACTIVE',
    allergens: [],
    nutritionTagIds: [],
    variants: [createEmptyVariant(1)],
    images: [],
    nutritionFacts: {
      perAmountG: 100,
      calories: 0,
      proteinG: 0,
      carbG: 0,
      sugarG: 0,
      fiberG: 0,
      fatG: 0,
      sodiumMg: 0,
    },
  });

  const [previewIdx, setPreviewIdx] = useState(0);
  const [manualImageUrl, setManualImageUrl] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [catRes, brandRes, tagRes] = await Promise.all([
          adminApi.getCategories(),
          adminApi.getBrands(),
          adminApi.getNutritionTags(),
        ]);
        const cats = catRes.data || [];
        const brs = brandRes.data || [];
        setCategories(cats);
        setBrands(brs);
        setNutritionTags(tagRes.data || []);

        if (isEdit) {
          const prodRes = await adminApi.getProductById(id);
          const p = prodRes.data;
          setForm({
            categoryId: p.category?.id || '',
            brandId: p.brand?.id || '',
            name: p.name || '',
            slug: p.slug || '',
            description: p.description || '',
            ingredients: p.ingredients || '',
            shelfLifeDays: p.shelfLifeDays || 180,
            storageInstruction: p.storageInstruction || '',
            status: p.status || 'ACTIVE',
            allergens: p.allergens ? Array.from(p.allergens) : [],
            nutritionTagIds: p.nutritionTags ? p.nutritionTags.map((t) => t.id) : [],
            variants:
              p.variants && p.variants.length > 0
                ? p.variants.map((v) => ({
                    sku: v.sku,
                    name: v.name,
                    price: v.price,
                    originalPrice: v.originalPrice ?? '',
                    stockQuantity: v.stockQuantity,
                    weightGram: v.weightGram,
                    isActive: v.isActive,
                  }))
                : [createEmptyVariant(1)],
            images: p.images || [],
            nutritionFacts: p.nutritionFacts || {
              perAmountG: 100,
              calories: 0,
              proteinG: 0,
              carbG: 0,
              sugarG: 0,
              fiberG: 0,
              fatG: 0,
              sodiumMg: 0,
            },
          });
        } else {
          setForm((prev) => ({
            ...prev,
            categoryId: cats[0]?.id || '',
            brandId: brs[0]?.id || '',
          }));
        }
      } catch {
        setError('Không thể tải dữ liệu sản phẩm.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isEdit]);

  const handleUploadFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      const uploaded = [];
      for (const file of files) {
        const res = await adminApi.uploadImage(file, 'the-sweet-lab/products');
        uploaded.push(res.data.url);
      }
      setForm((prev) => {
        const existing = [...prev.images];
        uploaded.forEach((url) => {
          existing.push({
            imageUrl: url,
            displayOrder: existing.length + 1,
            isThumbnail: existing.length === 0,
          });
        });
        return { ...prev, images: existing };
      });
      setPreviewIdx(form.images.length);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload ảnh lên Cloudinary thất bại');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const addManualImage = () => {
    const url = manualImageUrl.trim();
    if (!url) return;
    setForm((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          imageUrl: url,
          displayOrder: prev.images.length + 1,
          isThumbnail: prev.images.length === 0,
        },
      ],
    }));
    setPreviewIdx(form.images.length);
    setManualImageUrl('');
  };

  const setThumbnail = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({ ...img, isThumbnail: i === index })),
    }));
  };

  const removeImage = (index) => {
    setForm((prev) => {
      const next = prev.images.filter((_, i) => i !== index).map((img, i) => ({
        ...img,
        displayOrder: i + 1,
      }));
      if (next.length > 0 && !next.some((img) => img.isThumbnail)) {
        next[0].isThumbnail = true;
      }
      return { ...prev, images: next };
    });
    setPreviewIdx(0);
  };

  const updateVariant = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    }));
  };

  const toggleAllergen = (alg) => {
    setForm((prev) => ({
      ...prev,
      allergens: prev.allergens.includes(alg)
        ? prev.allergens.filter((a) => a !== alg)
        : [...prev.allergens, alg],
    }));
  };

  const toggleTag = (tagId) => {
    setForm((prev) => ({
      ...prev,
      nutritionTagIds: prev.nutritionTagIds.includes(tagId)
        ? prev.nutritionTagIds.filter((t) => t !== tagId)
        : [...prev.nutritionTagIds, tagId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      categoryId: Number(form.categoryId),
      brandId: Number(form.brandId),
      name: form.name.trim(),
      slug: form.slug.trim().toLowerCase(),
      description: form.description,
      ingredients: form.ingredients,
      shelfLifeDays: Number(form.shelfLifeDays),
      storageInstruction: form.storageInstruction,
      status: form.status,
      allergens: form.allergens,
      nutritionTagIds: form.nutritionTagIds,
      variants: form.variants.map((v) => ({
        sku: v.sku.trim(),
        name: v.name.trim(),
        price: Number(v.price),
        originalPrice: v.originalPrice !== '' ? Number(v.originalPrice) : null,
        stockQuantity: Number(v.stockQuantity),
        weightGram: Number(v.weightGram),
        isActive: Boolean(v.isActive),
      })),
      images: form.images.map((img, idx) => ({
        imageUrl: img.imageUrl,
        displayOrder: idx + 1,
        isThumbnail: Boolean(img.isThumbnail),
      })),
      nutritionFacts: {
        perAmountG: Number(form.nutritionFacts.perAmountG) || 100,
        calories: Number(form.nutritionFacts.calories) || 0,
        proteinG: Number(form.nutritionFacts.proteinG) || 0,
        carbG: Number(form.nutritionFacts.carbG) || 0,
        sugarG: Number(form.nutritionFacts.sugarG) || 0,
        fiberG: Number(form.nutritionFacts.fiberG) || 0,
        fatG: Number(form.nutritionFacts.fatG) || 0,
        sodiumMg: Number(form.nutritionFacts.sodiumMg) || 0,
      },
    };

    try {
      if (isEdit) {
        await adminApi.updateProduct(id, payload);
      } else {
        await adminApi.createProduct(payload);
      }
      navigate('/products');
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      const firstFieldError = apiErrors ? Object.values(apiErrors)[0] : null;
      setError(firstFieldError || err.response?.data?.message || 'Lưu sản phẩm thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title={isEdit ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}>
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--slate)' }}>
          Đang tải dữ liệu...
        </div>
      </AdminLayout>
    );
  }

  const activePreview = form.images[previewIdx] || form.images[0];

  return (
    <AdminLayout title={isEdit ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Link to="/products" className="btn-secondary">
          <ArrowLeft size={16} />
          <span>Quay lại danh sách</span>
        </Link>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="product-form-layout">
          <div>
            {/* 1. Thông tin cơ bản */}
            <section className="form-section-card">
              <h2 className="form-section-title">Thông tin cơ bản</h2>
              <div className="form-grid">
                <div className="form-group full">
                  <label>Tên sản phẩm</label>
                  <input
                    value={form.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm((prev) => ({
                        ...prev,
                        name: val,
                        slug: isEdit ? prev.slug : toSlug(val),
                      }));
                    }}
                    placeholder="Ví dụ: Socola Đen Bến Tre 85%"
                    required
                  />
                </div>

                <div className="form-group full">
                  <label>Slug URL</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Danh mục</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Nhãn hàng</label>
                  <select
                    value={form.brandId}
                    onChange={(e) => setForm({ ...form, brandId: e.target.value })}
                    required
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Trạng thái</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="ACTIVE">Đang bán (ACTIVE)</option>
                    <option value="INACTIVE">Tạm ẩn (INACTIVE)</option>
                    <option value="OUT_OF_STOCK">Hết hàng (OUT_OF_STOCK)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Hạn sử dụng (ngày)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.shelfLifeDays}
                    onChange={(e) => setForm({ ...form, shelfLifeDays: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group full">
                  <label>Hướng dẫn bảo quản</label>
                  <input
                    value={form.storageInstruction}
                    onChange={(e) => setForm({ ...form, storageInstruction: e.target.value })}
                  />
                </div>

                <div className="form-group full">
                  <label>Thành phần</label>
                  <textarea
                    rows={2}
                    value={form.ingredients}
                    onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                  />
                </div>

                <div className="form-group full">
                  <label>Mô tả chi tiết</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </div>
            </section>

            {/* 2. Biến thể sản phẩm */}
            <section className="form-section-card">
              <div className="form-section-title">
                <span>Biến thể sản phẩm ({form.variants.length})</span>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      variants: [...prev.variants, createEmptyVariant(prev.variants.length + 1)],
                    }))
                  }
                >
                  <Plus size={15} />
                  <span>Thêm biến thể</span>
                </button>
              </div>

              {form.variants.map((variant, idx) => (
                <div key={idx} className="variant-item-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <strong style={{ fontSize: '13px' }}>Biến thể #{idx + 1}</strong>
                    {form.variants.length > 1 && (
                      <button
                        type="button"
                        className="icon-action-btn danger"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            variants: prev.variants.filter((_, i) => i !== idx),
                          }))
                        }
                        aria-label="Xóa biến thể"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Mã SKU</label>
                      <input
                        value={variant.sku}
                        onChange={(e) => updateVariant(idx, 'sku', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Tên quy cách (VD: Hộp 250g)</label>
                      <input
                        value={variant.name}
                        onChange={(e) => updateVariant(idx, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Giá bán (VNĐ)</label>
                      <input
                        type="number"
                        min={1000}
                        value={variant.price}
                        onChange={(e) => updateVariant(idx, 'price', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Giá gốc (VNĐ - tùy chọn)</label>
                      <input
                        type="number"
                        value={variant.originalPrice}
                        onChange={(e) => updateVariant(idx, 'originalPrice', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Tồn kho</label>
                      <input
                        type="number"
                        min={0}
                        value={variant.stockQuantity}
                        onChange={(e) => updateVariant(idx, 'stockQuantity', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Khối lượng (gram)</label>
                      <input
                        type="number"
                        min={1}
                        step="0.1"
                        value={variant.weightGram}
                        onChange={(e) => updateVariant(idx, 'weightGram', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* 3. Bảng dinh dưỡng */}
            <section className="form-section-card">
              <h2 className="form-section-title">Giá trị dinh dưỡng (Nutrition Facts)</h2>
              <div className="form-grid">
                {[
                  ['perAmountG', 'Khẩu phần chuẩn (g)'],
                  ['calories', 'Năng lượng (kcal)'],
                  ['proteinG', 'Chất đạm (g)'],
                  ['carbG', 'Tinh bột (g)'],
                  ['sugarG', 'Đường (g)'],
                  ['fiberG', 'Chất xơ (g)'],
                  ['fatG', 'Chất béo (g)'],
                  ['sodiumMg', 'Natri (mg)'],
                ].map(([key, label]) => (
                  <div key={key} className="form-group">
                    <label>{label}</label>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      value={form.nutritionFacts[key]}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          nutritionFacts: { ...prev.nutritionFacts, [key]: e.target.value },
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div>
            {/* 4. Hình ảnh & Preview rõ ràng */}
            <section className="form-section-card">
              <h2 className="form-section-title">
                <span>Hình ảnh sản phẩm ({form.images.length})</span>
                <label className="btn-primary" style={{ cursor: 'pointer' }}>
                  <Upload size={15} />
                  <span>{uploading ? 'Đang tải...' : 'Upload Cloudinary'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleUploadFiles}
                  />
                </label>
              </h2>

              <div className="image-preview-stage">
                {activePreview ? (
                  <img src={activePreview.imageUrl} alt="Xem trước ảnh sản phẩm" />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--slate)', fontSize: '13px' }}>
                    <ImageIcon size={36} style={{ marginBottom: '8px', opacity: 0.6 }} />
                    <div>Chưa có ảnh — hãy upload hoặc dán link bên dưới</div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  className="search-input"
                  style={{ flex: 1, minWidth: 0 }}
                  value={manualImageUrl}
                  onChange={(e) => setManualImageUrl(e.target.value)}
                  placeholder="Hoặc dán URL ảnh Cloudinary..."
                />
                <button type="button" className="btn-secondary" onClick={addManualImage}>
                  Thêm link
                </button>
              </div>

              {form.images.length > 0 && (
                <div className="image-thumb-grid">
                  {form.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`image-thumb-item ${previewIdx === idx ? 'active' : ''}`}
                      onClick={() => setPreviewIdx(idx)}
                    >
                      <img src={img.imageUrl} alt={`Ảnh ${idx + 1}`} />
                      <div
                        style={{
                          position: 'absolute',
                          top: '4px',
                          left: '4px',
                          right: '4px',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setThumbnail(idx);
                          }}
                          title="Đặt làm ảnh đại diện"
                          style={{
                            border: 'none',
                            borderRadius: '6px',
                            padding: '3px 6px',
                            background: img.isThumbnail ? '#00875A' : 'rgba(255,255,255,0.9)',
                            color: img.isThumbnail ? '#fff' : '#475569',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Star size={12} fill={img.isThumbnail ? '#fff' : 'none'} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(idx);
                          }}
                          title="Xóa ảnh"
                          style={{
                            border: 'none',
                            borderRadius: '6px',
                            padding: '3px 6px',
                            background: 'rgba(255,255,255,0.9)',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 5. Nhãn dinh dưỡng */}
            <section className="form-section-card">
              <h2 className="form-section-title">Nhãn dinh dưỡng</h2>
              <div className="tag-chip-grid">
                {nutritionTags.map((tag) => {
                  const checked = form.nutritionTagIds.includes(tag.id);
                  return (
                    <label
                      key={tag.id}
                      className={`tag-chip-label ${checked ? 'checked' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        hidden
                        onChange={() => toggleTag(tag.id)}
                      />
                      <span>{tag.name}</span>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* 6. Cảnh báo dị ứng */}
            <section className="form-section-card">
              <h2 className="form-section-title">Thành phần gây dị ứng</h2>
              <div className="tag-chip-grid">
                {ALLERGEN_OPTIONS.map((alg) => {
                  const checked = form.allergens.includes(alg);
                  return (
                    <label key={alg} className={`tag-chip-label ${checked ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        hidden
                        onChange={() => toggleAllergen(alg)}
                      />
                      <span>{alg}</span>
                    </label>
                  );
                })}
              </div>
            </section>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '15px' }}
              disabled={saving || uploading}
            >
              {saving ? 'Đang lưu sản phẩm...' : isEdit ? 'Lưu Cập Nhật Sản Phẩm' : 'Tạo Sản Phẩm Mới'}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}

export default ProductFormPage;
