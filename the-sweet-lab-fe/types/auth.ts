export interface UserProfile {
    phone?: string;
    address?: string;
    avatar?: string;
    dateOfBirth?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | string;
}

export interface NutritionProfile {
    height?: number;
    weight?: number;
    activityLevel?: 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'VERY_ACTIVE' | 'EXTRA_ACTIVE' | string;
    goal?: 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'MAINTENANCE' | 'KETO' | 'VEGAN' | 'LOW_SUGAR' | string;
    dietaryPreference?: 'STANDARD' | 'VEGETARIAN' | 'VEGAN' | 'GLUTEN_FREE' | 'DIABETIC_FRIENDLY' | 'KETO' | string;
}

export interface User {
    id: string;
    email: string;
    fullName: string;
    role: 'ROLE_CUSTOMER' | 'ROLE_ADMIN' | 'CUSTOMER' | 'ADMIN' | string;
    avatarUrl?: string;
    status?: 'ACTIVE' | 'PENDING' | 'INACTIVE' | string;
    createdAt?: string;
    updatedAt?: string;
    profile?: UserProfile;
    nutritionProfile?: NutritionProfile;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    user: User;
}

export interface ApiResponse<T> {
    code?: number;
    success?: boolean;
    message: string;
    data: T;
    timestamp?: string;
}
