package com.sweetlab.backend.repository;

import com.sweetlab.backend.entity.FlashSaleItem;
import com.sweetlab.backend.entity.FlashSaleItemId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FlashSaleItemRepository extends JpaRepository<FlashSaleItem, FlashSaleItemId> {
}
