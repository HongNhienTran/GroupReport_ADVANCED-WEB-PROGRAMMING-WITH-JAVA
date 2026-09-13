

- -> Ăn vặt Healthy / Socola & Bánh kẹo tốt cho sức khỏe 

# **The Sweet Lab** 

Phân trang của web: 

Trang chủ (Home) 

Sản phẩm (Products) -> Thả xuống các danh mục con: Socola, Bánh quy... 

Câu chuyện ngọt ngào (About Us) 

Góc cẩm nang (Blog) – Nếu còn thời gian 

Liên hệ (Contact) 

Danh mục gốc (Root Category) 

- ├── 1. Socola Lành Mạnh (Healthy Chocolates) 

- │   ├── Socola đen nguyên chất (Dark Chocolate 70% - 100%) 

- │   ├── Socola không đường & Keto (Sugar-Free & Keto) 

- │   ├── Socola tươi thuần chay (Vegan Nama Chocolate) 

- │   └── Socola bọc hạt & Trái cây sấy (Nut & Fruit-Coated) 

- ├── 2. Bánh Quy & Bánh Nướng Organic (Bakery & Healthy Cookies) 

- │   ├── Bánh Biscotti & Thanh năng lượng (Biscotti & Energy Bars) 

- │   ├── Bánh quy hạt & Nguyên cám (Nutty & Whole-grain Cookies) 

- │   └── Bánh thuần chay & Không Glutein (Vegan & Gluten-Free Bakery) 

- ├── 3. Kẹo Dẻo & Góc Ngọt Lành (Healthy Candies & Sweets) 

- │   ├── Kẹo dẻo nước ép trái cây organic (Organic Fruit Gummies) 

- │   ├── Kẹo bông đường ít ngọt (Low-Sugar Marshmallows) 

- │   └── Kẹo thảo mộc & Mật ong kiêng (Herbal & Honey Mints) 

- └── 4. Hộp Quà & Combo Sức Khỏe (Gift Sets & Healthy Combos) 

- ├── Hộp quà sự kiện "Xanh" (Festive Healthy Gift Boxes) 

├── Quà tặng sinh nhật & Chăm sóc (Appreciation & Wellness Gifts) 

└── Combo ăn vặt tổng hợp kiêng (Assorted Diet Snack Combos) 

Root Category 

├── 1. Healthy Chocolates 

- │   ├── Pure Dark Chocolate (70% - 100% Cocoa) 

- │   ├── Sugar-Free & Keto-Friendly Chocolates 

- │   ├── Vegan Nama Chocolate (Fresh & Dairy-Free) 

- │   └── Nut & Dried Fruit-Coated Chocolates 

├── 2. Bakery & Healthy Cookies 

- │   ├── Diet Biscotti & Energy Bars 

- │   ├── Nutty & Whole-Grain Cookies 

- │   └── Vegan & Gluten-Free Bakery 

├── 3. Healthy Candies & Sweets 

- │   ├── Organic Fruit Juice Gummies 

- │   ├── Low-Sugar & Fluffy Marshmallows 

- │   └── Herbal & Sugar-Free Mints 

└── 4. Gift Sets & Healthy Combos 

├── Eco-Friendly Festive Gift Boxes 

├── Wellness & Appreciation Gifts 

└── Assorted Diet Snack Combos 

<u>Tùy chọn Tiếng Việt</u> 

<u>Tùy chọn Tiếng Anh</u> 

<u>Nhóm Bộ Lọc</u> 

<u>Phù hợp cho</u> 

|(Filter Group)||||
|---|---|---|---|
|Khoảng giá (Price)|• Dưới 100k|• Under $5|Tất cả sản phẩm|
||• 100k - 300k|• $5 - $15||
||• 300k - 500k|• $15 - $25||
||• Trên 500k|• Over $25||
|Thương hiệu<br>(Brand)|• Marou|• Marou|Tất cả sản phẩm|
||• Royce|• Royce||
||• Ferrero Rocher|• Ferrero Rocher||
||• KitKat|• KitKat||
||• Handmade / Nhà làm|• Homemade||
|Chế độ ăn (Dietary)|• Không đường / Đường<br>ăn kiêng|• Sugar-free|Bánh, kẹo, socola<br>đen|
||• Thuần chay|• Vegan||



||• Hữu cơ (Organic)|• Organic||
|---|---|---|---|
||• Ít béo / Low-carb|• Low-fat / Low-carb||
|Xuất xứ (Origin)|• Việt Nam|• Domestic (Vietnam)|Tất cả sản phẩm|
||• Nhập khẩu (Bỉ, Pháp,<br>Nhật, Mỹ...)|• Imported (Belgium,<br>Japan, USA...)||
|Nồng độ Cacao (%<br>Cacao)|• Từ 50% - 70%|• 50% - 70% Cacao|Chuyên biệt cho<br>Socola đen|
||• Từ 70% - 85%|• 70% - 85% Cacao||
||• Trên 85%|• Over 85% Cacao||



Dưới đây là bản **Kế hoạch tóm lược phát triển dự án The Sweet Lab** sử dụng **Spring Boot** , bám sát yêu cầu tối thiểu của đề tài và định hướng tích hợp AI. 

# **PHẦN 1: BẢN ĐỒ TÍNH NĂNG (FEATURE MAP)** 

Hệ thống sẽ được phân quyền chặt chẽ thông qua **Spring Security (cơ chế Session-based)** để quản lý 3 nhóm đối tượng: 

The Sweet Lab System 

├── 1. Khách vãng lai (Guest) 

- │   ├── Xem danh sách sản phẩm (Bánh kẹo healthy, socola, bộ lọc) 

- │   ├── Xem chi tiết sản phẩm 

- │   ├── Thêm vào giỏ hàng (Quản lý qua HttpSession) 

- │   ├── Chỉnh sửa/Xóa sản phẩm trong giỏ hàng (Số lượng = 0) 

- │   └── Đăng ký tài khoản (Validate trùng Email, lưu DB, gửi Mail active) 

│ 

├── 2. Khách hàng (Customer) = Tất cả quyền Guest + 

│   └── Xử lý thanh toán (Đặt hàng -> Lưu DB đơn hàng -> Gửi Mail xác nhận -> Clear Session giỏ hàng) 

# │ 

└── 3. Quản trị viên (Admin) = Tất cả quyền Customer + 

├── Tra cứu nhanh (Search sản phẩm, loại sản phẩm, user, đơn hàng) 

├── Quản lý Sản phẩm / Danh mục (CRUD - Ràng buộc xóa khi chưa có đơn hàng/chưa có sản phẩm con) 

├── Quản lý Tài khoản (CRUD - Không xem được password, ràng buộc xóa khi chưa từng mua hàng) 

└── Quản lý Đơn hàng (Xem list theo ngày, xem chi tiết, cập nhật số lượng mặt hàng trong đơn) 

# **PHẦN 2: THIẾT KẾ CƠ SỞ DỮ LIỆU TỐI THIỂU (DATABASE COMPACT SCHEMA)** 

Dựa trên yêu cầu và quy định ràng buộc kiểm tra phía Server (Validation ở tầng Model/Service), cấu trúc bảng cốt lõi (sử dụng MySQL/PostgreSQL) sẽ gồm: 

1. categories: id, name, slug, parent_id (Cây danh mục bánh kẹo healthy/socola). 

2. products: id, name, price, description, stock_quantity, category_id. 

3. users: id, email (Unique), password (Được mã hóa Bcrypt), full_name, role (CUSTOMER, ADMIN), status. 

4. orders: id, user_id, order_date (Dùng để sort), total_amount, status. 

5. order_details: id, order_id, product_id, quantity, price. 

⚠️� **Lưu ý nghiệp vụ từ đề tài:** Khi xử lý hàm deleteCategory(id), deleteProduct(id), hoặc deleteUser(id) ở tầng **Spring Boot Service** , bạn cần dùng các câu lệnh count để kiểm tra trước (Ví dụ: orderDetailRepository.countByProductId(id) == 0). Nếu thỏa mãn mới tiến hành xóa, không dùng ON DELETE CASCADE ở DB để tránh vi phạm quy chế chấm điểm. 

# **PHẦN 3: ĐỊNH HƯỚNG TÍCH HỢP MODULE AI (AI INTEGRATION PROPOSAL)** 

Vì đây là website về **Đồ ăn vặt Healthy** , mô-đun AI tích hợp vào giai đoạn sau nên tập trung vào việc **Cá nhân hóa và Tư vấn sức khỏe** , sử dụng các mô hình ngôn ngữ lớn (LLM) hoặc hệ thống gợi ý nền tảng: 

- **Ý tưởng 1: AI Nutrition Assistant (Trợ lý dinh dưỡng AI):** Một khung Chatbot AI ở góc màn hình. Khách hàng có thể hỏi: _"Tôi đang tập gym/bị tiểu đường, nên chọn loại bánh nào ở cửa hàng?"_ hoặc _"Tính giúp tôi calo của thanh socola 85%."_ AI sẽ đọc dữ liệu từ DB sản phẩm hiện có của **The Sweet Lab** để tư vấn và gửi link sản phẩm phù hợp. 

- **Ý tưởng 2: Smart Recommender (Gợi ý sản phẩm thông minh):** Dựa vào giỏ hàng hoặc lịch sử xem của user để AI gợi ý các sản phẩm "Healthy" đi kèm (Ví dụ: Mua Socola đen sẽ gợi ý thêm Biscotti nguyên cám). 

# **PHẦN 4: TIẾN ĐỘ THỰC HIỆN DỰ KIẾN (ROADMAP)** 

Kế hoạch chia làm 4 giai đoạn cuốn chiếu để bạn dễ kiểm soát: 

# **Giai đoạn 1: Khởi tạo & Cấu trúc nền tảng (Tuần 1)** 

- Tạo dự án Spring Boot (Spring Web, Spring Data JPA, Spring Security, Thymeleaf/React tùy FE của bạn). 

- Thiết kế CSDL, tạo các Entity, Repository. Viết mock data cho sản phẩm bánh kẹo. 

# **Giai đoạn 2: Phát triển chức năng Guest & Customer (Tuần 2 - 3)** 

- Lập trình tính năng xem sản phẩm, bộ lọc filter (đã chuẩn bị ở bước trước). 

- Lập trình Giỏ hàng bằng HttpSession. Viết logic Đăng ký tài khoản + tích hợp Spring Boot Starter Mail để gửi email tự động. 

- Lập trình logic Đặt hàng và Thanh toán (Lưu đơn hàng, clear session). 

# **Giai đoạn 3: Phát triển phân hệ Admin Backend & Nghiệp vụ (Tuần 4)** 

- Lập trình các trang quản lý CRUD cho Admin. 

- **⚠️� Quan trọng:** Viết các logic kiểm tra (Validation) trên Bean Validation (@Valid, @NotNull,...) và các hàm check ràng buộc xóa dữ liệu ở tầng Service. 

# **Giai đoạn 4: Tích hợp AI & Hoàn thiện (Tuần 5)** 

- Tích hợp module AI (Có thể dùng **Spring AI** để kết nối trực tiếp với API của OpenAI/Gemini một cách chính thống và bảo mật). 

- Kiểm thử toàn diện các luồng tương tác và nộp báo cáo. 

Bản kế hoạch tóm lược này đã bao quát toàn bộ "đề bài" của bạn dưới góc nhìn kỹ thuật của Spring Boot. Bước tiếp theo bạn muốn triển khai phần nào trước? Tôi có thể giúp bạn thiết kế chi tiết các class Entity JPA ban đầu cho **The Sweet Lab** ! 

