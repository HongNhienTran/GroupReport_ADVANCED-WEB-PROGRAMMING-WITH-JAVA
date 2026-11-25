# Đặc Tả Nghiệp Vụ Hệ Thống — The Sweet Lab

**The Sweet Lab** là nền tảng thương mại điện tử chuyên kinh doanh bánh kẹo dinh dưỡng & lành mạnh (ít đường, Keto, Vegan, Organic, Gluten-Free), tích hợp **AI Chatbot (Sweetie)** và **hệ thống gợi ý sản phẩm cá nhân hóa** dựa trên hồ sơ dinh dưỡng và hành vi người dùng.

---

## 1. Vai trò người dùng (Actors)

| Vai trò | Mô tả | Quyền hạn chính |
| :--- | :--- | :--- |
| **Khách vãng lai (Guest)** | Người dùng chưa đăng nhập | Xem trang chủ, tìm kiếm/lọc sản phẩm, xem chi tiết & đánh giá, thêm sản phẩm vào giỏ hàng tạm (`guestSessionId`), nhận gợi ý sản phẩm theo phiên truy cập. |
| **Khách hàng (`CUSTOMER`)** | Người dùng đã đăng ký & đăng nhập | Toàn bộ quyền của Guest + gộp giỏ hàng khi đăng nhập, quản lý trang cá nhân, hồ sơ dinh dưỡng/dị ứng, sổ địa chỉ, đặt hàng, theo dõi vận chuyển, viết đánh giá, lưu yêu thích và **chat với trợ lý AI Sweetie**. |
| **Quản trị viên (`ADMIN`)** | Quản trị hệ thống | Truy cập Admin Portal: quản lý Danh mục, Nhãn hàng, Sản phẩm (biến thể, ảnh Cloudinary, bảng dinh dưỡng), Flash Sale, Voucher, Đơn hàng, Người dùng và xem Báo cáo thống kê. |

---

## 2. Quy tắc nghiệp vụ cốt lõi

1. **Tiền tệ**: Toàn bộ giá bán, giá gốc, phí ship, giảm giá sử dụng kiểu `BigDecimal` (đơn vị VNĐ).
2. **Trạng thái nghiệp vụ**: Mọi trạng thái (`AccountStatus`, `ProductStatus`, `OrderStatus`, `PaymentStatus`, `ShipmentStatus`, `FlashSaleStatus`, `ChatSessionStatus`) được chuẩn hóa bằng `Enum`.
3. **An toàn dị ứng (Dietary Safety)**: Hệ thống hỗ trợ 8 nhóm dị ứng (`MILK`, `EGG`, `PEANUT`, `TREE_NUT`, `SOY`, `GLUTEN`, `SESAME`, `SULFITE`). Khi lọc hoặc gợi ý cho khách hàng có `NutritionProfile`, các sản phẩm chứa thành phần dị ứng của khách sẽ được loại trừ.
4. **Thuộc tính dẫn xuất (Derived Attributes)**: Các chỉ số như `averageRating`, `reviewCount`, `bmi`, `dailyCalorieTarget`, `dailySugarLimit`, `subtotal`, `totalAmount` không lưu cứng mà được tính toán động từ dữ liệu thật.
5. **Lưu trữ hình ảnh**: Ảnh sản phẩm, logo nhãn hàng và ảnh đại diện được upload và lưu trữ tập trung trên **Cloudinary**.

---

## 3. Đặc tả 12 Domain nghiệp vụ

### 3.1. Authentication & Account (`Account`, `AuthToken`, `User`)
- **Đăng ký**: Kiểm tra trùng `email` và `phone`, mã hóa mật khẩu bằng `BCrypt`, tạo `Account` (`role = CUSTOMER`, `status = ACTIVE`), tạo hồ sơ `User` và `Cart` tương ứng.
- **Đăng nhập**: Xác thực bằng `email` + mật khẩu, kiểm tra trạng thái `ACTIVE` (không bị `BLOCKED`), cập nhật `lastLoginAt`, cấp JWT Access Token + Refresh Token (lưu vào `auth_tokens`).
- **Làm mới / Đăng xuất / Quên & Đổi mật khẩu**: Xoay vòng Refresh Token khi làm mới, thu hồi token khi đăng xuất, tạo token `PASSWORD_RESET` (hiệu lực 15 phút) khi quên mật khẩu.

### 3.2. Customer Profile & Dietary Profile (`UserAddress`, `NutritionProfile`)
- Khách hàng cập nhật thông tin cá nhân (`fullName`, `phone`, `dateOfBirth`, `gender`, `avatarUrl`).
- **Hồ sơ dinh dưỡng**: Lưu `heightCm`, `weightKg`, `activityLevel`, `allergens`. Hệ thống tự động tính `BMI`, `dailyCalorieTarget` (theo công thức Mifflin-St Jeor × hệ số vận động) và `dailySugarLimit`.
- **Sổ địa chỉ**: Hỗ trợ nhiều địa chỉ nhận hàng (`HOME`, `OFFICE`, `OTHER`), cho phép đặt địa chỉ mặc định (`isDefault`).

### 3.3. Product Management (`Product`, `ProductVariant`, `ProductImage`, `NutritionFacts`, `NutritionTag`)
- Mỗi sản phẩm thuộc 1 `Category` và 1 `Brand`, có nhiều `ProductVariant` (SKU, quy cách, khối lượng gram, giá bán, tồn kho) và nhiều `ProductImage` (chọn 1 ảnh đại diện `isThumbnail`).
- Gắn kèm `NutritionFacts` (calo, đạm, carb, đường, chất xơ, béo, natri trên 100g) và nhiều `NutritionTag` (`Sugar-Free`, `Keto`, `Vegan`, `Gluten-Free`, `High-Protein`, `High-Fiber`, `Organic`).
- Hỗ trợ tìm kiếm theo từ khóa, lọc theo danh mục, nhãn hàng, tag dinh dưỡng, **loại trừ dị ứng**, khoảng giá và phân trang.

### 3.4. Category & Brand Management (`Category`, `Brand`)
- Quản lý 4 danh mục gốc (*Socola*, *Bánh Quy & Bánh Nướng*, *Kẹo Dẻo*, *Hộp Quà & Combo Sức Khỏe*) và 8 thương hiệu đối tác.
- Slug là duy nhất; không cho xóa danh mục/nhãn hàng khi đang có sản phẩm phụ thuộc.

### 3.5. Promotion & Coupon (`FlashSale`, `FlashSaleItem`, `Voucher`) *(Quân phụ trách hoàn thiện)*
- **Flash Sale**: Theo khung giờ (`startTime` – `endTime`), giới hạn số lượng bán (`quantityLimit`, `soldQuantity`) theo từng biến thể (`FlashSaleItem`).
- **Voucher**: Giảm theo phần trăm (`PERCENTAGE` kèm trần `maxDiscountAmount`) hoặc số tiền cố định (`FIXED_AMOUNT`), kiểm tra `minOrderAmount`, thời hạn sử dụng và `usedCount < usageLimit`.

### 3.6. Shopping Cart & Wishlist (`Cart`, `CartItem`, `WishItem`)
- **Giỏ hàng**: Hỗ trợ cả **khách vãng lai** (`guestSessionId`) và **thành viên** (`user_id`). Kiểm tra biến thể đang `isActive` và số lượng không vượt quá `stockQuantity`.
- **Gộp giỏ hàng**: Ngay khi khách đăng nhập, giỏ hàng tạm của `guestSessionId` được tự động gộp vào giỏ hàng tài khoản.
- **Wishlist**: Khách hàng lưu/xóa sản phẩm yêu thích (`WishItem`) *(Quân phụ trách hoàn thiện API/UI)*.

### 3.7. Order Management (`Order`, `OrderItem`) *(Quang phụ trách hoàn thiện)*
- Khi `checkout`:
  - Kiểm tra giỏ hàng, tồn kho của từng `ProductVariant` và trừ `stockQuantity`.
  - Áp dụng `Voucher` (nếu có) và tăng `usedCount`.
  - **Snapshot** tên sản phẩm, tên biến thể, đơn giá vào `OrderItem` và thông tin người nhận vào `Order` để đảm bảo lịch sử hóa đơn không bị thay đổi nếu sản phẩm/địa chỉ sửa về sau.
  - Xóa giỏ hàng và ghi nhận hành vi `PURCHASE` vào `UserBehaviorLog`.
- Hỗ trợ khách hàng hủy đơn khi đơn ở trạng thái `PENDING`.

### 3.8. Payment & Shipment (`Payment`, `Shipment`) *(Quang phụ trách hoàn thiện)*
- **Payment**: Hỗ trợ `COD` và `BANKING` với các trạng thái `PENDING`, `SUCCESS`, `FAILED`, `REFUNDED`.
- **Shipment**: Lưu `carrier`, `trackingCode`, `estimatedDeliveryAt`, `shippedAt`, `deliveredAt` theo vòng đời `PREPARING → IN_TRANSIT → DELIVERED` (hoặc `FAILED` / `RETURNED`).

### 3.9. Product Review (`Review`)
- Mỗi đánh giá gắn với cặp `(order_id, product_id)` và `user_id` để đảm bảo người đánh giá thực sự đã mua sản phẩm (`DELIVERED`).
- Hiển thị danh sách bình luận tại trang chi tiết sản phẩm và tự động tính `averageRating` / `reviewCount` trên mọi thẻ sản phẩm.

### 3.10. AI Chatbot "Sweetie" (`AiChatSession`, `AiChatMessage`, `SweetieTools`)
- **Bắt buộc đăng nhập** (`401 Unauthorized` nếu là khách vãng lai).
- Sử dụng **Spring AI** kết hợp model Groq (`openai/gpt-oss-120b`) và **Tool Calling** (`searchProductsByMeaning`, `getProductDetails`, `getUserNutritionProfile`, `getRecentInterests`) để trả lời dựa trên dữ liệu thật trong MariaDB & VectorStore, tuyệt đối không bịa giá hay sản phẩm.
- Lưu toàn bộ lịch sử phiên chat vào `ai_chat_sessions` và `ai_chat_messages`.

### 3.11. AI Product Recommendation & User Tracking (`UserBehaviorLog`, `ProductVectorService`)
- Ghi nhận tự động các hành vi: `VIEW` (trọng số 1), `SEARCH` (1), `WISHLIST` (2), `ADD_TO_CART` (3), `PURCHASE` (5).
- Kết hợp **Local Vector Embedding (`SimpleVectorStore`)** + lịch sử hành vi + **lọc dị ứng từ `NutritionProfile`** để trả về danh sách gợi ý cá nhân hóa tại `/api/v1/recommendations`.

### 3.12. Report & Statistics *(Bảo phụ trách hoàn thiện)*
- Tổng hợp số liệu thật cho Admin Dashboard: tổng doanh thu theo ngày/tháng, số đơn theo từng `OrderStatus`, top sản phẩm bán chạy từ `OrderRepository` và `OrderItemRepository`.

---

## 4. Phân quyền truy cập chính

| Nhóm API | Guest | Customer | Admin |
| :--- | :---: | :---: | :---: |
| Catalog (`/categories`, `/brands`, `/products`, `/reviews` GET) | ✓ | ✓ | ✓ |
| Tracking & Recommendations (`/tracking/events`, `/recommendations`) | ✓ | ✓ | ✓ |
| Giỏ hàng (`/cart`, `/cart/items/**`) | ✓ | ✓ | ✓ |
| Gộp giỏ hàng (`/cart/merge`), Profile (`/profile/**`), AI Chat (`/ai/**`) | ✗ | ✓ | ✓ |
| Đặt hàng (`/orders/**`), Wishlist (`/wishlist/**`), Viết Review (`POST`) | ✗ | ✓ | ✓ |
| Quản trị (`/admin/**`), Xóa ảnh Cloudinary (`DELETE /media`) | ✗ | ✗ | ✓ |
