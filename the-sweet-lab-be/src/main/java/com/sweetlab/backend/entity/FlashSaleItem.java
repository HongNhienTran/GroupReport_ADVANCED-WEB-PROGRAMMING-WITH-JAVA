package com.sweetlab.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "flash_sale_items")
public class FlashSaleItem {

    @EmbeddedId
    private FlashSaleItemId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("flashSaleId")
    @JoinColumn(name = "flash_sale_id", nullable = false)
    private FlashSale flashSale;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productVariantId")
    @JoinColumn(name = "product_variant_id", nullable = false)
    private ProductVariant productVariant;

    @Column(name = "flash_sale_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal flashSalePrice;

    @Column(name = "quantity_limit", nullable = false)
    private int quantityLimit;

    @Column(name = "sold_quantity", nullable = false)
    private int soldQuantity;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;
}
