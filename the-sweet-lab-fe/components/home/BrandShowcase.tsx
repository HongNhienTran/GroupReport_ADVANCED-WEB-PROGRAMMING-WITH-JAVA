"use client";

import React from 'react';

interface BrandItem {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
}

const BRANDS_DATA: BrandItem[] = [
  {
    id: 'brand-1',
    name: 'The Sweet Lab Signature',
    description: 'Nghiên cứu bánh kẹo lành mạnh không đường tinh luyện, bổ sung siêu thực phẩm (superfoods).',
    logoUrl: '/brands/the-sweet-lab.jpg',
  },
  {
    id: 'brand-2',
    name: 'Cacaovita',
    description: 'Socola thủ công từ hạt cacao Bến Tre tuyển chọn, dồi dào chất chống oxy hóa Polyphenol, chuẩn Keto & Vegan.',
    logoUrl: '/brands/cacaovita.jpg',
  },
  {
    id: 'brand-3',
    name: 'PureChoc Artisans',
    description: 'Socola tươi tan chảy mịn màng từ cốt dừa hữu cơ tươi và bơ hạt phỉ, ngọt thanh nhẹ từ mật hoa dừa.',
    logoUrl: '/brands/purechoc-artisans.jpg',
  },
  {
    id: 'brand-4',
    name: 'NutriBloom',
    description: 'Biscotti giòn tan không bơ sữa, thanh năng lượng Granola giàu chất xơ thực vật hỗ trợ kiểm soát cân nặng.',
    logoUrl: '/brands/nutribloom.jpg',
  },
  {
    id: 'brand-5',
    name: 'BerryZen',
    description: '100% nước ép quả mọng nguyên chất (dâu tây, mâm xôi, việt quất) với pectin táo tự nhiên, không gelatin động vật.',
    logoUrl: '/brands/berryzen.jpg',
  },
  {
    id: 'brand-6',
    name: 'KetoFlora',
    description: 'Bánh ngói hạnh nhân Tuiles siêu mỏng, bột hạnh nhân cao cấp vị ngọt La Hán Quả an toàn đường huyết.',
    logoUrl: '/brands/ketoflora.jpg',
  },
  {
    id: 'brand-7',
    name: 'AuraBake Clean Treats',
    description: 'Bánh nướng thủ công ngũ cốc nguyên cám giàu đạm thực vật, mật ong hoa rừng, nướng mới mỗi ngày.',
    logoUrl: '/brands/aurabake.jpg',
  },
  {
    id: 'brand-8',
    name: 'Sweetie Present',
    description: 'Hộp quà sinh học thân thiện môi trường, giỏ mây tre đan tinh xảo trao gửi yêu thương và sức khỏe bền vững.',
    logoUrl: '/brands/sweetie-present.jpg',
  }
];

export default function BrandShowcase() {
  // Nhân đôi danh sách 8 thương hiệu để tạo hiệu ứng vòng lặp vô tận mượt mà
  const marqueeBrands = [...BRANDS_DATA, ...BRANDS_DATA];

  return (
    <section className="w-full bg-white py-14 sm:py-18 border-t border-slate-100 select-none overflow-hidden">
      {/* Tiêu đề ngắn gọn duy nhất, đúng theo font chữ thống nhất */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-10 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Thương Hiệu Đối Tác
        </h2>
      </div>

      {/* Đường line chạy từ từ liên tục (Marquee) từ phải sang trái */}
      <div className="relative w-full overflow-hidden">
        {/* Lớp mờ nhẹ hai bên cạnh để line trượt vào/ra tự nhiên */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-white to-transparent z-10" />

        {/* Track chạy chuyển động marquee - Khi hover vào bất kỳ card nào thì dừng lại */}
        <div className="animate-marquee-left flex items-center gap-5 sm:gap-6 py-3 px-4">
          {marqueeBrands.map((brand, idx) => (
            <div
              key={`${brand.id}-${idx}`}
              className="group relative w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Trạng thái mặc định: Logo thương hiệu hiển thị rõ ràng trên nền trắng, KHÔNG có lớp phủ đen/tối */}
              <div className="w-full h-full p-2 flex items-center justify-center bg-white">
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="w-full h-full object-cover rounded-xl pointer-events-none"
                  loading="lazy"
                />
              </div>

              {/* Trạng thái khi Hover: Base nền trắng 100% sạch sẽ, chỉ hiển thị tên và mô tả ngắn, không icon */}
              <div className="absolute inset-0 bg-white p-5 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 border-2 border-emerald-500 rounded-2xl shadow-sm z-20">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2 leading-snug">
                  {brand.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-4 font-normal">
                  {brand.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
