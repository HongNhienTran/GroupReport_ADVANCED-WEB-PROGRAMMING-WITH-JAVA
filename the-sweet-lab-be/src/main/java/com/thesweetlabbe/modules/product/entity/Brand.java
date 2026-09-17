package com.thesweetlabbe.modules.product.entity;

import com.thesweetlabbe.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "brands", indexes = {
        @Index(name = "idx_brand_slug", columnList = "slug", unique = true),
        @Index(name = "idx_brand_name", columnList = "name")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Brand extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "slug", nullable = false, unique = true, length = 120)
    private String slug;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "origin_country", length = 100)
    private String originCountry;

    @Column(name = "website_url", length = 300)
    private String websiteUrl;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;
}
