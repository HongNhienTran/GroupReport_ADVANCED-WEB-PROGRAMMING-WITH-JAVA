package com.sweetlab.backend.service.impl;

import com.sweetlab.backend.dto.request.BrandRequest;
import com.sweetlab.backend.dto.response.BrandResponse;
import com.sweetlab.backend.entity.Brand;
import com.sweetlab.backend.exception.BadRequestException;
import com.sweetlab.backend.exception.ResourceNotFoundException;
import com.sweetlab.backend.mapper.BrandMapper;
import com.sweetlab.backend.repository.BrandRepository;
import com.sweetlab.backend.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;
    private final BrandMapper brandMapper;

    @Override
    @Transactional(readOnly = true)
    public List<BrandResponse> getAll() {
        return brandRepository.findAll().stream()
                .map(brandMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BrandResponse getById(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + id));
        return brandMapper.toResponse(brand);
    }

    @Override
    @Transactional(readOnly = true)
    public BrandResponse getBySlug(String slug) {
        Brand brand = brandRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with slug: " + slug));
        return brandMapper.toResponse(brand);
    }

    @Override
    @Transactional
    public BrandResponse create(BrandRequest request) {
        String slug = request.getSlug().trim().toLowerCase();
        if (brandRepository.existsBySlug(slug)) {
            throw new BadRequestException("Brand slug already exists: " + slug);
        }
        Brand saved = brandRepository.save(brandMapper.toEntity(request));
        return brandMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public BrandResponse update(Long id, BrandRequest request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + id));

        String newSlug = request.getSlug().trim().toLowerCase();
        if (!brand.getSlug().equals(newSlug) && brandRepository.existsBySlug(newSlug)) {
            throw new BadRequestException("Brand slug already exists: " + newSlug);
        }

        brandMapper.updateEntity(brand, request);
        return brandMapper.toResponse(brandRepository.save(brand));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!brandRepository.existsById(id)) {
            throw new ResourceNotFoundException("Brand not found with id: " + id);
        }
        brandRepository.deleteById(id);
    }
}
