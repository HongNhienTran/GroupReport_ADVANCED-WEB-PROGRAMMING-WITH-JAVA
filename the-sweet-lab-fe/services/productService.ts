import { Product, Category, FlashSaleProduct } from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const categoryBackgrounds = ['bg-emerald-50', 'bg-green-50', 'bg-teal-50', 'bg-lime-50'];

// Mock Categories dự phòng khi Backend chưa khởi động
const mockCategories: Category[] = [
    {
        id: 'mock-1',
        name: 'Socola Lành Mạnh',
        productCount: 4,
        slug: 'socola-lanh-manh',
        backgroundColor: 'bg-emerald-50',
        imageUrl: '/categories/Socola.png',
        description: 'Socola đen nguyên chất, ít đường, giàu chất chống oxy hóa và flavonoid.',
        bannerUrl: '/categories/Socola.png'
    },
    {
        id: 'mock-2',
        name: 'Bánh Quy & Bánh Nướng',
        productCount: 3,
        slug: 'banh-quy-banh-nuong-organic',
        backgroundColor: 'bg-green-50',
        imageUrl: '/categories/Bakery.png',
        description: 'Bánh nướng ít ngọt, nguyên cám, bổ sung protein và năng lượng sạch.',
        bannerUrl: '/categories/Bakery.png'
    },
    {
        id: 'mock-3',
        name: 'Kẹo Dẻo & Góc Ngọt Lành',
        productCount: 3,
        slug: 'keo-deo-goc-ngot-lanh',
        backgroundColor: 'bg-teal-50',
        imageUrl: '/categories/Candies.png',
        description: 'Kẹo dẻo từ nước ép trái cây hữu cơ và thảo mộc tự nhiên, không gelatin động vật.',
        bannerUrl: '/categories/Candies.png'
    },
    {
        id: 'mock-4',
        name: 'Hộp Quà & Combo Sức Khỏe',
        productCount: 3,
        slug: 'hop-qua-combo-suc-khoe',
        backgroundColor: 'bg-lime-50',
        imageUrl: '/categories/Gifts.png',
        description: 'Bộ quà tặng sức khỏe tinh tế, ý nghĩa cho người thân và đối tác.',
        bannerUrl: '/categories/Gifts.png'
    },
];

const mockFlashSales: FlashSaleProduct[] = [
    { id: 'fs-1', name: 'Socola Không Đường Keto 70%', price: 120000, oldPrice: 150000, imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800' },
    { id: 'fs-2', name: 'Socola Tươi Vegan Nama Matcha', price: 165000, oldPrice: 190000, imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800' },
    { id: 'fs-3', name: 'Bánh Biscotti Yến Mạch Hạt', price: 115000, oldPrice: 135000, imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800' },
    { id: 'fs-4', name: 'Combo Ăn Vặt Healthy Tiết Kiệm', price: 290000, oldPrice: 340000, imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800' },
];

const mockFeaturedProducts: Product[] = [
    { 
        id: 'feat-1', 
        name: 'Socola Đen Marou 85%', 
        price: 135000, 
        originalPrice: 155000,
        rating: 5.0, 
        reviewCount: 68,
        soldCount: 310,
        imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800', 
        categoryId: 'mock-1',
        categoryName: 'Socola Lành Mạnh',
        brand: 'Marou',
        dietaryTags: ['Keto', 'Sugar-Free', 'Vegan'],
        nutrition: { calories: 155, sugarG: 1.2, proteinG: 7.5 }
    },
    { 
        id: 'feat-2', 
        name: 'Socola Hạnh Nhân & Việt Quất', 
        price: 145000, 
        originalPrice: 170000,
        rating: 4.8, 
        reviewCount: 42,
        soldCount: 190,
        imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800', 
        categoryId: 'mock-1',
        categoryName: 'Socola Lành Mạnh',
        brand: 'The Sweet Lab',
        dietaryTags: ['Organic', 'Gluten-Free'],
        nutrition: { calories: 160, sugarG: 2.0, proteinG: 6.8 }
    },
    { 
        id: 'feat-3', 
        name: 'Bánh Biscotti Yến Mạch Hạt Dinh Dưỡng', 
        price: 115000, 
        rating: 4.9, 
        reviewCount: 95,
        soldCount: 520,
        imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800', 
        categoryId: 'mock-2',
        categoryName: 'Bánh Quy & Bánh Nướng',
        brand: 'The Sweet Lab',
        dietaryTags: ['High Protein', 'No Flour'],
        nutrition: { calories: 130, sugarG: 0.5, proteinG: 9.2 }
    },
    { 
        id: 'feat-4', 
        name: 'Hộp Quà Sự Kiện Eco-Friendly', 
        price: 450000, 
        originalPrice: 520000,
        rating: 5.0, 
        reviewCount: 28,
        soldCount: 85,
        imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800', 
        categoryId: 'mock-4',
        categoryName: 'Hộp Quà & Combo Sức Khỏe',
        brand: 'The Sweet Lab',
        dietaryTags: ['Gift', 'Organic'],
        nutrition: { calories: 180, sugarG: 3.5, proteinG: 6.0 }
    },
    { 
        id: 'feat-5', 
        name: 'Kẹo Dẻo Thảo Mộc Trái Cây Rừng', 
        price: 85000, 
        rating: 4.7, 
        reviewCount: 53,
        soldCount: 240,
        imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800', 
        categoryId: 'mock-3',
        categoryName: 'Kẹo Dẻo & Góc Ngọt Lành',
        brand: 'The Sweet Lab',
        dietaryTags: ['Vegan', 'Sugar-Free'],
        nutrition: { calories: 95, sugarG: 0.0, proteinG: 1.5 }
    },
    { 
        id: 'feat-6', 
        name: 'Bánh Cookie Hạt Macca & Dừa Sấy', 
        price: 125000, 
        originalPrice: 140000,
        rating: 4.9, 
        reviewCount: 64,
        soldCount: 215,
        imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800', 
        categoryId: 'mock-2',
        categoryName: 'Bánh Quy & Bánh Nướng',
        brand: 'HealthyBites',
        dietaryTags: ['Keto', 'Gluten-Free'],
        nutrition: { calories: 140, sugarG: 1.0, proteinG: 5.8 }
    },
    { 
        id: 'feat-7', 
        name: 'Socola Bọc Hạt Dẻ Cười Pistachio', 
        price: 175000, 
        rating: 4.8, 
        reviewCount: 39,
        soldCount: 160,
        imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800', 
        categoryId: 'mock-1',
        categoryName: 'Socola Lành Mạnh',
        brand: 'Marou',
        dietaryTags: ['Organic', 'High Fiber'],
        nutrition: { calories: 170, sugarG: 1.8, proteinG: 8.0 }
    },
    { 
        id: 'feat-8', 
        name: 'Combo Trải Nghiệm 4 Vị Bánh Nướng', 
        price: 260000, 
        originalPrice: 310000,
        rating: 5.0, 
        reviewCount: 88,
        soldCount: 430,
        imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800', 
        categoryId: 'mock-4',
        categoryName: 'Hộp Quà & Combo Sức Khỏe',
        brand: 'The Sweet Lab',
        dietaryTags: ['Combo', 'Sugar-Free'],
        nutrition: { calories: 150, sugarG: 1.5, proteinG: 7.2 }
    }
];

export const productService = {
    // 1. Kéo Danh mục từ Backend
    getFeaturedCategories: async (): Promise<Category[]> => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/categories`, {
                next: { revalidate: 60 } // Cache 60s
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const result = await res.json();
            
            if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                return result.data.map((cat: any, index: number) => ({
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug,
                    productCount: cat.productCount || 0,
                    backgroundColor: categoryBackgrounds[index % categoryBackgrounds.length],
                    imageUrl: cat.imageUrl || `/categories/Socola.png`,
                    description: cat.description || `Khám phá các dòng sản phẩm ${cat.name} lành mạnh, an toàn cho sức khỏe.`,
                    bannerUrl: cat.bannerUrl || cat.imageUrl || `/categories/Socola.png`,
                    children: cat.children || []
                }));
            }
        } catch (error) {
            console.warn('[productService] Không thể kết nối Backend API categories, sử dụng mock data:', (error as any).message);
        }
        return mockCategories;
    },

    // 2. Kéo Sản phẩm Flash Sale từ Backend
    getFlashSaleProducts: async (): Promise<FlashSaleProduct[]> => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/products/flash-sale`, {
                next: { revalidate: 30 }
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const result = await res.json();

            if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                return result.data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    price: Number(item.price),
                    oldPrice: item.originalPrice ? Number(item.originalPrice) : Math.round(Number(item.price) * 1.2),
                    imageUrl: item.thumbnailUrl || 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800',
                    thumbnailUrl: item.thumbnailUrl
                }));
            }
        } catch (error) {
            console.warn('[productService] Không thể kết nối Backend API flash-sale, sử dụng mock data:', (error as any).message);
        }
        return mockFlashSales;
    },

    // 3. Kéo Sản phẩm Gợi ý Nổi bật từ Backend
    getFeaturedProducts: async (): Promise<Product[]> => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/products/featured`, {
                next: { revalidate: 30 }
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const result = await res.json();

            if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                return result.data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    slug: item.slug,
                    price: Number(item.price),
                    originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
                    rating: item.rating ? Number(item.rating) : 5.0,
                    imageUrl: item.thumbnailUrl || 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800',
                    thumbnailUrl: item.thumbnailUrl,
                    categoryId: item.categoryId,
                    categoryName: item.categoryName,
                    brand: item.brand,
                    dietaryTags: item.dietaryTags,
                    nutrition: item.nutrition
                }));
            }
        } catch (error) {
            console.warn('[productService] Không thể kết nối Backend API featured, sử dụng mock data:', (error as any).message);
        }
        return mockFeaturedProducts;
    },

    // 4. Kéo Toàn bộ sản phẩm cho trang Sản Phẩm (kèm fallback đầy đủ)
    getAllProducts: async (): Promise<Product[]> => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/products`, {
                next: { revalidate: 30 }
            });
            if (res.ok) {
                const result = await res.json();
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    return result.data.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        slug: item.slug,
                        price: Number(item.price),
                        originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
                        rating: item.rating ? Number(item.rating) : 5.0,
                        reviewCount: item.reviewCount || 45,
                        soldCount: item.soldCount || 120,
                        imageUrl: item.thumbnailUrl || 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800',
                        thumbnailUrl: item.thumbnailUrl,
                        categoryId: item.categoryId,
                        categoryName: item.categoryName,
                        brand: item.brand,
                        dietaryTags: item.dietaryTags,
                        nutrition: item.nutrition
                    }));
                }
            }
        } catch (error) {
            console.warn('[productService] Fallback to mockFeaturedProducts for full product list:', (error as any).message);
        }
        return mockFeaturedProducts;
    },
};