package com.thesweetlabbe.modules.product.entity;

import com.thesweetlabbe.modules.product.enums.FlashSaleStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "flash_sales", indexes = {
        @Index(name = "idx_flash_sale_dates", columnList = "start_time, end_time"),
        @Index(name = "idx_flash_sale_status", columnList = "status, is_active")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashSale {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private FlashSaleStatus status = FlashSaleStatus.UPCOMING;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @OneToMany(mappedBy = "flashSale", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<FlashSaleItem> items = new ArrayList<>();

    public boolean isCurrentlyActive() {
        if (!isActive || status == FlashSaleStatus.CANCELLED) {
            return false;
        }
        LocalDateTime now = LocalDateTime.now();
        return (now.isEqual(startTime) || now.isAfter(startTime)) &&
               (now.isEqual(endTime) || now.isBefore(endTime));
    }
}
