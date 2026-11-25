import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });
      navigate('/');
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      const firstFieldError = apiErrors ? Object.values(apiErrors)[0] : null;
      setError(
        firstFieldError ||
          err.response?.data?.message ||
          'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="brand-logo">
            The Sweet<span>Lab.</span>
          </Link>
          <h1>Đăng Ký Tài Khoản</h1>
          <p>Tạo tài khoản để nhận gợi ý dinh dưỡng và ưu đãi thành viên</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="form-field">
            <label htmlFor="fullName">Họ và tên</label>
            <div className="input-box">
              <User size={17} color="#64748B" />
              <input
                id="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange('fullName')}
                placeholder="Nguyễn Văn An"
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <div className="input-box">
              <Mail size={17} color="#64748B" />
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="phone">Số điện thoại</label>
            <div className="input-box">
              <Phone size={17} color="#64748B" />
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange('phone')}
                placeholder="0901234567"
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="password">Mật khẩu</label>
            <div className="input-box">
              <Lock size={17} color="#64748B" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange('password')}
                placeholder="Tối thiểu 6 ký tự"
                minLength={6}
                required
              />
              <button
                type="button"
                className="toggle-pwd-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Ẩn/hiện mật khẩu"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <div className="input-box">
              <Lock size={17} color="#64748B" />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                placeholder="Nhập lại mật khẩu"
                minLength={6}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={submitting}>
            {submitting ? 'Đang tạo tài khoản...' : 'Đăng Ký'}
          </button>
        </form>

        <div className="auth-footer-links">
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          <div style={{ marginTop: '8px' }}>
            <Link to="/">← Quay về trang chủ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
