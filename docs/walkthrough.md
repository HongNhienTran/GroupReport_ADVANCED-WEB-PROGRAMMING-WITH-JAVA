# Tổng kết Triển khai Base Project & Authentication Module - The Sweet Lab

Chúng ta đã thiết lập hoàn chỉnh kiến trúc cơ sở (Base Project) theo mô hình **Modular Monolith (Modulith)** và triển khai thành công toàn bộ luồng **Authentication (Đăng ký, Xác thực Email, Đăng nhập JWT, Quản lý Token & Profile)**.

---

## 1. Hạ tầng & Công nghệ đã thiết lập

- **Backend**: Spring Boot `3.3.5`, Java `21`, Spring Security `6`, JJWT `0.12.6`.
- **Database**: PostgreSQL `16` (Hibernate tự động sinh bảng, quan hệ 1-1 và khóa ngoại).
- **In-Memory & Cache**: Redis `7` (RedisTemplate sẵn sàng cho Caching, Token Blacklisting, OTP).
- **Email Service**: Spring Mail + Mailpit (SMTP server giả lập cho dev, có web UI `http://localhost:8025`).
- **Thư viện template**: Thymeleaf (render email HTML nhận diện thương hiệu **The Sweet Lab**).
- **Tài liệu API**: Springdoc OpenAPI 3 / Swagger UI (`http://localhost:8080/swagger-ui.html`).
- **Docker Compose**: File [docker-compose.yml](file:///d:/HK9/WWW/Group_Report/Project/the-sweet-lab-be/docker-compose.yml) quản lý 3 containers (`sweet_lab_postgres`, `sweet_lab_redis`, `sweet_lab_mailpit`).

---

## 2. Cấu trúc Thư mục Module & Thực thể

```text
com.thesweetlabbe
├── common
│   ├── config                 # SecurityConfig, RedisConfig, OpenApiConfig, JpaAuditingConfig
│   ├── dto                    # ApiResponse<T>, PageResponse<T>
│   ├── enums                  # ErrorCode
│   ├── exception              # AppException, GlobalExceptionHandler
│   ├── security               # JwtTokenProvider, JwtAuthenticationFilter, UserPrincipal, CustomUserDetailsService
│   └── entity                 # BaseEntity (createdAt, updatedAt tự động JPA Auditing)
│
├── modules
│   ├── auth                   # Đăng ký, kích hoạt email, đăng nhập JWT, refresh token
│   │   ├── controller         # AuthController
│   │   ├── dto                # RegisterRequest, LoginRequest, VerifyEmailRequest, ResendVerificationRequest, RefreshTokenRequest, AuthResponse
│   │   ├── entity             # VerificationToken
│   │   ├── enums              # TokenType (EMAIL_VERIFICATION, PASSWORD_RESET, REFRESH_TOKEN)
│   │   ├── repository         # VerificationTokenRepository
│   │   └── service            # AuthService, AuthServiceImpl
│   │
│   ├── user                   # Quản lý tài khoản & hồ sơ theo Class Diagram
│   │   ├── entity             # User, UserProfile (1-1), NutritionProfile (1-1)
│   │   ├── enums              # UserRole, AccountStatus, Gender, ActivityLevel, NutritionGoal, DietaryPreference
│   │   ├── repository         # UserRepository, UserProfileRepository, NutritionProfileRepository
│   │   └── service            # UserService, UserServiceImpl
│   │
│   ├── notification           # Gửi email HTML bất đồng bộ (@Async) qua Thymeleaf template
│   ├── product                # (Skeleton sẵn sàng cho module Bánh kẹo/socola healthy & calo)
│   ├── order                  # (Skeleton sẵn sàng cho module Giỏ hàng & Đơn hàng)
│   └── nutrition              # (Skeleton sẵn sàng cho module Tính BMI & AI Gợi ý)
```

---

## 3. Kết quả Kiểm thử Thực tế (End-to-End Verification)

Toàn bộ quy trình xác thực đã được chạy thử nghiệm thực tế với kết quả 100% thành công:

| Bước | Hành động | Endpoint | Kết quả thực tế |
| :--- | :--- | :--- | :--- |
| **1** | Kiểm tra tài liệu Swagger | `GET /v3/api-docs` | Thành công, hiển thị đầy đủ schema và Bearer JWT Auth |
| **2** | Đăng ký tài khoản mới | `POST /api/v1/auth/register` | `201 Created` - Tạo User (`PENDING_VERIFICATION`), tạo 1-1 `UserProfile` & `NutritionProfile`, sinh token và gửi mail |
| **3** | Nhận email xác thực | `Mailpit (Port 8025)` | Email HTML gửi đến tức thì với giao diện The Sweet Lab và mã kích hoạt |
| **4** | Thử đăng nhập khi chưa kích hoạt | `POST /api/v1/auth/login` | `403 Forbidden` - Thông báo `"Account has not been verified. Please check your email."` |
| **5** | Kích hoạt tài khoản bằng Token | `POST /api/v1/auth/verify-email` | `200 OK` - Đổi trạng thái user sang `ACTIVE`, vô hiệu hóa token |
| **6** | Đăng nhập sau khi kích hoạt | `POST /api/v1/auth/login` | `200 OK` - Cấp `accessToken` (JWT 24h), `refreshToken` (7 ngày) |
| **7** | Gọi Endpoint được bảo vệ | `GET /api/v1/auth/me` | `200 OK` - Trả về đầy đủ thông tin User, UserProfile và NutritionProfile |

---

## 4. Hướng dẫn Khởi chạy Dự án

### 4.1. Khởi động Hạ tầng Docker (Postgres, Redis, Mailpit)
Tại thư mục `the-sweet-lab-be`:
```bash
docker compose up -d
```

### 4.2. Khởi động Spring Boot Backend
```bash
./mvnw spring-boot:run
```
- **Backend API**: `http://localhost:8080`
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **Mailpit Web UI (Xem email)**: `http://localhost:8025`
