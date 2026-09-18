import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FlashSale from '@/components/home/FlashSale';
import ProductSuggestion from '@/components/home/ProductSuggestion';
import BrandShowcase from '@/components/home/BrandShowcase';
import PromoSection from '@/components/home/PromoSection';
import { productService } from '@/services/productService';

export default async function HomePage() {
  const categories = await productService.getFeaturedCategories();
  const flashSales = await productService.getFlashSaleProducts();
  const products = await productService.getFeaturedProducts();

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-emerald-100">

      {/* 1. Hero Welcome Banner (Kèm thanh tìm kiếm lớn bên dưới) */}
      <HeroSection />

      {/* 2. Flash Sale Đếm Ngược */}
      <FlashSale flashSales={flashSales} />

      {/* 3. Gợi Ý Cho Bạn (Tích hợp 4 khung ảnh ngành hàng thu nhỏ thay cho phân loại) */}
      <ProductSuggestion products={products} categories={categories} />

      {/* 4. Hệ Sinh Thái Thương Hiệu (4x2 Gallery Grid giống phong cách Maison Marou) */}
      <BrandShowcase />

      {/* 6. Khối Đăng ký cẩm nang */}
      <PromoSection />

    </div>
  );
}