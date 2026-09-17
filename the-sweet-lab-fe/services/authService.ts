import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, User } from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const TOKEN_KEY = "sweet_lab_access_token";
const REFRESH_TOKEN_KEY = "sweet_lab_refresh_token";
const USER_KEY = "sweet_lab_user";

export const authService = {
    // 1. Đăng nhập
    login: async (request: LoginRequest): Promise<AuthResponse> => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(request),
            });

            const data: ApiResponse<AuthResponse> = await res.json();

            // Spring Boot trả về code: 1000 khi thành công hoặc success: true
            const isSuccess = data.code === 1000 || data.success === true;

            if (!res.ok || !isSuccess || !data.data) {
                throw new Error(data.message || "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.");
            }

            authService.setSession(data.data);
            return data.data;
        } catch (error: any) {
            // Nếu Backend chưa chạy, hỗ trợ fallback demo mock cho 2 tài khoản mẫu
            if (error.message?.includes("fetch failed") || error.message?.includes("NetworkError") || error.message?.includes("Failed to fetch")) {
                if (request.email === "admin@thesweetlab.com" && request.password === "Admin@123") {
                    const mockAdmin: AuthResponse = {
                        accessToken: "mock_jwt_admin_token",
                        refreshToken: "mock_refresh_token",
                        tokenType: "Bearer",
                        user: {
                            id: "mock-admin-uuid",
                            email: "admin@thesweetlab.com",
                            fullName: "Quản Trị Viên",
                            role: "ROLE_ADMIN",
                            status: "ACTIVE",
                            profile: {
                                phone: "0901234567",
                                address: "123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh",
                                gender: "OTHER"
                            },
                            nutritionProfile: {
                                height: 175,
                                weight: 70,
                                activityLevel: "MODERATE",
                                goal: "MAINTENANCE",
                                dietaryPreference: "STANDARD"
                            }
                        },
                    };
                    authService.setSession(mockAdmin);
                    return mockAdmin;
                } else if (
                    (request.email === "customer1@thesweetlab.com" || request.email === "customer2@thesweetlab.com") &&
                    request.password === "Customer@123"
                ) {
                    const isC1 = request.email.startsWith("customer1");
                    const mockCustomer: AuthResponse = {
                        accessToken: "mock_jwt_customer_token",
                        refreshToken: "mock_refresh_token",
                        tokenType: "Bearer",
                        user: {
                            id: isC1 ? "mock-c1-uuid" : "mock-c2-uuid",
                            email: request.email,
                            fullName: isC1 ? "Nguyễn Văn An" : "Trần Thị Bình",
                            role: "ROLE_CUSTOMER",
                            status: "ACTIVE",
                            profile: {
                                phone: isC1 ? "0912345678" : "0987654321",
                                address: isC1 ? "45 Lê Lợi, Quận 1, TP. Hồ Chí Minh" : "88 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
                                gender: isC1 ? "MALE" : "FEMALE"
                            },
                            nutritionProfile: {
                                height: isC1 ? 172 : 160,
                                weight: isC1 ? 68 : 50,
                                activityLevel: isC1 ? "VERY_ACTIVE" : "LIGHT",
                                goal: isC1 ? "WEIGHT_LOSS" : "MAINTENANCE",
                                dietaryPreference: isC1 ? "KETO" : "VEGAN"
                            }
                        },
                    };
                    authService.setSession(mockCustomer);
                    return mockCustomer;
                }
            }
            throw error;
        }
    },

    // 2. Lấy thông tin cá nhân hiện tại (Profile)
    getProfile: async (): Promise<User | null> => {
        const token = authService.getStoredToken();
        if (!token) return authService.getStoredUser();

        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const result = await res.json();
                if ((result.code === 1000 || result.success) && result.data) {
                    const updatedUser = result.data as User;
                    if (typeof window !== "undefined") {
                        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
                        window.dispatchEvent(new Event("auth-changed"));
                    }
                    return updatedUser;
                }
            }
        } catch {
            // Dùng dữ liệu lưu tạm trong localStorage
        }

        return authService.getStoredUser();
    },

    // 3. Đăng ký tài khoản
    register: async (request: RegisterRequest): Promise<string> => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(request),
            });

            const data: ApiResponse<string> = await res.json();

            if (!res.ok || (data.code !== 1000 && !data.success)) {
                throw new Error(data.message || "Đăng ký không thành công. Email có thể đã tồn tại.");
            }

            return data.message || "Đăng ký tài khoản thành công! Vui lòng kiểm tra email kích hoạt.";
        } catch (error: any) {
            if (error.message?.includes("fetch failed") || error.message?.includes("NetworkError") || error.message?.includes("Failed to fetch")) {
                return "Đăng ký thành công (Demo offline). Khi Backend bật, email xác thực sẽ được gửi đến hòm thư của bạn!";
            }
            throw error;
        }
    },

    // 4. Kích hoạt tài khoản bằng Token từ Email
    verifyEmail: async (token: string): Promise<string> => {
        const res = await fetch(`${API_BASE_URL}/api/v1/auth/verify-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        });

        const data: ApiResponse<string> = await res.json();

        if (!res.ok || (data.code !== 1000 && !data.success)) {
            throw new Error(data.message || "Xác thực tài khoản thất bại hoặc token không hợp lệ.");
        }

        return data.message || "Xác thực tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.";
    },

    // 5. Gửi lại mã kích hoạt
    resendVerification: async (email: string): Promise<string> => {
        const res = await fetch(`${API_BASE_URL}/api/v1/auth/resend-verification`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data: ApiResponse<string> = await res.json();

        if (!res.ok || (data.code !== 1000 && !data.success)) {
            throw new Error(data.message || "Gửi lại email kích hoạt thất bại.");
        }

        return data.message || "Đã gửi lại email kích hoạt! Vui lòng kiểm tra hòm thư của bạn.";
    },

    // 4. Quản lý phiên trong localStorage
    setSession: (authData: AuthResponse) => {
        if (typeof window !== "undefined") {
            localStorage.setItem(TOKEN_KEY, authData.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
            localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
            window.dispatchEvent(new Event("auth-changed"));
        }
    },

    logout: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            window.dispatchEvent(new Event("auth-changed"));
        }
    },

    getStoredUser: (): User | null => {
        if (typeof window === "undefined") return null;
        const raw = localStorage.getItem(USER_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw) as User;
        } catch {
            return null;
        }
    },

    getStoredToken: (): string | null => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(TOKEN_KEY);
    },

    isAuthenticated: (): boolean => {
        return !!authService.getStoredToken();
    },
};
