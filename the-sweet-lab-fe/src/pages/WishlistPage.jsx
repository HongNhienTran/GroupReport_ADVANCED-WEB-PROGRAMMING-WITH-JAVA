import MainLayout from '../layouts/MainLayout';

/**
 * [PHÂN CÔNG: QUÂN - Nhánh feat/quan-flashsale-voucher-wishlist]
 * Nhiệm vụ: Trang hiển thị và quản lý danh sách sản phẩm yêu thích của người dùng.
 */
function WishlistPage() {
  return (
    <MainLayout>
      <div className="container" style={{ padding: '48px 24px' }}>
        <h1>Sản Phẩm Yêu Thích</h1>
        <p>TODO [Quân]: Kết nối API /api/v1/wishlist để hiển thị và xóa sản phẩm yêu thích.</p>
      </div>
    </MainLayout>
  );
}

export default WishlistPage;
