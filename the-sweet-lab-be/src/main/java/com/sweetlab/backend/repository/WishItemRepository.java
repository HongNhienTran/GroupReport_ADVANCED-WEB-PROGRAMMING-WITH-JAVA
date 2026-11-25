package com.sweetlab.backend.repository;

import com.sweetlab.backend.entity.WishItem;
import com.sweetlab.backend.entity.WishItemId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishItemRepository extends JpaRepository<WishItem, WishItemId> {
    List<WishItem> findByUserId(Long userId);
}
