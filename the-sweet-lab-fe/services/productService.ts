import { Product, Category, FlashSaleProduct } from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const categoryBackgrounds = ['bg-emerald-50', 'bg-green-50', 'bg-teal-50', 'bg-lime-50'];

// Helper hàm bóc tách mảng dữ liệu từ ApiResponse { code, message, data, success }
const extractDataArray = (result: any): any[] | null => {
    if (!result) return null;
    if (Array.isArray(result)) return result;
    if (Array.isArray(result.data)) return result.data;
    return null;
};

// Mock Categories dự phòng khi Backend chưa khởi động
const mockCategories: Category[] = [
    {
        id: 'mock-1',
        name: 'Socola & Cacao Thủ Công',
        productCount: 4,
        slug: 'socola-cacao-thu-cong',
        backgroundColor: 'bg-emerald-50',
        imageUrl: '/categories/Socola.png',
        description: 'Socola đen nguyên chất bean-to-bar, nama tươi và cacao giàu chất chống oxy hóa tự nhiên.',
        bannerUrl: '/categories/Socola.png'
    },
    {
        id: 'mock-2',
        name: 'Bánh Quy & Bánh Nướng Organic',
        productCount: 4,
        slug: 'banh-quy-banh-nuong-organic',
        backgroundColor: 'bg-green-50',
        imageUrl: '/categories/Bakery.png',
        description: 'Bánh nướng ngũ cốc nguyên cám, ít ngọt, không chất béo xấu, cung cấp năng lượng sạch dồi dào.',
        bannerUrl: '/categories/Bakery.png'
    },
    {
        id: 'mock-3',
        name: 'Kẹo Dẻo & Kẹo Thảo Mộc Tự Nhiên',
        productCount: 4,
        slug: 'keo-deo-keo-thao-moc-tu-nhien',
        backgroundColor: 'bg-teal-50',
        imageUrl: '/categories/Candies.png',
        description: 'Kẹo dẻo vegan từ pectin hoa quả và kẹo ngậm thảo dược thiên nhiên không đường hóa học.',
        bannerUrl: '/categories/Candies.png'
    },
    {
        id: 'mock-4',
        name: 'Hộp Quà & Combo Sức Khỏe',
        productCount: 4,
        slug: 'hop-qua-combo-suc-khoe',
        backgroundColor: 'bg-lime-50',
        imageUrl: '/categories/Gifts.png',
        description: 'Bộ quà tặng sức khỏe tinh tế, ý nghĩa cho người thân và đối tác.',
        bannerUrl: '/categories/Gifts.png'
    },
];

const mockFlashSales: FlashSaleProduct[] = [
    { id: 'fs-1', name: 'Socola Tươi Nama Thuần Chay PureChoc Artisans Vị Cốt Dừa', price: 165000, oldPrice: 190000, imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800' },
    { id: 'fs-2', name: 'Bánh Cookies Yến Mạch Socola Chip AuraBake Clean Treats', price: 110000, oldPrice: 125000, imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800' },
    { id: 'fs-3', name: 'Kẹo Dẻo Thuần Chay BerryZen Vị Dâu & Quả Mọng Pectin Hữu Cơ', price: 65000, oldPrice: 75000, imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?q=80&w=800' },
    { id: 'fs-4', name: 'Hộp Quà Sweetie Present Eco-Friendly Tinh Hoa Bánh Kẹo Healthy', price: 420000, oldPrice: 480000, imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800' },
    { id: 'fs-5', name: 'Socola Đen Cacaovita 85% Nguyên Chất Đắk Lắk', price: 120000, oldPrice: 145000, imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=800' },
    { id: 'fs-6', name: 'Bánh Ngói Hạnh Nhân Tuiles KetoFlora Bột Hạnh Nhân Siêu Mỏng', price: 115000, oldPrice: 135000, imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800' },
];

const mockFeaturedProducts: Product[] = [
    { 
        id: 'feat-1', 
        name: 'Socola Đen Cacaovita 85% Nguyên Chất Đắk Lắk', 
        slug: 'socola-den-cacaovita-dak-lak-85',
        price: 135000, 
        originalPrice: 150000,
        rating: 4.9, 
        reviewCount: 68,
        soldCount: 310,
        imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=800', 
        categoryId: 'mock-1',
        categoryName: 'Socola & Cacao Thủ Công',
        brand: 'Cacaovita',
        dietaryTags: ['Keto', 'Sugar-Free', 'Vegan'],
        nutrition: { calories: 220, sugarG: 3.2, proteinG: 4.5 }
    },
    { 
        id: 'feat-2', 
        name: 'Socola Tươi Nama Thuần Chay PureChoc Artisans Vị Cốt Dừa', 
        slug: 'socola-tuoi-nama-thuan-chay-purechoc-artisans',
        price: 165000, 
        originalPrice: 190000,
        rating: 4.8, 
        reviewCount: 42,
        soldCount: 190,
        imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800', 
        categoryId: 'mock-1',
        categoryName: 'Socola & Cacao Thủ Công',
        brand: 'PureChoc Artisans',
        dietaryTags: ['Vegan', 'Organic', 'Sugar-Free'],
        nutrition: { calories: 130, sugarG: 2.1, proteinG: 1.8 }
    },
    { 
        id: 'feat-3', 
        name: 'Bánh Biscotti Hạt Dinh Dưỡng NutriBloom Không Đường', 
        slug: 'banh-biscotti-hat-dinh-duong-nutribloom-khong-duong',
        price: 125000, 
        originalPrice: 140000,
        rating: 4.9, 
        reviewCount: 95,
        soldCount: 520,
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800', 
        categoryId: 'mock-2',
        categoryName: 'Bánh Quy & Bánh Nướng Organic',
        brand: 'NutriBloom',
        dietaryTags: ['Sugar-Free', 'High Protein', 'No Flour'],
        nutrition: { calories: 135, sugarG: 1.2, proteinG: 6.5 }
    },
    { 
        id: 'feat-4', 
        name: 'Bánh Cookies Yến Mạch Socola Chip AuraBake Clean Treats', 
        slug: 'banh-cookies-yen-mach-socola-chip-aurabake',
        price: 110000, 
        originalPrice: 125000,
        rating: 4.8, 
        reviewCount: 55,
        soldCount: 230,
        imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800', 
        categoryId: 'mock-2',
        categoryName: 'Bánh Quy & Bánh Nướng Organic',
        brand: 'AuraBake Clean Treats',
        dietaryTags: ['Low Carb', 'Organic'],
        nutrition: { calories: 145, sugarG: 3.0, proteinG: 4.2 }
    },
    { 
        id: 'feat-5', 
        name: 'Kẹo Dẻo Thuần Chay BerryZen Vị Dâu & Quả Mọng Pectin Hữu Cơ', 
        slug: 'keo-deo-thuan-chay-berryzen-vi-dau-qua-mong',
        price: 65000, 
        originalPrice: 75000,
        rating: 4.9, 
        reviewCount: 88,
        soldCount: 420,
        imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?q=80&w=800', 
        categoryId: 'mock-3',
        categoryName: 'Kẹo Dẻo & Kẹo Thảo Mộc Tự Nhiên',
        brand: 'BerryZen',
        dietaryTags: ['Vegan', 'Organic', 'Sugar-Free'],
        nutrition: { calories: 82, sugarG: 7.5, proteinG: 0.4 }
    },
    { 
        id: 'feat-6', 
        name: 'Kẹo Ngậm Thảo Mộc BerryZen Bạc Hà & Cam Thảo Không Đường', 
        slug: 'keo-ngam-thao-moc-berryzen-bac-ha-cam-thao',
        price: 55000, 
        originalPrice: 65000,
        rating: 4.8, 
        reviewCount: 39,
        soldCount: 160,
        imageUrl: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?q=80&w=800', 
        categoryId: 'mock-3',
        categoryName: 'Kẹo Dẻo & Kẹo Thảo Mộc Tự Nhiên',
        brand: 'BerryZen',
        dietaryTags: ['Sugar-Free', 'Vegan', 'Organic'],
        nutrition: { calories: 45, sugarG: 0.2, proteinG: 0.1 }
    },
    { 
        id: 'feat-7', 
        name: 'Hộp Quà Sweetie Present Eco-Friendly Tinh Hoa Bánh Kẹo Healthy', 
        slug: 'hop-qua-sweetie-present-eco-friendly-tinh-hoa',
        price: 420000, 
        originalPrice: 480000,
        rating: 5.0, 
        reviewCount: 28,
        soldCount: 85,
        imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800', 
        categoryId: 'mock-4',
        categoryName: 'Hộp Quà & Combo Sức Khỏe',
        brand: 'Sweetie Present',
        dietaryTags: ['Gift', 'Organic', 'Eco-Friendly'],
        nutrition: { calories: 180, sugarG: 3.5, proteinG: 6.0 }
    },
    { 
        id: 'feat-8', 
        name: 'Giỏ Mây Quà Tặng Sweetie Present Premium Hamper Đan Thủ Công', 
        slug: 'gio-may-qua-tang-sweetie-present-premium-hamper',
        price: 850000, 
        originalPrice: 980000,
        rating: 5.0, 
        reviewCount: 45,
        soldCount: 60,
        imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800', 
        categoryId: 'mock-4',
        categoryName: 'Hộp Quà & Combo Sức Khỏe',
        brand: 'Sweetie Present',
        dietaryTags: ['Premium Gift', 'Handmade'],
        nutrition: { calories: 190, sugarG: 4.0, proteinG: 5.5 }
    }
];

export const productService = {
    // 1. Kéo Danh mục từ Backend
    getFeaturedCategories: async (): Promise<Category[]> => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/categories`, {
                cache: 'no-store'
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const result = await res.json();
            const data = extractDataArray(result);
            
            if (data && data.length > 0) {
                return data.map((cat: any, index: number) => {
                    const slug = (cat.slug || '').toLowerCase();
                    const name = (cat.name || '').toLowerCase();
                    let categoryImage = '/categories/Socola.png';

                    if (slug.includes('banh') || name.includes('bánh')) {
                        categoryImage = '/categories/Bakery.png';
                    } else if (slug.includes('keo') || name.includes('kẹo')) {
                        categoryImage = '/categories/Candies.png';
                    } else if (slug.includes('hop') || slug.includes('qua') || name.includes('quà') || name.includes('combo')) {
                        categoryImage = '/categories/Gifts.png';
                    } else if (slug.includes('socola') || name.includes('socola') || name.includes('cacao')) {
                        categoryImage = '/categories/Socola.png';
                    }

                    return {
                        id: cat.id,
                        name: cat.name,
                        slug: cat.slug,
                        productCount: cat.productCount || 0,
                        backgroundColor: categoryBackgrounds[index % categoryBackgrounds.length],
                        imageUrl: categoryImage,
                        description: cat.description || `Khám phá các dòng sản phẩm ${cat.name} lành mạnh, an toàn cho sức khỏe.`,
                        bannerUrl: categoryImage,
                        children: cat.children || []
                    };
                });
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
                cache: 'no-store'
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const result = await res.json();
            const data = extractDataArray(result);

            if (data && data.length > 0) {
                return data.map((item: any) => ({
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
                cache: 'no-store'
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const result = await res.json();
            const data = extractDataArray(result);

            if (data && data.length > 0) {
                return data.map((item: any) => ({
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
                cache: 'no-store'
            });
            if (res.ok) {
                const result = await res.json();
                const data = extractDataArray(result);
                if (data && data.length > 0) {
                    return data.map((item: any) => ({
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