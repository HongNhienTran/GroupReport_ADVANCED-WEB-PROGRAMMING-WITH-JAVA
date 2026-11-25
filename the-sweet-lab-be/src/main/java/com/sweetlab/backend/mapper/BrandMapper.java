package com.sweetlab.backend.mapper;

import com.sweetlab.backend.dto.request.BrandRequest;
import com.sweetlab.backend.dto.response.BrandResponse;
import com.sweetlab.backend.entity.Brand;
import org.springframework.stereotype.Component;

@Component
public class BrandMapper {

    public BrandResponse toResponse(Brand brand) {
        return BrandResponse.builder()
                .id(brand.getId())
                .name(brand.getName())
                .slug(brand.getSlug())
                .logoUrl(brand.getLogoUrl())
                .country(brand.getCountry())
                .build();
    }

    public Brand toEntity(BrandRequest request) {
        return Brand.builder()
                .name(request.getName().trim())
                .slug(request.getSlug().trim().toLowerCase())
                .logoUrl(request.getLogoUrl())
                .country(request.getCountry())
                .build();
    }

    public void updateEntity(Brand brand, BrandRequest request) {
        brand.setName(request.getName().trim());
        brand.setSlug(request.getSlug().trim().toLowerCase());
        brand.setLogoUrl(request.getLogoUrl());
        brand.setCountry(request.getCountry());
    }
}
