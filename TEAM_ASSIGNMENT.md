# Phân Công Nhiệm Vụ Nhóm — The Sweet Lab

Tài liệu phân công công việc cho 3 thành viên trên cùng kiến trúc **Layered Architecture** (`controller → service → service.impl → repository → entity`). Toàn bộ các class/page khung đã được tạo sẵn và đánh dấu tên từng thành viên để tránh xung đột code.

---

## 1. Thành viên 1: Quân
- **Nhánh Git**: `feat/quan-flashsale-voucher-wishlist`
- **Phạm vi nghiệp vụ**: Khuyến mãi (`FlashSale`, `Voucher`), Yêu thích (`WishItem`) và viết Đánh giá (`POST Review`).

### Danh sách file phụ trách
- **Backend (`the-sweet-lab-be`)**:
  - `service/FlashSaleService.java` & `service/impl/FlashSaleServiceImpl.java` & `controller/FlashSaleController.java`: Lấy chương trình Flash Sale đang chạy (`GET /api/v1/flash-sales/active`) + Admin CRUD (`/api/v1/admin/flash-sales`).
  - `service/VoucherService.java` & `service/impl/VoucherServiceImpl.java` & `controller/VoucherController.java`: Kiểm tra/áp dụng mã giảm giá (`POST /api/v1/vouchers/validate`) + Admin CRUD (`/api/v1/admin/vouchers`).
  - `service/WishlistService.java` & `service/impl/WishlistServiceImpl.java` & `controller/WishlistController.java`: Thêm/xóa/xem danh sách yêu thích (`GET/POST/DELETE /api/v1/wishlist`).
  - Bổ sung `POST /api/v1/products/{productId}/reviews` vào `ReviewController.java` (chỉ cho phép khách đã mua hàng).
- **Frontend (`the-sweet-lab-fe`)**:
  - `src/pages/WishlistPage.jsx` + gắn nút tim ở `ProductCard.jsx` / `ProductDetailPage.jsx`.
  - Nối API thật vào `src/components/homepage/FlashSaleSection.jsx` (thay thế dữ liệu tạm).
  - Thêm form viết đánh giá ở `src/components/product-detail/ProductReviewsSection.jsx`.
- **Admin (`the-sweet-lab-admin`)**:
  - `src/pages/FlashSalesManagePage.jsx`
  - `src/pages/VouchersManagePage.jsx`

---

## 2. Thành viên 2: Quang
- **Nhánh Git**: `feat/quang-order-payment-shipment`
- **Phạm vi nghiệp vụ**: Đặt hàng (`Order`), Thanh toán (`Payment`) và Vận chuyển (`Shipment`).

### Danh sách file phụ trách
- **Backend (`the-sweet-lab-be`)**:
  - `service/OrderService.java` & `service/impl/OrderServiceImpl.java` & `controller/OrderController.java`:
    - `POST /api/v1/orders/checkout`: Kiểm tra & trừ `stockQuantity` của `ProductVariant`, áp `Voucher`, tạo `Order` + `OrderItem` + `Payment` + `Shipment`, xóa `Cart`, ghi `PURCHASE` vào `UserBehaviorLog`.
    - `GET /api/v1/orders/my-orders` & `PUT /api/v1/orders/{id}/cancel`.
  - `service/PaymentService.java` & `service/impl/PaymentServiceImpl.java`: Xử lý trạng thái thanh toán `COD` / `BANKING`.
  - `controller/AdminOrderController.java`: Quản lý đơn hàng, cập nhật `OrderStatus` và `ShipmentStatus` (`trackingCode`, `carrier`).
- **Frontend (`the-sweet-lab-fe`)**:
  - `src/pages/CheckoutPage.jsx` (chọn địa chỉ `UserAddress`, chọn phương thức thanh toán, nhập `Voucher`, đặt hàng).
  - `src/pages/OrdersPage.jsx` (theo dõi trạng thái đơn hàng & vận đơn, hủy đơn).
- **Admin (`the-sweet-lab-admin`)**:
  - `src/pages/OrdersManagePage.jsx`

---

## 3. Thành viên 3: Bảo
- **Nhánh Git**: `feat/bao-admin-report-users`
- **Phạm vi nghiệp vụ**: Báo cáo thống kê (`Report`), Quản lý tài khoản người dùng (`Admin Users`) và Kiểm thử (`Unit/Integration Tests`).

### Danh sách file phụ trách
- **Backend (`the-sweet-lab-be`)**:
  - `service/ReportService.java` & `service/impl/ReportServiceImpl.java` & `controller/ReportController.java`: Thống kê doanh thu theo ngày/tháng, top sản phẩm bán chạy, số đơn theo trạng thái (`GET /api/v1/admin/reports/overview`).
  - `service/AdminUserService.java` & `service/impl/AdminUserServiceImpl.java` & `controller/AdminUserController.java`: Danh sách người dùng, khóa/mở khóa tài khoản (`AccountStatus.BLOCKED` / `ACTIVE`).
  - `src/test/java/com/sweetlab/backend/`: Viết Unit/Integration test cho `AuthService`, `CartService`, `OrderService`.
- **Admin (`the-sweet-lab-admin`)**:
  - Nâng cấp `src/pages/DashboardPage.jsx` với biểu đồ doanh thu & top sản phẩm thật từ `/api/v1/admin/reports/overview`.
  - `src/pages/UsersManagePage.jsx`

---

## Quy trình làm việc Git (Bắt buộc)
1. Pull `main` mới nhất trước khi làm:
   ```bash
   git checkout <nhanh-cua-ban>
   git pull origin main
   ```
2. Chỉ code trong các file thuộc nhiệm vụ của mình. Không tự ý sửa `SecurityConfig.java`, `AppRouter.jsx`, `AdminLayout.jsx` khi chưa thống nhất với Tech Lead.
3. Sau khi hoàn thành, push lên nhánh riêng và tạo **Pull Request** vào `main` để GitHub Actions CI kiểm tra build trước khi merge.
