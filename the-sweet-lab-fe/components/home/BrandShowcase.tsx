"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  categoryTag: string;
  tagline: string;
  description: string;
  logoUrl: string;
  origin: string;
  highlights: string[];
}

const BRANDS_DATA: BrandItem[] = [
  {
    id: 'brand-1',
    name: 'The Sweet Lab Signature',
    slug: 'the-sweet-lab',
    categoryTag: 'Signature Sweets',
    tagline: 'Bánh Kẹo & Dinh Dưỡng Độc Quyền',
    description: 'Nghiên cứu bánh kẹo lành mạnh không đường tinh luyện, bổ sung siêu thực phẩm (superfoods).',
    logoUrl: '/brands/the-sweet-lab.jpg',
    origin: 'Việt Nam',
    highlights: ['Không đường tinh luyện', 'Bổ sung Superfoods', 'Thủ công 100%']
  },
  {
    id: 'brand-2',
    name: 'Cacaovita',
    slug: 'cacaovita',
    categoryTag: 'Bean-To-Bar Chocolate',
    tagline: 'Socola Đen Nguyên Chất 85% - 100%',
    description: 'Socola thủ công từ hạt cacao Bến Tre tuyển chọn, dồi dào chất chống oxy hóa Polyphenol, chuẩn Keto & Vegan.',
    logoUrl: '/brands/cacaovita.jpg',
    origin: 'Bến Tre, VN',
    highlights: ['Polyphenol chống lão hóa', 'Keto & Vegan', 'Cacao hữu cơ']
  },
  {
    id: 'brand-3',
    name: 'PureChoc Artisans',
    slug: 'purechoc-artisans',
    categoryTag: 'Plant-Based Nama',
    tagline: 'Nama Chocolate Tươi Thuần Chay',
    description: 'Socola tươi tan chảy mịn màng từ cốt dừa hữu cơ tươi và bơ hạt phỉ, ngọt thanh nhẹ từ mật hoa dừa.',
    logoUrl: '/brands/purechoc-artisans.jpg',
    origin: 'Việt Nam',
    highlights: ['Nama cốt dừa tươi', 'Không kem sữa bò', 'Mật hoa dừa organic']
  },
  {
    id: 'brand-4',
    name: 'NutriBloom',
    slug: 'nutribloom',
    categoryTag: 'Healthy Bakery',
    tagline: 'Biscotti & Hạt Dinh Dưỡng',
    description: 'Biscotti giòn tan không bơ sữa, thanh năng lượng Granola giàu chất xơ thực vật hỗ trợ kiểm soát cân nặng.',
    logoUrl: '/brands/nutribloom.jpg',
    origin: 'Việt Nam',
    highlights: ['Giàu đạm & chất xơ', 'Không chất bảo quản', 'Hạt cao cấp']
  },
  {
    id: 'brand-5',
    name: 'BerryZen',
    slug: 'berryzen',
    categoryTag: 'Organic Gummies',
    tagline: 'Kẹo Dẻo Pectin Quả Mọng Hữu Cơ',
    description: '100% nước ép quả mọng nguyên chất (dâu tây, mâm xôi, việt quất) với pectin táo tự nhiên, không gelatin động vật.',
    logoUrl: '/brands/berryzen.jpg',
    origin: 'Đà Lạt, VN',
    highlights: ['Pectin thực vật tự nhiên', 'Không gelatin động vật', 'Vitamin C hữu cơ']
  },
  {
    id: 'brand-6',
    name: 'KetoFlora',
    slug: 'ketoflora',
    categoryTag: 'Keto & Low Carb',
    tagline: 'Bánh Ăn Kiêng Keto & Không Gluten',
    description: 'Bánh ngói hạnh nhân Tuiles siêu mỏng, bột hạnh nhân cao cấp vị ngọt La Hán Quả an toàn đường huyết.',
    logoUrl: '/brands/ketoflora.jpg',
    origin: 'Việt Nam',
    highlights: ['100% Gluten-Free', 'Chỉ số GI thấp', 'Bột hạnh nhân Mỹ']
  },
  {
    id: 'brand-7',
    name: 'AuraBake Clean Treats',
    slug: 'aurabake',
    categoryTag: 'High Protein Treats',
    tagline: 'Cookies Yến Mạch & Năng Lượng Gymers',
    description: 'Bánh nướng thủ công ngũ cốc nguyên cám giàu đạm thực vật, mật ong hoa rừng, nướng mới mỗi ngày.',
    logoUrl: '/brands/aurabake.jpg',
    origin: 'Việt Nam',
    highlights: ['Năng lượng sạch bền bỉ', 'Yến mạch nguyên cám', 'Bơ hạt tự nhiên']
  },
  {
    id: 'brand-8',
    name: 'Sweetie Present',
    slug: 'sweetie-present',
    categoryTag: 'Eco Gift Studio',
    tagline: 'Hộp Quà Tặng & Giỏ Mây Thủ Công',
    description: 'Hộp quà sinh học thân thiện môi trường, giỏ mây tre đan tinh xảo trao gửi yêu thương và sức khỏe bền vững.',
    logoUrl: '/brands/sweetie-present.jpg',
    origin: 'Việt Nam',
    highlights: ['Hộp quà sinh học Kraft', 'Mây tre đan thủ công', 'Thiệp chúc mừng độc quyền']
  }
];

export default function BrandShowcase() {
  const [activeBrand, setActiveBrand] = useState<string | null>(null);

  return (
    <section className="w-full bg-white py-14 sm:py-18 md:py-20 border-t border-slate-100 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header theo phong cách Instagram / Editorial Gallery */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-100">
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase leading-tight font-serif">
            Hệ Sinh Thái Thương Hiệu
          </h2>
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase mt-2">
            Khám phá 8 thương hiệu dinh dưỡng lành mạnh & cùng lan tỏa lối sống xanh
          </p>
        </div>

        {/* 8 Card Grid (4 columns x 2 rows trên Desktop, 2x4 trên Mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {BRANDS_DATA.map((brand) => (
            <div
              key={brand.id}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-slate-200/80"
              onMouseEnter={() => setActiveBrand(brand.id)}
              onMouseLeave={() => setActiveBrand(null)}
            >
              {/* Ảnh bìa Brand Logo / Banner */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Lớp gradient nhẹ trạng thái mặc định (Default Badge ở góc) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-0 flex flex-col justify-end p-3.5 sm:p-4">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300">
                  {brand.categoryTag}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white leading-tight drop-shadow-md truncate mt-0.5">
                  {brand.name}
                </h3>
              </div>

              {/* Lớp Overlay Hover: Hiển thị đầy đủ thông tin Brand */}
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md p-4 sm:p-5 flex flex-col justify-between text-white opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                {/* Header trong Overlay */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {brand.categoryTag}
                    </span>
                    <span className="text-[10px] text-slate-300 font-medium">
                      {brand.origin}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight leading-snug">
                    {brand.name}
                  </h3>

                  <p className="text-[11px] sm:text-xs font-semibold text-amber-300 mt-1 line-clamp-1">
                    {brand.tagline}
                  </p>

                  <p className="text-[11px] text-slate-300 leading-relaxed mt-2 line-clamp-3 hidden sm:block font-normal">
                    {brand.description}
                  </p>
                </div>

                {/* Footer trong Overlay: Highlight & Nút bấm */}
                <div className="pt-2 border-t border-white/10">
                  <div className="space-y-1 mb-3 hidden lg:block">
                    {brand.highlights.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/products?search=${encodeURIComponent(brand.name)}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-900 bg-white hover:bg-emerald-400 px-3 py-2 rounded-xl transition-all duration-200 shadow-sm active:scale-95"
                  >
                    <span>Xem Sản Phẩm</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-8 md:mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors uppercase tracking-wider"
          >
            <span>Khám phá toàn bộ 16 sản phẩm từ các đối tác</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
