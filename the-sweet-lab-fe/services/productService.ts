import { Product, Category, FlashSaleProduct } from "@/types/product";

const mockCategories: Category[] = [
    {
        id: 1,
        name: 'Socola Lành Mạnh',
        productCount: 12,
        slug: 'socola-lanh-manh',
        backgroundColor: 'bg-emerald-50',
        imageUrl: '/categories/Socola.png',
        description: 'Khám phá các dòng sản phẩm socola organic, 100% tự nhiên, không đường hóa học và an toàn cho sức khỏe.',
        bannerUrl: '/categories/Socola.png'
    },
    {
        id: 2,
        name: 'Bánh Quy & Bánh Nướng',
        productCount: 12,
        slug: 'banh-quy-organic',
        backgroundColor: 'bg-green-50',
        imageUrl: '/categories/Bakery.png',
        description: 'Khám phá các dòng sản phẩm bánh quy và bánh nướng organic, 100% tự nhiên, không đường hóa học và an toàn cho sức khỏe.',
        bannerUrl: '/categories/Bakery.png'
    },
    {
        id: 3,
        name: 'Kẹo Dẻo & Góc Ngọt Lành',
        productCount: 12,
        slug: 'keo-deo-healthy',
        backgroundColor: 'bg-teal-50',
        imageUrl: '/categories/Candies.png',
        description: 'Khám phá các dòng sản phẩm kẹo dẻo và góc ngọt lành organic, 100% tự nhiên, không đường hóa học và an toàn cho sức khỏe.',
        bannerUrl: '/categories/Candies.png'
    },
    {
        id: 4,
        name: 'Hộp Quà & Combo Sức Khỏe',
        productCount: 12,
        slug: 'hop-qua-suc-khoe',
        backgroundColor: 'bg-lime-50',
        imageUrl: '/categories/Gifts.png',
        description: 'Khám phá các dòng sản phẩm hộp quà và combo sức khỏe organic, 100% tự nhiên, không đường hóa học và an toàn cho sức khỏe.',
        bannerUrl: '/categories/Gifts.png'
    },
];

const mockFlashSales: FlashSaleProduct[] = [
    { id: 101, name: 'Socola 85% Đậu Phộng', price: 100000, oldPrice: 130000, imageUrl: '🍫' },
    { id: 102, name: 'Bánh Yến Mạch Sale', price: 75000, oldPrice: 100000, imageUrl: '🍪' },
    { id: 103, name: 'Hạt Macca Mix Sale', price: 150000, oldPrice: 200000, imageUrl: '🌰' },
    { id: 104, name: 'Kẹo Yêu Sale', price: 60000, oldPrice: 80000, imageUrl: '🍬' },
];

const mockFeaturedProducts: Product[] = [
    { id: 1, name: 'Socola Đen 85%', price: 120000, rating: 5.0, imageUrl: '🍫', categoryId: 1 },
    { id: 2, name: 'Bánh Biscotti Matcha', price: 120000, rating: 5.0, imageUrl: '🍵', categoryId: 2 },
    { id: 3, name: 'Granola Siêu Hạt', price: 120000, rating: 5.0, imageUrl: '🥣', categoryId: 3 },
    { id: 4, name: 'Granola Siêu Hạt Đặc Biệt', price: 120000, rating: 5.0, imageUrl: '🌾', categoryId: 3 },
];

export const productService = {
    getFeaturedCategories: async (): Promise<Category[]> => mockCategories,
    getFlashSaleProducts: async (): Promise<FlashSaleProduct[]> => mockFlashSales,
    getFeaturedProducts: async (): Promise<Product[]> => mockFeaturedProducts,
};