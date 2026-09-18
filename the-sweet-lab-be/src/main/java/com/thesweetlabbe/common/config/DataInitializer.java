package com.thesweetlabbe.common.config;

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

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JsonDataLoader jsonDataLoader;

    @Override
    @Transactional
    public void run(String... args) {
        seedUsers();
        seedJsonData();
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

        com.thesweetlabbe.modules.user.entity.UserAddress adminAddress = com.thesweetlabbe.modules.user.entity.UserAddress.builder()
                .user(admin)
                .recipientName("Ban Quản Trị The Sweet Lab")
                .phone("0901234567")
                .province("TP. Hồ Chí Minh")
                .district("Quận 1")
                .ward("Phường Bến Nghé")
                .detailAddress("123 Đường Công Nghệ")
                .fullAddress("123 Đường Công Nghệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh")
                .addressType(AddressType.OFFICE)
                .isDefault(true)
                .build();
        admin.getAddresses().add(adminAddress);

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

        com.thesweetlabbe.modules.user.entity.UserAddress customer1Home = com.thesweetlabbe.modules.user.entity.UserAddress.builder()
                .user(customer1)
                .recipientName("Nguyễn Văn An")
                .phone("0912345678")
                .province("TP. Hồ Chí Minh")
                .district("Quận 1")
                .ward("Phường Bến Nghé")
                .detailAddress("45 Lê Lợi")
                .fullAddress("45 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh")
                .addressType(AddressType.HOME)
                .isDefault(true)
                .build();
        com.thesweetlabbe.modules.user.entity.UserAddress customer1Office = com.thesweetlabbe.modules.user.entity.UserAddress.builder()
                .user(customer1)
                .recipientName("Nguyễn Văn An (Văn phòng)")
                .phone("0912345678")
                .province("TP. Hồ Chí Minh")
                .district("Quận 1")
                .ward("Phường Bến Nghé")
                .detailAddress("Tầng 12, Tòa nhà Bitexco, 2 Hải Triều")
                .fullAddress("Tầng 12, Tòa nhà Bitexco, 2 Hải Triều, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh")
                .addressType(AddressType.OFFICE)
                .isDefault(false)
                .build();
        customer1.getAddresses().add(customer1Home);
        customer1.getAddresses().add(customer1Office);

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

        com.thesweetlabbe.modules.user.entity.UserAddress customer2Home = com.thesweetlabbe.modules.user.entity.UserAddress.builder()
                .user(customer2)
                .recipientName("Trần Thị Bình")
                .phone("0987654321")
                .province("TP. Hồ Chí Minh")
                .district("Quận 1")
                .ward("Phường Bến Nghé")
                .detailAddress("88 Nguyễn Huệ")
                .fullAddress("88 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh")
                .addressType(AddressType.HOME)
                .isDefault(true)
                .build();
        customer2.getAddresses().add(customer2Home);

        userRepository.save(customer2);

        log.info("Users seeded successfully with address books (Admin, customer1 [2 addresses], customer2 [1 address]).");
    }

    private void seedJsonData() {
        log.info("Tự động đồng bộ Thương hiệu và Sản phẩm từ các file JSON trong resources/data/...");
        int loaded = jsonDataLoader.loadAllJsonData();
        log.info("Đã đồng bộ {} sản phẩm từ file JSON vào CSDL thành công.", loaded);
    }
}
