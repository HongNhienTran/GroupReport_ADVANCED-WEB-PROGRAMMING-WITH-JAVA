export interface Product {
    id: number;
    name: string;
    price: number;
    rating: number;
    imageUrl: string;
    categoryId: number;
    isOrganic?: boolean;
}

export interface FlashSaleProduct {
    id: number;
    name: string;
    price: number;
    oldPrice: number;
    imageUrl: string;
}

export interface Category {
    id: number;
    name: string;
    productCount: number;
    slug: string;
    backgroundColor: string;
    imageUrl: string; // Ảnh nhỏ dùng cho card danh mục
    description: string; // Mô tả chi tiết ngành hàng
    bannerUrl: string;
}