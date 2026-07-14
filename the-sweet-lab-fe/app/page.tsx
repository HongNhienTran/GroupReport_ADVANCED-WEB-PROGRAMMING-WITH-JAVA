import React from 'react';
import HeroSection from './_components/HeroSection';
import CategoryGrid from './_components/CategoryGrid';
import FlashSale from './_components/FlashSale';
import ProductSuggestion from './_components/ProductSuggestion'; // 1. Import component mới tách
import PromoSection from './_components/PromoSection';
import { productService } from '@/services/productService';

export default async function HomePage() {
  const categories = await productService.getFeaturedCategories();
  const flashSales = await productService.getFlashSaleProducts();
  const products = await productService.getFeaturedProducts();

  return (
    <div className="bg-white min-h-screen pb-20 font-sans selection:bg-emerald-100">

      {/* 1. Hero Welcome Banner */}
      <HeroSection />

      {/* 2. Danh Mục Nổi Bật */}
      <CategoryGrid categories={categories} />

      {/* 3. Flash Sale Đếm Ngược */}
      <FlashSale flashSales={flashSales} />

      {/* 4. Gợi Ý Cho Bạn (Đã được đóng gói gọn gàng vào Component riêng) */}
      <ProductSuggestion products={products} />

      {/* 5. Khối Đăng ký cẩm nang */}
      <PromoSection />

    </div>
  );
}