"use client";

import React, { useState, useMemo } from 'react';
import { 
    Search, 
    SlidersHorizontal, 
    ArrowUpDown, 
    RotateCcw, 
    Check, 
    X,
    Filter,
    ChevronDown,
    Sparkles,
    Flame,
    Plus,
    Minus
} from 'lucide-react';
import { Product, Category, FlashSaleProduct } from '@/types/product';
import FlashSale from '@/components/home/FlashSale';
import ProductCard from '@/components/common/ProductCard';

interface ProductsPageClientProps {
    initialProducts: Product[];
    categories: Category[];
    flashSales: FlashSaleProduct[];
}

// Danh mục chế độ ăn healthy
const DIETARY_OPTIONS = [
    { id: 'Sugar-Free', label: 'Không Đường (Sugar-Free)' },
    { id: 'Keto', label: 'Ăn Kiêng Keto' },
    { id: 'Vegan', label: 'Thuần Chay (Vegan)' },
    { id: 'Organic', label: 'Hữu Cơ (Organic)' },
    { id: 'Gluten-Free', label: 'Không Gluten (Gluten-Free)' },
    { id: 'High Protein', label: 'Giàu Protein (High Protein)' },
];

// Khoảng giá
const PRICE_RANGES = [
    { id: 'all', label: 'Tất cả mức giá', min: 0, max: Infinity },
    { id: 'under-100', label: 'Dưới 100.000₫', min: 0, max: 100000 },
    { id: '100-200', label: '100.000₫ - 200.000₫', min: 100000, max: 200000 },
    { id: '200-400', label: '200.000₫ - 400.000₫', min: 200000, max: 400000 },
    { id: 'above-400', label: 'Trên 400.000₫', min: 400000, max: Infinity },
];

// Tùy chọn sắp xếp
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating-desc';

export default function ProductsPageClient({
    initialProducts,
    categories,
    flashSales
}: ProductsPageClientProps) {
    // 1. Bộ lọc state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
    
    // Slider mức giá: min = 0, max = 500.000₫ (hoặc tùy biến)
    const MIN_PRICE_BOUND = 0;
    const MAX_PRICE_BOUND = 500000;
    const [minPrice, setMinPrice] = useState<number>(MIN_PRICE_BOUND);
    const [maxPrice, setMaxPrice] = useState<number>(MAX_PRICE_BOUND);
    const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(true);

    const [minRating, setMinRating] = useState<number>(0);
    const [sortBy, setSortBy] = useState<SortOption>('default');
    
    // Mobile Filter Drawer Toggle
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Toggle chế độ ăn
    const handleToggleDiet = (diet: string) => {
        setSelectedDiets((prev) => 
            prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]
        );
    };

    // Đặt lại toàn bộ bộ lọc
    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSelectedDiets([]);
        setMinPrice(MIN_PRICE_BOUND);
        setMaxPrice(MAX_PRICE_BOUND);
        setMinRating(0);
        setSortBy('default');
    };

    // 2. Logic Lọc & Sắp xếp dữ liệu (useMemo tối ưu)
    const filteredProducts = useMemo(() => {
        return initialProducts.filter((product) => {
            // Lọc theo từ khóa tìm kiếm (Tên hoặc Brand)
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim();
                const matchName = product.name.toLowerCase().includes(query);
                const matchBrand = product.brand?.toLowerCase().includes(query);
                if (!matchName && !matchBrand) return false;
            }

            // Lọc theo danh mục
            if (selectedCategory !== 'all') {
                if (product.categoryId !== selectedCategory && product.categorySlug !== selectedCategory) {
                    return false;
                }
            }

            // Lọc theo chế độ ăn (Dietary Tags)
            if (selectedDiets.length > 0) {
                const productTags = product.dietaryTags || [];
                const hasMatch = selectedDiets.some((diet) => productTags.includes(diet));
                if (!hasMatch) return false;
            }

            // Lọc theo mức giá (minPrice & maxPrice)
            if (product.price < minPrice || product.price > maxPrice) {
                return false;
            }

            // Lọc theo đánh giá sao (rating)
            if (minRating > 0) {
                if ((product.rating || 0) < minRating) return false;
            }

            return true;
        }).sort((a, b) => {
            // Sắp xếp
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'name-asc') return a.name.localeCompare(b.name, 'vi');
            if (sortBy === 'name-desc') return b.name.localeCompare(a.name, 'vi');
            if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
            return 0; // default
        });
    }, [initialProducts, searchQuery, selectedCategory, selectedDiets, minPrice, maxPrice, minRating, sortBy]);

    // Kiểm tra xem khoảng giá có đang được lọc hay không
    const isPriceFiltered = minPrice > MIN_PRICE_BOUND || maxPrice < MAX_PRICE_BOUND;

    // Đếm số lượng bộ lọc đang active
    const activeFilterCount = (selectedCategory !== 'all' ? 1 : 0) + 
                              selectedDiets.length + 
                              (isPriceFiltered ? 1 : 0) + 
                              (minRating > 0 ? 1 : 0) + 
                              (searchQuery.trim() ? 1 : 0);

    return (
        <div className="bg-white min-h-screen">
            {/* 1. COMPONENT FLASHSALE Ở TRÊN CÙNG CỦA TRANG */}
            {flashSales && flashSales.length > 0 && (
                <div className="pt-4">
                    <FlashSale flashSales={flashSales} />
                </div>
            )}

            {/* 2. KHU VỰC CHÍNH: THANH TÌM KIẾM, SORT & BỐ CỤC SIDEBAR + GRID SẢN PHẨM */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 select-none">
                
                {/* THANH CÔNG CỤ TRÊN: TIÊU ĐỀ, TÌM KIẾM & SORT */}
                <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 sm:p-5 mb-8 shadow-xs">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        
                        {/* Tiêu đề & Tổng số lượng */}
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight uppercase">
                                    Tất Cả Sản Phẩm
                                </h1>
                                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                    {filteredProducts.length} món
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 font-medium">
                                Socola, bánh kẹo hữu cơ lành mạnh, ít calo, không đường tinh luyện
                            </p>
                        </div>

                        {/* Nhóm Ô Tìm Kiếm + Bộ Sắp Xếp */}
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                            {/* Ô Tìm Kiếm */}
                            <div className="relative w-full sm:w-72 flex-shrink-0">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm tên bánh, kẹo, thương hiệu..."
                                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-9 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all shadow-2xs"
                                />
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* Dropdown Sắp xếp (Theo giá, theo tên, theo đánh giá) */}
                            <div className="relative w-full sm:w-auto flex-shrink-0">
                                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs">
                                    <ArrowUpDown className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                                    <span className="text-slate-400 font-normal hidden sm:inline">Sắp xếp:</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                                        aria-label="Sắp xếp sản phẩm"
                                        className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer text-xs pr-2"
                                    >
                                        <option value="default">Mặc định</option>
                                        <option value="price-asc">Giá: Thấp đến Cao</option>
                                        <option value="price-desc">Giá: Cao đến Thấp</option>
                                        <option value="name-asc">Tên: A &rarr; Z</option>
                                        <option value="name-desc">Tên: Z &rarr; A</option>
                                        <option value="rating-desc">Đánh giá cao nhất</option>
                                    </select>
                                </div>
                            </div>

                            {/* Nút lọc dành cho màn hình điện thoại (Mobile Toggle) */}
                            <button
                                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                                className="lg:hidden flex items-center justify-center gap-1.5 bg-emerald-600 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-xs flex-shrink-0"
                            >
                                <Filter className="w-3.5 h-3.5" />
                                <span>Bộ Lọc</span>
                                {activeFilterCount > 0 && (
                                    <span className="bg-white text-emerald-700 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. BỐ CỤC 2 CỘT: THANH FILTER SIDEBAR (TRÁI) & LƯỚI SẢN PHẨM (PHẢI) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* --- CỘT TRÁI: SIDEBAR FILTER --- */}
                    <aside className={`
                        lg:col-span-3 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-6
                        ${isMobileFilterOpen ? 'block fixed inset-x-4 top-24 bottom-6 z-40 bg-white overflow-y-auto shadow-2xl p-6' : 'hidden lg:block'}
                    `}>
                        {/* Header của Sidebar */}
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Bộ Lọc Tìm Kiếm</h3>
                            </div>
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={handleResetFilters}
                                    className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 transition-colors"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Xóa tất cả</span>
                                </button>
                            )}
                            {/* Nút đóng drawer trên mobile */}
                            <button
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* 1. Lọc theo Danh mục */}
                        <div className="space-y-2.5">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Danh Mục</h4>
                            <div className="space-y-1.5">
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                                        selectedCategory === 'all'
                                            ? 'bg-emerald-600 text-white shadow-xs'
                                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                                    }`}
                                >
                                    <span>Tất cả danh mục</span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                                        selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {initialProducts.length}
                                    </span>
                                </button>
                                {categories.map((cat) => {
                                    const count = initialProducts.filter(
                                        (p) => p.categoryId === cat.id || p.categorySlug === cat.slug
                                    ).length;
                                    const isSelected = selectedCategory === String(cat.id) || selectedCategory === cat.slug;

                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(String(cat.id))}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                                                isSelected
                                                    ? 'bg-emerald-600 text-white shadow-xs'
                                                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                                            }`}
                                        >
                                            <span className="truncate pr-2">{cat.name}</span>
                                            {count > 0 && (
                                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full flex-shrink-0 ${
                                                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {count}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 2. Lọc theo Chế độ ăn Healthy (Dietary Tags) */}
                        <div className="space-y-2.5 pt-2 border-t border-slate-200">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                <span>Chế Độ Dinh Dưỡng</span>
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            </h4>
                            <div className="space-y-1.5">
                                {DIETARY_OPTIONS.map((opt) => {
                                    const isChecked = selectedDiets.includes(opt.id);
                                    return (
                                        <label
                                            key={opt.id}
                                            onClick={() => handleToggleDiet(opt.id)}
                                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors border ${
                                                isChecked
                                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                                                    : 'bg-white border-slate-200/60 text-slate-700 hover:bg-slate-100'
                                            }`}
                                        >
                                            <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                                                isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                                            }`}>
                                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                            </div>
                                            <span>{opt.label}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 3. Lọc theo Mức Giá (Thanh kéo Dual Range Slider theo mẫu) */}
                        <div className="space-y-3 pt-2 border-t border-slate-200">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Mức giá</h4>
                                <button
                                    onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
                                    className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                                    title="Thu gọn / Mở rộng"
                                    aria-label="Thu gọn hoặc mở rộng mức giá"
                                >
                                    {isPriceFilterOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                </button>
                            </div>

                            {isPriceFilterOpen && (
                                <div className="space-y-4 pt-1">
                                    {/* Thanh trượt Dual Slider */}
                                    <div className="relative h-6 flex items-center px-1">
                                        {/* Thanh ray nền màu xám (như ảnh mẫu) */}
                                        <div className="absolute inset-x-2 h-1.5 bg-slate-200 rounded-full pointer-events-none" />
                                        
                                        {/* Thanh ray được kích hoạt màu emerald giữa 2 mốc */}
                                        <div 
                                            className="absolute h-1.5 bg-emerald-700 rounded-full pointer-events-none"
                                            style={{
                                                left: `calc(${(minPrice / MAX_PRICE_BOUND) * 100}% + 8px)`,
                                                right: `calc(${100 - (maxPrice / MAX_PRICE_BOUND) * 100}% + 8px)`
                                            }}
                                        />

                                        {/* Input Range cho Min Price */}
                                        <input
                                            type="range"
                                            min={MIN_PRICE_BOUND}
                                            max={MAX_PRICE_BOUND}
                                            step={5000}
                                            value={minPrice}
                                            onChange={(e) => {
                                                const value = Math.min(Number(e.target.value), maxPrice - 10000);
                                                setMinPrice(value);
                                            }}
                                            className="absolute inset-x-0 w-full appearance-none bg-transparent pointer-events-auto cursor-pointer focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-700 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-700 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white z-20"
                                        />

                                        {/* Input Range cho Max Price */}
                                        <input
                                            type="range"
                                            min={MIN_PRICE_BOUND}
                                            max={MAX_PRICE_BOUND}
                                            step={5000}
                                            value={maxPrice}
                                            onChange={(e) => {
                                                const value = Math.max(Number(e.target.value), minPrice + 10000);
                                                setMaxPrice(value);
                                            }}
                                            className="absolute inset-x-0 w-full appearance-none bg-transparent pointer-events-auto cursor-pointer focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-700 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-700 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white z-20"
                                        />
                                    </div>

                                    {/* 2 Khung hiển thị mức giá bo tròn đúng như ảnh mẫu */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-center shadow-2xs">
                                            <input
                                                type="text"
                                                value={minPrice.toLocaleString('vi-VN')}
                                                onChange={(e) => {
                                                    const raw = Number(e.target.value.replace(/\D/g, ''));
                                                    if (!isNaN(raw)) setMinPrice(Math.min(raw, maxPrice));
                                                }}
                                                className="w-full text-center text-xs font-black text-slate-900 focus:outline-none bg-transparent"
                                                aria-label="Giá tối thiểu"
                                            />
                                        </div>
                                        <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-center shadow-2xs">
                                            <input
                                                type="text"
                                                value={maxPrice.toLocaleString('vi-VN')}
                                                onChange={(e) => {
                                                    const raw = Number(e.target.value.replace(/\D/g, ''));
                                                    if (!isNaN(raw)) setMaxPrice(Math.max(raw, minPrice));
                                                }}
                                                className="w-full text-center text-xs font-black text-slate-900 focus:outline-none bg-transparent"
                                                aria-label="Giá tối đa"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 4. Lọc theo Đánh giá Vote Sao */}
                        <div className="space-y-2.5 pt-2 border-t border-slate-200">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Đánh Giá Sản Phẩm</h4>
                            <div className="space-y-1.5">
                                {[4.8, 4.5, 4.0].map((star) => {
                                    const isSelected = minRating === star;
                                    return (
                                        <button
                                            key={star}
                                            onClick={() => setMinRating(isSelected ? 0 : star)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left border ${
                                                isSelected
                                                    ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                                                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200/60'
                                            }`}
                                        >
                                            <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                                                <span>⭐</span>
                                                <span>Từ {star} sao trở lên</span>
                                            </div>
                                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 stroke-[3]" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Nút bấm áp dụng trên mobile */}
                        <div className="lg:hidden pt-4">
                            <button
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
                            >
                                Xem kết quả ({filteredProducts.length})
                            </button>
                        </div>
                    </aside>

                    {/* --- CỘT PHẢI: KHUNG HIỂN THỊ SẢN PHẨM (GRID) --- */}
                    <section className="lg:col-span-9">
                        
                        {/* Thanh thông tin phụ: Active filter tags */}
                        {activeFilterCount > 0 && (
                            <div className="flex flex-wrap items-center gap-2 mb-5">
                                <span className="text-[11px] font-bold text-slate-400">Đang lọc:</span>
                                
                                {searchQuery.trim() && (
                                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-200">
                                        Từ khóa: "{searchQuery}"
                                        <button onClick={() => setSearchQuery('')}><X className="w-3 h-3 text-slate-400 hover:text-slate-700" /></button>
                                    </span>
                                )}

                                {selectedCategory !== 'all' && (
                                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-emerald-200">
                                        {categories.find((c) => String(c.id) === selectedCategory || c.slug === selectedCategory)?.name || 'Danh mục'}
                                        <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3 text-emerald-600 hover:text-emerald-900" /></button>
                                    </span>
                                )}

                                {selectedDiets.map((diet) => (
                                    <span key={diet} className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-emerald-200">
                                        {diet}
                                        <button onClick={() => handleToggleDiet(diet)}><X className="w-3 h-3 text-emerald-600 hover:text-emerald-900" /></button>
                                    </span>
                                ))}

                                {isPriceFiltered && (
                                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-200">
                                        Giá: {minPrice.toLocaleString('vi-VN')}₫ - {maxPrice.toLocaleString('vi-VN')}₫
                                        <button onClick={() => {
                                            setMinPrice(MIN_PRICE_BOUND);
                                            setMaxPrice(MAX_PRICE_BOUND);
                                        }}><X className="w-3 h-3 text-slate-400 hover:text-slate-700" /></button>
                                    </span>
                                )}

                                {minRating > 0 && (
                                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-amber-200">
                                        ⭐ Từ {minRating} sao
                                        <button onClick={() => setMinRating(0)}><X className="w-3 h-3 text-amber-600 hover:text-amber-900" /></button>
                                    </span>
                                )}

                                <button
                                    onClick={handleResetFilters}
                                    className="text-[11px] font-bold text-slate-500 hover:text-rose-600 underline ml-1"
                                >
                                    Xóa lọc
                                </button>
                            </div>
                        )}

                        {/* Lưới sản phẩm đồng bộ bằng ProductCard */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        name={product.name}
                                        price={product.price}
                                        originalPrice={product.originalPrice}
                                        imageUrl={product.imageUrl || product.thumbnailUrl || 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800'}
                                        rating={product.rating || 5.0}
                                        reviewCount={product.reviewCount || 48}
                                        soldCount={product.soldCount || 120}
                                        nutrition={product.nutrition || { calories: 150, sugarG: 1.5, proteinG: 7.0 }}
                                        dietaryTags={product.dietaryTags}
                                    />
                                ))}
                            </div>
                        ) : (
                            /* Giao diện khi không có kết quả phù hợp */
                            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-12 text-center space-y-4">
                                <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-2xl">
                                    🍃
                                </div>
                                <h3 className="text-base font-bold text-slate-900">
                                    Không tìm thấy sản phẩm phù hợp
                                </h3>
                                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                                    Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn một số tiêu chí bộ lọc bên trái để xem thêm sản phẩm nhé!
                                </p>
                                <button
                                    onClick={handleResetFilters}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs"
                                >
                                    Đặt lại toàn bộ bộ lọc
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
