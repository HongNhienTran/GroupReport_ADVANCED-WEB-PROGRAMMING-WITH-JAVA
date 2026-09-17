export interface ProductNutrition {
    servingSize?: string;
    calories?: number;
    proteinG?: number;
    fatG?: number;
    saturatedFatG?: number;
    carbsG?: number;
    sugarG?: number;
    fiberG?: number;
    sodiumMg?: number;
    allergens?: string;
    ingredients?: string;
}

export interface Brand {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
    description?: string;
    originCountry?: string;
    websiteUrl?: string;
}

export interface ProductVariant {
    id: string;
    name: string;
    sku: string;
    price: number;
    originalPrice?: number;
    stockQuantity: number;
    imageUrl?: string;
    displayOrder?: number;
    inStock: boolean;
}

export interface Product {
    id: string | number;
    name: string;
    slug?: string;
    sku?: string;
    price: number;
    originalPrice?: number;
    stockQuantity?: number;
    description?: string;
    thumbnailUrl?: string;
    imageUrl: string; // Tương thích hiển thị cả thumbnailUrl lẫn imageUrl
    categoryId?: string | number;
    categoryName?: string;
    categorySlug?: string;
    brand?: string;
    brandDetail?: Brand;
    origin?: string;
    cocoaPercentage?: number;
    dietaryTags?: string[];
    isFeatured?: boolean;
    isFlashSale?: boolean;
    rating: number;
    reviewCount?: number;
    soldCount?: number;
    status?: string;
    nutrition?: ProductNutrition;
    images?: string[];
    variants?: ProductVariant[];
}

export interface FlashSaleProduct {
    id: string | number;
    name: string;
    price: number;
    oldPrice: number;
    imageUrl: string;
    thumbnailUrl?: string;
    discountPercent?: number;
    rating?: number;
    reviewCount?: number;
    soldCount?: number;
    nutrition?: ProductNutrition;
    dietaryTags?: string[];
}

export interface Category {
    id: string | number;
    name: string;
    productCount: number;
    slug: string;
    backgroundColor?: string;
    imageUrl: string;
    description?: string;
    bannerUrl?: string;
    children?: Category[];
}