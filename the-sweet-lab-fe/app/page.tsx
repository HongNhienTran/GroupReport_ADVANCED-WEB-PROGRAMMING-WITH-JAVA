import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import FlashSale from '@/components/home/FlashSale';
import ProductSuggestion from '@/components/home/ProductSuggestion';
import PromoSection from '@/components/home/PromoSection';
import { productService } from '@/services/productService';

export default async function HomePage() {
  const categories = await productService.getFeaturedCategories();
  const flashSales = await productService.getFlashSaleProducts();
  const products = await productService.getFeaturedProducts();

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-emerald-100">

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