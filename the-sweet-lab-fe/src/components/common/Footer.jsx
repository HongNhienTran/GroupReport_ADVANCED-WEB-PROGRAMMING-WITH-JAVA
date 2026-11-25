import { ArrowRight, Award, RefreshCw, ShieldCheck, Truck } from 'lucide-react';

function Footer() {
  return (
    <>
      <div className="trust-strip">
        <div className="container trust-grid">
          <div className="trust-item">
            <div className="trust-icon">
              <Truck size={18} />
            </div>
            <div>
              <h4>GIAO SIÊU TỐC</h4>
              <p>Bảo quản lạnh, giao tận nơi</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon">
              <RefreshCw size={18} />
            </div>
            <div>
              <h4>ĐỔI TRẢ DỄ DÀNG</h4>
              <p>Trong 7 ngày nếu lỗi sản phẩm</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon">
              <Award size={18} />
            </div>
            <div>
              <h4>CHUẨN DINH DƯỠNG</h4>
              <p>Kiểm định calo &amp; hữu cơ</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4>THANH TOÁN AN TOÀN</h4>
              <p>Bảo mật 100% đa phương thức</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h5>VỀ CHÚNG TÔI</h5>
              <ul>
                <li><a href="#about-sweet-lab">Câu chuyện thương hiệu</a></li>
                <li><a href="#recommendations">Tất cả sản phẩm</a></li>
                <li><a href="#recommendations">Danh mục dinh dưỡng</a></li>
                <li><a href="#brands">Chứng nhận hữu cơ</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>CHÍNH SÁCH</h5>
              <ul>
                <li><a href="#about-sweet-lab">Chính sách đổi trả 7 ngày</a></li>
                <li><a href="#about-sweet-lab">Chính sách bảo mật</a></li>
                <li><a href="#about-sweet-lab">Điều khoản dịch vụ</a></li>
                <li><a href="#about-sweet-lab">Cam kết chất lượng</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>HỖ TRỢ MUA HÀNG</h5>
              <ul>
                <li><a href="#about-sweet-lab">Phương thức vận chuyển</a></li>
                <li><a href="#about-sweet-lab">Hình thức thanh toán</a></li>
                <li><a href="#about-sweet-lab">Tài khoản &amp; Đơn hàng</a></li>
                <li><a href="#about-sweet-lab">Hỏi đáp dinh dưỡng</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>LIÊN HỆ</h5>
              <ul>
                <li>Email: thesweetlab.contact@gmail.com</li>
                <li>Giờ hoạt động: 08:00 - 21:30 hàng ngày</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="brand-logo" style={{ fontSize: '20px' }}>
              The Sweet<span>Lab.</span>
            </div>
            <div>Copyright &copy; 2026 The Sweet Lab. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
