import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

function AdminLoginPage() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Đăng nhập thất bại. Vui lòng kiểm tra thông tin.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="admin-brand-logo" style={{ fontSize: '26px' }}>
            The Sweet<span>Lab.</span>
          </div>
          <h1 style={{ margin: '10px 0 4px', fontSize: '20px', fontWeight: 800 }}>
            Đăng Nhập Quản Trị
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--slate)' }}>
            Chỉ dành cho tài khoản Quản trị viên (ADMIN)
          </p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label htmlFor="admin-email">Email</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)', borderRadius: '9px', padding: '0 12px' }}>
              <Mail size={16} color="#64748B" />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@thesweetlab.vn"
                required
                style={{ border: 'none', width: '100%', padding: '10px 0' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="admin-pwd">Mật khẩu</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)', borderRadius: '9px', padding: '0 12px' }}>
              <Lock size={16} color="#64748B" />
              <input
                id="admin-pwd"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
                style={{ border: 'none', width: '100%', padding: '10px 0' }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '11px' }} disabled={loading}>
            {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;
