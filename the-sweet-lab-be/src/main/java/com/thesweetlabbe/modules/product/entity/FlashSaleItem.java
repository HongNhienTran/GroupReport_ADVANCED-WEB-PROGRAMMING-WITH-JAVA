package com.thesweetlabbe.modules.product.entity;

import com.thesweetlabbe.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "flash_sale_items", uniqueConstraints = {
        @UniqueConstraint(name = "uk_flash_sale_product", columnNames = {"flash_sale_id", "product_id"})
}, indexes = {
        @Index(name = "idx_fsi_flash_sale", columnList = "flash_sale_id"),
        @Index(name = "idx_fsi_product", columnList = "product_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashSaleItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flash_sale_id", nullable = false)
    private FlashSale flashSale;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "flash_sale_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal flashSalePrice;

    @Column(name = "quantity_limit", nullable = false)
    private Integer quantityLimit;

    @Column(name = "sold_quantity", nullable = false)
    @Builder.Default
    private Integer soldQuantity = 0;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    public int getRemainingQuantity() {
        if (quantityLimit == null) return 0;
        int sold = soldQuantity != null ? soldQuantity : 0;
        return Math.max(0, quantityLimit - sold);
    }

    public boolean isSoldOut() {
        return getRemainingQuantity() <= 0;
    }
}
