# Hướng Dẫn Chuẩn Bị & Nạp Dữ Liệu Sản Phẩm Bằng JSON (The Sweet Lab)

Thư mục này chứa toàn bộ dữ liệu mẫu cho hệ thống **The Sweet Lab** gồm **8 thương hiệu độc quyền**, **4 danh mục sản phẩm**, và **16 sản phẩm** (trong đó có 8 sản phẩm có biến thể).

---

## 1. Cấu Trúc Thư Mục Dữ Liệu

```text
the-sweet-lab-be/src/main/resources/data/
├── README.md                                    # Tài liệu hướng dẫn này
├── brands/
│   └── brands_data_sample.json                  # 8 Thương hiệu mới hoàn toàn
├── socola/
│   └── socola_data_sample.json                  # 4 sản phẩm Socola & Cacao Thủ Công (2 có biến thể)
├── banh-quy/
│   └── banh_quy_data_sample.json                # 4 sản phẩm Bánh Quy & Bánh Nướng Organic (2 có biến thể)
├── keo-deo/
│   └── keo_deo_data_sample.json                 # 4 sản phẩm Kẹo Dẻo & Kẹo Thảo Mộc Tự Nhiên (2 có biến thể)
└── hop-qua/
    └── hop_qua_data_sample.json                 # 4 sản phẩm Hộp Quà & Combo Sức Khỏe (2 có biến thể)
```

---

## 2. Danh Sách 8 Thương Hiệu Mới Hoàn Toàn

| STT | Thương Hiệu | Slug | Lĩnh Vực / Định Vị | File Logo FE |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **The Sweet Lab Signature** | `the-sweet-lab` | Thương hiệu bánh kẹo healthy cốt lõi độc quyền của website | `/brands/the-sweet-lab.jpg` |
| **2** | **Cacaovita** | `cacaovita` | Socola Bean-to-bar nguyên chất thủ công từ cacao Bến Tre (70% - 100%) | `/brands/cacaovita.jpg` |
| **3** | **NutriBloom** | `nutribloom` | Bánh quy ngũ cốc, biscotti nguyên cám và thanh hạt Granola ăn kiêng | `/brands/nutribloom.jpg` |
| **4** | **BerryZen** | `berryzen` | Kẹo dẻo hữu cơ thuần chay (Vegan Gummies) từ quả mọng & thảo mộc | `/brands/berryzen.jpg` |
| **5** | **KetoFlora** | `ketoflora` | Bánh nướng Low-carb, Keto, không gluten từ bột hạnh nhân & La Hán Quả | `/brands/ketoflora.jpg` |
| **6** | **PureChoc Artisans** | `purechoc-artisans` | Socola tươi Nama thuần chay (Plant-based) từ sữa dừa & bơ phỉ mịn tan | `/brands/purechoc-artisans.jpg` |
| **7** | **Sweetie Present** | `sweetie-present` | **Hộp quà, giỏ quà cao cấp & phụ kiện (ruy băng, thiệp) do website tự bán** | `/brands/sweetie-present.jpg` |
| **8** | **AuraBake Clean Treats** | `aurabake` | Bánh nướng Eat Clean, cookies giàu protein thực vật cho người tập gym | `/brands/aurabake.jpg` |

---

## 3. Tổng Quan 16 Sản Phẩm (4 Danh Mục x 4 Sản Phẩm)

### 🍫 1. Socola & Cacao Thủ Công (`socola-cacao-thu-cong`)
1. **Socola Đen Cacaovita 85% Nguyên Chất Đắk Lắk** (`SWL-CHOC-001`) - Brand: *Cacaovita* - **[Có 2 biến thể: Thanh 40g, Thanh 80g]**
2. **Socola Tươi Nama Thuần Chay PureChoc Artisans Vị Cốt Dừa** (`SWL-CHOC-002`) - Brand: *PureChoc Artisans* - **[Có 2 biến thể: Hộp 16 viên, Hộp 24 viên]**
3. **Socola Bọc Hạnh Nhân Rang Mộc The Sweet Lab Signature** (`SWL-CHOC-003`) - Brand: *The Sweet Lab Signature*
4. **Bột Cacao Nguyên Chất Không Đường Cacaovita Organic** (`SWL-CHOC-004`) - Brand: *Cacaovita*

### 🍪 2. Bánh Quy & Bánh Nướng Organic (`banh-quy-banh-nuong-organic`)
1. **Bánh Biscotti Hạt Dinh Dưỡng NutriBloom Không Đường** (`SWL-BAKE-001`) - Brand: *NutriBloom* - **[Có 2 biến thể: Hũ 250g, Hũ 500g]**
2. **Bánh Cookies Yến Mạch Socola Chip AuraBake Clean Treats** (`SWL-BAKE-002`) - Brand: *AuraBake Clean Treats* - **[Có 2 biến thể: Vị Cacao, Vị Matcha Hạnh Nhân]**
3. **Bánh Ngói Hạnh Nhân Tuiles KetoFlora Bột Hạnh Nhân Siêu Mỏng** (`SWL-BAKE-003`) - Brand: *KetoFlora*
4. **Thanh Hạt Dinh Dưỡng Granola Bar NutriBloom Vị Nam Việt Quất** (`SWL-BAKE-004`) - Brand: *NutriBloom*

### 🍬 3. Kẹo Dẻo & Kẹo Thảo Mộc Tự Nhiên (`keo-deo-keo-thao-moc-tu-nhien`)
1. **Kẹo Dẻo Thuần Chay BerryZen Vị Dâu & Quả Mọng Pectin Hữu Cơ** (`SWL-CAND-001`) - Brand: *BerryZen* - **[Có 2 biến thể: Túi 100g, Gói Tiết Kiệm 250g]**
2. **Kẹo Ngậm Thảo Mộc BerryZen Bạc Hà & Cam Thảo Không Đường** (`SWL-CAND-002`) - Brand: *BerryZen* - **[Có 2 biến thể: Vị Bạc Hà, Vị Chanh Gừng]**
3. **Kẹo Que Hữu Cơ Không Đường The Sweet Lab Kids Vitamin C** (`SWL-CAND-003`) - Brand: *The Sweet Lab Signature*
4. **Kẹo Dẻo Cam Vàng & Chanh Dây BerryZen Tăng Đề Kháng** (`SWL-CAND-004`) - Brand: *BerryZen*

### 🎁 4. Hộp Quà & Combo Sức Khỏe (`hop-qua-combo-suc-khoe`)
1. **Hộp Quà Sweetie Present Eco-Friendly Tinh Hoa Bánh Kẹo Healthy** (`SWL-GIFT-001`) - Brand: *Sweetie Present* - **[Có 2 biến thể: Set Cơ Bản, Set Cao Cấp]**
2. **Giỏ Mây Quà Tặng Sweetie Present Premium Hamper Đan Thủ Công** (`SWL-GIFT-002`) - Brand: *Sweetie Present* - **[Có 2 biến thể: Giỏ Mây Size M, Giỏ Mây Size L]**
3. **Hộp Quà Bánh Quy & Socola The Sweet Lab Signature Gift Box** (`SWL-GIFT-003`) - Brand: *The Sweet Lab Signature*
4. **Bộ Phụ Kiện Gói Quà Sweetie Present Handmade & Thiệp Chúc Mừng** (`SWL-GIFT-004`) - Brand: *Sweetie Present*

---

## 4. Cách Nạp Dữ Liệu Vào Cơ Sở Dữ Liệu

Gửi request HTTP POST tới endpoint:
```bash
POST http://localhost:8080/api/v1/data/import-json
```

Backend sẽ tự động:
1. Nạp/Cập nhật toàn bộ **8 thương hiệu** vào bảng `brands`.
2. Nạp/Cập nhật **4 danh mục** vào bảng `categories`.
3. Nạp/Cập nhật **16 sản phẩm**, **8 nhóm biến thể**, bảng **dinh dưỡng** và **gallery hình ảnh** tương ứng mà không bị trùng lặp.
