package com.thesweetlabbe.modules.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private UUID id;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private String bannerUrl;
    private Integer displayOrder;
    private long productCount;
    @Builder.Default
    private List<CategoryResponse> children = new ArrayList<>();
}
