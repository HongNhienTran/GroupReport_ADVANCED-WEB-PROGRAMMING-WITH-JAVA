import React from 'react';
import { productService } from '@/services/productService';
import ProductsPageClient from '@/components/product/ProductsPageClient';

export const metadata = {
    title: 'Sản Phẩm Dinh Dưỡng & Bánh Kẹo Healthy - The Sweet Lab',
    description: 'Khám phá tất cả các dòng sản phẩm socola đen, bánh nướng ít đường, kẹo dẻo hữu cơ 100% tự nhiên tại The Sweet Lab.',
};

export default async function ProductsPage({
    searchParams,
}: {
    searchParams?: Promise<{ search?: string; category?: string }>;
}) {
    const resolvedParams = searchParams ? await searchParams : {};

    // Kéo dữ liệu song song từ productService (có fallback mock data đầy đủ)
    const [categories, flashSales, products] = await Promise.all([
        productService.getFeaturedCategories(),
        productService.getFlashSaleProducts(),
        productService.getAllProducts(),
    ]);

    return (
        <ProductsPageClient
            initialProducts={products}
            categories={categories}
            flashSales={flashSales}
            initialSearch={resolvedParams.search || ''}
            initialCategory={resolvedParams.category || 'all'}
        />
    );
}
