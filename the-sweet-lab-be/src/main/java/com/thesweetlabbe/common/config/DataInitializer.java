package com.thesweetlabbe.common.config;

import com.thesweetlabbe.modules.product.entity.Category;
import com.thesweetlabbe.modules.product.entity.Product;
import com.thesweetlabbe.modules.product.entity.ProductImage;
import com.thesweetlabbe.modules.product.entity.ProductNutrition;
import com.thesweetlabbe.modules.product.enums.DietaryTag;
import com.thesweetlabbe.modules.product.enums.ProductStatus;
import com.thesweetlabbe.modules.product.repository.CategoryRepository;
import com.thesweetlabbe.modules.product.repository.ProductRepository;
import com.thesweetlabbe.modules.user.entity.NutritionProfile;
import com.thesweetlabbe.modules.user.entity.User;
import com.thesweetlabbe.modules.user.entity.UserProfile;
import com.thesweetlabbe.modules.user.enums.*;
import com.thesweetlabbe.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    // Ảnh mẫu dùng chung tạm thời cho toàn bộ sản phẩm
    private static final String DEFAULT_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800";

    @Override
    @Transactional
    public void run(String... args) {
        seedUsers();
        seedCategoriesAndProducts();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) {
            log.info("Users already exist. Skipping user seeding.");
            return;
        }

        log.info("Seeding initial users (1 Admin, 2 Customers)...");

        // 1. Admin Account
        User admin = User.builder()
                .email("admin@thesweetlab.com")
                .fullName("Quản Trị Viên The Sweet Lab")
                .passwordHash(passwordEncoder.encode("Admin@123"))
                .role(UserRole.ROLE_ADMIN)
                .status(AccountStatus.ACTIVE)
                .build();

        UserProfile adminProfile = UserProfile.builder()
                .user(admin)
                .phone("0901234567")
                .address("123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh")
                .gender(Gender.OTHER)
                .dateOfBirth(LocalDate.of(1995, 1, 1))
                .build();
        admin.setProfile(adminProfile);

        NutritionProfile adminNutrition = NutritionProfile.builder()
                .user(admin)
                .height(175.0)
                .weight(70.0)
                .activityLevel(ActivityLevel.MODERATE)
                .goal(NutritionGoal.MAINTENANCE)
                .dietaryPreference(DietaryPreference.STANDARD)
                .build();
        admin.setNutritionProfile(adminNutrition);

        userRepository.save(admin);

        // 2. Customer 1 (Ăn kiêng Keto / Giảm cân)
        User customer1 = User.builder()
                .email("customer1@thesweetlab.com")
                .fullName("Nguyễn Văn An")
                .passwordHash(passwordEncoder.encode("Customer@123"))
                .role(UserRole.ROLE_CUSTOMER)
                .status(AccountStatus.ACTIVE)
                .build();

        UserProfile customer1Profile = UserProfile.builder()
                .user(customer1)
                .phone("0912345678")
                .address("45 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh")
                .gender(Gender.MALE)
                .dateOfBirth(LocalDate.of(1998, 5, 20))
                .build();
        customer1.setProfile(customer1Profile);

        NutritionProfile customer1Nutrition = NutritionProfile.builder()
                .user(customer1)
                .height(172.0)
                .weight(68.0)
                .activityLevel(ActivityLevel.VERY_ACTIVE)
                .goal(NutritionGoal.WEIGHT_LOSS)
                .dietaryPreference(DietaryPreference.KETO)
                .build();
        customer1.setNutritionProfile(customer1Nutrition);

        userRepository.save(customer1);

        // 3. Customer 2 (Thuần chay / Eat Clean)
        User customer2 = User.builder()
                .email("customer2@thesweetlab.com")
                .fullName("Trần Thị Bình")
                .passwordHash(passwordEncoder.encode("Customer@123"))
                .role(UserRole.ROLE_CUSTOMER)
                .status(AccountStatus.ACTIVE)
                .build();

        UserProfile customer2Profile = UserProfile.builder()
                .user(customer2)
                .phone("0987654321")
                .address("88 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh")
                .gender(Gender.FEMALE)
                .dateOfBirth(LocalDate.of(2000, 10, 15))
                .build();
        customer2.setProfile(customer2Profile);

        NutritionProfile customer2Nutrition = NutritionProfile.builder()
                .user(customer2)
                .height(160.0)
                .weight(50.0)
                .activityLevel(ActivityLevel.LIGHT)
                .goal(NutritionGoal.MAINTENANCE)
                .dietaryPreference(DietaryPreference.VEGAN)
                .build();
        customer2.setNutritionProfile(customer2Nutrition);

        userRepository.save(customer2);

        log.info("Users seeded successfully (Admin: admin@thesweetlab.com, Customers: customer1@thesweetlab.com, customer2@thesweetlab.com).");
    }

    private void seedCategoriesAndProducts() {
        if (categoryRepository.count() > 0) {
            log.info("Categories already exist. Skipping category and product seeding.");
            return;
        }

        log.info("Seeding Categories and Sample Products based on Data_Idea.md...");

        // ==========================================
        // 1. NHÓM GỐC: SOCOLA LÀNH MẠNH
        // ==========================================
        Category catSocola = createCategory("Socola Lành Mạnh", "socola-lanh-manh",
                "Socola đen nguyên chất, ít đường, giàu chất chống oxy hóa", null, 1, "/categories/Socola.png");

        Category subSocola1 = createCategory("Socola đen nguyên chất (70% - 100%)", "socola-den-nguyen-chat",
                "Socola đen thuần khiết từ 70% đến 100% cacao", catSocola, 1, "/categories/Socola.png");
        Category subSocola2 = createCategory("Socola không đường & Keto", "socola-khong-duong-keto",
                "Socola dùng đường ăn kiêng Isomalt/Stevia an toàn cho người tiểu đường và Keto", catSocola, 2, "/categories/Socola.png");
        Category subSocola3 = createCategory("Socola tươi thuần chay (Vegan Nama)", "socola-tuoi-thuan-chay",
                "Nama Chocolate mềm tan từ sữa hạt và dầu dừa organic", catSocola, 3, "/categories/Socola.png");
        Category subSocola4 = createCategory("Socola bọc hạt & Trái cây sấy", "socola-boc-hat-trai-cay",
                "Hạt hạnh nhân, macca, việt quất sấy phủ socola đen", catSocola, 4, "/categories/Socola.png");

        // ==========================================
        // 2. NHÓM GỐC: BÁNH QUY & BÁNH NƯỚNG ORGANIC
        // ==========================================
        Category catBakery = createCategory("Bánh Quy & Bánh Nướng Organic", "banh-quy-banh-nuong-organic",
                "Bánh nướng ít ngọt, nguyên cám, bổ sung protein và năng lượng sạch", null, 2, "/categories/Bakery.png");

        Category subBakery1 = createCategory("Bánh Biscotti & Thanh năng lượng", "biscotti-thanh-nang-luong",
                "Biscotti giòn tan không bơ sữa và energy bars cho gymer", catBakery, 1, "/categories/Bakery.png");
        Category subBakery2 = createCategory("Bánh quy hạt & Nguyên cám", "banh-quy-hat-nguyen-cam",
                "Bánh quy làm từ yến mạch, bột mì nguyên cám và mix hạt dinh dưỡng", catBakery, 2, "/categories/Bakery.png");
        Category subBakery3 = createCategory("Bánh thuần chay & Không Gluten", "banh-thuan-chay-gluten-free",
                "Bánh nướng 100% gốc thực vật, không gluten (Gluten-Free)", catBakery, 3, "/categories/Bakery.png");

        // ==========================================
        // 3. NHÓM GỐC: KẸO DẺO & GÓC NGỌT LÀNH
        // ==========================================
        Category catCandies = createCategory("Kẹo Dẻo & Góc Ngọt Lành", "keo-deo-goc-ngot-lanh",
                "Kẹo dẻo từ nước ép trái cây hữu cơ và thảo mộc tự nhiên", null, 3, "/categories/Candies.png");

        Category subCandies1 = createCategory("Kẹo dẻo nước ép trái cây organic", "keo-deo-trai-cay-organic",
                "Kẹo dẻo không gelatin động vật, 100% nước ép trái cây", catCandies, 1, "/categories/Candies.png");
        Category subCandies2 = createCategory("Kẹo bông đường ít ngọt", "keo-bong-duong-it-ngot",
                "Marshmallow xốp mịn giảm 60% lượng đường", catCandies, 2, "/categories/Candies.png");
        Category subCandies3 = createCategory("Kẹo thảo mộc & Mật ong kiêng", "keo-thao-moc-mat-ong",
                "Kẹo ngậm giảm ho thảo mộc tự nhiên không đường", catCandies, 3, "/categories/Candies.png");

        // ==========================================
        // 4. NHÓM GỐC: HỘP QUÀ & COMBO SỨC KHỎE
        // ==========================================
        Category catGifts = createCategory("Hộp Quà & Combo Sức Khỏe", "hop-qua-combo-suc-khoe",
                "Bộ quà tặng sức khỏe tinh tế, ý nghĩa cho người thân và đối tác", null, 4, "/categories/Gifts.png");

        Category subGifts1 = createCategory("Hộp quà sự kiện \"Xanh\"", "hop-qua-su-kien-xanh",
                "Hộp quà bao bì thân thiện môi trường kết hợp bánh kẹo healthy", catGifts, 1, "/categories/Gifts.png");
        Category subGifts2 = createCategory("Quà tặng sinh nhật & Chăm sóc", "qua-tang-sinh-nhat-cham-soc",
                "Set quà tặng ngọt ngào chăm sóc sức khỏe ngày sinh nhật", catGifts, 2, "/categories/Gifts.png");
        Category subGifts3 = createCategory("Combo ăn vặt tổng hợp kiêng", "combo-an-vat-tong-hop",
                "Combo tiết kiệm gồm socola, biscotti và kẹo dẻo ăn kiêng", catGifts, 3, "/categories/Gifts.png");

        // ==========================================
        // TẠO 1 SẢN PHẨM MẪU CHO MỖI LOẠI (13 SẢN PHẨM)
        // ==========================================
        createSampleProduct(
                "Socola Đen Nguyên Chất Marou 85%",
                "socola-den-marou-85",
                "SWL-CHOC-001",
                new BigDecimal("135000"),
                new BigDecimal("150000"),
                50,
                "Socola đen Marou 85% Cacao Việt Nam nguyên chất, đượm vị đắng thanh tự nhiên, dồi dào chất chống oxy hóa flavonoid.",
                subSocola1,
                "Marou",
                "Việt Nam",
                85,
                Set.of(DietaryTag.ORGANIC, DietaryTag.VEGAN, DietaryTag.LOW_CARB),
                true, false, 5.0,
                "40g (1 thanh)", 210.0, 4.2, 16.5, 3.8, 9.8, 3.5, 2.0,
                "Không chứa sữa, gluten",
                "Cacao mass (85%), bơ cacao hữu cơ, đường mía thô (15%)"
        );

        createSampleProduct(
                "Socola Không Đường Keto Dark Bar 70%",
                "socola-khong-duong-keto-70",
                "SWL-CHOC-002",
                new BigDecimal("120000"),
                null,
                40,
                "Thanh socola 70% cacao kết hợp đường ăn kiêng Erythritol và cỏ ngọt Stevia, không tăng chỉ số đường huyết, cực kỳ thích hợp cho người ăn kiêng Keto.",
                subSocola2,
                "The Sweet Lab Homemade",
                "Việt Nam",
                70,
                Set.of(DietaryTag.SUGAR_FREE, DietaryTag.KETO),
                true, true, 4.9,
                "50g", 195.0, 3.8, 17.2, 2.1, 12.0, 0.2, 5.0,
                "Có thể chứa hạt đậu phộng",
                "Cacao nguyên chất, bơ cacao, chất tạo ngọt tự nhiên (Erythritol, Stevia), lecithin đậu nành"
        );

        createSampleProduct(
                "Socola Tươi Thuần Chay Vegan Nama Matcha",
                "socola-tuoi-vegan-nama-matcha",
                "SWL-CHOC-003",
                new BigDecimal("165000"),
                new BigDecimal("190000"),
                30,
                "Nama chocolate tươi mềm tan trong miệng, làm từ cốt dừa hữu cơ và bột matcha Uji Nhật Bản thượng hạng, hoàn toàn không chứa sữa bò.",
                subSocola3,
                "Royce",
                "Nhật Bản",
                null,
                Set.of(DietaryTag.VEGAN, DietaryTag.ORGANIC),
                false, true, 5.0,
                "100g (1 hộp 12 viên)", 380.0, 5.5, 28.0, 15.0, 22.0, 12.0, 2.5,
                "Không có gluten và sữa động vật",
                "Bột matcha Uji, cốt dừa organic, bơ cacao, đường mía hữu cơ, bột tảo biển"
        );

        createSampleProduct(
                "Socola Hạnh Nhân & Việt Quất Sấy Phủ Cacao",
                "socola-hanh-nhan-viet-quat-say",
                "SWL-CHOC-004",
                new BigDecimal("145000"),
                null,
                60,
                "Hạt hạnh nhân Mỹ giòn rụm và việt quất sấy dẻo được phủ lớp socola đen 65%, cung cấp chất béo tốt và vitamin dồi dào.",
                subSocola4,
                "Ferrero Rocher",
                "Mỹ",
                65,
                Set.of(DietaryTag.ORGANIC, DietaryTag.LOW_CARB),
                true, false, 4.8,
                "50g", 240.0, 6.0, 18.0, 4.0, 14.0, 8.5, 3.0,
                "Chứa hạt hạnh nhân",
                "Hạnh nhân nướng mộc, việt quất sấy lạnh, socola đen 65%, bột cacao nguyên chất"
        );

        createSampleProduct(
                "Bánh Biscotti Yến Mạch Hạt Dinh Dưỡng",
                "biscotti-yen-mach-hat-dinh-duong",
                "SWL-BAKE-001",
                new BigDecimal("115000"),
                new BigDecimal("135000"),
                80,
                "Bánh nướng 2 lần giòn rụm theo phong cách Ý, sử dụng 100% yến mạch nguyên cám và mix hạt óc chó, hạnh nhân, hạt dưa.",
                subBakery1,
                "The Sweet Lab Homemade",
                "Việt Nam",
                null,
                Set.of(DietaryTag.ORGANIC, DietaryTag.LOW_CARB),
                true, false, 4.9,
                "100g", 360.0, 12.0, 14.0, 2.5, 45.0, 4.0, 6.5,
                "Chứa trứng gà và hạt óc chó",
                "Bột yến mạch, lòng trắng trứng, hạt hạnh nhân, hạt óc chó, hạt bí xanh, nho khô, mật ong"
        );

        createSampleProduct(
                "Bánh Quy Ngũ Cốc Nguyên Cám Hạt Chia",
                "banh-quy-ngu-coc-nguyen-cam-chia",
                "SWL-BAKE-002",
                new BigDecimal("95000"),
                null,
                75,
                "Bánh quy giòn thơm vị ngũ cốc tự nhiên, bổ sung hạt chia giàu Omega-3, ít calo cho bữa phụ lành mạnh.",
                subBakery2,
                "KitKat Healthy",
                "Pháp",
                null,
                Set.of(DietaryTag.ORGANIC, DietaryTag.SUGAR_FREE),
                false, false, 4.7,
                "100g (8 bánh)", 320.0, 8.5, 9.0, 1.5, 48.0, 2.0, 7.0,
                "Chứa lúa mạch",
                "Bột mì nguyên cám, hạt chia hữu cơ, dầu hướng dương ép lạnh, đường ăn kiêng"
        );

        createSampleProduct(
                "Bánh Muffin Chuối Thuần Chay Gluten-Free",
                "bánh-muffin-chuoi-thuan-chay-gluten-free",
                "SWL-BAKE-003",
                new BigDecimal("85000"),
                null,
                35,
                "Bánh muffin mềm xốp vị chuối chín tự nhiên, không chứa bột mì (Gluten-Free) và không sử dụng trứng sữa động vật.",
                subBakery3,
                "The Sweet Lab Homemade",
                "Việt Nam",
                null,
                Set.of(DietaryTag.VEGAN, DietaryTag.ORGANIC),
                false, false, 4.8,
                "1 chiếc (80g)", 180.0, 4.0, 5.0, 0.8, 30.0, 9.0, 4.2,
                "An toàn cho người dị ứng gluten và sữa",
                "Bột hạnh nhân, chuối tiêu chín, hạt lanh, dầu dừa, bột nở hữu cơ"
        );

        createSampleProduct(
                "Kẹo Dẻo Nước Ép Táo & Lựu Hữu Cơ",
                "keo-deo-tao-luu-huu-co",
                "SWL-CAND-001",
                new BigDecimal("65000"),
                new BigDecimal("80000"),
                100,
                "Kẹo dẻo dẻo dai tự nhiên từ pectin táo, đượm vị chua ngọt thơm lừng của nước ép lựu đỏ, dồi dào Vitamin C.",
                subCandies1,
                "The Sweet Lab Homemade",
                "Việt Nam",
                null,
                Set.of(DietaryTag.ORGANIC, DietaryTag.VEGAN),
                true, false, 5.0,
                "60g (khoảng 15 viên)", 140.0, 0.5, 0.1, 0.0, 34.0, 18.0, 2.0,
                "Không chất bảo quản, phẩm màu nhân tạo",
                "Nước ép lựu nguyên chất (60%), nước ép táo, pectin thực vật, đường mía thô hữu cơ"
        );

        createSampleProduct(
                "Kẹo Bông Đường Marshmallow Ít Ngọt Vani",
                "marshmallow-it-ngot-vani",
                "SWL-CAND-002",
                new BigDecimal("70000"),
                null,
                60,
                "Kẹo marshmallow trắng xốp mềm mại, giảm 60% lượng đường so với kẹo thông thường, hương vani Madagascar tự nhiên.",
                subCandies2,
                "The Sweet Lab Homemade",
                "Bỉ",
                null,
                Set.of(DietaryTag.LOW_CARB),
                false, false, 4.6,
                "50g", 110.0, 2.0, 0.2, 0.0, 24.0, 8.0, 0.5,
                "Có chứa gelatin thực phẩm",
                "Gelatin sạch, siro bắp ít ngọt, hương vani tự nhiên, bột bắp phủ chống dính"
        );

        createSampleProduct(
                "Kẹo Ngậm Thảo Mộc Bạc Hà & Mật Ong Không Đường",
                "keo-ngam-thao-moc-bac-ha-mat-ong",
                "SWL-CAND-003",
                new BigDecimal("55000"),
                null,
                120,
                "Kẹo ngậm the mát từ tinh dầu bạc hà và thảo dược alpine, hỗ trợ làm dịu cổ họng và thơm miệng không lo sâu răng.",
                subCandies3,
                "The Sweet Lab Homemade",
                "Thụy Sĩ",
                null,
                Set.of(DietaryTag.SUGAR_FREE),
                false, false, 4.9,
                "40g (khoảng 20 viên)", 75.0, 0.0, 0.0, 0.0, 28.0, 0.0, 0.0,
                "Không có đường saccarose",
                "Isomalt, tinh dầu bạc hà tự nhiên, chiết xuất cam thảo, hương thảo mộc"
        );

        createSampleProduct(
                "Hộp Quà Sự Kiện Eco-Friendly Healthy Box",
                "hop-qua-su-kien-eco-friendly",
                "SWL-GIFT-001",
                new BigDecimal("450000"),
                new BigDecimal("520000"),
                25,
                "Hộp quà cao cấp làm từ giấy kraft tái sinh, bao gồm 1 thanh Socola Marou 85%, 1 hũ Biscotti hạt, 1 túi kẹo dẻo organic và thiệp viết tay.",
                subGifts1,
                "The Sweet Lab Homemade",
                "Việt Nam",
                null,
                Set.of(DietaryTag.ORGANIC),
                true, false, 5.0,
                "1 Hộp quà (500g)", 850.0, 22.0, 35.0, 8.0, 95.0, 25.0, 15.0,
                "Bao gồm nhiều loại bánh kẹo healthy",
                "Hộp quà sự kiện kết hợp nhiều sản phẩm tuyển chọn"
        );

        createSampleProduct(
                "Set Quà Tặng Sinh Nhật & Chăm Sóc Sức Khỏe",
                "set-qua-tang-sinh-nhat-cham-soc",
                "SWL-GIFT-002",
                new BigDecimal("380000"),
                null,
                20,
                "Món quà ngọt lành thay lời chúc sức khỏe, kết hợp các dòng bánh kẹo thuần chay và socola tươi ít đường sang trọng.",
                subGifts2,
                "The Sweet Lab Homemade",
                "Việt Nam",
                null,
                Set.of(DietaryTag.VEGAN, DietaryTag.SUGAR_FREE),
                false, false, 4.9,
                "1 Set (400g)", 680.0, 18.0, 28.0, 5.0, 75.0, 18.0, 12.0,
                "Phù hợp người ăn thuần chay và kiêng đường",
                "Set quà tặng gồm nama socola thuần chay và bánh yến mạch dinh dưỡng"
        );

        createSampleProduct(
                "Combo Ăn Vặt Healthy Tiết Kiệm (Mix 3 Món)",
                "combo-an-vat-healthy-tiet-kiem",
                "SWL-GIFT-003",
                new BigDecimal("290000"),
                new BigDecimal("340000"),
                45,
                "Combo tiện lợi cho dân văn phòng và gymer: 1 Socola đen 70%, 1 gói Biscotti matcha và 1 gói kẹo dẻo trái cây.",
                subGifts3,
                "The Sweet Lab Homemade",
                "Việt Nam",
                null,
                Set.of(DietaryTag.LOW_CARB, DietaryTag.ORGANIC),
                true, true, 5.0,
                "350g", 720.0, 20.0, 32.0, 6.0, 80.0, 22.0, 11.0,
                "Chứa hạt hạnh nhân và yến mạch",
                "Combo 3 món ăn vặt lành mạnh được ưa chuộng nhất"
        );

        log.info("Categories and Sample Products seeded successfully!");
    }

    private Category createCategory(String name, String slug, String description, Category parent, int displayOrder, String imageUrl) {
        Category category = Category.builder()
                .name(name)
                .slug(slug)
                .description(description)
                .imageUrl(imageUrl != null ? imageUrl : DEFAULT_PRODUCT_IMAGE)
                .bannerUrl(imageUrl != null ? imageUrl : DEFAULT_PRODUCT_IMAGE)
                .parent(parent)
                .displayOrder(displayOrder)
                .isActive(true)
                .build();
        return categoryRepository.save(category);
    }

    private void createSampleProduct(
            String name, String slug, String sku, BigDecimal price, BigDecimal originalPrice, int stock,
            String description, Category category, String brand, String origin, Integer cocoaPercentage,
            Set<DietaryTag> tags, boolean isFeatured, boolean isFlashSale, double rating,
            String servingSize, Double calories, Double protein, Double fat, Double satFat,
            Double carbs, Double sugar, Double fiber, String allergens, String ingredients
    ) {
        Product product = Product.builder()
                .name(name)
                .slug(slug)
                .sku(sku)
                .price(price)
                .originalPrice(originalPrice)
                .stockQuantity(stock)
                .description(description)
                .thumbnailUrl(DEFAULT_PRODUCT_IMAGE)
                .category(category)
                .brand(brand)
                .origin(origin)
                .cocoaPercentage(cocoaPercentage)
                .dietaryTags(tags)
                .isFeatured(isFeatured)
                .isFlashSale(isFlashSale)
                .rating(rating)
                .status(ProductStatus.ACTIVE)
                .build();

        ProductNutrition nutrition = ProductNutrition.builder()
                .product(product)
                .servingSize(servingSize)
                .calories(calories)
                .proteinG(protein)
                .fatG(fat)
                .saturatedFatG(satFat)
                .carbsG(carbs)
                .sugarG(sugar)
                .fiberG(fiber)
                .sodiumMg(15.0)
                .allergens(allergens)
                .ingredients(ingredients)
                .build();
        product.setNutrition(nutrition);

        ProductImage galleryImage = ProductImage.builder()
                .product(product)
                .imageUrl(DEFAULT_PRODUCT_IMAGE)
                .altText(name)
                .displayOrder(1)
                .build();
        product.setImages(new ArrayList<>(List.of(galleryImage)));

        productRepository.save(product);
    }
}
