import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown, Heart, LogIn, LogOut, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalQuantity } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const initial = user?.fullName ? user.fullName.trim().charAt(0).toUpperCase() : 'U';

  return (
    <>
      <div className="announcement-bar">
        100% Organic &amp; Sugar-Free • Ăn vặt dinh dưỡng lành mạnh
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand-logo">
            The Sweet<span>Lab.</span>
          </Link>

          <nav className="header-nav" aria-label="Main navigation">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Trang chủ
            </NavLink>
            <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Sản phẩm
            </NavLink>
            <a href="/#brands" className="nav-link">
              Cẩm nang
            </a>
            <a href="/#about-sweet-lab" className="nav-link">
              Giới thiệu
            </a>
          </nav>

          <div className="header-actions">
            <button type="button" className="icon-badge-btn" aria-label="Yêu thích">
              <Heart size={20} />
              <span className="badge-count red">0</span>
            </button>
            <Link to="/cart" className="icon-badge-btn" aria-label="Giỏ hàng">
              <ShoppingCart size={20} />
              <span className="badge-count green">{totalQuantity}</span>
            </Link>

            {isAuthenticated ? (
              <div className="user-pill">
                <button
                  type="button"
                  className="user-pill-btn"
                  onClick={() => setMenuOpen((prev) => !prev)}
                >
                  <span className="user-avatar-circle">{initial}</span>
                  <span>{user.fullName}</span>
                  <ChevronDown size={15} />
                </button>
                {menuOpen && (
                  <div className="user-dropdown">
                    <Link
                      to="/profile"
                      className="user-dropdown-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      <User size={15} />
                      <span>Trang cá nhân</span>
                    </Link>
                    <button
                      type="button"
                      className="user-dropdown-item"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                    >
                      <LogOut size={15} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="login-nav-btn">
                <LogIn size={16} />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
