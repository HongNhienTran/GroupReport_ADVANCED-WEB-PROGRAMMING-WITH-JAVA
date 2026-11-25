import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Award,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

function AdminLayout({ title, children }) {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('adminSidebarCollapsed') === 'true'
  );

  const initial = user?.fullName ? user.fullName.trim().charAt(0).toUpperCase() : 'A';

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('adminSidebarCollapsed', String(next));
      return next;
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={`admin-shell ${collapsed ? 'collapsed' : ''}`}>
      <aside className="admin-sidebar">
        <div className="admin-brand-row">
          <div className="admin-brand">
            <div className="admin-brand-logo">
              The Sweet<span>Lab.</span>
            </div>
            <div className="admin-brand-sub">ADMIN PORTAL</div>
          </div>
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            title={collapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
            aria-label="Thu gọn/Mở rộng sidebar"
          >
            {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          </button>
        </div>

        <nav className="admin-nav">
          <NavLink
            to="/"
            end
            title="Tổng quan"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Tổng quan</span>
          </NavLink>
          <NavLink
            to="/products"
            title="Sản phẩm"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <Package size={18} />
            <span>Sản phẩm</span>
          </NavLink>
          <NavLink
            to="/categories"
            title="Danh mục"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <FolderTree size={18} />
            <span>Danh mục</span>
          </NavLink>
          <NavLink
            to="/brands"
            title="Nhãn hàng"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <Award size={18} />
            <span>Nhãn hàng</span>
          </NavLink>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-title">{title}</div>
          <div className="admin-user-bar">
            <div className="admin-user-chip">
              <span className="admin-avatar">{initial}</span>
              <span>{user?.fullName || 'Administrator'}</span>
            </div>
            <button type="button" className="btn-logout" onClick={handleLogout}>
              <LogOut size={15} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
