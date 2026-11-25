package com.sweetlab.backend.service;

import com.sweetlab.backend.dto.request.BrandRequest;
import com.sweetlab.backend.dto.response.BrandResponse;

import java.util.List;

public interface BrandService {

    List<BrandResponse> getAll();

    BrandResponse getById(Long id);

    BrandResponse getBySlug(String slug);

    BrandResponse create(BrandRequest request);

    BrandResponse update(Long id, BrandRequest request);

    void delete(Long id);
}
