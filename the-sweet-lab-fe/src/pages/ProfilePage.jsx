import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Activity, KeyRound, MapPin, Plus, Trash2, Upload, User } from 'lucide-react';
import { profileApi } from '../api/profileApi';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';

const ALLERGENS = ['MILK', 'EGG', 'PEANUT', 'TREE_NUT', 'SOY', 'GLUTEN', 'SESAME', 'SULFITE'];
const ACTIVITY_LABELS = {
  SEDENTARY: 'Ít vận động',
  LIGHT: 'Vận động nhẹ (1-3 buổi/tuần)',
  MODERATE: 'Vận động vừa (3-5 buổi/tuần)',
  VERY_ACTIVE: 'Năng động (6-7 buổi/tuần)',
  EXTRA_ACTIVE: 'Cường độ cao (Vận động viên)',
};

function ProfilePage() {
  const { isAuthenticated, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [infoForm, setInfoForm] = useState({
    fullName: '',
    phone: '',
    avatarUrl: '',
    dateOfBirth: '',
    gender: 'OTHER',
  });

  const [nutritionForm, setNutritionForm] = useState({
    heightCm: 165,
    weightKg: 55,
    activityLevel: 'MODERATE',
    allergens: [],
  });

  const [addressForm, setAddressForm] = useState({
    recipientName: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    detailAddress: '',
    type: 'HOME',
    isDefault: true,
  });

  const [pwdForm, setPwdForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const syncStateFromProfile = (data) => {
    setProfile(data);
    setInfoForm({
      fullName: data.fullName || '',
      phone: data.phone || '',
      avatarUrl: data.avatarUrl || '',
      dateOfBirth: data.dateOfBirth || '',
      gender: data.gender || 'OTHER',
    });
    if (data.nutritionProfile) {
      setNutritionForm({
        heightCm: data.nutritionProfile.heightCm || 165,
        weightKg: data.nutritionProfile.weightKg || 55,
        activityLevel: data.nutritionProfile.activityLevel || 'MODERATE',
        allergens: data.nutritionProfile.allergens || [],
      });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    profileApi
      .getProfile()
      .then((res) => syncStateFromProfile(res.data))
      .catch(() => setError('Không thể tải thông tin cá nhân.'))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const showSuccess = (text) => {
    setError('');
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    try {
      const res = await profileApi.uploadAvatar(file);
      setInfoForm((prev) => ({ ...prev, avatarUrl: res.data.url }));
      showSuccess('Đã tải ảnh đại diện lên Cloudinary. Nhấn Lưu thay đổi để cập nhật.');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload ảnh đại diện thất bại');
    }
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await profileApi.updateProfile({
        ...infoForm,
        dateOfBirth: infoForm.dateOfBirth || null,
      });
      syncStateFromProfile(res.data);
      updateUser({ fullName: res.data.fullName, avatarUrl: res.data.avatarUrl, phone: res.data.phone });
      showSuccess('Cập nhật thông tin cá nhân thành công!');
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const handleSaveNutrition = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await profileApi.updateNutrition({
        heightCm: Number(nutritionForm.heightCm),
        weightKg: Number(nutritionForm.weightKg),
        activityLevel: nutritionForm.activityLevel,
        allergens: nutritionForm.allergens,
      });
      syncStateFromProfile(res.data);
      showSuccess('Cập nhật hồ sơ dinh dưỡng thành công!');
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật hồ sơ dinh dưỡng thất bại');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await profileApi.addAddress(addressForm);
      syncStateFromProfile(res.data);
      setAddressForm({
        recipientName: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        detailAddress: '',
        type: 'HOME',
        isDefault: false,
      });
      showSuccess('Đã thêm địa chỉ mới!');
    } catch (err) {
      setError(err.response?.data?.message || 'Thêm địa chỉ thất bại');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const res = await profileApi.deleteAddress(addressId);
      syncStateFromProfile(res.data);
      showSuccess('Đã xóa địa chỉ.');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể xóa địa chỉ');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    try {
      await profileApi.changePassword({
        oldPassword: pwdForm.oldPassword,
        newPassword: pwdForm.newPassword,
      });
      setPwdForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      showSuccess('Đổi mật khẩu thành công!');
    } catch (err) {
      setError(err.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
  };

  const initial = profile?.fullName ? profile.fullName.trim().charAt(0).toUpperCase() : 'U';

  return (
    <MainLayout>
      <div className="container" style={{ padding: '36px 24px 72px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--slate)' }}>
            Đang tải trang cá nhân...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '28px', alignItems: 'start' }}>
            {/* Sidebar */}
            <aside
              style={{
                background: '#ffffff',
                border: '1px solid #eef2f6',
                borderRadius: '18px',
                padding: '24px 18px',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '22px' }}>
                {infoForm.avatarUrl && infoForm.avatarUrl.startsWith('http') ? (
                  <img
                    src={infoForm.avatarUrl}
                    alt={profile?.fullName}
                    style={{ width: '84px', height: '84px', borderRadius: '999px', objectFit: 'cover', marginBottom: '10px', border: '2px solid var(--emerald)' }}
                  />
                ) : (
                  <div
                    className="user-avatar-circle"
                    style={{ width: '84px', height: '84px', fontSize: '30px', margin: '0 auto 10px' }}
                  >
                    {initial}
                  </div>
                )}
                <div style={{ fontWeight: 800, fontSize: '17px', color: 'var(--navy)' }}>
                  {profile?.fullName}
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--slate)', marginTop: '2px' }}>
                  {profile?.email}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  ['info', 'Thông tin cá nhân', User],
                  ['nutrition', 'Hồ sơ dinh dưỡng & Dị ứng', Activity],
                  ['addresses', 'Sổ địa chỉ giao hàng', MapPin],
                  ['password', 'Đổi mật khẩu', KeyRound],
                ].map(([key, label, Icon]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      background: activeTab === key ? 'var(--emerald)' : 'transparent',
                      color: activeTab === key ? '#ffffff' : '#334155',
                      fontWeight: 600,
                      fontSize: '13.5px',
                      textAlign: 'left',
                    }}
                  >
                    <Icon size={17} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </aside>

            {/* Main Content */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #eef2f6',
                borderRadius: '18px',
                padding: '28px',
              }}
            >
              {message && (
                <div style={{ background: 'var(--mint-bg)', color: 'var(--emerald-dark)', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '13.5px', fontWeight: 600 }}>
                  {message}
                </div>
              )}
              {error && <div className="auth-error" style={{ marginBottom: '16px' }}>{error}</div>}

              {activeTab === 'info' && (
                <form onSubmit={handleSaveInfo} className="auth-form">
                  <h2 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 800 }}>Thông Tin Cá Nhân</h2>
                  <div className="form-field">
                    <label>Họ và tên</label>
                    <div className="input-box">
                      <input
                        value={infoForm.fullName}
                        onChange={(e) => setInfoForm({ ...infoForm, fullName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Số điện thoại</label>
                    <div className="input-box">
                      <input
                        value={infoForm.phone}
                        onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-field">
                      <label>Ngày sinh</label>
                      <div className="input-box">
                        <input
                          type="date"
                          value={infoForm.dateOfBirth}
                          onChange={(e) => setInfoForm({ ...infoForm, dateOfBirth: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Giới tính</label>
                      <div className="input-box">
                        <select
                          value={infoForm.gender}
                          onChange={(e) => setInfoForm({ ...infoForm, gender: e.target.value })}
                          style={{ width: '100%', border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: '14px' }}
                        >
                          <option value="MALE">Nam</option>
                          <option value="FEMALE">Nữ</option>
                          <option value="OTHER">Khác</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Ảnh đại diện (Upload Cloudinary)</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div className="input-box" style={{ flex: 1 }}>
                        <input
                          value={infoForm.avatarUrl}
                          onChange={(e) => setInfoForm({ ...infoForm, avatarUrl: e.target.value })}
                          placeholder="https://res.cloudinary.com/..."
                        />
                      </div>
                      <label className="btn-outline-pill" style={{ cursor: 'pointer' }}>
                        <Upload size={15} />
                        <span>Chọn ảnh</span>
                        <input type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="auth-submit-btn" style={{ maxWidth: '220px' }}>
                    Lưu Thay Đổi
                  </button>
                </form>
              )}

              {activeTab === 'nutrition' && (
                <form onSubmit={handleSaveNutrition} className="auth-form">
                  <h2 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 800 }}>
                    Hồ Sơ Dinh Dưỡng &amp; Dị Ứng
                  </h2>
                  <p style={{ margin: '0 0 10px', fontSize: '13px', color: 'var(--slate)' }}>
                    Dữ liệu này giúp Sweetie AI và hệ thống gợi ý loại bỏ sản phẩm gây dị ứng và tính nhu cầu calo phù hợp.
                  </p>

                  {profile?.nutritionProfile && (
                    <div className="nutrition-grid" style={{ marginBottom: '12px' }}>
                      <div className="nutrition-stat">
                        <span>Chỉ số BMI</span>
                        <strong>{profile.nutritionProfile.bmi}</strong>
                      </div>
                      <div className="nutrition-stat">
                        <span>Mục tiêu Calo/ngày</span>
                        <strong>{profile.nutritionProfile.dailyCalorieTarget} kcal</strong>
                      </div>
                      <div className="nutrition-stat">
                        <span>Giới hạn đường/ngày</span>
                        <strong>{profile.nutritionProfile.dailySugarLimit} g</strong>
                      </div>
                      <div className="nutrition-stat">
                        <span>Dị ứng đang tránh</span>
                        <strong>{profile.nutritionProfile.allergens?.length || 0}</strong>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-field">
                      <label>Chiều cao (cm)</label>
                      <div className="input-box">
                        <input
                          type="number"
                          step="0.1"
                          value={nutritionForm.heightCm}
                          onChange={(e) => setNutritionForm({ ...nutritionForm, heightCm: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Cân nặng (kg)</label>
                      <div className="input-box">
                        <input
                          type="number"
                          step="0.1"
                          value={nutritionForm.weightKg}
                          onChange={(e) => setNutritionForm({ ...nutritionForm, weightKg: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Mức độ vận động</label>
                    <div className="input-box">
                      <select
                        value={nutritionForm.activityLevel}
                        onChange={(e) => setNutritionForm({ ...nutritionForm, activityLevel: e.target.value })}
                        style={{ width: '100%', border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: '14px' }}
                      >
                        {Object.entries(ACTIVITY_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Thành phần dị ứng cần tránh</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {ALLERGENS.map((alg) => {
                        const checked = nutritionForm.allergens.includes(alg);
                        return (
                          <label
                            key={alg}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '999px',
                              border: `1px solid ${checked ? 'var(--emerald)' : 'var(--border)'}`,
                              background: checked ? 'var(--mint-bg)' : '#fff',
                              color: checked ? 'var(--emerald-dark)' : '#475569',
                              fontSize: '12.5px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            <input
                              type="checkbox"
                              hidden
                              checked={checked}
                              onChange={() =>
                                setNutritionForm((prev) => ({
                                  ...prev,
                                  allergens: checked
                                    ? prev.allergens.filter((a) => a !== alg)
                                    : [...prev.allergens, alg],
                                }))
                              }
                            />
                            {alg}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <button type="submit" className="auth-submit-btn" style={{ maxWidth: '240px' }}>
                    Lưu Hồ Sơ Dinh Dưỡng
                  </button>
                </form>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <h2 style={{ margin: '0 0 16px', fontSize: '20px', fontWeight: 800 }}>
                    Sổ Địa Chỉ Giao Hàng ({profile?.addresses?.length || 0})
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                    {profile?.addresses?.map((addr) => (
                      <div
                        key={addr.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 16px',
                          border: '1px solid #eef2f6',
                          borderRadius: '12px',
                          background: '#f8fafc',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '14px' }}>
                            {addr.recipientName} • {addr.phone}{' '}
                            {addr.isDefault && (
                              <span className="kcal-pill" style={{ marginLeft: '6px' }}>
                                Mặc định
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--slate)', marginTop: '3px' }}>
                            {addr.detailAddress}, {addr.ward}, {addr.district}, {addr.province}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          style={{ border: 'none', background: 'transparent', color: '#ef4444' }}
                          aria-label="Xóa địa chỉ"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddAddress} className="auth-form">
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Thêm địa chỉ mới</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="input-box">
                        <input
                          placeholder="Tên người nhận"
                          value={addressForm.recipientName}
                          onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="input-box">
                        <input
                          placeholder="Số điện thoại"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div className="input-box">
                        <input
                          placeholder="Tỉnh / Thành phố"
                          value={addressForm.province}
                          onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                          required
                        />
                      </div>
                      <div className="input-box">
                        <input
                          placeholder="Quận / Huyện"
                          value={addressForm.district}
                          onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                          required
                        />
                      </div>
                      <div className="input-box">
                        <input
                          placeholder="Phường / Xã"
                          value={addressForm.ward}
                          onChange={(e) => setAddressForm({ ...addressForm, ward: e.target.value })}
                          required
                        />
                      </div>
                      <div className="input-box">
                        <input
                          placeholder="Số nhà, tên đường"
                          value={addressForm.detailAddress}
                          onChange={(e) => setAddressForm({ ...addressForm, detailAddress: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <button type="submit" className="auth-submit-btn" style={{ maxWidth: '200px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <Plus size={16} />
                      <span>Thêm Địa Chỉ</span>
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'password' && (
                <form onSubmit={handleChangePassword} className="auth-form" style={{ maxWidth: '420px' }}>
                  <h2 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 800 }}>Đổi Mật Khẩu</h2>
                  <div className="form-field">
                    <label>Mật khẩu hiện tại</label>
                    <div className="input-box">
                      <input
                        type="password"
                        value={pwdForm.oldPassword}
                        onChange={(e) => setPwdForm({ ...pwdForm, oldPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Mật khẩu mới</label>
                    <div className="input-box">
                      <input
                        type="password"
                        minLength={6}
                        value={pwdForm.newPassword}
                        onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Xác nhận mật khẩu mới</label>
                    <div className="input-box">
                      <input
                        type="password"
                        minLength={6}
                        value={pwdForm.confirmPassword}
                        onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="auth-submit-btn" style={{ maxWidth: '200px' }}>
                    Đổi Mật Khẩu
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default ProfilePage;
